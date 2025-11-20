import { type DashboardSnapshot } from "./dashboard-types";

import { mockDashboardSnapshot } from "../mocks/mock-dashboard-snapshot";

export type DashboardQuery = {
  orgId?: string;
  from?: string;
  to?: string;
  locale?: string;
};

export class DashboardService {
  // In future, add Prisma-backed implementation; currently returns mock snapshot.
  static async getDashboardSnapshot(query: DashboardQuery): Promise<DashboardSnapshot> {
    void query;
    return mockDashboardSnapshot;
  }
}
