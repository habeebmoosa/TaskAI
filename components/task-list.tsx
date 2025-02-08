import { Task } from "./task-manager"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, Pencil, Trash2, CheckCircle } from "lucide-react"

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (taskId: string) => void
  onComplete: (task: Task) => void
}

export function TaskList({ tasks, onEdit, onDelete, onComplete }: TaskListProps) {
  const sortedTasks = [...tasks].sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1
    }
    // Then by priority
    if (a.priority !== b.priority) {
      return b.priority - a.priority
    }
    // Finally by creation date
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-2 py-4">
        {sortedTasks.map((task) => (
          <div key={task.id} className={`rounded-lg border p-4 ${task.completed ? "bg-muted" : "bg-background"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="grid gap-1">
                <h3 className={`font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                  {task.title}
                </h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(task)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(task.id)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                  {!task.completed && (
                    <DropdownMenuItem onClick={() => onComplete(task)}>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Complete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

