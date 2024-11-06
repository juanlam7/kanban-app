"use client";

import { Column as ColumnType, Task as TaskType } from "@/lib/types";
import {
  getCurrentBoardName,
  openAddAndEditBoardModal,
  openAddAndEditTaskModal,
  openDeleteBoardAndTaskModal,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

interface ColumnProps {
  column: ColumnType;
  onEditTask: (columnName: string, index: number, title: string) => void;
  onDeleteTask: (
    columnName: string,
    index: number,
    title: string,
    status: string
  ) => void;
}

interface TaskProps {
  task: TaskType;
  onEdit: () => void;
  onDelete: () => void;
}

const Task = ({ task, onEdit, onDelete }: TaskProps) => (
  <div className="bg-white p-6 rounded-md mt-6 flex items-center justify-between border">
    <p>{task.title}</p>
    <div className="flex items-center space-x-1">
      <MdEdit onClick={onEdit} className="text-lg cursor-pointer" />
      <MdDelete
        onClick={onDelete}
        className="text-lg cursor-pointer text-red-500"
      />
    </div>
  </div>
);

const Column = ({ column, onEditTask, onDeleteTask }: ColumnProps) => (
  <div className="w-[17.5rem] shrink-0">
    <p className="text-black">{`${column.name} (${
      column.tasks?.length || 0
    })`}</p>
    <div className="h-full">
      {column.tasks?.length > 0 ? (
        column.tasks.map((task: TaskType, index: number) => (
          <Task
            key={task.id}
            task={task}
            onEdit={() => onEditTask(column.name, index, task.title)}
            onDelete={() =>
              onDeleteTask(column.name, index, task.title, task.status)
            }
          />
        ))
      ) : (
        <div className="mt-6 h-full rounded-md border-dashed border-4 border-white" />
      )}
    </div>
  </div>
);

export default function BoardTasks() {
  const { isLoading, data } = useFetchDataFromDbQuery();
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const currentBoardTitle = useAppSelector(getCurrentBoardName);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      const activeBoardData = data[0]?.boards.find(
        (board) => board.name === currentBoardTitle
      );
      setColumns(activeBoardData?.columns || []);
    }
  }, [data, currentBoardTitle]);

  const handleEditTask = (columnName: string, index: number, title: string) => {
    dispatch(
      openAddAndEditTaskModal({
        variant: "Edit Task",
        title,
        index,
        name: columnName,
      })
    );
  };

  const handleDeleteTask = (
    columnName: string,
    index: number,
    title: string,
    status: string
  ) => {
    dispatch(
      openDeleteBoardAndTaskModal({
        variant: "Delete this task?",
        title,
        status,
        index,
      })
    );
  };

  const handleAddColumn = () => {
    dispatch(openAddAndEditBoardModal("Edit Board"));
  };

  return (
    <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-stone-200">
      {isLoading ? (
        <p className="text-3xl w-full text-center font-bold">
          Loading tasks...
        </p>
      ) : columns.length > 0 ? (
        <div className="flex space-x-6">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
          {columns.length < 7 && (
            <div
              onClick={handleAddColumn}
              className="rounded-md bg-white w-[17.5rem] mt-12 shrink-0 flex justify-center items-center cursor-pointer"
            >
              <p className="font-bold text-black text-2xl">+ New Column</p>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center">
            <p className="text-black text-sm">
              This board is empty. Create a new column to get started.
            </p>
            <button
              onClick={handleAddColumn}
              className="bg-blue-500 text-black px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
            >
              <p>+ Add New Column</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
