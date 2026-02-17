import { useQuery } from "@tanstack/react-query";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  LayoutDashboard,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { getDashboardMetrics } from "../services/dashboard";
import { StatsCard } from "../components/dashboard/StatsCard";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

export default function Dashboard() {
  const {
    data: metrics,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboardMetrics"],
    queryFn: getDashboardMetrics,
  });

  if (isLoading) {
    return <div className="p-8 text-center">Cargando métricas...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">Error cargando datos</div>
    );
  }

  if (!metrics) return null;

  // Prepare Chart Data
  const statusData = {
    labels: ["Backlog", "En Progreso", "Completado"],
    datasets: [
      {
        data: [
          metrics.tasks_by_status.backlog || 0,
          metrics.tasks_by_status.in_progress || 0,
          metrics.tasks_by_status.done || 0,
        ],
        backgroundColor: [
          "rgba(99, 102, 241, 0.5)", // Indigo
          "rgba(245, 158, 11, 0.5)", // Amber
          "rgba(16, 185, 129, 0.5)", // Emerald
        ],
        borderColor: [
          "rgb(99, 102, 241)",
          "rgb(245, 158, 11)",
          "rgb(16, 185, 129)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const projectData = {
    labels: Object.keys(metrics.tasks_by_project),
    datasets: [
      {
        label: "Tareas por Proyecto",
        data: Object.values(metrics.tasks_by_project),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Tareas"
          value={metrics.total_tasks}
          icon={<LayoutDashboard className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Completadas"
          value={metrics.tasks_by_status.done || 0}
          icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
        />
        <StatsCard
          title="En Progreso"
          value={metrics.tasks_by_status.in_progress || 0}
          icon={<Clock className="h-4 w-4 text-amber-500" />}
        />
        <StatsCard
          title="Vencidas"
          value={metrics.overdue_tasks}
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
          description="Tareas que requieren atención"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Resumen por Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Bar
              data={projectData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" as const },
                },
              }}
            />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Estado de Tareas</CardTitle>
          </CardHeader>
          <CardContent>
            <Doughnut
              data={statusData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "bottom" as const },
                },
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
