import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const id = () => Math.random().toString(36).substring(2, 10);

export const data = {
  boards: [
    {
      id: id(),
      name: "Roadmap",
      columns: [
        {
          id: id(),
          name: "backlog",
          tasks: [
            {
              id: id(),
              title: "Launch version one",
              status: "backlog",
            },
            {
              id: id(),
              title: "Review early feedback and plan next steps for roadmap",
              status: "backlog",
            },
          ],
        },
        {
          id: id(),
          name: "in progress",
          tasks: [
            {
              id: id(),
              title: "Review early feedback and plan next steps for roadmap",
              status: "in progress",
            },
          ],
        },
        {
          id: id(),
          name: "done",
          tasks: [
            {
              id: id(),
              title: "Review early feedback and plan next steps for roadmap",
              status: "done",
            },
          ],
        },
      ],
    },
  ],
};
