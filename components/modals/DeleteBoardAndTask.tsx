"use client";

import { Board } from "@/lib/types";
import {
  closeDeleteBoardAndTaskModal,
  getCurrentBoardName,
  getDeleteBoardAndTaskModalIndex,
  getDeleteBoardAndTaskModalStatus,
  getDeleteBoardAndTaskModalTitle,
  getDeleteBoardAndTaskModalValue,
  getDeleteBoardAndTaskModalVariantValue,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/redux/services/apiSlice";
import { Modal, ModalBody } from "../ui/Modal";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

export default function DeleteBoardOrTaskModal() {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(getDeleteBoardAndTaskModalValue);
  const closeModal = () => dispatch(closeDeleteBoardAndTaskModal());
  const currentBoardName = useAppSelector(getCurrentBoardName);
  const modalVariant = useAppSelector(getDeleteBoardAndTaskModalVariantValue);
  const taskTitle = useAppSelector(getDeleteBoardAndTaskModalTitle);
  const taskIndex = useAppSelector(getDeleteBoardAndTaskModalIndex);
  const taskStatus = useAppSelector(getDeleteBoardAndTaskModalStatus);
  const { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  const t = useTranslations();

  const handleDeleteBoard = async () => {
    if (!data || !currentBoardName) return;

    const [boards] = data;
    const updatedBoards = boards.boards.filter(
      (board: Board) => board.name !== currentBoardName
    );

    await updateBoardToDb(updatedBoards);
    closeModal();
  };

  const handleDeleteTask = async () => {
    if (!data || taskIndex === undefined || !taskStatus || !currentBoardName)
      return;

    const [boards] = data;
    const updatedBoards = boards.boards.map((board) => {
      if (board.name !== currentBoardName) return board;

      const updatedColumns = board.columns.map((column) => {
        if (column.name.toLowerCase() !== taskStatus.toLowerCase())
          return column;

        const updatedTasks = column.tasks.filter(
          (_, index) => index !== taskIndex
        );
        return { ...column, tasks: updatedTasks };
      });

      return { ...board, columns: updatedColumns };
    });

    await updateBoardToDb(updatedBoards);
    closeModal();
  };

  const handleDelete = async () => {
    if (modalVariant === "Delete this board?") {
      await handleDeleteBoard();
    } else {
      await handleDeleteTask();
    }
  };

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p className="text-red font-bold text-lg">{modalVariant}</p>
        <div className="pt-6">
          <p className="text-sm text-medium-grey leading-6">
            {modalVariant === "Delete this board?"
              ? t("delete_board_confirmation", {
                  boardName: `"${currentBoardName}"`,
                })
              : t("delete_task_confirmation", { taskTitle: `"${taskTitle}"` })}
          </p>
        </div>
        <div className="pt-6 flex space-x-2">
          <div className="w-1/2">
            <Button
              type="submit"
              variant={"destructive"}
              onClick={handleDelete}
              className="rounded-3xl py-2 w-full text-sm font-bold"
            >
              {isLoading ? `${t('loading')}...` : t('delete')}
            </Button>
          </div>
          <div className="w-1/2">
            <Button
              variant={"secondary"}
              onClick={closeModal}
              className="rounded-3xl py-2 w-full text-sm font-bold"
            >
              {t('cancel')}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
