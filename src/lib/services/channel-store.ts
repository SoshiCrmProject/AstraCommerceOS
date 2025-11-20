import {
  type ChannelConnectionSummary,
  type ChannelDetailSnapshot,
  type ChannelHealthSnapshot,
  type ChannelSyncLog,
  type ChannelSyncPreferences,
} from "./channel-types";
import { mockChannelDetails, mockChannelList } from "../mocks/mock-channel-data";

type ChannelStoreState = {
  connections: ChannelConnectionSummary[];
  details: Record<string, ChannelDetailSnapshot>;
};

export type ChannelRepository = {
  getConnections(): Promise<ChannelConnectionSummary[]>;
  getDetail(id: string): Promise<ChannelDetailSnapshot | null>;
  saveDetail(detail: ChannelDetailSnapshot): Promise<void>;
  saveConnections(connections: ChannelConnectionSummary[]): Promise<void>;
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value));

const initState = (): ChannelStoreState => {
  const connections = clone(mockChannelList);
  const details: Record<string, ChannelDetailSnapshot> = {};
  Object.entries(mockChannelDetails).forEach(([id, detail]) => {
    details[id] = clone(detail);
  });
  return { connections, details };
};

const globalKey = "__channelStoreState";

const getState = (): ChannelStoreState => {
  const g = globalThis as typeof globalThis & { [globalKey]?: ChannelStoreState };
  if (!g[globalKey]) {
    g[globalKey] = initState();
  }
  return g[globalKey]!;
};

const inMemoryRepository: ChannelRepository = {
  async getConnections() {
    return getState().connections;
  },
  async getDetail(id: string) {
    return getState().details[id] ?? null;
  },
  async saveDetail(detail: ChannelDetailSnapshot) {
    const state = getState();
    state.details[detail.channel.id] = detail;
    const idx = state.connections.findIndex((c) => c.id === detail.channel.id);
    if (idx >= 0) state.connections[idx] = detail.channel;
  },
  async saveConnections(connections: ChannelConnectionSummary[]) {
    const state = getState();
    state.connections = connections;
  },
};

let repository: ChannelRepository = inMemoryRepository;

export const setChannelRepository = (repo: ChannelRepository) => {
  repository = repo;
};

const upsertConnection = async (connection: ChannelConnectionSummary) => {
  const connections = await repository.getConnections();
  const idx = connections.findIndex((c) => c.id === connection.id);
  if (idx >= 0) {
    connections[idx] = connection;
  } else {
    connections.push(connection);
  }
  await repository.saveConnections(connections);
};

const updateHealth = async (channelId: string, health: Partial<ChannelHealthSnapshot>) => {
  const detail = await repository.getDetail(channelId);
  if (detail) {
    detail.health = { ...detail.health, ...health };
    await repository.saveDetail(detail);
  }
};

const updateSyncPreferences = async (
  channelId: string,
  preferences: ChannelSyncPreferences,
): Promise<ChannelSyncPreferences> => {
  const detail = await repository.getDetail(channelId);
  if (!detail) throw new Error("Channel not found");
  detail.syncPreferences = preferences;
  await repository.saveDetail(detail);
  return detail.syncPreferences;
};

const appendLog = async (channelId: string, log: ChannelSyncLog): Promise<ChannelSyncLog> => {
  const detail = await repository.getDetail(channelId);
  if (!detail) throw new Error("Channel not found");
  detail.recentSyncs = [log, ...(detail.recentSyncs ?? [])].slice(0, 50);
  await repository.saveDetail(detail);
  return log;
};

const updateLogStatus = async (
  channelId: string,
  logId: string,
  updates: Partial<ChannelSyncLog>,
): Promise<ChannelSyncLog | null> => {
  const detail = await repository.getDetail(channelId);
  if (!detail) return null;
  const idx = detail.recentSyncs.findIndex((log) => log.id === logId);
  if (idx === -1) return null;
  detail.recentSyncs[idx] = { ...detail.recentSyncs[idx], ...updates };
  await repository.saveDetail(detail);
  return detail.recentSyncs[idx];
};

export class ChannelStore {
  static async getChannelList(orgId: string): Promise<ChannelConnectionSummary[]> {
    void orgId;
    return repository.getConnections();
  }

  static async getChannelDetail(orgId: string, channelId: string): Promise<ChannelDetailSnapshot> {
    void orgId;
    const detail = await repository.getDetail(channelId);
    if (!detail) throw new Error("Channel not found");
    return detail;
  }

  static async updateSyncPreferences(
    orgId: string,
    channelId: string,
    preferences: ChannelSyncPreferences,
  ) {
    void orgId;
    return updateSyncPreferences(channelId, preferences);
  }

  static async appendSyncLog(orgId: string, channelId: string, log: ChannelSyncLog) {
    void orgId;
    return appendLog(channelId, log);
  }

