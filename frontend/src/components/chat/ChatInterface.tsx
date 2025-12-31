"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import { chatApi, Message } from "@/lib/api";

export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Load session from local storage on mount
    useEffect(() => {
        const savedSessionId = localStorage.getItem("chatSessionId");
        if (savedSessionId) {
            setSessionId(savedSessionId);
            loadHistory(savedSessionId);
        }
    }, []);

    const loadHistory = async (id: string) => {
        try {
            setLoading(true);
            const history = await chatApi.getHistory(id);
            setMessages(history.messages);
        } catch (error) {
            console.error("Failed to load history:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (text: string) => {
        // Optimistic update
        const userMessage: Message = { sender: "user", text };
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);
        setIsTyping(true);

        try {
            const response = await chatApi.sendMessage(text, sessionId || undefined);

            const aiMessage: Message = {
                sender: "ai",
                text: response.reply,
                timestamp: response.timestamp,
            };

            setMessages((prev) => [...prev, aiMessage]);

            if (!sessionId) {
                setSessionId(response.sessionId);
                localStorage.setItem("chatSessionId", response.sessionId);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            // Add error message to chat
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "⚠️ Something went wrong. Please try again." },
            ]);
        } finally {
            setLoading(false);
            setIsTyping(false);
        }
    };

    return (
        <Card className="w-full h-[700px] flex flex-col overflow-hidden bg-background/80 backdrop-blur-md border-border/50 shadow-xl">
            <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                    <h2 className="font-semibold">AI Support Agent</h2>
                </div>
                {sessionId && (
                    <span className="text-xs text-muted-foreground">Session Active</span>
                )}
            </div>

            <MessageList messages={messages} isTyping={isTyping} />

            <ChatInput onSend={handleSendMessage} isLoading={loading} />
        </Card>
    );
};
