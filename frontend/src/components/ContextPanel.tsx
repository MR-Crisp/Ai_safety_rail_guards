import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, Check, Loader2 } from "lucide-react";

interface ContextPanelProps {
  context: string;
  onContextChange: (context: string) => void;
  onSetContext: () => void;
  onResetContext: () => void;
  isContextSet: boolean;
  isLoading: boolean;
}

export function ContextPanel({
  context,
  onContextChange,
  onSetContext,
  onResetContext,
  isContextSet,
  isLoading,
}: ContextPanelProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Context</CardTitle>
              <CardDescription>Set your reference context for similarity checks</CardDescription>
            </div>
          </div>
          <Badge variant={isContextSet ? "default" : "secondary"}>
            {isContextSet ? "Active" : "Not Set"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter your context text here... (e.g., company description, topic boundaries, allowed subjects)"
          value={context}
          onChange={(e) => onContextChange(e.target.value)}
          className="min-h-[200px] resize-none font-mono text-sm"
        />
        <div className="flex gap-2">
          <Button
            onClick={onSetContext}
            disabled={isLoading || !context.trim()}
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Set Context
          </Button>
          <Button
            variant="outline"
            onClick={onResetContext}
            disabled={isLoading || !isContextSet}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        {context && (
          <p className="text-xs text-muted-foreground">
            {context.length} characters
          </p>
        )}
      </CardContent>
    </Card>
  );
}
