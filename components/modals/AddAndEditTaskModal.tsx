"use client";

import { Column, Subtask, Task } from "@/lib/types";
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
import { MdDelete, MdEdit } from "react-icons/md";
import { Modal, ModalBody } from "../ui/Modal";
import { Button } from "../ui/button";

const initialTaskData: Task = {
  id: id(),
  title: "",
  description: "",
  status: "",
  subtasks: [
    {
      id: id(),
      title: "",
      isCompleted: false,
    },
  ],
};

export default function AddOrEditTaskModal() {
  const { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();
  const [taskData, setTaskData] = useState<Task>();
  const [isTaskTitleEmpty, setIsTaskTitleEmpty] = useState<boolean>();
  const [isTaskStatusEmpty, setIsTaskStatusEmpty] = useState<boolean>();
  const [columnNames, setColumnNames] = useState<string[]>();
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(getAddAndEditTaskModalValue);
  const modalVariant = useAppSelector(getAddAndEditTaskModalVariantValue);
  const isVariantAdd = modalVariant === "Add New Task";
  const closeModal = () => dispatch(closeAddAndEditTaskModal());
  const currentBoardTitle = useAppSelector(getCurrentBoardName);
  const currentTaskTitle = useAppSelector(getAddAndEditTaskModalTitle);
  const activeBoardIndex = useAppSelector(getActiveBoardIndex);
  const [emptySubtaskIndex, setEmptySubtaskIndex] = useState<number>();
  const [isViewCompleted, setIsViewCompleted] = useState<boolean>(false);

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
      setIsTaskTitleEmpty(false);
      setEmptySubtaskIndex(undefined);
      setIsTaskStatusEmpty(false);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [isTaskStatusEmpty, isTaskTitleEmpty, emptySubtaskIndex]);

  const handleTaskTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (taskData) {
      const newTitle = { ...taskData, title: e.target.value };
      setTaskData(newTitle);
    }
  };

  const handleTaskDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (taskData) setTaskData({ ...taskData, description: e.target.value });
  };

  const handleTaskStatusChange = (e: React.FormEvent<HTMLSelectElement>) => {
    const target = e.target as HTMLSelectElement;
    if (taskData) setTaskData({ ...taskData, status: target.value });
  };

  const handleAddNewSubtask = () => {
    const newSubtask = { title: "", isCompleted: false, id: id() };
    if (taskData) {
      setTaskData({
        ...taskData,
        subtasks: [...taskData.subtasks, newSubtask],
      });
    }
  };

  const handleDeleteSubtask = (id: string) => {
    if (taskData) {
      const deletedSubtask = taskData.subtasks.filter((subtask) => {
        const { id: subtaskId } = subtask;
        return subtaskId !== id;
      });
      setTaskData({ ...taskData, subtasks: deletedSubtask });
    }
  };

  const handleSubtaskTitleChange = (id: string) => {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      if (taskData) {
        const updatedSubtaskTitle = taskData.subtasks.map((subtask) => {
          const { id: subtaskId } = subtask;
          if (subtaskId === id) {
            return { ...subtask, title: e.target.value };
          }
          return subtask;
        });
        setTaskData({ ...taskData, subtasks: updatedSubtaskTitle });
      }
    };
  };

  const handleIsCompletedStatus = async (id: string) => {
    if (taskData) {
      const updatedSubtaskTitle = taskData.subtasks.map((subtask) => {
        const { id: subtaskId } = subtask;
        if (subtaskId === id) {
          return { ...subtask, isCompleted: !subtask.isCompleted };
        }
        return subtask;
      });
      setTaskData({ ...taskData, subtasks: updatedSubtaskTitle });
    }
  };

  const handleEditorAddTaskToDb = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    const { title, status, id: taskId, description, subtasks } = taskData!;

    if (!title) {
      setIsTaskTitleEmpty(true);
    }

    if (!status) {
      setIsTaskStatusEmpty(true);
    }

    const emptySubtaskStringChecker = subtasks.some(
      (subtask) => subtask.title === ""
    );

    if (emptySubtaskStringChecker) {
      const emptyColumn = subtasks.findIndex((subtask) => subtask.title == "");
      setEmptySubtaskIndex(emptyColumn);
    }

    if (title && status && !emptySubtaskStringChecker && status != "") {
      if (data) {
        const [boards] = data;
        const newData = addOrUpdateTaskToColumnImmutable(
          boards,
          currentBoardTitle,
          status,
          {
            id: taskId ?? id(),
            title: title,
            status: status,
            description: description,
            subtasks: subtasks,
          }
        );

        await updateBoardToDb(newData.boards);
        closeModal();
      }
    }
  };
  // TODO: use form ui component in all modal with input field
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

          <div className="pt-6">
            <label className="text-sm">Description</label>
            <div className="pt-2">
              <textarea
                placeholder="e.g. It's always good to take a break. This fifteen minutes break will recharge the batteries a little"
                value={taskData?.description}
                onChange={handleTaskDescriptionChange}
                className={`border hide-scrollbar focus:outline-none text-sm cursor-pointer w-full p-2 rounded h-16`}
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="flex justify-between">
              <label htmlFor="" className="text-sm">
                Subtasks (
                {
                  taskData?.subtasks?.filter(
                    (subtask: { isCompleted: boolean }) =>
                      subtask?.isCompleted === true
                  ).length
                }{" "}
                of {taskData?.subtasks.length})
              </label>
              <MdEdit
                onClick={() => setIsViewCompleted(!isViewCompleted)}
                className="text-lg cursor-pointer"
              />
            </div>
            <div className="hide-scrollbar overflow-x-auto overflow-y-auto max-h-40">
              {taskData &&
                taskData.subtasks &&
                taskData.subtasks.length > 0 &&
                taskData.subtasks.map((subtask: Subtask, index: number) => {
                  const { id, title, isCompleted } = subtask;
                  return (
                    <div key={id} className="pt-2">
                      <div
                        className="px-4 py-2 bg-accent w-full flex items-center space-x-4 
                        cursor-pointer transition ease-in duration-150 delay-150"
                      >
                        {isViewCompleted ? (
                          <input
                            value={title}
                            className={`${
                              emptySubtaskIndex === index
                                ? "border-red-500"
                                : "border-stone-200"
                            } border text-sm cursor-pointer w-full p-2 rounded`}
                            placeholder="e.g Doing"
                            onChange={(e) => handleSubtaskTitleChange(id)(e)}
                          />
                        ) : (
                          <>
                            <input
                              id={title}
                              type="checkbox"
                              disabled={isLoading}
                              checked={isCompleted}
                              onChange={() => handleIsCompletedStatus(id)}
                              className="w-4 h-4 rounded focus:ring-2"
                            />
                            <label
                              htmlFor={title}
                              className={`${
                                !isCompleted
                                  ? "dark:text-white text-black"
                                  : "text-medium-grey"
                              } text-sm dark:hover:text-white cursor-pointer w-full`}
                            >
                              {title}
                            </label>
                          </>
                        )}
                        <div className="flex items-center">
                          <MdDelete
                            onClick={() => handleDeleteSubtask(id)}
                            className="text-lg cursor-pointer text-destructive"
                          />
                        </div>
                      </div>
                      {emptySubtaskIndex === index ? (
                        <p className="text-xs text-red-500">
                          Subtask name cannot be empty
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
            </div>
            {isViewCompleted && (
              <div className="mt-3">
                <Button
                  variant={"secondary"}
                  type="button"
                  onClick={handleAddNewSubtask}
                  className="rounded-3xl py-2 w-full text-sm font-bold"
                >
                  <p>+ Add New Subtask</p>
                </Button>
              </div>
            )}
          </div>

          <div className="mt-3">
            <label htmlFor="status" className="text-sm">
              Status
            </label>
            <select
              id="status"
              className="outline-none border text-sm rounded-lg block w-full p-2.5 mt-2"
              onChange={(e) => handleTaskStatusChange(e)}
              value={taskData?.status}
            >
              {columnNames?.map((option) => {
                return (
                  <option key={option} value={option}>
                    {option.toUpperCase()}
                  </option>
                );
              })}
              {taskData?.status === "" ? (
                <option value="">Select Status</option>
              ) : (
                ""
              )}
            </select>
            {isTaskStatusEmpty ? (
              <p className="text-xs text-red-500">
                Task status cannot be empty
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="pt-6">
            <Button
              type="submit"
              onClick={(e: React.FormEvent<HTMLButtonElement>) =>
                handleEditorAddTaskToDb(e)
              }
              className="rounded-3xl py-2 w-full text-sm font-bold"
            >
              <p>
                {isLoading
                  ? "Loading"
                  : `${isVariantAdd ? "Create Task" : "Save Changes"}`}
              </p>
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
