import { Task } from './types';
export const id = () => Math.random().toString(36).substring(2, 10);

export const INITIAL_TASKS: Task[] = [
  {
    id: id(),
    title: 'Title 2',
    status: 'backlog',
  },
  {
    id: id(),
    title: 'Title 3',
    status: 'backlog',
  },
  {
    id: id(),
    title: 'Title 4',
    status: 'done',
  },
  {
    id: id(),
    title: 'Title 5',
    status: 'in progress',
  },
];
