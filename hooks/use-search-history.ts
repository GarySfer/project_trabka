"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  SearchHistoryEntry,
  HttpStatusCategory,
  ChartDataPoint,
  CategoryCountMap,
} from "@/types/http-status";
import { getStatusCategory, HTTP_STATUS_DESCRIPTIONS } from "@/types/http-status";

const STORAGE_KEY = "http-status-search-history";

function loadFromStorage(): SearchHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as Array<Omit<SearchHistoryEntry, "timestamp"> & { timestamp: string }>;
    return parsed.map((entry) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch {
    return [];
  }
}

function saveToStorage(entries: SearchHistoryEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Storage might be full or disabled
  }
}

const CHART_FILLS: Record<HttpStatusCategory, string> = {
  "1xx": "hsl(220, 14%, 50%)",
  "2xx": "hsl(175, 70%, 42%)",
  "3xx": "hsl(210, 100%, 50%)",
  "4xx": "hsl(38, 92%, 50%)",
  "5xx": "hsl(0, 84%, 60%)",
};

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    setHistory(loadFromStorage());
  }, []);

  const addEntry = useCallback((code: number) => {
    const category = getStatusCategory(code);
    const description =
      HTTP_STATUS_DESCRIPTIONS[code] ?? `Unknown status ${code}`;

    const newEntry: SearchHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      code,
      description,
      category,
      timestamp: new Date(),
    };

    setHistory((prev) => {
      const updated = [newEntry, ...prev].slice(0, 50);
      saveToStorage(updated);
      return updated;
    });

    return { description, category };
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveToStorage([]);
  }, []);

  const chartData: ChartDataPoint[] = (() => {
    const counts: CategoryCountMap = {
      "1xx": 0,
      "2xx": 0,
      "3xx": 0,
      "4xx": 0,
      "5xx": 0,
    };
    history.forEach((entry) => {
      counts[entry.category]++;
    });

    return (Object.keys(counts) as HttpStatusCategory[]).map((category) => ({
      category,
      count: counts[category],
      fill: CHART_FILLS[category],
    }));
  })();

  return {
    history,
    addEntry,
    clearHistory,
    chartData,
    totalSearches: history.length,
  };
}
