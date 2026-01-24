import { Activity, Server, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  isConnected: boolean;
  isModelLoaded: boolean;
  isContextLoaded: boolean;
}

export function StatusIndicator({
  isConnected,
  isModelLoaded,
  isContextLoaded,
}: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-4">
      <StatusItem
        icon={Server}
        label="API"
        active={isConnected}
      />
      <StatusItem
        icon={Brain}
        label="Model"
        active={isModelLoaded}
      />
      <StatusItem
        icon={Activity}
        label="Context"
        active={isContextLoaded}
      />
    </div>
  );
}

function StatusItem({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof Server;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
          active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium">{label}</span>
        <span
          className={cn(
            "text-xs",
            active ? "text-primary" : "text-muted-foreground"
          )}
        >
          {active ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
}
