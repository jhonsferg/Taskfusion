import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task } from "../../types";
import { TaskCard } from "./TaskCard";
import { cn } from "../../utils/cn";

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  color?: string;
  titleColor?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  color,
  titleColor,
  onEdit,
  onDelete,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex h-full w-[85vw] md:w-full flex-col rounded-xl border-2 p-3 md:p-4 transition-colors",
        color || "bg-gray-50 border-gray-100",
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className={cn("font-bold", titleColor || "text-gray-700")}>
          {title}
        </h3>
        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-gray-500 shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
