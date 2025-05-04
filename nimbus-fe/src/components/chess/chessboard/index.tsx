"use client";

import { Chess, Color, Square } from "chess.js";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import MoveHistory, {
  MoveHistory as MoveHistoryType,
  initMoveHistory,
} from "./MoveHistory";
import GameAnalysis from "./GameAnalysis";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Dices,
  FlipVertical2,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// import { useMediaQuery } from "../../../hooks/use-media-query";

interface ChessBoardProps {
  initialPosition?: string;
  playerColor?: Color;
  onMove?: (move: { from: string; to: string; promotion?: string }) => void;
  allowMoves?: boolean;
}

export default function ChessBoard({
  initialPosition = "start",
  playerColor = "w",
  onMove,
  allowMoves = true,
}: ChessBoardProps) {
  const [chess, setChess] = useState<Chess>(() => {
    try {
      return new Chess(initialPosition);
    } catch (error) {
      console.warn(
        "Invalid FEN provided, using starting position instead:",
        error,
      );
      return new Chess();
    }
  });
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [boardOrientation, setBoardOrientation] = useState<Color>(playerColor);
  const [moveHistory, setMoveHistory] = useState<MoveHistoryType[]>([]);
  const [currentPosition, setCurrentPosition] = useState<number>(-1);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(false);

  // const isDesktop = useMediaQuery("(min-width: 1024px)");

  // // Set sidebar expanded by default on desktop
  // useEffect(() => {
  //   if (isDesktop) {
  //     setSidebarExpanded(true);
  //   } else {
  //     setSidebarExpanded(false);
  //   }
  // }, [isDesktop]);

  // Reset the chess instance and move history when initialPosition changes
  useEffect(() => {
    try {
      const newChess = new Chess(initialPosition);
      setChess(newChess);
      const history = initMoveHistory(newChess);
      setMoveHistory(history);
      setCurrentPosition(history.length - 1);
    } catch (error) {
      console.warn(
        "Invalid FEN provided, using starting position instead:",
        error,
      );
      const newChess = new Chess();
      setChess(newChess);
      const history = initMoveHistory(newChess);
      setMoveHistory(history);
      setCurrentPosition(history.length - 1);
    }
    setSelectedSquare(null);
    setPossibleMoves([]);
  }, [initialPosition]);

  // Update board orientation when playerColor changes
  useEffect(() => {
    setBoardOrientation(playerColor);
  }, [playerColor]);

  const handleSquareClick = (square: Square) => {
    if (!allowMoves || currentPosition !== moveHistory.length - 1) return;

    // If a square is already selected
    if (selectedSquare) {
      // Try to make a move from the selected square to the clicked square
      try {
        const move = chess.move({
          from: selectedSquare,
          to: square,
          // Add promotion=q as default for pawn promotion to queen
          promotion: "q",
        });

        // If move is successful and onMove callback is provided, call it
        if (move && onMove) {
          onMove({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
          });
        }

        // Update move history
        if (move) {
          const newMoveNumber = Math.floor(moveHistory.length / 2) + 1;
          const newMove: MoveHistoryType = {
            san: move.san,
            fen: chess.fen(),
            moveNumber: newMoveNumber,
            color: moveHistory.length % 2 === 0 ? "w" : "b",
          };

          setMoveHistory((prevHistory) => [...prevHistory, newMove]);
          setCurrentPosition(moveHistory.length);
        }

        // Reset selection and update chess instance
        setSelectedSquare(null);
        setPossibleMoves([]);
        setChess(new Chess(chess.fen()));
      } catch {
        // If the move is invalid, check if the clicked square has a piece of the same color
        const piece = chess.get(square);
        if (piece && piece.color === chess.turn()) {
          // Select the new square
          setSelectedSquare(square);
          // Get possible moves for the selected piece
          const moves = chess.moves({ square, verbose: true });
          setPossibleMoves(moves.map((move) => move.to as Square));
        } else {
          // Reset selection
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      // If no square is selected, select the clicked square if it has a piece of the current turn
      const piece = chess.get(square);
      if (piece && piece.color === chess.turn()) {
        setSelectedSquare(square);
        // Get possible moves for the selected piece
        const moves = chess.moves({ square, verbose: true });
        setPossibleMoves(moves.map((move) => move.to as Square));
      }
    }
  };

  // Jump to a specific position in the game history
  const jumpToPosition = (index: number) => {
    if (index < -1 || index >= moveHistory.length) return;

    let newChess;
    if (index === -1) {
      // Initial position
      newChess = new Chess();
    } else {
      // Position after the move at the given index
      newChess = new Chess(moveHistory[index].fen);
    }

    setChess(newChess);
    setCurrentPosition(index);
    setSelectedSquare(null);
    setPossibleMoves([]);
  };

  // Reset the game
  const resetGame = () => {
    const newChess = new Chess();
    setChess(newChess);
    setSelectedSquare(null);
    setPossibleMoves([]);
    setMoveHistory([]);
    setCurrentPosition(-1);
  };

  // Play a random game for testing
  const playRandomGame = () => {
    // Reset the board first
    resetGame();

    // Create a new chess instance
    const gameChess = new Chess();
    const gameMoveHistory = [];

    // Make a series of random moves (30 moves or until game over)
    for (let i = 0; i < 30; i++) {
      // Get all possible moves
      const moves = gameChess.moves({ verbose: true });

      // If game is over, stop making moves
      if (moves.length === 0 || gameChess.isGameOver()) break;

      // Select a random move
      const randomMove = moves[Math.floor(Math.random() * moves.length)];

      // Make the move
      gameChess.move(randomMove);

      // Add to move history
      const newMoveNumber = Math.floor(gameMoveHistory.length / 2) + 1;
      const newMove: MoveHistoryType = {
        san: randomMove.san,
        fen: gameChess.fen(),
        moveNumber: newMoveNumber,
        color: gameMoveHistory.length % 2 === 0 ? "w" : "b",
      };

      gameMoveHistory.push(newMove);
    }

    // Update the state with the final position and move history
    setChess(gameChess);
    setMoveHistory(gameMoveHistory);
    setCurrentPosition(gameMoveHistory.length - 1);
  };

  const renderSquare = (square: Square, isDark: boolean) => {
    const piece = chess.get(square);
    const isSelected = selectedSquare === square;
    const isPossibleMove = possibleMoves.includes(square);

    // Determine piece image URL based on the piece type and color
    const pieceImage = piece ? `/chess/${piece.color}${piece.type}.svg` : null;

    return (
      <div
        key={square}
        className={cn(
          "w-full h-full aspect-square flex items-center justify-center relative max-w-[4rem] max-h-[4rem]",
          isDark ? "bg-gray-600" : "bg-gray-300",
          isSelected && "ring-2 ring-blue-500",
          isPossibleMove &&
            !piece &&
            "after:absolute after:w-1/4 after:h-1/4 after:bg-blue-500 after:rounded-full after:opacity-50",
          isPossibleMove && piece && "ring-2 ring-red-500",
        )}
        onClick={() => handleSquareClick(square as Square)}
      >
        {pieceImage && piece && (
          <Image
            src={pieceImage}
            alt={`${piece.color}${piece.type}`}
            width={64}
            height={64}
            className="w-full h-full p-1"
          />
        )}
      </div>
    );
  };

  const renderBoard = () => {
    const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

    // If player is black, flip the ranks
    const orderedRanks =
      boardOrientation === "b" ? [...ranks].reverse() : ranks;
    const orderedFiles =
      boardOrientation === "b" ? [...files].reverse() : files;

    return (
      <div className="grid grid-cols-8 border border-gray-700 w-full max-w-[32rem] aspect-square">
        {orderedRanks.map((rank) =>
          orderedFiles.map((file) => {
            const square = `${file}${rank}` as Square;
            const isDark =
              (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 1;
            return renderSquare(square, isDark);
          }),
        )}
      </div>
    );
  };

  return (
    <Card className="w-full py-4 bg-black border-none">
      <div className="flex flex-col lg:flex-row gap-4 relative">
        <CardContent className="p-2 sm:p-4 flex justify-center">
          {renderBoard()}
        </CardContent>

        {/* Sidebar toggle button (visible on non-desktop) */}
        <div className="lg:hidden absolute right-2 top-2 z-10">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
              >
                {sidebarExpanded ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sidebarExpanded ? "Hide Analysis" : "Show Analysis"}
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Collapsible sidebar */}
        <CardContent
          className={cn(
            "flex-1 p-2 sm:p-4 transition-all duration-300 ease-in-out",
            // !sidebarExpanded && !isDesktop && "hidden"
          )}
        >
          <div className="space-y-4 h-full">
            <div className="h-1/2 overflow-y-auto">
              <GameAnalysis chess={chess} moveHistory={moveHistory} />
            </div>
            <div className="h-1/2 overflow-y-auto max-h-[200px]">
              <MoveHistory
                moveHistory={moveHistory}
                currentPosition={currentPosition}
                jumpToPosition={jumpToPosition}
              />
            </div>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex flex-wrap gap-2 h-min py-2 px-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={resetGame}
                size="sm"
                className="h-9 w-9 p-0"
              >
                <RotateCcw size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reset Board</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() =>
                  setBoardOrientation(boardOrientation === "w" ? "b" : "w")
                }
                size="sm"
                className="h-9 w-9 p-0"
              >
                <FlipVertical2 size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Flip Board</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setSidebarExpanded(!sidebarExpanded)}
                size="sm"
                className="h-9 w-9 p-0 lg:hidden"
              >
                {sidebarExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {sidebarExpanded ? "Hide Analysis" : "Show Analysis"}
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                onClick={playRandomGame}
                size="sm"
                className="h-9 w-9 p-0"
              >
                <Dices size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Play Random Game</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}
