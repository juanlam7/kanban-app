import { Button } from "./button";

export default function BoardTasks() {
  return (
    <div className="overflow-x-auto overflow-y-auto w-full bg-stone-200">
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col items-center">
          <p className="text-black text-sm">
            This board is empty. Create a new column to get started.
          </p>
          <Button className="px-4 py-2 flex mt-6 items-center">
            <p>+ Add New Column</p>
          </Button>
        </div>  
      </div>
    </div>
  );
}
