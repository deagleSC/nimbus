"use client";

import { Chess, Square } from "chess.js";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import MoveHistory from "./MoveHistory";
import GameAnalysis from "./GameAnalysis";
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  FlipVertical2,
  ChevronsRight,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState, useRef, useCallback } from "react";

// Constants
const CHESS_FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const CHESS_RANKS = ["8", "7", "6", "5", "4", "3", "2", "1"] as const;
const BOARD_SIZE = 8;
const DEFAULT_PROMOTION = "q";

interface ChessboardProps {
  initialPosition: string;
  playerColor: "w" | "b";
}

interface DragState {
  isDragging: boolean;
  sourceSquare: Square | null;
  draggedPiece: { type: string; color: string } | null;
  cursorPosition: { x: number; y: number };
}

interface PromotionState {
  isPromoting: boolean;
  fromSquare: Square | null;
  toSquare: Square | null;
}

export default function ChessBoard({
  initialPosition,
  playerColor,
}: ChessboardProps) {
  // Game state
  const [gameState, setGameState] = useState(() => new Chess(initialPosition));
  const [currentPosition, setCurrentPosition] = useState<number>(-1);
  const [viewingState, setViewingState] = useState(
    () => new Chess(initialPosition),
  );

  // UI state
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    sourceSquare: null,
    draggedPiece: null,
    cursorPosition: { x: 0, y: 0 },
  });
  const [promotionState, setPromotionState] = useState<PromotionState>({
    isPromoting: false,
    fromSquare: null,
    toSquare: null,
  });
  const [isFlipped, setIsFlipped] = useState(playerColor === "b");
  const [showResetDialog, setShowResetDialog] = useState(false);

  // Refs
  const chessboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(gameState.pgn());
  }, [gameState]);

  // Jump to a specific position in the game history
  const jumpToPosition = useCallback(
    (index: number) => {
      if (index < -1 || index >= gameState.history().length) return;

      const newViewingState = new Chess(initialPosition);
      if (index >= 0) {
        // Load moves up to the target position
        const moves = gameState.history({ verbose: true }).slice(0, index + 1);
        moves.forEach((move) => newViewingState.move(move));
      }

      setViewingState(newViewingState);
      setCurrentPosition(index);
      setSelectedSquare(null);
      setValidMoves([]);
      setDragState({
        isDragging: false,
        sourceSquare: null,
        draggedPiece: null,
        cursorPosition: { x: 0, y: 0 },
      });
    },
    [gameState, initialPosition],
  );

  // Navigation functions
  const goToPreviousMove = useCallback(() => {
    jumpToPosition(Math.max(-1, currentPosition - 1));
  }, [currentPosition, jumpToPosition]);

  const goToNextMove = useCallback(() => {
    jumpToPosition(
      Math.min(gameState.history().length - 1, currentPosition + 1),
    );
  }, [currentPosition, gameState, jumpToPosition]);

  const goToLatestPosition = useCallback(() => {
    jumpToPosition(gameState.history().length - 1);
  }, [gameState, jumpToPosition]);

  const flipBoard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard navigation for move history
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        // Previous move
        goToPreviousMove();
      } else if (e.key === "ArrowRight") {
        // Next move
        goToNextMove();
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [goToPreviousMove, goToNextMove]);

  const resetGame = useCallback(() => {
    const newGameState = new Chess(initialPosition);
    setGameState(newGameState);
    setViewingState(newGameState);
    setCurrentPosition(-1);
    setSelectedSquare(null);
    setValidMoves([]);
    setDragState({
      isDragging: false,
      sourceSquare: null,
      draggedPiece: null,
      cursorPosition: { x: 0, y: 0 },
    });
    setShowResetDialog(false);
  }, [initialPosition]);

  const handleResetClick = useCallback(() => {
    setShowResetDialog(true);
  }, []);

  const executeMove = useCallback(
    (fromSquare: Square, toSquare: Square, promotion?: string): boolean => {
      // Only allow moves when viewing the latest position
      if (currentPosition !== gameState.history().length - 1) return false;

      try {
        // Create a new chess instance with current game history
        const updatedGameState = new Chess();
        const moveHistory = gameState.history({ verbose: true });

        // Replay all previous moves
        moveHistory.forEach((move) => {
          updatedGameState.move(move);
        });

        // Check if this is a pawn promotion
        const piece = updatedGameState.get(fromSquare);
        const isPawn = piece?.type === "p";
        const isPromotionRank =
          (piece?.color === "w" && toSquare[1] === "8") ||
          (piece?.color === "b" && toSquare[1] === "1");

        if (isPawn && isPromotionRank) {
          // If no promotion piece is specified, show the promotion dialog
          if (!promotion) {
            setPromotionState({
              isPromoting: true,
              fromSquare,
              toSquare,
            });
            return false;
          }
        }

        // Attempt the new move
        const moveResult = updatedGameState.move({
          from: fromSquare,
          to: toSquare,
          promotion: promotion || DEFAULT_PROMOTION,
        });

        if (moveResult) {
          setGameState(updatedGameState);
          setViewingState(updatedGameState);
          setCurrentPosition(updatedGameState.history().length - 1);
          return true;
        }
        return false;
      } catch (error) {
        console.warn("Invalid move attempted:", error);
        return false;
      }
    },
    [gameState, currentPosition],
  );

  const handlePromotion = useCallback(
    (piece: string) => {
      if (!promotionState.fromSquare || !promotionState.toSquare) return;

      executeMove(promotionState.fromSquare, promotionState.toSquare, piece);
      setPromotionState({
        isPromoting: false,
        fromSquare: null,
        toSquare: null,
      });
    },
    [promotionState, executeMove],
  );

  const getValidMovesForSquare = useCallback(
    (square: Square): Square[] => {
      // Only allow moves when viewing the latest position
      if (currentPosition !== gameState.history().length - 1) return [];
      const moves = viewingState.moves({ square, verbose: true });
      return moves.map((move) => move.to as Square);
    },
    [viewingState, currentPosition, gameState],
  );

  const clearSelection = useCallback(() => {
    setSelectedSquare(null);
    setValidMoves([]);
  }, []);

  const selectSquare = useCallback(
    (square: Square) => {
      // Only allow selection when viewing the latest position
      if (currentPosition !== gameState.history().length - 1) {
        clearSelection();
        return;
      }

      const piece = viewingState.get(square);
      if (piece && piece.color === viewingState.turn()) {
        setSelectedSquare(square);
        setValidMoves(getValidMovesForSquare(square));
      } else {
        clearSelection();
      }
    },
    [
      viewingState,
      getValidMovesForSquare,
      clearSelection,
      currentPosition,
      gameState,
    ],
  );

  const handleSquareClick = useCallback(
    (square: Square) => {
      if (selectedSquare) {
        // Attempt to move to clicked square
        const moveSuccessful = executeMove(selectedSquare, square);

        if (moveSuccessful) {
          clearSelection();
        } else {
          // If move failed, try selecting the clicked square instead
          selectSquare(square);
        }
      } else {
        // No square selected, try to select the clicked square
        selectSquare(square);
      }
    },
    [selectedSquare, executeMove, clearSelection, selectSquare],
  );

  const calculateSquareFromCoordinates = useCallback(
    (clientX: number, clientY: number, boardRect: DOMRect): Square | null => {
      const squareSize = boardRect.width / BOARD_SIZE;
      const x = clientX - boardRect.left;
      const y = clientY - boardRect.top;

      let fileIndex = Math.floor(x / squareSize);
      let rankIndex = Math.floor(y / squareSize);

      if (
        fileIndex < 0 ||
        fileIndex >= BOARD_SIZE ||
        rankIndex < 0 ||
        rankIndex >= BOARD_SIZE
      ) {
        return null;
      }

      // Adjust for board orientation
      if (isFlipped) {
        fileIndex = BOARD_SIZE - 1 - fileIndex;
        rankIndex = BOARD_SIZE - 1 - rankIndex;
      }

      const targetFile = CHESS_FILES[fileIndex];
      const targetRank = CHESS_RANKS[rankIndex];
      return `${targetFile}${targetRank}` as Square;
    },
    [isFlipped],
  );

  const resetDragState = useCallback(() => {
    setDragState({
      isDragging: false,
      sourceSquare: null,
      draggedPiece: null,
      cursorPosition: { x: 0, y: 0 },
    });
    setValidMoves([]);
  }, []);

  const isCoordinateInsideBoard = useCallback(
    (clientX: number, clientY: number, boardRect: DOMRect): boolean => {
      return (
        clientX >= boardRect.left &&
        clientX <= boardRect.right &&
        clientY >= boardRect.top &&
        clientY <= boardRect.bottom
      );
    },
    [],
  );

  const getClientCoordinates = useCallback((e: MouseEvent | TouchEvent) => {
    if ("changedTouches" in e && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    if ("touches" in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  }, []);

  // Drag and drop handlers
  const initiateDrag = useCallback(
    (e: React.MouseEvent | React.TouchEvent, square: Square) => {
      // Only allow dragging when viewing the latest position
      if (currentPosition !== gameState.history().length - 1) return;

      const piece = viewingState.get(square);
      if (!piece || piece.color !== viewingState.turn()) return;

      // Get client coordinates
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Prevent default behavior
      e.preventDefault();

      // Calculate possible moves
      const moves = viewingState.moves({ square, verbose: true });
      setValidMoves(moves.map((move) => move.to as Square));

      // Set drag state
      setDragState({
        isDragging: true,
        sourceSquare: square,
        draggedPiece: { type: piece.type, color: piece.color },
        cursorPosition: { x: clientX, y: clientY },
      });
    },
    [viewingState, currentPosition, gameState],
  );

  // Effect for handling dragging
  useEffect(() => {
    if (!dragState.isDragging) return;

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const { x, y } = getClientCoordinates(e);

      setDragState((prev) => ({
        ...prev,
        cursorPosition: { x, y },
      }));
    };

    const handleDragEnd = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();

      if (!chessboardRef.current || !dragState.sourceSquare) {
        resetDragState();
        return;
      }

      const boardRect = chessboardRef.current.getBoundingClientRect();
      const { x: clientX, y: clientY } = getClientCoordinates(e);

      // Check if cursor is inside the board
      if (!isCoordinateInsideBoard(clientX, clientY, boardRect)) {
        resetDragState();
        return;
      }

      // Calculate target square
      const targetSquare = calculateSquareFromCoordinates(
        clientX,
        clientY,
        boardRect,
      );

      if (!targetSquare) {
        resetDragState();
        return;
      }

      // Try to make the move
      executeMove(dragState.sourceSquare, targetSquare);
      resetDragState();
    };

    // Add event listeners
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchend", handleDragEnd);

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [
    dragState.isDragging,
    dragState.sourceSquare,
    executeMove,
    getClientCoordinates,
    isCoordinateInsideBoard,
    calculateSquareFromCoordinates,
    resetDragState,
  ]);

  const createPieceImageUrl = useCallback(
    (piece: { type: string; color: string }): string => {
      return `/chess/${piece.color}${piece.type}.svg`;
    },
    [],
  );

  const isSquareDark = useCallback((file: string, rank: string): boolean => {
    const fileIndex = CHESS_FILES.indexOf(file as (typeof CHESS_FILES)[number]);
    const rankIndex = CHESS_RANKS.indexOf(rank as (typeof CHESS_RANKS)[number]);
    return (fileIndex + rankIndex) % 2 === 1;
  }, []);

  const renderChessSquare = useCallback(
    (squareNotation: string, isDarkSquare: boolean) => {
      const square = squareNotation as Square;
      const piece = viewingState.get(square);
      const isSquareSelected = selectedSquare === square;
      const isValidMoveTarget = validMoves.includes(square);
      const isPieceBeingDragged =
        dragState.isDragging && dragState.sourceSquare === square;

      return (
        <div
          key={square}
          className={cn(
            "w-full h-full aspect-square flex items-center justify-center relative max-w-[4rem] max-h-[4rem]",
            isDarkSquare ? "bg-gray-600" : "bg-gray-300",
            isSquareSelected && "outline outline-2 outline-blue-500 z-10",
            isValidMoveTarget &&
              !piece &&
              "after:absolute after:w-1/4 after:h-1/4 after:bg-blue-500 after:rounded-full after:opacity-50",
            isValidMoveTarget &&
              piece &&
              "outline outline-2 outline-red-500 z-10",
          )}
          onClick={() => handleSquareClick(square)}
        >
          {piece && !isPieceBeingDragged && (
            <div
              className="w-full h-full p-1 cursor-grab relative"
              onMouseDown={(e) => initiateDrag(e, square)}
              onTouchStart={(e) => initiateDrag(e, square)}
            >
              <Image
                src={createPieceImageUrl(piece)}
                alt={`${piece.color} ${piece.type}`}
                width={64}
                height={64}
                className="w-full h-full"
                draggable={false}
              />
            </div>
          )}
        </div>
      );
    },
    [
      viewingState,
      selectedSquare,
      validMoves,
      dragState,
      handleSquareClick,
      initiateDrag,
      createPieceImageUrl,
    ],
  );

  const renderDraggedPieceOverlay = useCallback(() => {
    if (!dragState.isDragging || !dragState.draggedPiece) return null;

    return (
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: `${dragState.cursorPosition.x}px`,
          top: `${dragState.cursorPosition.y}px`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Image
          src={createPieceImageUrl(dragState.draggedPiece)}
          alt={`${dragState.draggedPiece.color} ${dragState.draggedPiece.type}`}
          width={64}
          height={64}
          className="w-12 h-12"
        />
      </div>
    );
  }, [dragState, createPieceImageUrl]);

  const renderChessBoard = useCallback(() => {
    const displayRanks = isFlipped ? [...CHESS_RANKS].reverse() : CHESS_RANKS;
    const displayFiles = isFlipped ? [...CHESS_FILES].reverse() : CHESS_FILES;

    return (
      <div
        className="grid grid-cols-8 border border-gray-700 w-full max-w-[32rem] aspect-square relative select-none touch-none"
        ref={chessboardRef}
      >
        {displayRanks.map((rank) =>
          displayFiles.map((file) => {
            const squareNotation = `${file}${rank}`;
            const isDarkSquare = isSquareDark(file, rank);
            return renderChessSquare(squareNotation, isDarkSquare);
          }),
        )}
        {renderDraggedPieceOverlay()}
      </div>
    );
  }, [renderChessSquare, renderDraggedPieceOverlay, isSquareDark, isFlipped]);

  return (
    <Card className="w-full py-4 bg-black border-none">
      <div className="flex flex-col lg:flex-row gap-4 relative" tabIndex={0}>
        <CardContent className="p-2 sm:p-4 flex justify-center">
          {renderChessBoard()}
        </CardContent>

        {/* Promotion Dialog */}
        <Dialog
          open={promotionState.isPromoting}
          onOpenChange={(open) => {
            if (!open) {
              setPromotionState({
                isPromoting: false,
                fromSquare: null,
                toSquare: null,
              });
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Choose Promotion</DialogTitle>
              <DialogDescription>
                Choose the piece you want to promote your pawn to.
              </DialogDescription>
            </DialogHeader>
            <div className="flex gap-2">
              {["q", "r", "b", "n"].map((piece) => (
                <Button
                  key={piece}
                  variant="outline"
                  className="aspect-square p-2 w-15 h-15"
                  onClick={() => handlePromotion(piece)}
                >
                  <Image
                    src={`/chess/${viewingState.turn()}${piece}.svg`}
                    alt={`${piece.toUpperCase()}`}
                    width={32}
                    height={32}
                    className="w-full h-full"
                  />
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Collapsible sidebar */}
        <CardContent
          className={cn(
            "flex-1 p-2 sm:p-4 transition-all duration-300 ease-in-out",
          )}
        >
          <div className="space-y-4 h-full">
            <div className="h-full max-h-[420px] overflow-y-auto">
              <MoveHistory
                chessInstance={gameState}
                currentPosition={currentPosition}
                jumpToPosition={jumpToPosition}
              />
            </div>
          </div>
        </CardContent>
      </div>

      <CardFooter className="flex flex-wrap justify-between h-min py-2 px-4">
        <div className="flex gap-2">
          <TooltipProvider>
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 w-9 p-0"
                      onClick={handleResetClick}
                    >
                      <RotateCcw size={16} />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>Reset Board</TooltipContent>
              </Tooltip>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Chess Board</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to reset the board? This will clear
                    all moves and return to the starting position. This action
                    cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowResetDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={resetGame}>
                    Reset Board
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  onClick={flipBoard}
                >
                  <FlipVertical2 size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Flip Board</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Move navigation controls */}
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  disabled={currentPosition <= -1}
                  onClick={goToPreviousMove}
                >
                  <ChevronLeft size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Previous Move</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  disabled={currentPosition >= gameState.history().length - 1}
                  onClick={goToNextMove}
                >
                  <ChevronRight size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Next Move</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-9 p-0"
                  disabled={currentPosition >= gameState.history().length - 1}
                  onClick={goToLatestPosition}
                >
                  <ChevronsRight size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Go to Latest Position</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>

      <div className="h-1/2 overflow-y-auto p-4">
        <GameAnalysis chess={viewingState} />
      </div>
    </Card>
  );
}
