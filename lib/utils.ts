import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AllBoards, Board, BoardSections, Column, Task } from "./types";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const id = () => uuidv4();

export const getTaskById = (tasks: Task[], id: string) => {
  return tasks.find((task) => task.id === id);
};

export const findBoardSectionContainer = (
  boardSections: BoardSections,
  id: string
) => {
  if (id in boardSections) {
    return id;
  }

  const container = Object.keys(boardSections).find((key) =>
    boardSections[key].find((item) => item.id === id)
  );
  return container;
};

export function extractTasks(data: Board): Task[] {
  return data.columns.flatMap((column) => column.tasks);
}

export const transformBoard = (board: Board): BoardSections => {
  const boardSections: BoardSections = {};

  for (const column of board.columns) {
    const normalizedStatus =
      column.name[0].toUpperCase() + column.name.slice(1).toLowerCase();

    if (!boardSections[normalizedStatus]) {
      boardSections[normalizedStatus] = [];
    }

    for (const task of column.tasks) {
      boardSections[normalizedStatus].push({
        ...task,
        status: normalizedStatus,
      });
    }
  }

  return boardSections;
};

export function addOrUpdateTaskToColumnImmutable(
  data: AllBoards,
  boardName: string,
  columnName: string,
  newTask: Task
): AllBoards {
  return {
    boards: data.boards.map((board) => {
      if (board.name === boardName) {
        return {
          ...board,
          columns: board.columns.map((column) => {
            // Check if the column is the target column for the new task
            if (column.name === columnName) {
              // Add the new or updated task in the target column
              const existingTaskIndex = column.tasks.findIndex(
                (task) => task.id === newTask.id
              );

              if (existingTaskIndex > -1) {
                // If the task exists in the target column, update it
                const updatedTasks = column.tasks.map((task) =>
                  task.id === newTask.id
                    ? { ...task, title: newTask.title, status: newTask.status }
                    : task
                );
                return { ...column, tasks: updatedTasks };
              } else {
                // If task does not exist in the target column, add it
                return { ...column, tasks: [...column.tasks, newTask] };
              }
            } else {
              // For other columns, remove the task if it exists
              return {
                ...column,
                tasks: column.tasks.filter((task) => task.id !== newTask.id),
              };
            }
          }),
        };
      }
      return board;
    }),
  };
}

export const transformFromBoardSectionToBoard = (
  arrayTasks: BoardSections,
  boardName: string
): Board => {
  const columns: Column[] = Object.entries(arrayTasks).map(
    ([status, tasks]) => ({
      id: id(),
      name: status.toLowerCase(),
      tasks: tasks.map((task) => ({
        ...task,
        status: status.toLowerCase(),
      })),
    })
  );

  return {
    id: id(),
    name: boardName,
    columns,
  };
};
