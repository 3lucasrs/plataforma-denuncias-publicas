import api from "@/lib/api";

export interface AnalyticsSummary {
  totalUsers: number;
  totalComplaints: number;
  statusCounts: {
    Pending?: number;
    "In Progress"?: number;
    Resolved?: number;
  };
  categoryCounts: { category: string; count: number }[];
}

export const getAnalyticsSummary = async (): Promise<AnalyticsSummary> => {
  const response = await api.get("/analytics/summary");
  return response.data;
};
