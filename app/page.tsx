"use client";

import { Header } from "@/components/header";
import { StatusSearch } from "@/components/status-search";
import { HistoryTable } from "@/components/history-table";
import { StatsChart } from "@/components/stats-chart";
import { MultiStepForm } from "@/components/multi-step-form";
import { useSearchHistory } from "@/hooks/use-search-history";

export default function HomePage() {
  const { history, addEntry, clearHistory, chartData, totalSearches } =
    useSearchHistory();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        {/* Hero section */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
            HTTP Status Explorer
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground leading-relaxed md:text-lg">
            Search HTTP status codes and discover their meanings through
            adorable cat images. Built with Next.js, TypeScript, and Tailwind CSS.
          </p>
        </section>

        {/* Search + Result section */}
        <section className="mb-10">
          <div className="@container">
            <div className="grid gap-6 @lg:grid-cols-2">
              <div>
                <h2 className="mb-4 text-xl font-semibold text-foreground">
                  Search Status Code
                </h2>
                <StatusSearch onSearch={addEntry} />
              </div>
              <div>
                <StatsChart data={chartData} totalSearches={totalSearches} />
              </div>
            </div>
          </div>
        </section>

        {/* History section */}
        <section className="mb-10">
          <HistoryTable history={history} onClear={clearHistory} />
        </section>

        {/* Multi-step form section */}
        <section className="mb-10">
          <div className="mx-auto max-w-2xl">
            <MultiStepForm />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          <p>
            {"Images from "}
            <a
              href="https://http.cat"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              http.cat
            </a>
            {" | Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui"}
          </p>
        </footer>
      </main>
    </div>
  );
}
