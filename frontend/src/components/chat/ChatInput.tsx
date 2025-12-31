import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal, Loader2 } from "lucide-react";
import { useState } from "react";

interface ChatInputProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
    const [input, setInput] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;
        onSend(input);
        setInput("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2 p-4 border-t bg-background/50 backdrop-blur-sm">
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                disabled={isLoading}
                className="flex-1 bg-background/50"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                    <SendHorizontal className="h-5 w-5" />
                )}
            </Button>
        </form>
    );
};
