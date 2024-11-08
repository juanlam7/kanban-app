// export type Status = 'backlog' | 'in progress' | 'done';

export type Task = {
  id: string;
  title: string;
  status: string;
};

export type BoardSections = {
  [name: string]: Task[];
};
