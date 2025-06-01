"use client";

import AppLayout from "@/layouts/app-layout";
import ChessBoard from "@/components/chess/chessboard";
export default function Analysis() {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "AI Coach", href: "/ai-coach" },
        { title: "Analysis", href: "/ai-coach/analysis" },
      ]}
    >
      <div>
        <ChessBoard
          initialPosition="rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
          // initialPosition="8/P7/8/8/8/8/4k3/7K w - - 0 1"
          playerColor="w"
        />
      </div>
    </AppLayout>
  );
}
