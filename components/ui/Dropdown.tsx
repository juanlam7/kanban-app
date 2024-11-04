import { Button } from "./button";

interface IDropdown {
  show: boolean;
}

export default function Dropdown({ show }: IDropdown) {
  return (
    <div
      className={`${show ? "block" : "hidden"} w-48 absolute top-full bg-white
         border shadow-lg right-0 py-2 rounded-2xl`}
    >
      <div className="hover:bg-gray-300">
        <Button variant='link' className="text-sm px-4 py-2">Edit Board</Button>
      </div>
      <div className="hover:bg-gray-300">
        <Button variant='link' className="text-sm px-4 py-2">Delete Board</Button>
      </div>
    </div>
  );
}
