"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { HttpStatusCategory } from "@/types/http-status";
import { Skeleton } from "@/components/ui/skeleton";

// ── Context for compound component ──
interface HttpCardContextValue {
  code: number;
  description: string;
  category: HttpStatusCategory;
  imageUrl: string;
}

const HttpCardContext = React.createContext<HttpCardContextValue | null>(null);

function useHttpCardContext() {
  const context = React.useContext(HttpCardContext);
  if (!context) {
    throw new Error(
      "HttpCard compound components must be used within <HttpCard>"
    );
  }
  return context;
}

// ── Category color mapping ──
function getCategoryColor(category: HttpStatusCategory): string {
  const colors: Record<HttpStatusCategory, string> = {
    "1xx": "border-chart-3",
    "2xx": "border-chart-2",
    "3xx": "border-chart-1",
    "4xx": "border-chart-4",
    "5xx": "border-chart-5",
  };
  return colors[category];
}

function getCategoryBadgeColor(category: HttpStatusCategory): string {
  const colors: Record<HttpStatusCategory, string> = {
    "1xx": "bg-chart-3/15 text-chart-3",
    "2xx": "bg-chart-2/15 text-chart-2",
    "3xx": "bg-chart-1/15 text-chart-1",
    "4xx": "bg-chart-4/15 text-chart-4",
    "5xx": "bg-chart-5/15 text-chart-5",
  };
  return colors[category];
}

// ── Root component ──
interface HttpCardProps extends React.HTMLAttributes<HTMLDivElement> {
  code: number;
  description: string;
  category: HttpStatusCategory;
  imageUrl: string;
}

function HttpCardRoot({
  code,
  description,
  category,
  imageUrl,
  className,
  children,
  ...props
}: HttpCardProps) {
  return (
    <HttpCardContext.Provider value={{ code, description, category, imageUrl }}>
      <div
        className={cn(
          "group rounded-lg border-l-4 bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md",
          getCategoryColor(category),
          className
        )}
        {...props}
      >
        {children}
      </div>
    </HttpCardContext.Provider>
  );
}

// ── Image sub-component ──
function HttpCardImage({ className }: { className?: string }) {
  const { imageUrl, code, description } = useHttpCardContext();
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [hasError, setHasError] = React.useState<boolean>(false);
  const imageRef = React.useRef<HTMLImageElement | null>(null);

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted rounded-t-lg aspect-video",
          className
        )}
      >
        <p className="text-muted-foreground text-sm">
          {"Image not available for code "}{code}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden rounded-t-lg aspect-video", className)}>
      {isLoading && (
        <Skeleton className="absolute inset-0 rounded-t-lg" />
      )}
      <Image
        ref={imageRef}
        src={imageUrl}
        alt={`HTTP ${code} - ${description}`}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        unoptimized
      />
    </div>
  );
}

// ── Content sub-component ──
function HttpCardContent({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { code, description, category } = useHttpCardContext();

  return (
    <div className={cn("p-4", className)}>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-bold font-mono text-foreground">
          {code}
        </span>
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-medium",
            getCategoryBadgeColor(category)
          )}
        >
          {category}
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
      {children}
    </div>
  );
}

// ── Footer sub-component ──
function HttpCardFooter({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center border-t px-4 py-3 text-xs text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

// ── Skeleton loader ──
function HttpCardSkeleton() {
  return (
    <div className="rounded-lg border-l-4 border-muted bg-card shadow-sm">
      <Skeleton className="aspect-video rounded-t-lg" />
      <div className="p-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>
        <Skeleton className="mt-2 h-4 w-3/4" />
      </div>
    </div>
  );
}

// ── Compose compound component ──
const HttpCard = Object.assign(HttpCardRoot, {
  Image: HttpCardImage,
  Content: HttpCardContent,
  Footer: HttpCardFooter,
  Skeleton: HttpCardSkeleton,
});

export { HttpCard, type HttpCardProps };
