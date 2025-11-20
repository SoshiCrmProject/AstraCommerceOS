import { NextResponse } from "next/server";
import { ChannelStore } from "@/lib/services/channel-store";
import { type ChannelSyncLog, type ChannelSyncPreferences, type ChannelType } from "@/lib/services/channel-types";

type ActionBody =
  | { action: "getChannelList"; payload: { orgId: string } }
  | { action: "getChannelDetail"; payload: { orgId: string; channelId: string } }
  | { action: "testChannelConnection"; payload: { orgId: string; channelId: string } }
  | { action: "triggerChannelSync"; payload: { orgId: string; channelId: string; kind: ChannelSyncLog["kind"] } }
  | { action: "runOrgHealthCheck"; payload: { orgId: string } }
  | { action: "updateSyncPreferences"; payload: { orgId: string; channelId: string; preferences: ChannelSyncPreferences } }
  | { action: "appendSyncLogEntry"; payload: { orgId: string; channelId: string; log: ChannelSyncLog } }
  | { action: "provisionChannelConnection"; payload: { orgId: string; payload: { name: string; type: ChannelType; region: string; accountId?: string } } };

export async function POST(req: Request) {
  const body = (await req.json()) as ActionBody;
  const { action, payload } = body;

  switch (action) {
    case "getChannelList":
      return NextResponse.json(await ChannelStore.getChannelList(payload.orgId));
    case "getChannelDetail":
      return NextResponse.json(await ChannelStore.getChannelDetail(payload.orgId, payload.channelId));
    case "testChannelConnection":
      return NextResponse.json(await ChannelStore.testConnection(payload.orgId, payload.channelId));
    case "triggerChannelSync":
      return NextResponse.json(
        await ChannelStore.triggerSyncJob(payload.orgId, payload.channelId, payload.kind),
      );
    case "runOrgHealthCheck":
      return NextResponse.json(await ChannelStore.runHealthCheck(payload.orgId));
    case "updateSyncPreferences":
      return NextResponse.json(
        await ChannelStore.updateSyncPreferences(payload.orgId, payload.channelId, payload.preferences),
      );
    case "appendSyncLogEntry":
      return NextResponse.json(
        await ChannelStore.appendSyncLog(payload.orgId, payload.channelId, payload.log),
      );
    case "provisionChannelConnection":
      return NextResponse.json(
        await ChannelStore.provision(payload.orgId, payload.payload),
      );
    default:
      return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  }
}
