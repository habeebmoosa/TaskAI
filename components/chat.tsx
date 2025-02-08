"use client"

import { useChat } from "ai/react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, Send, User } from "lucide-react"
import { useEffect } from "react"

interface ChatProps {
    onCreateTask: (task: any) => void;
    onUpdateTask: (task: any) => void;
    onChangeTasks: () => void;
}

export function Chat({ onCreateTask, onUpdateTask, onChangeTasks }: ChatProps) {
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();

    useEffect(()=> {
        onChangeTasks();
    }, [isLoading])

    return (
        <div className="flex h-full flex-col">
            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-start gap-3 ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"}`}
                        >
                            <Avatar className="h-8 w-8">
                                {message.role === "assistant" ? (
                                    <>
                                        {/* <AvatarFallback>AI</AvatarFallback> */}
                                        <Bot className="h-6 w-6 p-0.5" />
                                    </>
                                ) : (
                                    <>
                                        {/* <AvatarFallback>ME</AvatarFallback> */}
                                        <User className="h-6 w-6 p-0.5" />
                                    </>
                                )}
                            </Avatar>
                            <div
                                className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === "assistant" ? "bg-muted" : "bg-primary text-primary-foreground"
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="border-t p-4">
                <div className="flex gap-2">
                    <Textarea
                        placeholder="Type your message..."
                        value={input}
                        onChange={handleInputChange}
                        rows={1}
                        className="min-h-[2.5rem] max-h-32"
                    />
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>
            </form>
        </div>
    )
}

