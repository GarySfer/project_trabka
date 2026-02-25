"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type ColumnDef } from "@/components/data-table";
import type { SearchHistoryEntry, HttpStatusCategory } from "@/types/http-status";
import { cn } from "@/lib/utils";

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

const columns: ColumnDef<SearchHistoryEntry>[] = [
  {
    key: "code",
    header: "Code",
    render: (item) => (
      <span className="font-mono font-bold text-foreground">{item.code}</span>
    ),
    className: "w-20",
  },
  {
    key: "description",
    header: "Description",
    render: (item) => (
      <span className="text-foreground">{item.description}</span>
    ),
  },
  {
    key: "category",
    header: "Category",
    render: (item) => (
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          getCategoryBadgeColor(item.category)
        )}
      >
        {item.category}
      </span>
    ),
    className: "w-24",
  },
  {
    key: "timestamp",
    header: "Time",
    render: (item) => (
      <span className="text-muted-foreground text-xs">
        {item.timestamp.toLocaleTimeString()}
      </span>
    ),
    className: "w-28",
  },
];

interface HistoryTableProps {
  history: SearchHistoryEntry[];
  onClear: () => void;
}

export function HistoryTable({ history, onClear }: HistoryTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Search History</CardTitle>
        {history.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="gap-1.5 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <DataTable<SearchHistoryEntry>
          data={history}
          columns={columns}
          keyExtractor={(item) => item.id}
          emptyMessage="No searches yet. Try searching for an HTTP status code above."
        />
      </CardContent>
    </Card>
  );
}
