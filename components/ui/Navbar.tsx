"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { useEffect, useState } from "react";
import {
  getCurrentBoardName,
  openAddAndEditTaskModal,
  setCurrentBoardName,
} from "@/redux/features/appSlice";
import { Button } from "./button";
import Dropdown from "./Dropdown";

export default function Navbar() {
  const [show, setShow] = useState<boolean>(false);
  const { data } = useFetchDataFromDbQuery();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      const activeBoardData = data[0].boards.find(
        (board: { name: string }) => board.name === currentBoardName
      );
      if (activeBoardData) {
        dispatch(setCurrentBoardName(activeBoardData.name));
      } else {
        dispatch(setCurrentBoardName((data[0].boards[0] && data[0].boards[0].name) ?? 'Not board'));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const currentBoardName = useAppSelector(getCurrentBoardName);

  return (
    <nav className="bg-white border flex h-24">
      <div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
        <p className="font-bold text-3xl"> Kanban App </p>
      </div>

      <div className="flex justify-between w-full items-center pr-[2.12rem]">
        <p className="text-black text-2xl font-bold pl-6">{currentBoardName}</p>

        <div className="flex items-center space-x-3">
          <Button
            onClick={() =>
              dispatch(openAddAndEditTaskModal({ variant: "Add New Task" }))
            }
            className="px-4 py-2 flex items-center"
          >
            <p>+ Add New Task</p>
          </Button>
          <div className="relative flex items-center">
            <Button
              variant="ghost"
              className="text-3xl rotate-90 pb-4"
              onClick={() => setShow(!show)}
            >
              ⦀
            </Button>
            <Dropdown show={show} />
          </div>
        </div>
      </div>
    </nav>
  );
}
