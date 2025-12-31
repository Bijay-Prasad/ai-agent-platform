import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface MessageBubbleProps {
    message: {
        sender: 'user' | 'ai';
        text: string;
    };
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
    const isUser = message.sender === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "flex w-full items-start gap-4 p-4",
                isUser ? "flex-row-reverse" : "flex-row"
            )}
        >
            <Avatar className="h-8 w-8">
                <AvatarFallback className={isUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
                    {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                </AvatarFallback>
            </Avatar>

            <div
                className={cn(
                    "relative max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                    isUser
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/50 text-foreground border border-border rounded-tl-sm"
                )}
            >
                <ReactMarkdown
                    components={{
                        // Style code blocks
                        code({ node, className, children, ...props }) {
                            return (
                                <code
                                    className={cn(
                                        "rounded bg-black/10 px-1 py-0.5 font-mono text-xs",
                                        isUser ? "bg-white/20" : "",
                                        className
                                    )}
                                    {...props}
                                >
                                    {children}
                                </code>
                            );
                        },
                        // Style lists
                        ul({ children }) {
                            return <ul className="ml-4 list-disc space-y-1">{children}</ul>;
                        },
                        ol({ children }) {
                            return <ol className="ml-4 list-decimal space-y-1">{children}</ol>;
                        },
                        // Style bold text
                        strong({ children }) {
                            return <span className="font-bold">{children}</span>;
                        },
                    }}
                >
                    {message.text}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
};