  static async triggerSyncJob(orgId: string, channelId: string, kind: ChannelSyncLog["kind"]) {
    void orgId;
    const now = new Date();
    const startedAt = now.toISOString();
    const jobId = `job-${kind.toLowerCase()}-${Date.now()}`;
    const runningLog: ChannelSyncLog = {
      id: jobId,
      kind,
      status: "RUNNING",
      startedAt,
      finishedAt: null,
    };
    await appendLog(channelId, runningLog);

    const finishedAt = new Date(now.getTime() + 2000 + Math.round(Math.random() * 1500)).toISOString();
    const finalStatus: ChannelSyncLog["status"] = Math.random() > 0.1 ? "SUCCESS" : "PARTIAL";
    const completed = await updateLogStatus(channelId, jobId, {
      status: finalStatus,
      finishedAt,
      itemCount: 400 + Math.round(Math.random() * 800),
      errorMessage: finalStatus === "PARTIAL" ? "Completed with minor rate limit retries" : undefined,
    });

    const detail = await repository.getDetail(channelId);
    if (detail) {
      detail.health.pendingJobs = Math.max(0, detail.health.pendingJobs - 1);
      detail.channel.lastSyncAt = finishedAt;
      detail.channel.nextSyncAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      await repository.saveDetail(detail);
    }

    return { jobId, log: completed ?? runningLog, etaSeconds: 180 };
  }

  static async testConnection(orgId: string, channelId: string) {
    void orgId;
    const latencyMs = 200 + Math.round(Math.random() * 600);
    await updateHealth(channelId, { apiLatencyMs: latencyMs, lastErrorMessage: null });
    return { ok: true, latencyMs };
  }

  static async runHealthCheck(orgId: string) {
    void orgId;
    const connections = await repository.getConnections();
    for (const channel of connections) {
      const detail = await repository.getDetail(channel.id);
      if (!detail) continue;
      const latency = 280 + Math.round(Math.random() * 480);
      const uptimeDelta = (Math.random() - 0.5) * 0.1;
      detail.health.apiLatencyMs = latency;
      detail.health.uptime30dPercent = Math.max(
        92,
        Math.min(99.99, detail.health.uptime30dPercent + uptimeDelta),
      );
      detail.health.syncSuccessRate30d = Math.max(
        85,
        Math.min(99.9, detail.health.syncSuccessRate30d + (Math.random() - 0.5) * 0.6),
      );
      detail.health.pendingJobs = Math.max(0, detail.health.pendingJobs + Math.round(Math.random() * 2 - 1));

      if (detail.health.syncSuccessRate30d < 90 || detail.health.pendingJobs > 3) {
        channel.status = "DEGRADED";
        detail.health.lastErrorMessage ??= "Recent syncs exceed SLA. Investigate connector latency.";
      } else if (!detail.health.lastErrorMessage) {
        channel.status = "HEALTHY";
      }
      await repository.saveDetail(detail);
      await upsertConnection(channel);
    }

    const degraded = (await repository.getConnections()).filter((c) => c.status !== "HEALTHY").length;
    return {
      ok: true,
      checked: (await repository.getConnections()).length,
      degraded,
      timestamp: new Date().toISOString(),
    };
  }

  static async provision(
    orgId: string,
    payload: { name: string; type: ChannelConnectionSummary["type"]; region: string; accountId?: string },
  ) {
    void orgId;
    const now = new Date().toISOString();
    const newChannel: ChannelConnectionSummary = {
      id: `${payload.type.toLowerCase()}-${payload.region.toLowerCase()}-${Date.now()}`,
      name: payload.name,
      type: payload.type,
      region: payload.region,
      status: "DEGRADED",
      icon: payload.type.toLowerCase(),
      accountId: payload.accountId ?? `${payload.type}-${payload.region}`,
      accountType: "Seller",
      revenue7d: 0,
      revenue30d: 0,
      orders7d: 0,
      orders30d: 0,
      margin7d: 0,
      buyBoxShare: 0,
      lastSyncAt: null,
      nextSyncAt: null,
      connectedAt: now,
      tags: [payload.region],
      new: true,
    };

    const detail: ChannelDetailSnapshot = {
      channel: newChannel,
      health: {
        apiLatencyMs: 0,
        uptime30dPercent: 99.9,
        syncSuccessRate30d: 100,
        pendingJobs: 0,
        lastErrorAt: null,
        lastErrorMessage: null,
        incidentCount24h: 0,
      },
      financials: {
        revenue7d: 0,
        revenue30d: 0,
        fees7d: 0,
        fees30d: 0,
        refunds7d: 0,
        refunds30d: 0,
        profit7d: 0,
        profit30d: 0,
        orders7d: 0,
        orders30d: 0,
        avgOrderValue: 0,
        marginRate7d: 0,
        marginRate30d: 0,
      },
      recentSyncs: [],
      topListings: [],
      orders: [],
      timeline: [],
      syncPreferences: clone(mockChannelDetails["amazon-jp"].syncPreferences),
    };

    await upsertConnection(newChannel);
    await repository.saveDetail(detail);
    return newChannel;
  }
}
