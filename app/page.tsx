// import TaskManager from "@/components/task-manager";
import dynamic from "next/dynamic";

const TaskManager = dynamic(()=> import("@/components/task-manager"));

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <TaskManager />
    </main>
  )
}

