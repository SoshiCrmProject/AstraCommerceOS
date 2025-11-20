import {
  type ChannelConnectionSummary,
  type ChannelDetailSnapshot,
  type ChannelSyncLog,
  type ChannelSyncPreferences,
  type ChannelType,
} from "./channel-types";
import { ChannelStore } from "./channel-store";

type ChannelActionPayload =
  | { action: "getChannelList"; payload: { orgId: string } }
  | { action: "getChannelDetail"; payload: { orgId: string; channelId: string } }
  | { action: "testChannelConnection"; payload: { orgId: string; channelId: string } }
  | { action: "triggerChannelSync"; payload: { orgId: string; channelId: string; kind: ChannelSyncLog["kind"] } }
  | { action: "runOrgHealthCheck"; payload: { orgId: string } }
  | { action: "updateSyncPreferences"; payload: { orgId: string; channelId: string; preferences: ChannelSyncPreferences } }
  | { action: "appendSyncLogEntry"; payload: { orgId: string; channelId: string; log: ChannelSyncLog } }
  | { action: "provisionChannelConnection"; payload: { orgId: string; payload: { name: string; type: ChannelType; region: string; accountId?: string } } };

export class ChannelService {
  static async getChannelList(orgId: string): Promise<ChannelConnectionSummary[]> {
    return isBrowser()
      ? this.callApi<ChannelConnectionSummary[]>({ action: "getChannelList", payload: { orgId } })
      : ChannelStore.getChannelList(orgId);
  }

  static async getChannelDetail(
    orgId: string,
    channelId: string,
  ): Promise<ChannelDetailSnapshot> {
    return isBrowser()
      ? this.callApi<ChannelDetailSnapshot>({ action: "getChannelDetail", payload: { orgId, channelId } })
      : ChannelStore.getChannelDetail(orgId, channelId);
  }

  static async testChannelConnection(
    orgId: string,
    channelId: string,
  ): Promise<{ ok: boolean; latencyMs?: number; error?: string }> {
    return isBrowser()
      ? this.callApi({ action: "testChannelConnection", payload: { orgId, channelId } })
      : ChannelStore.testConnection(orgId, channelId);
  }

  static async triggerChannelSync(
    orgId: string,
    channelId: string,
    kind: ChannelSyncLog["kind"],
  ): Promise<{ accepted: boolean; jobId?: string; etaSeconds?: number }> {
    const result = isBrowser()
      ? await this.callApi<{ jobId: string; etaSeconds: number }>({
          action: "triggerChannelSync",
          payload: { orgId, channelId, kind },
        })
      : await ChannelStore.triggerSyncJob(orgId, channelId, kind);
    return { accepted: true, jobId: result.jobId, etaSeconds: result.etaSeconds };
  }

  static async runOrgHealthCheck(
    orgId: string,
  ): Promise<{ ok: boolean; checked: number; degraded: number; timestamp: string }> {
    return isBrowser()
      ? this.callApi({ action: "runOrgHealthCheck", payload: { orgId } })
      : ChannelStore.runHealthCheck(orgId);
  }

  static async updateSyncPreferences(
    orgId: string,
    channelId: string,
    preferences: ChannelSyncPreferences,
  ): Promise<ChannelSyncPreferences> {
    return isBrowser()
      ? this.callApi({
          action: "updateSyncPreferences",
          payload: { orgId, channelId, preferences },
        })
      : ChannelStore.updateSyncPreferences(orgId, channelId, preferences);
  }

  static async appendSyncLogEntry(
    orgId: string,
    channelId: string,
    log: ChannelSyncLog,
  ): Promise<ChannelSyncLog> {
    return isBrowser()
      ? this.callApi({ action: "appendSyncLogEntry", payload: { orgId, channelId, log } })
      : ChannelStore.appendSyncLog(orgId, channelId, log);
  }

  static async provisionChannelConnection(
    orgId: string,
    payload: {
      name: string;
      type: ChannelType;
      region: string;
      accountId?: string;
    },
  ): Promise<ChannelConnectionSummary> {
    return isBrowser()
      ? this.callApi({
          action: "provisionChannelConnection",
          payload: { orgId, payload },
        })
      : ChannelStore.provision(orgId, payload);
  }

  private static async callApi<T>(body: ChannelActionPayload): Promise<T> {
    const res = await fetch("/api/channel-actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Channel API request failed");
    }
    return res.json() as Promise<T>;
  }
}

const isBrowser = () => typeof window !== "undefined";
