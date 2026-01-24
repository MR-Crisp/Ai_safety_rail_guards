import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Bot, Loader2, ShieldCheck } from "lucide-react";
import { SimilarityResult } from "./SimilarityResult";
import type { SimilarityResponse } from "@/lib/api";

interface LlmResponseCheckerProps {
  onCheck: (llmResponse: string, threshold: number) => Promise<SimilarityResponse>;
  isContextSet: boolean;
}

export function LlmResponseChecker({ onCheck, isContextSet }: LlmResponseCheckerProps) {
  const [llmResponse, setLlmResponse] = useState("");
  const [threshold, setThreshold] = useState(0.4);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimilarityResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!llmResponse.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await onCheck(llmResponse, threshold);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">LLM Response Checker</CardTitle>
            <CardDescription>Verify if chatbot response matches context</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="llmResponse">LLM Response</Label>
          </div>
          <Textarea
            id="llmResponse"
            placeholder="Enter the chatbot/LLM response to verify against context..."
            value={llmResponse}
            onChange={(e) => setLlmResponse(e.target.value)}
            className="min-h-[100px] resize-none"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Similarity Threshold</Label>
            <span className="text-sm font-medium text-primary">
              {Math.round(threshold * 100)}%
            </span>
          </div>
          <Slider
            value={[threshold]}
            onValueChange={([value]) => setThreshold(value)}
            min={0}
            max={1}
            step={0.05}
            className="py-2"
          />
          <p className="text-xs text-muted-foreground">
            Response must be at least {Math.round(threshold * 100)}% similar to context
          </p>
        </div>

        <Button
          onClick={handleCheck}
          disabled={isLoading || !llmResponse.trim() || !isContextSet}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="mr-2 h-4 w-4" />
          )}
          Verify LLM Response
        </Button>

        {!isContextSet && (
          <p className="text-center text-sm text-muted-foreground">
            Please set a context first to enable LLM verification
          </p>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {result && <SimilarityResult result={result} />}
      </CardContent>
    </Card>
  );
}
