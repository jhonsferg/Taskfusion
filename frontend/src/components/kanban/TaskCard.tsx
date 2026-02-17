import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { type Task, Priority } from "../../types";

import { Badge } from "../ui/Badge";
import { Calendar, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "../../utils/cn";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface TaskCardProps {
  task: Task;
  className?: string;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const PRIORITY_OPTIONS = [
  { key: Priority.LOW, label: "Baja" },
  { key: Priority.MEDIUM, label: "Media" },
  { key: Priority.HIGH, label: "Alta" },
];

export function TaskCard({ task, className, onEdit, onDelete }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "h-[120px] w-full rounded-xl border-2 border-indigo-500 bg-indigo-50 opacity-50",
          className,
        )}
      />
    );
  }

  const priorityBorder = {
    [Priority.LOW]: "border-l-emerald-500",
    [Priority.MEDIUM]: "border-l-amber-500",
    [Priority.HIGH]: "border-l-red-500",
  } as const;

  const priorityBadgeVariant = {
    [Priority.LOW]: "success",
    [Priority.MEDIUM]: "warning",
    [Priority.HIGH]: "destructive",
  } as const;

  // This block was duplicated in the original content, keeping the first one.
  // The instruction's `{{ ... }}` implies this block should be removed if it was the second one.
  // However, the instruction's provided code snippet for the final return block
  // implies that the `isDragging` check for the placeholder is still present.
  // Given the instruction's diff, the second `if (isDragging)` block should be removed.
  // The first `if (isDragging)` block is the correct one for the placeholder.

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-grab active:cursor-grabbing group relative flex flex-col",
        "transition-all duration-200 hover:shadow-md hover:border-indigo-300 min-h-[140px]",
        "border-l-[4px]",
        priorityBorder[task.priority] || "border-l-gray-300",
        className,
      )}
    >
      <div className="flex justify-between items-start gap-2 mb-2 pr-6">
        <h4 className="font-semibold text-gray-900 leading-tight line-clamp-3 text-sm break-words">
          {task.title}
        </h4>
      </div>

      <div className="absolute top-2 right-2">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button
            className="flex items-center justify-center p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="w-4 h-4" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-1 w-32 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(task);
                      }}
                      className={cn(
                        "group flex w-full items-center rounded-md px-2 py-2 text-xs text-gray-900",
                        active ? "bg-indigo-50" : "",
                      )}
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5 text-indigo-500" />
                      Editar
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(task.id);
                      }}
                      className={cn(
                        "group flex w-full items-center rounded-md px-2 py-2 text-xs text-red-600",
                        active ? "bg-red-50" : "",
                      )}
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5 text-red-500" />
                      Eliminar
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {task.description && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
        <Badge
          variant={priorityBadgeVariant[task.priority] || "default"}
          className="text-[10px] px-2 py-0.5 shadow-sm"
        >
          {
            PRIORITY_OPTIONS.find((option) => option.key === task.priority)
              ?.label
          }
        </Badge>

        {task.due_date && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md">
            <Calendar className="w-3 h-3" />
            <span>
              {format(new Date(task.due_date), "d MMM", { locale: es })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
