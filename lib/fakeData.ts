import { id } from "./utils";

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
