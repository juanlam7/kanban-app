"use client";

import {
  getCurrentBoardName,
  openAddAndEditBoardModal,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { useEffect, useState } from "react";
import BoardSectionList from "./BoardSectionList";
import { Board } from "@/lib/types";

const WrapperBoard = () => {
  const { data, isLoading } = useFetchDataFromDbQuery();
  const currentBoardTitle = useAppSelector(getCurrentBoardName);
  const [activeBoard, setActiveBoard] = useState<Board>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      const activeBoardData = data[0]?.boards.find(
        (board) => board.name === currentBoardTitle
      );
      if (activeBoardData) {
        setActiveBoard(activeBoardData);
      }
    }
  }, [data, currentBoardTitle]);

  const handleAddColumn = () => {
    dispatch(openAddAndEditBoardModal("Edit Board"));
  };

  return (
    <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-stone-200">
      {isLoading ? (
        <p className="text-3xl w-full text-center font-bold">
          Loading tasks...
        </p>
      ) : activeBoard && activeBoard?.columns?.length > 0 ? (
        <BoardSectionList
          currentBoard={activeBoard}
          key={currentBoardTitle}
          AddColumn={handleAddColumn}
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center">
            <p className="text-black text-sm">
              This board is empty. Create a new column to get started.
            </p>
            <button
              onClick={handleAddColumn}
              className="bg-blue-500 text-black px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
            >
              <p>+ Add New Column</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WrapperBoard;
