import { Board, BoardSections as BoardSectionsType } from "@/lib/types";
import {
  extractTasks,
  findBoardSectionContainer,
  getTaskById,
  transformBoard,
  transformFromBoardSectionToBoard,
} from "@/lib/utils";
import { getActiveBoardIndex } from "@/redux/features/appSlice";
import { useAppSelector } from "@/redux/hooks";
import { useUpdateBoardToDbMutation } from "@/redux/services/apiSlice";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import BoardSection from "./BoardSection";
import TaskItem from "./TaskItem";
import { useTranslations } from "next-intl";

interface BoardSectionListProps {
  AddColumn: () => void;
  AllBoards: Board[];
  currentBoardTitle: string;
}

const BoardSectionList = ({
  AddColumn,
  AllBoards,
  currentBoardTitle,
}: BoardSectionListProps) => {
  // TODO: use this isLoading from useUpdateBoardToDbMutation to show a toast with task change state successfully
  const [updateBoardToDb] = useUpdateBoardToDbMutation();
  const [boardSections, setBoardSections] = useState<BoardSectionsType>({});
  const [activeTaskId, setActiveTaskId] = useState<null | string>(null);
  const [currentBoard, setCurrentBoard] = useState<Board>();
  const activeBoardIndex = useAppSelector(getActiveBoardIndex);
  const t = useTranslations();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (AllBoards) {
      const activeBoardData = AllBoards[activeBoardIndex];
      if (activeBoardData) {
        setCurrentBoard(activeBoardData);
        const initializedSections = transformBoard(activeBoardData);
        setBoardSections(initializedSections);
      }
    }
  }, [AllBoards, activeBoardIndex]);

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

  const updateBoards = (updatedSections: BoardSectionsType) => {
    if (currentBoard) {
      const transformedBoard = transformFromBoardSectionToBoard(
        updatedSections,
        currentBoardTitle,
        currentBoard.id
      );
      const updatedBoards = AllBoards.map((board) =>
        board.id === transformedBoard.id ? transformedBoard : board
      );
      updateBoardToDb(updatedBoards);
    }
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

    setBoardSections((prevBoardSections) => {
      if (activeIndex === overIndex) {
        updateBoards(prevBoardSections);
        return prevBoardSections;
      }

      const updatedSections = {
        ...prevBoardSections,
        [overContainer]: arrayMove(
          prevBoardSections[overContainer],
          activeIndex,
          overIndex
        ),
      };

      updateBoards(updatedSections);
      return updatedSections;
    });

    setActiveTaskId(null);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  const task =
    activeTaskId && currentBoard
      ? getTaskById(extractTasks(currentBoard), activeTaskId)
      : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex">
        {Object.keys(boardSections).map((boardSectionKey) => (
          <div key={boardSectionKey} className="flex mr-5">
            <BoardSection
              id={boardSectionKey}
              title={boardSectionKey}
              tasks={boardSections[boardSectionKey]}
            />
          </div>
        ))}
        {Object.keys(boardSections).length < 7 &&
          Object.keys(boardSections).length !== 0 && (
            <div
              onClick={AddColumn}
              className="rounded-md bg-popover w-[17.5rem] mt-12 shrink-0 flex justify-center items-center cursor-pointer"
            >
              <p className="font-bold text-2xl">+ {t("new_column")}</p>
            </div>
          )}
        <DragOverlay dropAnimation={dropAnimation}>
          {task ? <TaskItem task={task} /> : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default BoardSectionList;
