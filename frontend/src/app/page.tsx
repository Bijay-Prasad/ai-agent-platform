"use client";

import { cn } from "@/lib/utils";
import AnimatedGridPattern from "@/components/magicui/animated-grid-pattern";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

export default function Home() {
  return (
    <main className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background p-4 md:p-24">
      {/* Background Pattern */}
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.1}
        duration={3}
        repeatDelay={1}
        className={cn(
          "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]",
          "inset-x-0 inset-y-[-30%] h-[200%] skew-y-12",
        )}
      />

      <div className="absolute top-4 right-4 z-50">
        <AnimatedThemeToggler />
      </div>

      {/* Main Chat Interface */}
      <div className="z-10 w-full max-w-4xl items-center justify-center font-mono text-sm lg:flex">
        <ChatInterface />
      </div>
    </main>
  );
}
