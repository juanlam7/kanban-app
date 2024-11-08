import WrapperBoard from "@/components/board/WrapperBoard";
import AddAndEditBoardModal from "@/components/modals/AddAndEditBoardModal";
import AddOrEditTaskModal from "@/components/modals/AddAndEditTaskModal";
import DeleteBoardOrTaskModal from "@/components/modals/DeleteBoardAndTask";
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
        <WrapperBoard />
      </div>
      <AddAndEditBoardModal />
      <AddOrEditTaskModal />
      <DeleteBoardOrTaskModal />
    </main>
  );
}
