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

  const handleDelete = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (data) {
      if (modalVariant === "Delete this board?") {
        if (currentBoardName) {
          const [boards] = data;
          const updatedBoards = boards.boards.filter(
            (board: { name: string }) => board.name !== currentBoardName
          );
          await updateBoardToDb(updatedBoards);
          closeModal();
        }
      } else {
        if (taskIndex !== undefined && taskStatus && currentBoardName) {
          const [boards] = data;
          const updatedBoards = boards.boards.map((board: Board) => {
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
        }
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p className="text-red font-bold text-lg">{modalVariant}</p>
        <div className="pt-6">
          <p className="text-sm text-medium-grey leading-6">
            {modalVariant === "Delete this board?"
              ? `Are you sure you want to delete the '${currentBoardName}' board? This action will remove all columns
                and tasks and cannot be reversed.`
              : `Are you sure you want to delete the '${taskTitle}' tasks? This action cannot be reversed.`}
          </p>
        </div>
        <div className="pt-6 flex space-x-2">
          <div className="w-1/2">
            <button
              type="submit"
              onClick={(e: React.FormEvent<HTMLButtonElement>) =>
                handleDelete(e)
              }
              className="bg-red-500 rounded-3xl py-2 w-full text-sm font-bold"
            >
              {" "}
              {isLoading ? "Loading" : "Delete"}
            </button>
          </div>
          <div className="w-1/2">
            <button
              onClick={closeModal}
              className="bg-stone-200 rounded-3xl py-2 w-full text-sm font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
