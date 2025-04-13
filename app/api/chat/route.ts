import { streamText } from "ai"
import { createOpenAI } from "@ai-sdk/openai";
import { createTaskTool, deleteTaskTool, getTasksTool, updateTaskTool } from "./tools";

const openai = createOpenAI({
    baseURL: process.env.OPENAI_API_ENDPOINT,
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: openai("gpt-4o-mini"),
        system: `You are an AI task management assistant.
                 Help users manage their tasks by understanding their natural language input.
                 You can create, update, and complete tasks based on their requests.`,
        messages,
        tools: {
            getTasks: getTasksTool,
            createTask: createTaskTool,
            updateTask: updateTaskTool,
            deleteTask: deleteTaskTool
        },
        maxSteps: 2,
    })


    return result.toDataStreamResponse();
}

