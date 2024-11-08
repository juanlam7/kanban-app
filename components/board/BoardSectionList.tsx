"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import BoardSection from "./BoardSection";
import TaskItem from "./TaskItem";
import { BoardSections as BoardSectionsType, Task } from "./types";
import {
  findBoardSectionContainer,
  getTaskById,
  initializeBoard,
} from "./utils";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { Board } from "@/lib/types";
import { id } from "./data";
import { useAppSelector } from "@/redux/hooks";
import { getCurrentBoardName } from "@/redux/features/appSlice";

type BoardSectionListProps = {
  initial_tasks: Task[];
};

function extractTasks(data: Board) {
  return data.columns.flatMap((column) => {
    const extractedTasks = column.tasks.map((task) => ({
      id: task.id,
      title: task.title || "",
      status: task.status || column.name,
    }));

    if (extractedTasks.length === 0) {
      return [
        {
          id: id(),
          title: "",
          status: column.name,
        },
      ];
    }

    return extractedTasks;
  });
}

const WrapperBoard = () => {
  const { data, isLoading } = useFetchDataFromDbQuery();
  const currentBoardTitle = useAppSelector(getCurrentBoardName);
  const [initTasks, setInitTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (data) {
      const activeBoardData = data[0]?.boards.find(
        (board) => board.name === currentBoardTitle
      );
      if (activeBoardData) {
        setInitTasks(extractTasks(activeBoardData));
      }
    }
  }, [data, currentBoardTitle]);

  if (isLoading) {
    return (
      <p className="text-3xl w-full text-center font-bold">Loading tasks...</p>
    );
  }

  if (initTasks.length > 0) {
    return (
      <BoardSectionList initial_tasks={initTasks} key={currentBoardTitle} />
    );
  }
  return;
};

const BoardSectionList = ({ initial_tasks }: BoardSectionListProps) => {
  const [boardSections, setBoardSections] = useState<BoardSectionsType>({});
  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const initializedSections = initializeBoard(initial_tasks);
    setBoardSections(initializedSections);
  }, [initial_tasks]);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTaskId(active.id as string);
  };

  const handleDragOver = ({ active, over }: DragOverEvent) => {
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer === overContainer
    ) {
      return;
    }

    setBoardSections((boardSection) => {
      const activeItems = boardSection[activeContainer];
      const overItems = boardSection[overContainer];

      const activeIndex = activeItems.findIndex(
        (item) => item.id === active.id
      );
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...boardSection,
        [activeContainer]: [
          ...boardSection[activeContainer].filter(
            (item) => item.id !== active.id
          ),
        ],
        [overContainer]: [
          ...boardSection[overContainer].slice(0, overIndex),
          boardSections[activeContainer][activeIndex],
          ...boardSection[overContainer].slice(
            overIndex,
            boardSection[overContainer].length
          ),
        ],
      };
    });
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findBoardSectionContainer(
      boardSections,
      active.id as string
    );
    const overContainer = findBoardSectionContainer(
      boardSections,
      over?.id as string
    );

    if (
      !activeContainer ||
      !overContainer ||
      activeContainer !== overContainer
    ) {
      return;
    }

    const activeIndex = boardSections[activeContainer].findIndex(
      (task) => task.id === active.id
    );
    const overIndex = boardSections[overContainer].findIndex(
      (task) => task.id === over?.id
    );

    if (activeIndex !== overIndex) {
      setBoardSections((boardSection) => ({
        ...boardSection,
        [overContainer]: arrayMove(
          boardSection[overContainer],
          activeIndex,
          overIndex
        ),
      }));
    }

    setActiveTaskId(null);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const task = activeTaskId ? getTaskById(initial_tasks, activeTaskId) : null;

  return (
    <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-stone-200">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex">
          {Object.keys(boardSections).map((boardSectionKey) => (
            <div key={boardSectionKey} className="mr-5">
              <BoardSection
                id={boardSectionKey}
                title={boardSectionKey}
                tasks={boardSections[boardSectionKey]}
              />
            </div>
          ))}
          <DragOverlay dropAnimation={dropAnimation}>
            {task ? <TaskItem task={task} /> : null}
          </DragOverlay>
        </div>
      </DndContext>
    </div>
  );
};

export default WrapperBoard;
