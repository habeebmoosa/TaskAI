import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Task } from '@/components/task-manager';

export async function GET() {
    try {
        const client = await clientPromise
        const db = client.db("taskai");

        const posts = await db
            .collection("tasks")
            .find({})
            .sort({ createdAt: -1 })
            .toArray()

        return NextResponse.json(posts)
    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: "Failed to fetch tasks" },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, description, completed, priority } = body;

        if (!title || !priority) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            )
        }

        const client = await clientPromise
        const db = client.db("taskai");

        const task: Task = {
            id: crypto.randomUUID(),
            title,
            description,
            completed,
            priority,
            createdAt: new Date(),
        }

        const result = await db.collection("tasks").insertOne(task)

        return NextResponse.json({
            message: "Task is created successfully",
            post: { ...task, _id: result.insertedId }
        })

    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: "Failed to create task!" },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json()
        const { id, title, description, completed, priority } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Task ID is required" },
                { status: 400 }
            )
        }

        const updateData: Partial<Task> = {}

        if (title !== undefined) updateData.title = title
        if (description !== undefined) updateData.description = description
        if (completed !== undefined) updateData.completed = completed
        if (priority !== undefined) updateData.priority = priority


        const client = await clientPromise
        const db = client.db("taskai")

        const result = await db.collection("tasks").updateOne(
            { id: id },
            { $set: updateData }
        )

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            )
        }

        const updatedTask = await db.collection("tasks").findOne({ id: id })

        return NextResponse.json({
            message: "Task updated successfully",
            task: updatedTask
        })

    } catch (error) {
        console.error('Database error:', error)
        return NextResponse.json(
            { error: "Failed to update task" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json()
        const { id } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Task ID is required" },
                { status: 400 }
            )
        }

        const client = await clientPromise;
        const db = client.db("taskai");

        const result = await db.collection("tasks").deleteOne({ id: id });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Task not found" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            message: "Task deleted successfully",
            taskId: id
        })

    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { error: "Failed to delete task" },
            { status: 500 }
        )
    }
}