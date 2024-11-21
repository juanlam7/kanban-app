export type QueryAllBoards = AllBoards[]

export interface AllBoards {
  boards: Board[]
}

export interface Board {
  id: string
  columns: Column[]
  name: string
}

export interface Column {
  tasks: Task[]
  name: string
  id: string
}

export interface Task {
  title: string
  id: string
  status: string
  description: string
  subtasks: Subtask[]
  // columnId: string
}

export interface Subtask {
  id: string;
  isCompleted: boolean;
  title?: string;
}

export type BoardSections = {
  [name: string]: Task[];
};