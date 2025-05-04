import { Chess } from "chess.js";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MoveHistory } from "./MoveHistory";
import { Sparkles, ScanFace } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GameAnalysisProps {
  chess: Chess;
  moveHistory: MoveHistory[];
}

export default function GameAnalysis({
  chess,
  moveHistory,
}: GameAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>(
    "Analysis will appear here when connected to API.",
  );

  useEffect(() => {
    // This will be replaced with an actual API call
    // For now, just show a placeholder
    if (moveHistory.length === 0) {
      setAnalysis("The game hasn't started yet. Make your first move!");
    } else {
      setAnalysis("Analysis feature coming soon. API integration pending.");
    }
  }, [chess, moveHistory.length]);

  return (
    <Card className="w-full h-full shadow-md border border-sidebar-primary">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <Badge
          variant="outline"
          className="gap-1 flex items-center bg-sidebar-primary/60 text-sidebar-primary-foreground border border-sidebar-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Generated</span>
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex gap-2 items-start">
            <ScanFace className="h-4 w-4 text-sidebar-primary mt-1 shrink-0" />
            <p className="text-sm whitespace-pre-line">{analysis}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
