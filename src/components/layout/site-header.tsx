import Link from "next/link";
import { BarChart3, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="group inline-flex items-center gap-2" href="/">
          <span className="rounded-lg bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20">
            <BarChart3 className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-wide sm:text-base">
            ClassicModels Analytics
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          <Link
            className={cn(
              buttonVariants({ variant: "secondary" }),
              "hidden sm:inline-flex",
            )}
            href="/"
          >
            Dashboard
          </Link>
          <Link
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex items-center gap-2",
            )}
            href="/search"
          >
            <Search className="size-4" />
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}
