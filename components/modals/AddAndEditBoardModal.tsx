"use client";

import { Board } from "@/lib/types";
import { id } from "@/lib/utils";
import {
  closeAddAndEditBoardModal,
  getActiveBoardIndex,
  getAddAndEditBoardModalValue,
  getAddAndEditBoardModalVariantValue,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/redux/services/apiSlice";
import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { Modal, ModalBody } from "../ui/Modal";

const addBoardData = {
  id: id(),
  name: "",
  columns: [
    {
      id: id(),
      name: "",
      tasks: [],
    },
  ],
};

export default function AddAndEditBoardModal() {
  const [boardData, setBoardData] = useState<Board>();
  const [isBoardNameEmpty, setIsBoardNameEmpty] = useState<boolean>(false);
  const [emptyColumnIndex, setEmptyColumnIndex] = useState<number>();

  const modalVariant = useAppSelector(getAddAndEditBoardModalVariantValue);
  const isVariantAdd = modalVariant === "Add New Board";
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(getAddAndEditBoardModalValue);
  const closeModal = () => dispatch(closeAddAndEditBoardModal());
  const { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  const activeBoardIndex = useAppSelector(getActiveBoardIndex);

  useEffect(() => {
    if (data) {
      if (isVariantAdd) {
        setBoardData(addBoardData);
      } else {
        const activeBoard = data[0]?.boards[activeBoardIndex];
        setBoardData(activeBoard);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, modalVariant]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsBoardNameEmpty(false);
      setEmptyColumnIndex(undefined);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [emptyColumnIndex, isBoardNameEmpty]);

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (boardData) {
      const newName = { ...boardData, name: e.target.value };
      setBoardData(newName);
    }
  };

  const handleColumnNameChange = (index: number) => {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      if (boardData) {
        const modifyColumns = boardData.columns.map((column, columnIndex) => {
          if (columnIndex === index) {
            return { ...column, name: e.target.value };
          }
          return column;
        });
        const modifiedColumn = { ...boardData, columns: modifyColumns };
        setBoardData(modifiedColumn);
      }
    };
  };

  const handleAddNewColumn = () => {
    if (boardData && boardData.columns.length < 6) {
      const updatedBoardData = { ...boardData };
      const newColumn = { id: id(), name: "", tasks: [] };
      updatedBoardData.columns = [...updatedBoardData.columns, newColumn];
      setBoardData(updatedBoardData);
    }
  };

  const handleDeleteColumn = (index: number) => {
    if (boardData) {
      const filteredColumns = boardData.columns.filter(
        (_column, columnIndex) => columnIndex !== index
      );
      setBoardData({ ...boardData, columns: filteredColumns });
    }
  };

  const handleAddNewBoardToDb = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    const emptyColumnStringChecker = boardData?.columns.some(
      (column) => column.name === ""
    );

    if (boardData?.name === "") {
      setIsBoardNameEmpty(true);
    }

    if (emptyColumnStringChecker) {
      const emptyColumn = boardData?.columns.findIndex(
        (column) => column.name == ""
      );
      setEmptyColumnIndex(emptyColumn);
    }

    if (boardData && boardData?.name !== "" && !emptyColumnStringChecker) {
      if (data) {
        const [boards] = data;
        const addBoard = [...boards.boards, boardData];
        await updateBoardToDb(addBoard);
        closeModal();
      }
    }
  };

  const handleEditBoardToDb = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const emptyColumnStringChecker = boardData?.columns.some(
      (column) => column.name === ""
    );
    if (boardData?.name === "") {
      setIsBoardNameEmpty(true);
    }
    if (emptyColumnStringChecker) {
      const emptyColumn = boardData?.columns.findIndex(
        (column) => column.name == ""
      );
      setEmptyColumnIndex(emptyColumn);
    }
    if (boardData?.name !== "" && !emptyColumnStringChecker) {
      if (data) {
        const [boards] = data;
        const boardsCopy = [...boards.boards];
        const updatedBoard = {
          ...boards.boards[activeBoardIndex],
          name: boardData!.name,
          columns: boardData!.columns,
        };
        boardsCopy[activeBoardIndex] = updatedBoard;
        await updateBoardToDb(boardsCopy);
        closeModal();
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <ModalBody>
        {boardData && (
          <>
            <p className="text-lg font-bold">{modalVariant}</p>
            <div className="py-6">
              <div>
                <label htmlFor="boardName" className="text-sm">
                  Board Name
                </label>
                <div className="pt-2">
                  <input
                    id="boardName"
                    className={`${
                      isBoardNameEmpty ? "border-red-500" : "border-stone-200"
                    } border w-full p-2 rounded text-sm cursor-pointer focus:outline-none`}
                    placeholder="Name"
                    value={boardData.name}
                    onChange={handleBoardNameChange}
                  />
                </div>
                {isBoardNameEmpty ? (
                  <p className="text-xs text-red-500">
                    Board name cannot be empty
                  </p>
                ) : (
                  ""
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="" className="text-sm">
                  Board Column
                </label>
                {boardData &&
                  boardData.columns.map(
                    (column: { name: string; id: string }, index: number) => {
                      const { name, id } = column;
                      return (
                        <div key={id} className="pt-2">
                          <div className="flex items-center space-x-2">
                            <input
                              className={`${
                                emptyColumnIndex === index
                                  ? "border-red-500"
                                  : "border-stone-200"
                              } border border-stone-200 focus:outline-none text-sm cursor-pointer w-full p-2 rounded`}
                              placeholder="e.g Doing"
                              onChange={(e) => handleColumnNameChange(index)(e)}
                              value={name!}
                            />
                            <div>
                              <FaTimes
                                onClick={() => handleDeleteColumn(index)}
                              />
                            </div>
                          </div>
                          {emptyColumnIndex === index ? (
                            <p className="text-xs text-red-500">
                              Column name cannot be empty
                            </p>
                          ) : (
                            ""
                          )}
                        </div>
                      );
                    }
                  )}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleAddNewColumn}
                    className="bg-stone-200 rounded-3xl py-2 w-full text-sm font-bold"
                  >
                    <p>+ Add New Column</p>
                  </button>
                </div>
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  onClick={(e: React.FormEvent<HTMLButtonElement>) => {
                    return isVariantAdd
                      ? handleAddNewBoardToDb(e)
                      : handleEditBoardToDb(e);
                  }}
                  className="bg-blue-500 rounded-3xl py-2 w-full text-sm font-bold"
                >
                  <p>
                    {isLoading
                      ? "Loading"
                      : `${isVariantAdd ? "Create New Board" : "Save Changes"}`}
                  </p>
                </button>
              </div>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
}
