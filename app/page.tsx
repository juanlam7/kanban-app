import BoardSectionList from "@/components/board/BoardSectionList";
import AddAndEditBoardModal from "@/components/ui/AddAndEditBoardModal";
import AddOrEditTaskModal from "@/components/ui/AddAndEditTaskModal";
import DeleteBoardOrTaskModal from "@/components/ui/DeleteBoardAndTask";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/Sidebar";
import { createInitialData } from "@/lib/dataRequests";

export default async function Home() {
  await createInitialData();

  return (
    <main className="flex h-full">
      <div className="absolute w-full">
        <Navbar />
      </div>
      <div className="relative w-full flex mt-24">
        <Sidebar />
        <BoardSectionList />
      </div>
      <AddAndEditBoardModal />
      <AddOrEditTaskModal />
      <DeleteBoardOrTaskModal />
    </main>
  );
}
