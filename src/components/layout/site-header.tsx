import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChartHistogramIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="group inline-flex items-center gap-2" href="/">
          <span className="rounded-lg bg-primary/10 p-2 text-primary transition-colors group-hover:bg-primary/20">
            <HugeiconsIcon icon={ChartHistogramIcon} />
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
            <HugeiconsIcon icon={Search01Icon} />
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}
