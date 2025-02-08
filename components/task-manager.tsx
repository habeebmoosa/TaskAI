"use client"

import { useEffect, useState } from "react"
import { Chat } from "./chat"
import { TaskList } from "./task-list"
import { UserPreferencesDialog } from "./user-preferences-dialog"
import { TaskDialog } from "./task-dialog"
import { CompletedTasksDialog } from "./completed-tasks-dialog"
import { Button } from "@/components/ui/button"
import { PlusCircle, Settings, History } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useToast } from "@/hooks/use-toast"

export type Task = {
    id: string
    title: string
    description: string
    completed: boolean
    priority: number
    createdAt: Date
}

export type UserPreferences = {
    longTermGoals: string[]
    shortTermGoals: string[]
    workDescription: string
    sortingPreferences: {
        prioritizeDeadlines: boolean
        prioritizeComplexity: boolean
        prioritizeUrgency: boolean
    }
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// async function getTasks() {
//     try {
//         const res = await fetch("http://localhost:3000/api/task", {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             cache: 'no-store'
//         })

//         if (!res.ok) {
//             throw new Error(`Failed to fetch posts: ${res.status} ${res.statusText}`)
//         }

//         const data = await res.json()

//         if (!Array.isArray(data)) {
//             throw new Error('Invalid response format')
//         }

//         return data as Task[]
//     } catch (error) {
//         console.error('Error fetching blog posts:', error)
//         return []
//     }
// }

async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
    try {
        const res = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })

        console.log(res)

        if (!res.ok) {
            const errorData = await res.json().catch(() => null)
            throw new Error(errorData?.message || `HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        return data
    } catch (error) {
        console.error('API Error:', error)
        throw error
    }
}

async function getTasks(): Promise<Task[]> {
    try {
        const data = await fetchWithErrorHandling(`${API_BASE_URL}/task`)
        return Array.isArray(data) ? data.map(task => ({
            ...task,
        })) : []
    } catch (error) {
        console.error('API Error:', error)
        return []
    }
}

async function createTask(taskData: Omit<Task, "id" | "createdAt">): Promise<Task | null> {
    try {
        const data = await fetchWithErrorHandling(`${API_BASE_URL}/task`, {
            method: 'POST',
            body: JSON.stringify(taskData)
        })
        return {
            ...data,
            // createdAt: new Date(data.createdAt)
        }
    } catch (error) {
        console.error('API Error:', error)
        return null
    }
}

async function updateTask(taskData: Partial<Task>): Promise<Task | null> {
    try {
        const data = await fetchWithErrorHandling(`${API_BASE_URL}/task`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        })
        return {
            ...data,
            // createdAt: new Date(data.createdAt)
        }
    } catch (error) {
        console.error('API Error:', error)
        return null
    }
}

async function deleteTask(taskId: string): Promise<boolean> {
    try {
        const data = {
            id: taskId
        }

        await fetchWithErrorHandling(`${API_BASE_URL}/task`, {
            method: 'DELETE',
            body: JSON.stringify(data)
        })
        return true
    } catch (error) {
        console.error('API Error:', error)
        return false
    }
}

export default function TaskManager() {
    const [tasks, setTasks] = useState<Task[]>([])
    const [showPreferences, setShowPreferences] = useState(false)
    const [showTaskDialog, setShowTaskDialog] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        setLoading(true)
        try {
            const fetchedTasks = await getTasks()
            setTasks(fetchedTasks)
        } finally {
            setLoading(false)
            console.log(tasks)
        }
    }

    const handleCreateTask = async (taskData: Omit<Task, "id" | "createdAt">) => {

        const newTask = await createTask(taskData)
        if (newTask) {
            setTasks(prev => [...prev, newTask])
            toast({
                title: "Task created",
                description: "Your task has been created successfully."
            })
            fetchTasks();
        }
    }

    const handleUpdateTask = async (updatedTask: Task) => {
        console.log("The updatation data: ", updateTask)
        const result = await updateTask(updatedTask)
        if (result) {
            setTasks(prev => prev.map(task =>
                task.id === result.id ? result : task
            ))
            toast({
                title: "Task updated",
                description: "Your task has been updated successfully."
            })
            fetchTasks();
        }
    }

    const handleDeleteTask = async (taskId: string) => {
        const success = await deleteTask(taskId)
        if (success) {
            setTasks(prev => prev.filter(task => task.id !== taskId))
            toast({
                title: "Task deleted",
                description: "Your task has been deleted successfully."
            })
            fetchTasks();
        }
    }

    return (
        <div className="grid h-screen md:grid-cols-[1fr_1fr] gap-4 p-4">
            <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-background shadow">
                <Chat onCreateTask={handleCreateTask} onUpdateTask={handleUpdateTask} onChangeTasks={fetchTasks} />
            </div>
            <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-background shadow">
                <div className="flex items-center justify-between border-b p-4">
                    <div className="flex gap-2">
                        <Button onClick={() => setShowTaskDialog(true)} size="sm">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Task
                        </Button>
                        {/* <Button variant="outline" size="sm" onClick={() => setShowPreferences(true)}>
                            <Settings className="mr-2 h-4 w-4" />
                            Preferences
                        </Button> */}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowHistory(true)}>
                            <History className="mr-2 h-4 w-4" />
                            History
                        </Button>
                        <ThemeToggle />
                    </div>
                </div>
                <TaskList
                    tasks={tasks}
                    // loading={loading}
                    onEdit={(task) => {
                        setEditingTask(task)
                        setShowTaskDialog(true)
                    }}
                    onDelete={handleDeleteTask}
                    onComplete={(task) => handleUpdateTask({ ...task, completed: true })}
                />
            </div>



            <UserPreferencesDialog open={showPreferences} onOpenChange={setShowPreferences} />
            <TaskDialog
                open={showTaskDialog}
                onOpenChange={setShowTaskDialog}
                task={editingTask}
                onSubmit={async (task) => {
                    if (editingTask) {
                        console.log(editingTask)
                        await handleUpdateTask({ ...task, id: editingTask.id, createdAt: editingTask.createdAt })
                    } else {
                        await handleCreateTask(task)
                    }
                    setEditingTask(null)
                }}
            />

            <CompletedTasksDialog
                open={showHistory}
                onOpenChange={setShowHistory}
                tasks={tasks.filter((task) => task.completed)}
            />
        </div>
    )
}

