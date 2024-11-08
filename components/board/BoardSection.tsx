import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Task } from "./types";
import TaskItem from "./TaskItem";
import SortableTaskItem from "./SortableTaskItem";

type BoardSectionProps = {
  id: string;
  title: string;
  tasks: Task[];
};

const BoardSection = ({ id, title, tasks }: BoardSectionProps) => {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="w-[17.5rem] shrink-0">
      <h3 className="text-lg font-semibold mb-4">
        {`${title} (${tasks?.length || 0})`}
      </h3>
      <SortableContext
        id={id}
        items={tasks}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef}>
          {tasks.map((task, index: number) => (
            <div key={task.id} className="mb-4">
              <SortableTaskItem id={task.id}>
                {task.title.length === 0 ? (
                  <div className="mt-6 h-full rounded-md border-dashed border-4 border-white" />
                ) : (
                  <TaskItem task={task} index={index} />
                )}
              </SortableTaskItem>
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default BoardSection;
