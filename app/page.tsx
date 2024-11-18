import WrapperBoard from "@/components/board/WrapperBoard";
import AddAndEditBoardModal from "@/components/modals/AddAndEditBoardModal";
import AddOrEditTaskModal from "@/components/modals/AddAndEditTaskModal";
import DeleteBoardOrTaskModal from "@/components/modals/DeleteBoardAndTask";
import Navbar from "@/components/ui/Navbar";
import Sidebar from "@/components/ui/sidebar/Sidebar";

export default async function Home() {
  return (
    <main className="flex h-full">
      <div className="absolute w-full">
        <Navbar />
      </div>
      <div className="relative w-full md:flex flex mt-24">
        <Sidebar />
        <WrapperBoard />
      </div>
      <AddAndEditBoardModal />
      <AddOrEditTaskModal />
      <DeleteBoardOrTaskModal />
    </main>
  );
}
