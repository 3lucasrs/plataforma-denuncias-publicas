"use client";

import { useEffect, useMemo, useState } from "react";
import { getAnalyticsSummary, AnalyticsSummary } from "@/services/analyticsService";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Users, FileText, Loader, CheckCircle, Wrench } from "lucide-react";
import { reportCategories } from "@/lib/constants";

const BAR_CHART_COLORS = ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe"];
const STATUS_PIE_COLORS = {
  Pendentes: "#f59e0b",
  "Em Progresso": "#3b82f6",
  Resolvidas: "#22c55e",
};

export default function DashboardPage() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await getAnalyticsSummary();
        setData(summaryData);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryChartData = useMemo(() => {
    if (!data?.categoryCounts) return [];
    const categoryLabels = new Map(reportCategories.map((c) => [c.value, c.label]));
    return data.categoryCounts.map((item) => ({
      ...item,
      label: categoryLabels.get(item.category) || item.category,
    }));
  }, [data]);

  const statusChartData = useMemo(() => {
    if (!data?.statusCounts) return [];
    return [
      { name: "Pendentes", value: data.statusCounts?.Pending || 0 },
      { name: "Em Progresso", value: data.statusCounts?.["In Progress"] || 0 },
      { name: "Resolvidas", value: data.statusCounts?.Resolved || 0 },
    ].filter((item) => item.value > 0);
  }, [data]);

  if (isLoading) {
    return <div className="p-10 text-center text-gray-500">Carregando dashboard...</div>;
  }

  if (!data) {
    return (
      <div className="p-10 text-center text-red-500">
        Falha ao carregar dados do dashboard.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 lg:p-10 bg-gray-50 min-h-full">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Resumo de dados e estatísticas da plataforma.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total de Denúncias"
          value={data.totalComplaints}
          icon={<FileText />}
        />
        <StatCard
          title="Denúncias Pendentes"
          value={data.statusCounts?.Pending || 0}
          icon={<Loader />}
        />
        <StatCard
          title="Denúncias Em Andamento"
          value={data.statusCounts?.["In Progress"] || 0}
          icon={<Wrench />}
        />
        <StatCard
          title="Denúncias Resolvidas"
          value={data.statusCounts?.Resolved || 0}
          icon={<CheckCircle />}
        />
        <StatCard title="Usuários Cadastrados" value={data.totalUsers} icon={<Users />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-bold text-lg mb-4 text-gray-700">
            Top 5 Categorias de Denúncias
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={categoryChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                dataKey="label"
                type="category"
                width={140}
                tick={{ fontSize: 12 }}
              />
              <Tooltip cursor={{ fill: "#f3f4f6" }} />
              <Bar dataKey="count" name="Nº de Denúncias" barSize={30}>
                {categoryChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={BAR_CHART_COLORS[index % BAR_CHART_COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border flex flex-col">
          <h3 className="font-bold text-lg mb-4 text-gray-700">
            Distribuição por Status
          </h3>
          <div className="flex-1 flex items-center justify-center">
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {statusChartData.map((entry) => (
                      <Cell
                        key={`cell-${entry.name}`}
                        fill={
                          STATUS_PIE_COLORS[entry.name as keyof typeof STATUS_PIE_COLORS]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "Denúncias"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">Não há dados de status para exibir.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
