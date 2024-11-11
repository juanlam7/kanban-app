"use client";

import { Column, Task } from "@/lib/types";
import { addOrUpdateTaskToColumnImmutable, id } from "@/lib/utils";
import {
  closeAddAndEditTaskModal,
  getActiveBoardIndex,
  getAddAndEditTaskModalTitle,
  getAddAndEditTaskModalValue,
  getAddAndEditTaskModalVariantValue,
  getCurrentBoardName,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/redux/services/apiSlice";
import { useEffect, useState } from "react";
import { Modal, ModalBody } from "../ui/Modal";

const initialTaskData: Task = {
  id: id(),
  title: "",
  status: "",
};

export default function AddOrEditTaskModal() {
  const { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  const [taskData, setTaskData] = useState<Task>();
  const [isTaskTitleEmpty, setIsTaskTitleEmpty] = useState<boolean>();
  const [isTaskStatusEmpty, setIsTaskStatusEmpty] = useState<boolean>();
  const [statusExists, setStatusExists] = useState<boolean>(true);
  const [columnNames, setColumnNames] = useState<string[]>();
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(getAddAndEditTaskModalValue);
  const modalVariant = useAppSelector(getAddAndEditTaskModalVariantValue);
  const isVariantAdd = modalVariant === "Add New Task";
  const closeModal = () => dispatch(closeAddAndEditTaskModal());
  const currentBoardTitle = useAppSelector(getCurrentBoardName);
  const currentTaskTitle = useAppSelector(getAddAndEditTaskModalTitle);
  const activeBoardIndex = useAppSelector(getActiveBoardIndex);

  useEffect(() => {
    if (data) {
      const activeBoard = data[0]?.boards[activeBoardIndex];
      if (activeBoard) {
        const { columns } = activeBoard;
        const columnNames = columns.map(
          (column: { name: string }) => column.name
        );

        if (columnNames) {
          setColumnNames(columnNames);
        }

        if (isVariantAdd) {
          setTaskData(initialTaskData);
        } else {
          const activeTask = columns
            .map((column: Column) => column.tasks)
            .flat()
            .find((task: { title: string }) => task.title === currentTaskTitle);
          setTaskData(activeTask);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, modalVariant]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsTaskStatusEmpty(false);
      setIsTaskStatusEmpty(false);
      setStatusExists(true);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [isTaskStatusEmpty, isTaskTitleEmpty, statusExists]);

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskData) {
      const newTitle = { ...taskData, title: e.target.value };
      setTaskData(newTitle);
    }
  };

  const handleTaskStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskData) {
      const newTitle = { ...taskData, status: e.target.value };
      setTaskData(newTitle);
    }
  };

  const handleAddNewTaskToDb = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const { title, status } = taskData!;

    if (!title) {
      setIsTaskTitleEmpty(true);
    }

    if (!status) {
      setIsTaskStatusEmpty(true);
    }

    const doesStatusExists = columnNames?.some(
      (column) => column === taskData?.status
    );

    if (!doesStatusExists) {
      setStatusExists(false);
    }

    if (title && status && doesStatusExists) {
      if (data) {
        const [boards] = data;
        const newData = addOrUpdateTaskToColumnImmutable(
          boards,
          currentBoardTitle,
          status,
          {
            id: id(),
            title: title,
            status: status,
          }
        );

        await updateBoardToDb(newData.boards);
        closeModal();
      }
    }
  };

  const handleEditTaskToDb = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const { title, status, id } = taskData!;
    if (!title) {
      setIsTaskTitleEmpty(true);
    }
    if (!status) {
      setIsTaskStatusEmpty(true);
    }
    const doesStatusExists = columnNames?.some(
      (column) => column === taskData?.status
    );
    if (!doesStatusExists) {
      setStatusExists(false);
    }
    if (title && status && doesStatusExists) {
      if (data) {
        const [boards] = data;
        const newData = addOrUpdateTaskToColumnImmutable(
          boards,
          currentBoardTitle,
          status,
          {
            id: id,
            title: title,
            status: status,
          }
        );

        await updateBoardToDb(newData.boards);
        closeModal();
      }
    }
  };

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p className="font-bold text-lg">{modalVariant}</p>
        <div className="py-6">
          <div>
            <label htmlFor="title" className="text-sm">
              Title
            </label>
            <div className="pt-2">
              <input
                id="title"
                className={`${
                  isTaskTitleEmpty ? "border-red-500" : "border-stone-200"
                } border w-full p-2 rounded text-sm cursor-pointer focus:outline-none`}
                placeholder="Name"
                value={taskData?.title}
                onChange={handleTaskTitleChange}
              />
            </div>
            {isTaskTitleEmpty ? (
              <p className="text-xs text-red-500">Task title cannot be empty</p>
            ) : (
              ""
            )}
          </div>

          <div className="mt-3">
            <label htmlFor="status" className="text-sm">
              Status
            </label>
            <div className="pt-2">
              <input
                id="status"
                className={`${
                  isTaskStatusEmpty || !statusExists
                    ? "border-red-500"
                    : "border-stone-200"
                } border w-full p-2 rounded text-sm cursor-pointer focus:outline-none`}
                placeholder={columnNames?.join(", ")}
                value={taskData?.status}
                onChange={handleTaskStatusChange}
              />
            </div>
            {isTaskStatusEmpty ? (
              <p className="text-xs text-red-500">
                Task status cannot be empty
              </p>
            ) : !statusExists ? (
              <p className="text-xs text-red-500">Column does not exist</p>
            ) : (
              ""
            )}
          </div>
          <div className="pt-6">
            <button
              type="submit"
              onClick={(e: React.FormEvent<HTMLButtonElement>) => {
                return isVariantAdd
                  ? handleAddNewTaskToDb(e)
                  : handleEditTaskToDb(e);
              }}
              className="bg-blue-500 rounded-3xl py-2 w-full text-sm font-bold"
            >
              <p>
                {isLoading
                  ? "Loading"
                  : `${isVariantAdd ? "Create Task" : "Save Changes"}`}
              </p>
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}