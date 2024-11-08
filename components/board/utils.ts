import { BoardSections, Task } from "./types";

export const getTasksByStatus = (tasks: Task[], status: string) => {
  return tasks.filter((task) => task.status === status);
};

export const getTaskById = (tasks: Task[], id: string) => {
  return tasks.find((task) => task.id === id);
};

function extractStatus(tasks: Task[]): string[] {
  return tasks.map((task) => task.status);
}

export const initializeBoard = (tasks: Task[]) => {
  const statuses = extractStatus(tasks);
  const boardSections: BoardSections = {};

  statuses.forEach((boardSectionKey) => {
    boardSections[boardSectionKey] = getTasksByStatus(
      tasks,
      boardSectionKey as string
    );
  });

  return boardSections;
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
