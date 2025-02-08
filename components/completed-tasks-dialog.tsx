import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Task } from "./task-manager"
import { CheckCircle2 } from "lucide-react"

interface CompletedTasksDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tasks: Task[]
}

export function CompletedTasksDialog({ open, onOpenChange, tasks }: CompletedTasksDialogProps) {
  const recentCompletedTasks = [...tasks]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 20)

  const formatDate = (date: Date | string) => {
    const dateObj = new Date(date)
    return dateObj.toLocaleString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Completed Tasks History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4 py-2">
            {recentCompletedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50"
              >
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <h3 className="font-medium">{task.title}</h3>
                  {/* <p className="text-sm text-muted-foreground">{task.description}</p> */}
                  <p className="text-sm text-muted-foreground">
                    Completed on: {formatDate(task.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}