"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { HttpCard } from "@/components/http-card";
import { searchSchema, type SearchFormValues } from "@/lib/schemas";
import type { HttpStatusInfo } from "@/types/http-status";
import {
  getStatusCategory,
  HTTP_STATUS_DESCRIPTIONS,
  isValidHttpStatusCode,
} from "@/types/http-status";

interface StatusSearchProps {
  onSearch: (code: number) => { description: string; category: string };
}

export function StatusSearch({ onSearch }: StatusSearchProps) {
  const [result, setResult] = useState<HttpStatusInfo | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      code: "",
    },
  });

  function onSubmit(values: SearchFormValues) {
    const codeNum = parseInt(values.code, 10);

    if (!isValidHttpStatusCode(codeNum)) {
      setFetchError("Invalid HTTP status code");
      return;
    }

    setFetchError(null);
    setResult(null);

    const imageUrl = `https://http.cat/${codeNum}.jpg`;
    const category = getStatusCategory(codeNum);
    const description =
      HTTP_STATUS_DESCRIPTIONS[codeNum] ?? `Unknown status ${codeNum}`;

    const statusInfo: HttpStatusInfo = {
      code: codeNum,
      description,
      category,
      imageUrl,
    };

    setResult(statusInfo);
    onSearch(codeNum);
  }

  return (
    <div className="flex flex-col gap-6">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 sm:flex-row sm:items-end"
        >
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>HTTP Status Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. 200, 404, 500..."
                    maxLength={3}
                    className="font-mono"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>
      </Form>

      {fetchError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive animate-fade-in-up">
          {fetchError}
        </div>
      )}

      {result && (
        <div className="animate-fade-in-up">
          <HttpCard
            code={result.code}
            description={result.description}
            category={result.category}
            imageUrl={result.imageUrl}
          >
            <HttpCard.Image />
            <HttpCard.Content />
            <HttpCard.Footer>
              <span>
                {"Image from "}
                <a
                  href="https://http.cat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  http.cat
                </a>
              </span>
            </HttpCard.Footer>
          </HttpCard>
        </div>
      )}
    </div>
  );
}
