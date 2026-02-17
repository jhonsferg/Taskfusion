import { useEffect } from "react";
import type { Key } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import {
  Autocomplete,
  Button,
  Label,
  ListBox,
  SearchField,
  EmptyState,
  useFilter,
} from "@heroui/react";
import { getProjects } from "../../services/projects";
import { Settings } from "lucide-react";
import { ProjectManagerModal } from "./ProjectManagerModal";
import { useState } from "react";

interface ProjectSelectorProps {
  selectedProjectId: string | null;
  onProjectSelect: (projectId: string) => void;
}

export function ProjectSelector({
  selectedProjectId,
  onProjectSelect,
}: ProjectSelectorProps) {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const { contains } = useFilter({ sensitivity: "base" });

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });

  // Automatically select the first project if none is selected
  useEffect(() => {
    if (projects && projects.length > 0 && !selectedProjectId) {
      onProjectSelect(projects[0].id);
    }
  }, [projects, selectedProjectId, onProjectSelect]);

  return (
    <div className="flex items-center gap-2">
      <div className="w-64">
        <Autocomplete
          className="max-w-xs"
          placeholder={isLoading ? "Cargando..." : "Seleccionar proyecto..."}
          selectionMode="single"
          value={selectedProjectId}
          onChange={(key: Key | null) => {
            if (key) onProjectSelect(key as string);
          }}
        >
          <Label />
          <Autocomplete.Trigger>
            <Autocomplete.Value />
            <Autocomplete.ClearButton />
            <Autocomplete.Indicator />
          </Autocomplete.Trigger>
          <Autocomplete.Popover>
            <Autocomplete.Filter filter={contains}>
              <SearchField autoFocus name="search" variant="secondary">
                <SearchField.Group>
                  <SearchField.SearchIcon />
                  <SearchField.Input placeholder="Buscar proyectos..." />
                  <SearchField.ClearButton />
                </SearchField.Group>
              </SearchField>
              <ListBox
                renderEmptyState={() => (
                  <EmptyState>No se encontraron proyectos</EmptyState>
                )}
              >
                {(projects || []).map((project) => (
                  <ListBox.Item
                    key={project.id}
                    id={project.id}
                    textValue={project.name}
                  >
                    {project.name}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Autocomplete.Filter>
          </Autocomplete.Popover>
        </Autocomplete>
      </div>

      <Button
        isIconOnly
        variant="ghost"
        aria-label="Gestionar Proyectos"
        onPress={() => setIsManagerOpen(true)}
      >
        <Settings className="w-5 h-5" />
      </Button>

      <ProjectManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
      />
    </div>
  );
}
