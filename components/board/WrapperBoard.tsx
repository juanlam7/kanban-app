"use client";

import { BoardModalVariantEnum } from "@/lib/enums";
import { Board } from "@/lib/types";
import {
  getActiveBoardIndex,
  getCurrentBoardName,
  openAddAndEditBoardModal,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useAddInitialBoardToDbMutation,
  useFetchDataFromDbQuery,
} from "@/redux/services/apiSlice";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import BoardSectionList from "./BoardSectionList";

const WrapperBoard = () => {
  const { data, isLoading } = useFetchDataFromDbQuery();
  const [addInitialBoardToDb] = useAddInitialBoardToDbMutation();
  const currentBoardTitle = useAppSelector(getCurrentBoardName);
  const activeBoardIndex = useAppSelector(getActiveBoardIndex);
  const [activeBoards, setActiveBoards] = useState<Board[]>([]);
  const dispatch = useAppDispatch();
  const t = useTranslations();

  useEffect(() => {
    if (!data || !data[0]?.boards) {
      addInitialBoardToDb();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) {
      setActiveBoards(data.length > 0 ? data[0].boards : []);
    }
  }, [data, currentBoardTitle]);

  const handleAddColumn = () => {
    dispatch(openAddAndEditBoardModal(BoardModalVariantEnum.EditBoard));
  };

  return (
    <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-secondary">
      {isLoading ? (
        <p className="text-3xl w-full text-center font-bold">
          {t("loading_tasks")}...
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
              {t("board_empty_create_new_column_to_get_started")}.
            </p>
            <Button
              onClick={handleAddColumn}
              className="px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2"
            >
              <p>+ {t("add_new_column")}</p>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WrapperBoard;
