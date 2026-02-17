import api from "../api/client";
import type { DashboardMetrics } from "../types";

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {
  const response = await api.get<DashboardMetrics>("/dashboard/metrics");
  return response.data;
};
