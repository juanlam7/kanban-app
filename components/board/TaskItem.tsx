import { Task } from "@/lib/types";
import {
  openAddAndEditTaskModal,
  openDeleteBoardAndTaskModal,
} from "@/redux/features/appSlice";
import { useAppDispatch } from "@/redux/hooks";
import { MdDelete, MdEdit } from "react-icons/md";

type TaskItemProps = {
  task: Task;
  index?: number;
};

const TaskItem = ({ task, index }: TaskItemProps) => {
  const dispatch = useAppDispatch();

  const onEdit = (columnName: string, index: number, title: string) => {
    dispatch(
      openAddAndEditTaskModal({
        variant: "Edit Task",
        title,
        index,
        name: columnName,
      })
    );
  };

  const onDelete = (index: number, title: string, status: string) => {
    dispatch(
      openDeleteBoardAndTaskModal({
        variant: "Delete this task?",
        title,
        status,
        index,
      })
    );
  };

  return (
    <div className="bg-popover p-6 rounded-md flex items-center justify-between border">
      <p>{task.title}</p>
      <div className="flex items-center">
        <MdEdit
          onClick={() => onEdit(task.status, index!, task.title)}
          className="text-lg cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
          onDragStart={(e) => e.preventDefault()}
        />
        <MdDelete
          onClick={() => onDelete(index!, task.title, task.status)}
          className="text-lg cursor-pointer text-destructive"
          onPointerDown={(e) => e.stopPropagation()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
};

export default TaskItem;
