import { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Input,
  TextField,
  Label,
  TextArea,
} from "@heroui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProjects,
  updateProject,
} from "../../services/projects";
import { Trash2, Edit2, Check, X, Plus, Search, Save } from "lucide-react";
import { type Project } from "../../types";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectManagerModal({
  isOpen,
  onClose,
}: ProjectManagerModalProps) {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  // Delete confirmation state
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // Filter projects based on search query
  const filteredProjects = projects?.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const createMutation = useMutation({
    mutationFn: ({
      name,
      description,
    }: {
      name: string;
      description?: string;
    }) => createProject({ name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setNewProjectName("");
      setNewProjectDescription("");
      setIsCreating(false);
      setSuccessMessage("¡Proyecto creado exitosamente!");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      name,
      description,
    }: {
      id: string;
      name: string;
      description?: string;
    }) => updateProject(id, { name, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingProject(null);
      setEditName("");
      setEditDescription("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    },
  });

  const handleCreate = () => {
    if (newProjectName.trim()) {
      createMutation.mutate({
        name: newProjectName,
        description: newProjectDescription,
      });
    }
  };

  const startEdit = (project: Project) => {
    setEditingProject(project.id);
    setEditName(project.name);
    setEditDescription(project.description || "");
  };

  const handleUpdate = (id: string) => {
    if (editName.trim()) {
      updateMutation.mutate({
        id,
        name: editName,
        description: editDescription,
      });
    }
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      deleteMutation.mutate(projectToDelete);
    }
  };

  const handleDeleteRequest = (id: string) => {
    setProjectToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleClose = () => {
    setIsCreating(false);
    setNewProjectName("");
    setNewProjectDescription("");
    setSuccessMessage(null);
    onClose();
  };

  // Base input styles since we are using primitives
  const inputStyles =
    "w-full px-3 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white transition-all";
  const labelStyles = "text-sm font-medium text-gray-700";

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open: boolean) => !open && handleClose()}
      >
        <Modal.Backdrop variant="blur">
          <Modal.Container size="md">
            <Modal.Dialog>
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Gestionar Proyectos</Modal.Heading>
              </Modal.Header>
              <Modal.Body className="p-6">
                {successMessage && (
                  <div className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-lg flex items-center gap-2 mb-4 border border-emerald-100">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">{successMessage}</span>
                  </div>
                )}

                {!isCreating ? (
                  <div className="mb-6">
                    <Button
                      variant="primary"
                      onPress={() => setIsCreating(true)}
                      className="w-full font-semibold h-12 text-md shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Crear Nuevo Proyecto
                    </Button>
                  </div>
                ) : (
                  <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200 shadow-inner space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Nuevo Proyecto
                      </h3>
                      <Button
                        size="sm"
                        variant="ghost"
                        isIconOnly
                        onPress={() => setIsCreating(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <TextField className="flex flex-col gap-1">
                      <Label className={labelStyles}>Nombre del Proyecto</Label>
                      <Input
                        placeholder="Ej. Rediseño de Website"
                        value={newProjectName}
                        onChange={(e: any) => setNewProjectName(e.target.value)}
                        className={inputStyles}
                      />
                    </TextField>

                    <TextField className="flex flex-col gap-1">
                      <Label className={labelStyles}>Descripción</Label>
                      <TextArea
                        placeholder="Detalles opcionales del proyecto..."
                        value={newProjectDescription}
                        onChange={(e: any) =>
                          setNewProjectDescription(e.target.value)
                        }
                        className={inputStyles}
                        rows={3}
                      />
                    </TextField>

                    <div className="flex justify-end gap-2 pt-2">
                      <Button
                        variant="secondary"
                        onPress={() => setIsCreating(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        onPress={handleCreate}
                        isDisabled={
                          !newProjectName.trim() || createMutation.isPending
                        }
                        className="flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        {createMutation.isPending
                          ? "Guardando..."
                          : "Guardar Proyecto"}
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <TextField className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
                      <Search className="w-4 h-4" />
                    </div>
                    <Input
                      placeholder="Buscar proyectos..."
                      value={searchQuery}
                      onChange={(e: any) => setSearchQuery(e.target.value)}
                      className={`${inputStyles} pl-9`}
                    />
                  </TextField>

                  <div className="max-h-[350px] overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                    {filteredProjects?.map((project) => (
                      <div
                        key={project.id}
                        className={`p-4 rounded-xl transition-all ${
                          editingProject === project.id
                            ? "bg-gray-50 border border-indigo-200 shadow-md ring-1 ring-indigo-50"
                            : "bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-100"
                        }`}
                      >
                        {editingProject === project.id ? (
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="text-xs font-bold text-indigo-600 uppercase">
                                Editando Proyecto
                              </h4>
                            </div>

                            <TextField className="flex flex-col gap-1">
                              <Label className={labelStyles}>Nombre</Label>
                              <Input
                                value={editName}
                                onChange={(e: any) =>
                                  setEditName(e.target.value)
                                }
                                className={inputStyles}
                                autoFocus
                              />
                            </TextField>

                            <TextField className="flex flex-col gap-1">
                              <Label className={labelStyles}>Descripción</Label>
                              <TextArea
                                value={editDescription}
                                onChange={(e: any) =>
                                  setEditDescription(e.target.value)
                                }
                                className={inputStyles}
                                rows={2}
                              />
                            </TextField>

                            <div className="flex justify-end gap-2 pt-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-danger hover:bg-red-50 flex items-center gap-1"
                                onPress={() => setEditingProject(null)}
                              >
                                <X className="w-4 h-4" />
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                variant="primary"
                                onPress={() => handleUpdate(project.id)}
                                className="flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Guardar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-between items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-800 text-base mb-1">
                                {project.name}
                              </h3>
                              {project.description ? (
                                <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                  {project.description}
                                </p>
                              ) : (
                                <p className="text-xs text-gray-300 italic">
                                  Sin descripción
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <Button
                                isIconOnly
                                size="sm"
                                variant="ghost"
                                onPress={() => startEdit(project)}
                                className="text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="ghost"
                                onPress={() => handleDeleteRequest(project.id)}
                                className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}

                    {projects?.length === 0 && (
                      <div className="text-center py-10 px-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <div className="bg-white w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
                          <Plus className="w-6 h-6 text-indigo-500" />
                        </div>
                        <h4 className="font-medium text-gray-900">
                          Sin proyectos
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Comienza creando tu primer proyecto arriba.
                        </p>
                      </div>
                    )}
                    {projects &&
                      projects.length > 0 &&
                      filteredProjects?.length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500">
                            No se encontraron proyectos para "{searchQuery}"
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button slot="close" variant="secondary" className="w-full">
                  Cerrar
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Proyecto"
        message="¿Estás seguro de que deseas eliminar este proyecto? Se eliminarán todas las tareas asociadas. Esta acción no se puede deshacer."
        confirmText="Eliminar Proyecto"
        cancelText="Cancelar"
        variant="danger"
      />
    </>
  );
}
