"use client";

import {
  getActiveBoardIndex,
  getCurrentBoardName,
  openAddAndEditBoardModal,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { useEffect, useState } from "react";
import BoardSectionList from "./BoardSectionList";
import { Board } from "@/lib/types";
import { Button } from "../ui/button";

const WrapperBoard = () => {
  const { data, isLoading } = useFetchDataFromDbQuery();
  const currentBoardTitle = useAppSelector(getCurrentBoardName);
  const activeBoardIndex = useAppSelector(getActiveBoardIndex);
  const [activeBoards, setActiveBoards] = useState<Board[]>([]);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) {
      setActiveBoards(data.length > 0 ? data[0].boards : []);
    }
  }, [data, currentBoardTitle]);

  const handleAddColumn = () => {
    dispatch(openAddAndEditBoardModal("Edit Board"));
  };

  return (
    <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-secondary">
      {isLoading ? (
        <p className="text-3xl w-full text-center font-bold">
          Loading tasks...
        </p>
      ) : data &&
        activeBoards[0] &&
        activeBoards[activeBoardIndex].columns.length > 0 ? (
        <BoardSectionList
          AllBoards={activeBoards}
          key={currentBoardTitle}
          currentBoardTitle={currentBoardTitle}
          AddColumn={handleAddColumn}
        />
      ) : (
        <div className="w-full h-full flex justify-center items-center">
          <div className="flex flex-col items-center">
            <p className="text-sm">
              This board is empty. Create a new column to get started.
            </p>
            <Button
              onClick={handleAddColumn}
              className="px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
            >
              <p>+ Add New Column</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WrapperBoard;
