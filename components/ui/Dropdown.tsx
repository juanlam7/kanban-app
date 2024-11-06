import { openAddAndEditBoardModal, openDeleteBoardAndTaskModal } from "@/redux/features/appSlice";
import { Button } from "./button";
import { useAppDispatch } from "@/redux/hooks";

interface IDropdown {
  show: boolean;
}

export default function Dropdown({ show }: IDropdown) {
  const dispatch = useAppDispatch();
  return (
    <div
      className={`${show ? "block" : "hidden"} w-48 absolute top-full bg-white
         border shadow-lg right-0 py-2 rounded-2xl z-10`}
    >
      <div className="hover:bg-gray-300">
        <Button
          variant="link"
          className="text-sm px-4 py-2"
          onClick={() => dispatch(openAddAndEditBoardModal("Edit Board"))}
        >
          Edit Board
        </Button>
      </div>
      <div className="hover:bg-gray-300">
        <Button
          onClick={() =>
            dispatch(
              openDeleteBoardAndTaskModal({ variant: "Delete this board?" })
            )
          }
          variant="link"
          className="text-sm px-4 py-2"
        >
          Delete Board
        </Button>
      </div>
    </div>
  );
}
