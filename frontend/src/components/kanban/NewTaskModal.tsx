import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  Select,
  ListBox,
  TextField,
  Label,
  TextArea,
} from "@heroui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createTask, updateTask, getProjects } from "../../services/tasks";
import {
  type TaskCreate,
  type Task,
  type TaskUpdate,
  Priority,
  Status,
} from "../../types";
// import { X, Check } from "lucide-react";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
  taskToEdit?: Task | null;
}

const PRIORITY_OPTIONS = [
  { key: Priority.LOW, label: "Baja" },
  { key: Priority.MEDIUM, label: "Media" },
  { key: Priority.HIGH, label: "Alta" },
];

const STATUS_OPTIONS = [
  { key: Status.BACKLOG, label: "Pendiente" },
  { key: Status.IN_PROGRESS, label: "En Progreso" },
  { key: Status.DONE, label: "Completado" },
];

export function NewTaskModal({
  isOpen,
  onClose,
  defaultProjectId,
  taskToEdit,
}: NewTaskModalProps) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.MEDIUM);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [projectId, setProjectId] = useState<string>("");
  const [date, setDate] = useState<string>("");

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setTitle(taskToEdit.title);
        setDescription(taskToEdit.description || "");
        setPriority(taskToEdit.priority);
        setStatus(taskToEdit.status);
        setProjectId(taskToEdit.project_id);
        try {
          if (taskToEdit.due_date) {
            setDate(taskToEdit.due_date.split("T")[0]);
          } else {
            setDate("");
          }
        } catch (error) {
          console.error("Invalid date format", taskToEdit.due_date);
          setDate("");
        }
      } else {
        setTitle("");
        setDescription("");
        setPriority(Priority.MEDIUM);
        setStatus(Status.BACKLOG);
        setProjectId(defaultProjectId || projects?.[0]?.id || "");
        setDate("");
      }
    }
  }, [isOpen, taskToEdit, defaultProjectId, projects]);

  const createMutation = useMutation({
    mutationFn: (task: TaskCreate) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
      onClose();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, task }: { id: string; task: TaskUpdate }) =>
      updateTask(id, task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboardMetrics"] });
      onClose();
    },
  });

  const handleSubmit = () => {
    if (!projectId) return;

    const taskData: any = {
      title,
      description,
      priority,
      status: status || Status.BACKLOG,
      project_id: projectId,
      due_date: date ? new Date(date).toISOString() : undefined,
    };

    if (taskToEdit) {
      updateMutation.mutate({
        id: taskToEdit.id,
        task: taskData,
      });
    } else {
      createMutation.mutate(taskData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Base input styles
  const inputStyles =
    "w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all";
  const labelStyles = "text-sm font-medium text-gray-700 mb-1 block";

  return (
    <Modal isOpen={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <Modal.Backdrop variant="blur">
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>
                {taskToEdit ? "Editar Tarea" : "Nueva Tarea"}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="p-6">
              <div className="space-y-4">
                <TextField className="flex flex-col">
                  <Label className={labelStyles}>Título</Label>
                  <Input
                    autoFocus
                    placeholder="Ej: Implementar Login"
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value)}
                    className={inputStyles}
                  />
                </TextField>

                <TextField className="flex flex-col">
                  <Label className={labelStyles}>Descripción</Label>
                  <TextArea
                    placeholder="Detalles de la tarea..."
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                    className={inputStyles}
                    rows={3}
                  />
                </TextField>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    className="flex flex-col w-full"
                    selectedKey={priority}
                    onSelectionChange={(key) => setPriority(key as Priority)}
                  >
                    <Label className={labelStyles}>Prioridad</Label>
                    <Select.Trigger
                      className={
                        inputStyles +
                        " flex justify-between items-center text-left"
                      }
                    >
                      <Select.Value />
                      <span className="text-gray-400">▼</span>
                    </Select.Trigger>
                    <Select.Popover className="min-w-[var(--trigger-width)]">
                      <ListBox className="bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                        {PRIORITY_OPTIONS.map((option) => (
                          <ListBox.Item
                            key={option.key}
                            id={option.key}
                            textValue={option.label}
                            className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
                          >
                            {option.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <Select
                    className="flex flex-col w-full"
                    selectedKey={status}
                    onSelectionChange={(key) => setStatus(key as Status)}
                  >
                    <Label className={labelStyles}>Estado</Label>
                    <Select.Trigger
                      className={
                        inputStyles +
                        " flex justify-between items-center text-left"
                      }
                    >
                      <Select.Value />
                      <span className="text-gray-400">▼</span>
                    </Select.Trigger>
                    <Select.Popover className="min-w-[var(--trigger-width)]">
                      <ListBox className="bg-white border border-gray-200 rounded-lg shadow-lg p-1">
                        {STATUS_OPTIONS.map((option) => (
                          <ListBox.Item
                            key={option.key}
                            id={option.key}
                            textValue={option.label}
                            className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
                          >
                            {option.label}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    className="flex flex-col w-full"
                    selectedKey={projectId}
                    onSelectionChange={(key) => setProjectId(key as string)}
                  >
                    <Label className={labelStyles}>Proyecto</Label>
                    <Select.Trigger
                      className={
                        inputStyles +
                        " flex justify-between items-center text-left"
                      }
                    >
                      <Select.Value />
                      <span className="text-gray-400">▼</span>
                    </Select.Trigger>
                    <Select.Popover className="min-w-[var(--trigger-width)]">
                      <ListBox className="bg-white border border-gray-200 rounded-lg shadow-lg p-1 max-h-60 overflow-y-auto">
                        {(projects || []).map((project) => (
                          <ListBox.Item
                            key={project.id}
                            id={project.id}
                            textValue={project.name}
                            className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer outline-none"
                          >
                            {project.name}
                          </ListBox.Item>
                        ))}
                      </ListBox>
                    </Select.Popover>
                  </Select>

                  <TextField className="flex flex-col">
                    <Label className={labelStyles}>Fecha de Vencimiento</Label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e: any) => setDate(e.target.value)}
                      className={inputStyles}
                    />
                  </TextField>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">
                Cancelar
              </Button>
              <Button
                variant="primary"
                onPress={handleSubmit}
                isDisabled={isPending}
              >
                {isPending && <span className="animate-spin">⌛</span>}
                {taskToEdit ? "Guardar Cambios" : "Crear Tarea"}
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
