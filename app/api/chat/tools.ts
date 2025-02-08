import { tool } from "ai";
import { z } from "zod";

export const getTasksTool = tool({
    description: 'Get all tasks',
    parameters: z.object({}),
    execute: async () => {
        const response = fetch("http://localhost:3000/api/task", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = (await response).json();
        return data;
    },
});

export const createTaskTool = tool({
    description: 'Create the task or todo',
    parameters: z.object({
        title: z.string().describe('The title of the task'),
        description: z.string().describe('The description of the task'),
        completed: z.boolean().describe('completed defines wheather task is done or not.'),
        priority: z.number().describe('Set the priority of the task. 1 means Low, 2 for Medium, and 3 for High'),
    }),
    execute: async ({
        title,
        description,
        completed,
        priority
    }) => {
        const response = fetch("http://localhost:3000/api/task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title,
                description,
                completed,
                priority
            })
        })

        const data = (await response).json();
        console.log(data);
        return data;
    }
})

export const updateTaskTool = tool({
    description: "Update the task information or update the task as completed",
    parameters: z.object({
        id: z.string().describe('The unique id of the task'),
        title: z.string().describe('The title of the task'),
        description: z.string().describe('The description of the task'),
        completed: z.boolean().describe('completed defines wheather task is done or not.'),
        priority: z.number().describe('Set the priority of the task. 1 means Low, 2 for Medium, and 3 for High'),
    }),
    execute: async ({
        id,
        title,
        description,
        completed,
        priority
    }) => {
        const response = fetch("http://localhost:3000/api/task", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
                title,
                description,
                completed,
                priority
            })
        })

        const data = (await response).json();
        console.log(data);
        return data;
    }
})

export const deleteTaskTool = tool({
    description: "Delete the task with task id",
    parameters: z.object({
        id: z.string().describe('The unique id of the task'),
    }),
    execute: async ({ id }) => {
        const response = fetch("http://localhost:3000/api/task", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id,
            })
        })

        const data = (await response).json();
        console.log(data);
        return data;
    }
})