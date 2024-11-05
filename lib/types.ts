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
}
