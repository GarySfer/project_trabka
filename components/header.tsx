"use client";

import { Cat } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Header() {
  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <Cat className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-balance">
              HTTP Status Explorer
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>
    </TooltipProvider>
  );
}
