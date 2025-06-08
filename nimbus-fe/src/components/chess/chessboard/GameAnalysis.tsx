"use client";

import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Brain, Loader2, ChevronDown, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAIStore } from "@/zustand/stores/aiStore";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Note } from "@/components/ui/note";
import { useAuthStore } from "@/zustand/stores/authStore";

interface GameAnalysisProps {
  chess: Chess;
}

interface AnalysisContent {
  summary: string;
  keyLearnings: string[];
  suggestions: string[];
}

interface AnalysisMessage {
  role: string;
  content: AnalysisContent;
}

interface AnalysisChoice {
  message: AnalysisMessage;
}

interface AnalysisData {
  gameId: string;
  id: string;
  provider: string;
  modelName: string;
  choices: AnalysisChoice[];
}

interface Analysis {
  success: boolean;
  message: string;
  data: AnalysisData;
}

export default function GameAnalysis({ chess }: GameAnalysisProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const analyzeGame = useAIStore((state) => state.analyzeGame);
  const aiAnalysis = useAIStore((state) => state.analysis);
  const isAnalyzing = useAIStore((state) => state.isAnalyzing);
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (aiAnalysis) {
      setAnalysis(aiAnalysis as Analysis);
    }
  }, [aiAnalysis]);

  const generateAnalysis = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(true);

    setShowDialog(false);
    await analyzeGame(chess.pgn(), "w", "1", userId as string);
  };

  return (
    <Card
      className="w-full h-full shadow-md border border-sidebar-primary glow-effect"
      data-color="sidebar-primary"
    >
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 transition-colors duration-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-sidebar-primary" />
              <span className="text-sm font-medium">Nimbus AI</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-end">
                <Dialog open={showDialog} onOpenChange={setShowDialog}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isAnalyzing || chess.history().length === 0}
                          className="h-8 w-8"
                        >
                          {isAnalyzing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Brain className="h-4 w-4" />
                          )}
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      {chess.history().length === 0
                        ? "Make your first move to begin analysis"
                        : "Generate Analysis"}
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Generate Game Analysis</DialogTitle>
                      <DialogDescription>
                        This will analyze your current game position. The
                        analysis may take a few moments to complete.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setShowDialog(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={generateAnalysis}>
                        Generate Analysis
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-all duration-200 ease-in-out",
                  isOpen ? "transform rotate-180" : "",
                )}
              />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="overflow-hidden transition-all duration-200 ease-in-out data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col gap-4">
              {isAnalyzing ? (
                <div className="flex flex-col gap-4">
                  <div className="w-full">
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                  <div className="flex gap-4 w-full">
                    <Skeleton className="h-[200px] w-1/2" />
                    <Skeleton className="h-[200px] w-1/2" />
                  </div>
                </div>
              ) : analysis ? (
                <>
                  {/* First Row - Game Summary */}
                  <Card className="p-6 border-none shadow-sm bg-muted/50">
                    <CardHeader className="px-0 pt-0">
                      <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Brain className="h-4 w-4 text-primary" />
                        Game Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                      <p className="text-muted-foreground leading-relaxed">
                        {analysis.data.choices[0].message.content.summary}
                      </p>
                    </CardContent>
                  </Card>

                  {/* Second Row - Key Learnings & Suggestions in 2 columns */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Key Learnings Card */}
                    <Card className="p-6 border-none shadow-sm bg-muted/50">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Key Learnings
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-0">
                        <ul className="space-y-3">
                          {analysis.data.choices[0].message.content.keyLearnings.map(
                            (learning: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="mt-1">
                                  <Badge
                                    variant="secondary"
                                    className="h-6 w-6 flex items-center justify-center p-0 font-medium"
                                  >
                                    {index + 1}
                                  </Badge>
                                </div>
                                <span className="text-muted-foreground leading-relaxed">
                                  {learning}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </CardContent>
                    </Card>

                    {/* Suggestions Card */}
                    <Card className="p-6 border-none shadow-sm bg-muted/50">
                      <CardHeader className="px-0 pt-0">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                          <Lightbulb className="h-4 w-4 text-primary" />
                          Suggestions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-0">
                        <ul className="space-y-3">
                          {analysis.data.choices[0].message.content.suggestions.map(
                            (suggestion: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-3"
                              >
                                <div className="mt-1">
                                  <Badge
                                    variant="outline"
                                    className="h-6 w-6 flex items-center justify-center p-0 font-medium"
                                  >
                                    {index + 1}
                                  </Badge>
                                </div>
                                <span className="text-muted-foreground leading-relaxed">
                                  {suggestion}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
                  <Brain className="h-12 w-12 text-muted-foreground/50 animate-pulse" />
                  <div className="space-y-2">
                    <p className="text-muted-foreground">
                      Click on the brain icon on the right to generate analysis
                    </p>
                    <Note>
                      <span className="font-medium">Note</span>: Generating
                      analysis can take some time, please be patient. Do not
                      refresh or close the tab.
                    </Note>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
