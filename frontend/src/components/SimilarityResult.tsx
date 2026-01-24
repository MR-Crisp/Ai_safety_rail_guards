import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SimilarityResponse } from "@/lib/api";

interface SimilarityResultProps {
  result: SimilarityResponse;
}

export function SimilarityResult({ result }: SimilarityResultProps) {
  const percentage = Math.round(result.score * 100);
  const passes = result.passes_threshold;

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-6 transition-all",
        passes
          ? "border-success/30 bg-success/10"
          : "border-destructive/30 bg-destructive/5"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {passes ? (
            <CheckCircle2 className="h-8 w-8 text-success" />
          ) : (
            <XCircle className="h-8 w-8 text-destructive" />
          )}
          <div>
            <p className="text-lg font-semibold">
              {passes ? "Relevant" : "Not Relevant"}
            </p>
            <p className="text-sm text-muted-foreground">
              {passes
                ? "Input matches the context"
                : "Input doesn't match the context"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "text-3xl font-bold",
              passes ? "text-success" : "text-destructive"
            )}
          >
            {percentage}%
          </p>
          <p className="text-xs text-muted-foreground">
            Threshold: {Math.round(result.threshold * 100)}%
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className={cn(
              "h-2 rounded-full transition-all duration-500",
              passes ? "bg-success" : "bg-destructive"
            )}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span
            className="relative"
            style={{ left: `${result.threshold * 100 - 50}%` }}
          >
            ↑ Threshold
          </span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
}
