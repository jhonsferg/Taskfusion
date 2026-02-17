import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { KanbanBoard } from "../components/kanban/KanbanBoard";
import { Button } from "@heroui/react";
import { Plus } from "lucide-react";
import { getTasks, updateTaskStatus, deleteTask } from "../services/tasks";
import { Status, type Task } from "../types";
import { NewTaskModal } from "../components/kanban/NewTaskModal";
import { ProjectSelector } from "../components/projects/ProjectSelector";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";

export default function Kanban() {
  const queryClient = useQueryClient();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Delete confirmation state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Fetch tasks filtering by selectedProjectId
  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks", selectedProjectId],
    queryFn: () => getTasks(selectedProjectId || undefined),
    enabled: !!selectedProjectId, // Only fetch if a project is selected
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: Status }) =>
      updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
    },
  });

  const handleTaskMove = (taskId: string, newStatus: Status) => {
    updateStatusMutation.mutate({ taskId, status: newStatus });
  };

  const handleTaskEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsNewTaskModalOpen(true);
  };

  const handleTaskDeleteRequest = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      deleteMutation.mutate(taskToDelete);
    }
  };

  const handleModalClose = () => {
    setIsNewTaskModalOpen(false);
    setTaskToEdit(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] space-y-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Tablero Kanban
          </h2>
          <ProjectSelector
            selectedProjectId={selectedProjectId}
            onProjectSelect={setSelectedProjectId}
          />
        </div>
        <Button
          onPress={() => {
            setTaskToEdit(null);
            setIsNewTaskModalOpen(true);
          }}
          isDisabled={!selectedProjectId}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20 font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        {selectedProjectId ? (
          isLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">Cargando tareas...</p>
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-red-500">Error cargando tareas</p>
            </div>
          ) : (
            <KanbanBoard
              tasks={tasks || []}
              onTaskMove={handleTaskMove}
              onTaskEdit={handleTaskEdit}
              onTaskDelete={handleTaskDeleteRequest}
            />
          )
        ) : (
          <div className="flex h-full items-center justify-center flex-col gap-2">
            <p className="text-gray-500 text-lg">
              Selecciona o crea un proyecto para ver sus tareas
            </p>
          </div>
        )}
      </div>

      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={handleModalClose}
        defaultProjectId={selectedProjectId || undefined}
        taskToEdit={taskToEdit}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Tarea"
        message="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="danger"
      />
    </div>
  );
}
