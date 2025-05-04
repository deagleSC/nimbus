import { Chess } from "chess.js";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface MoveHistory {
  san: string;
  fen: string;
  moveNumber: number;
  color: "w" | "b";
}

interface MoveHistoryProps {
  moveHistory: MoveHistory[];
  currentPosition: number;
  jumpToPosition: (index: number) => void;
}

export function initMoveHistory(chessInstance: Chess): MoveHistory[] {
  const history = chessInstance.history({ verbose: true });
  const moves: MoveHistory[] = [];

  // Create a temporary chess instance to track positions
  const tempChess = new Chess();

  history.forEach((move, index) => {
    tempChess.move(move);
    const moveNumber = Math.floor(index / 2) + 1;
    moves.push({
      san: move.san,
      fen: tempChess.fen(),
      moveNumber,
      color: index % 2 === 0 ? "w" : "b",
    });
  });

  return moves;
}

export default function MoveHistory({
  moveHistory,
  currentPosition,
  jumpToPosition,
}: MoveHistoryProps) {
  if (moveHistory.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No moves yet. Start playing!
      </p>
    );
  }

  // Group moves by pairs for white and black
  const moveRows: {
    moveNumber: number;
    white?: MoveHistory;
    black?: MoveHistory;
  }[] = [];

  moveHistory.forEach((move) => {
    if (move.color === "w") {
      moveRows.push({ moveNumber: move.moveNumber, white: move });
    } else {
      const lastRow = moveRows[moveRows.length - 1];
      if (lastRow && lastRow.moveNumber === move.moveNumber) {
        lastRow.black = move;
      } else {
        moveRows.push({ moveNumber: move.moveNumber, black: move });
      }
    }
  });

  return (
    <div className="overflow-auto h-full rounded-lg font-xs bg-black px-3">
      <Table className="text-xs border-collapse [&_tr:hover]:bg-transparent">
        <TableHeader>
          <TableRow className="py-3">
            <TableHead className="w-6 px-1 font-medium">#</TableHead>
            <TableHead className="px-1 font-medium">White</TableHead>
            <TableHead className="px-1 font-medium">Black</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-xs">
          {moveRows.map((row, index) => (
            <TableRow key={index} className="h-6 border-b">
              <TableCell className="px-1">{row.moveNumber}</TableCell>
              <TableCell
                className={cn(
                  "px-1 py-0 cursor-pointer rounded-sm hover:bg-sidebar-accent",
                  currentPosition ===
                    moveHistory.findIndex((m) => m === row.white)
                    ? "bg-sidebar-accent"
                    : "",
                )}
                onClick={() =>
                  row.white &&
                  jumpToPosition(moveHistory.findIndex((m) => m === row.white))
                }
              >
                {row.white && row.white.san}
              </TableCell>
              <TableCell
                className={cn(
                  "px-1 py-0 rounded-sm",
                  row.black && "cursor-pointer hover:bg-sidebar-accent",
                  currentPosition ===
                    moveHistory.findIndex((m) => m === row.black)
                    ? "bg-sidebar-accent"
                    : "",
                )}
                onClick={() =>
                  row.black &&
                  jumpToPosition(moveHistory.findIndex((m) => m === row.black))
                }
              >
                {row.black && row.black.san}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {currentPosition !== moveHistory.length - 1 && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => jumpToPosition(moveHistory.length - 1)}
          >
            Go to Latest Position
          </Button>
        </div>
      )}
    </div>
  );
}
