import { useState, useMemo } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type DropAnimation,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { type Task, Status } from "../../types";
import { createPortal } from "react-dom";

interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: Status) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
}

export function KanbanBoard({
  tasks,
  onTaskMove,
  onTaskEdit,
  onTaskDelete,
}: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const columns = useMemo(
    () => ({
      [Status.BACKLOG]: tasks.filter((t) => t.status === Status.BACKLOG),
      [Status.IN_PROGRESS]: tasks.filter(
        (t) => t.status === Status.IN_PROGRESS,
      ),
      [Status.DONE]: tasks.filter((t) => t.status === Status.DONE),
    }),
    [tasks],
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requires 8px movement before drag starts, allowing clicks
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Logic for sorting within columns would go here if we were reordering
    // For now we just handle column changes in dragEnd
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // Process the move first
    if (over) {
      const activeId = active.id as string;
      const overId = over.id as string;

      const activeTask = tasks.find((t) => t.id === activeId);
      if (activeTask) {
        // Check if dropped on a column
        if (Object.values(Status).includes(overId as Status)) {
          if (activeTask.status !== overId) {
            onTaskMove(activeId, overId as Status);
          }
        }
        // Check if dropped on another task
        else {
          const overTask = tasks.find((t) => t.id === overId);
          if (overTask && activeTask.status !== overTask.status) {
            onTaskMove(activeId, overTask.status);
          }
        }
      }
    }

    // Clear active task immediately to remove overlay
    setActiveTask(null);
  };

  const dropAnimation: DropAnimation = {
    // Disable side effects to prevent the "return to start" animation
    // when we want it to just disappear into the new position
    sideEffects: null,
    duration: 150,
    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex h-full gap-4 md:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory px-4 md:px-0">
        <div className="snap-center h-full shrink-0 flex-1 min-w-[300px] first:pl-0 last:pr-4">
          <KanbanColumn
            id={Status.BACKLOG}
            title="Pendiente"
            tasks={columns[Status.BACKLOG]}
            color="bg-indigo-50 border-indigo-100"
            titleColor="text-indigo-700"
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
          />
        </div>
        <div className="snap-center h-full shrink-0 flex-1 min-w-[300px]">
          <KanbanColumn
            id={Status.IN_PROGRESS}
            title="En Progreso"
            tasks={columns[Status.IN_PROGRESS]}
            color="bg-amber-50 border-amber-100"
            titleColor="text-amber-700"
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
          />
        </div>
        <div className="snap-center h-full shrink-0 flex-1 min-w-[300px] last:pr-0">
          <KanbanColumn
            id={Status.DONE}
            title="Completado"
            tasks={columns[Status.DONE]}
            color="bg-emerald-50 border-emerald-100"
            titleColor="text-emerald-700"
            onEdit={onTaskEdit}
            onDelete={onTaskDelete}
          />
        </div>
      </div>

      {createPortal(
        <DragOverlay dropAnimation={dropAnimation}>
          {activeTask && (
            <TaskCard
              task={activeTask}
              className="cursor-grabbing shadow-2xl scale-105"
            />
          )}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  );
}
