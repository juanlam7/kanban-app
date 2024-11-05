"use client";

import { useEffect, useState } from "react";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { useAppSelector } from "@/redux/hooks";
import { getCurrentBoardName } from "@/redux/features/appSlice";
import { Button } from "./button";
import { MdEdit, MdDelete } from "react-icons/md";

interface ITask {
  id: string;
  title: string;
  status: string;
}

interface Column {
  id: string;
  name: string;
  tasks: ITask[];
}

export default function BoardTasks() {
  const { isLoading, data } = useFetchDataFromDbQuery();
  const [columns, setColumns] = useState<Column[]>([]);
  const activeBoard = useAppSelector(getCurrentBoardName);

  useEffect(() => {
    if (data !== undefined) {
      const [boards] = data;
      if (boards) {
        const activeBoardData = boards.boards.find(
          (board: { name: string }) => board.name === activeBoard
        );
        if (activeBoardData) {
          const { columns } = activeBoardData;
          setColumns(columns);
        }
      }
    }
  }, [data, activeBoard]);

  return (
    <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-stone-200">
      {isLoading ? (
        <p className="text-3xl w-full text-center font-bold">
          Loading tasks...
        </p>
      ) : (
        <>
          {columns.length > 0 ? (
            <div className="flex space-x-6">
              {columns.map((column) => {
                const { id, name, tasks } = column;
                return (
                  <div key={id} className="w-[17.5rem] shrink-0">
                    <p className="text-black">{`${name} (${
                      tasks ? tasks?.length : 0
                    })`}</p>

                    {tasks &&
                      (tasks.length > 0 ? (
                        tasks.map((task) => {
                          const { id, title } = task;

                          return (
                            <div
                              key={id}
                              className="bg-white p-6 rounded-md mt-6 flex items-center justify-between border"
                            >
                              <p>{title}</p>
                              <div className="flex items-center space-x-1">
                                <MdEdit className="text-lg cursor-pointer" />
                                <MdDelete className="text-lg cursor-pointer text-red-500" />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="mt-6 h-full rounded-md border-dashed border-4 border-white" />
                      ))}
                  </div>
                );
              })}
              {columns.length < 7 ? (
                <div className="rounded-md bg-white w-[17.5rem] mt-12 shrink-0 flex justify-center items-center">
                  <p className="cursor-pointer font-bold text-black text-2xl">
                    + New Column
                  </p>
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col items-center">
                <p className="text-black text-sm">
                  This board is empty. Create a new column to get started.
                </p>
                <Button className="px-4 py-2 flex mt-6 items-center">
                  <p>+ Add New Column</p>
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
