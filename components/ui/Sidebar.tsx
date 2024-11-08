"use client";

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import {
  openAddAndEditBoardModal,
  setCurrentBoardName,
} from "@/redux/features/appSlice";
import { Button } from "./button";
import { Board } from "@/lib/types";

export default function Sidebar() {
  const [active, setActive] = useState<number>(0);

  const { data } = useFetchDataFromDbQuery();
  const dispatch = useAppDispatch();

  const handleNav = (index: number, name: string) => {
    setActive(index);
    dispatch(setCurrentBoardName(name));
  };
  return (
    <aside className="w-[18.75rem] flex-none dark:bg-dark-grey h-full py-6 pr-6">
      {data && (
        <>
          <p className="text-medium-grey pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
            {`All Boards (${data[0]?.boards.length})`}
          </p>
          {data[0]?.boards.map((board: Board, index: number) => {
            const { name, id } = board;
            const isActive = index === active;
            return (
              <div
                key={id}
                onClick={() => handleNav(index, name)}
                className={`${
                  isActive
                    ? "rounded-tr-full rounded-br-full bg-primary text-white"
                    : "text-black bg-secondary"
                } cursor-pointer flex items-center 
                space-x-2 pl-[2.12rem] py-3 pb-3`}
              >
                <p className="text-lg capitalize">{name}</p>
              </div>
            );
          })}
        </>
      )}
      <Button
        onClick={() => dispatch(openAddAndEditBoardModal("Add New Board"))}
        variant="ghost"
        className="flex items-center space-x-2 ml-[2.12rem] py-3"
      >
        <p className="text-base font-bold capitalize text-main-purple">
          + Create New Board
        </p>
      </Button>
    </aside>
  );
}
