import { useState, useEffect, useCallback } from "react";
import { ContextPanel } from "@/components/ContextPanel";
import { PromptSimilarityChecker } from "@/components/PromptSimilarityChecker";
import { LlmResponseChecker } from "@/components/LlmResponseChecker";
import { StatusIndicator } from "@/components/StatusIndicator";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Sparkles } from "lucide-react";

const Index = () => {
  const [context, setContext] = useState("");
  const [isContextSet, setIsContextSet] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [health, setHealth] = useState({
    isConnected: false,
    isModelLoaded: false,
    isContextLoaded: false,
  });
  const { toast } = useToast();

  const fetchHealth = useCallback(async () => {
    try {
      const data = await api.getHealth();
      setHealth({
        isConnected: data.status === "healthy",
        isModelLoaded: data.model_loaded,
        isContextLoaded: data.context_loaded,
      });
      setIsContextSet(data.context_loaded);
    } catch {
      setHealth({
        isConnected: false,
        isModelLoaded: false,
        isContextLoaded: false,
      });
    }
  }, []);

  const fetchContext = useCallback(async () => {
    try {
      const data = await api.getContext();
      if (data.context_set && data.context) {
        setContext(data.context);
        setIsContextSet(true);
      }
    } catch {
      // Context not set, that's okay
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    fetchContext();
    const interval = setInterval(fetchHealth, 10000);
    return () => clearInterval(interval);
  }, [fetchHealth, fetchContext]);

  const handleSetContext = async () => {
    if (!context.trim()) return;

    setIsLoading(true);
    try {
      await api.setContext(context);
      setIsContextSet(true);
      setHealth((prev) => ({ ...prev, isContextLoaded: true }));
      toast({
        title: "Context Set",
        description: "Your context has been set successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set context. Is the API running?",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetContext = async () => {
    setIsLoading(true);
    try {
      await api.resetContext();
      setContext("");
      setIsContextSet(false);
      setHealth((prev) => ({ ...prev, isContextLoaded: false }));
      toast({
        title: "Context Reset",
        description: "Your context has been cleared.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset context.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check user prompt against context using the /similarity endpoint
  const handleCheckPromptSimilarity = async (userPrompt: string, threshold: number) => {
    return api.calculateSimilarity(context, userPrompt, threshold);
  };

  // Check LLM response against stored context using the /check-llm-input endpoint
  const handleCheckLlmResponse = async (llmResponse: string, threshold: number) => {
    return api.checkLlmInput(llmResponse, threshold);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Text Similarity</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Context Matching</p>
            </div>
          </div>
          <StatusIndicator
            isConnected={health.isConnected}
            isModelLoaded={health.isModelLoaded}
            isContextLoaded={health.isContextLoaded}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Check Text Relevance
          </h2>
          <p className="mt-2 text-muted-foreground">
            Set your context and verify if inputs are semantically related using AI embeddings
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <ContextPanel
            context={context}
            onContextChange={setContext}
            onSetContext={handleSetContext}
            onResetContext={handleResetContext}
            isContextSet={isContextSet}
            isLoading={isLoading}
          />
          <PromptSimilarityChecker
            onCheck={handleCheckPromptSimilarity}
            isContextSet={isContextSet}
            context={context}
          />
          <LlmResponseChecker
            onCheck={handleCheckLlmResponse}
            isContextSet={isContextSet}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">How it works</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                1
              </div>
              <div>
                <p className="font-medium">Set Context</p>
                <p className="text-sm text-muted-foreground">
                  Define your reference text (company info, allowed topics, etc.)
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                2
              </div>
              <div>
                <p className="font-medium">Enter Input</p>
                <p className="text-sm text-muted-foreground">
                  Type the text you want to check for relevance
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                3
              </div>
              <div>
                <p className="font-medium">Get Results</p>
                <p className="text-sm text-muted-foreground">
                  See the similarity score and whether it passes your threshold
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
