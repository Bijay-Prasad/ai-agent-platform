import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { Message } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

interface MessageListProps {
    messages: Message[];
    isTyping?: boolean;
}

export const MessageList = ({ messages, isTyping }: MessageListProps) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Use requestAnimationFrame to ensure DOM is updated before scrolling
        requestAnimationFrame(() => {
            bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    }, [messages, isTyping]);

    return (
        <ScrollArea className="flex-1 min-h-0 p-4 pr-4">
            <div className="flex flex-col gap-2 pb-4">
                <AnimatePresence initial={false}>
                    {messages.map((msg, index) => (
                        <MessageBubble key={msg._id || index} message={msg} />
                    ))}
                </AnimatePresence>

                {isTyping && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-4"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 [animation-delay:-0.3s]"></span>
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50 mx-1 [animation-delay:-0.15s]"></span>
                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/50"></span>
                        </div>
                        <span className="text-xs text-muted-foreground animate-pulse">AI is thinking...</span>
                    </motion.div>
                )}
                <div ref={bottomRef} />
            </div>
        </ScrollArea>
    );
};
