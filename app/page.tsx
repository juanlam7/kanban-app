import Sidebar from "@/components/ui/Sidebar";
import BoardTasks from "@/components/ui/BoardTasks";

export default function Home() {
  return (
    <main className="flex h-full">
      <Sidebar />
      <BoardTasks />
    </main>
  );
}
