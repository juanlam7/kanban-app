import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Board, BoardSections, Task } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const id = () => Math.random().toString(36).substring(2, 10);

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
