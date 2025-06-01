import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface NoteProps {
  children: ReactNode;
}

export function Note({ children }: NoteProps) {
  return (
    <div className="flex items-start gap-2 text-sm bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md border border-amber-200 dark:border-amber-800/30">
      <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
      <div className="text-amber-800 dark:text-amber-200">{children}</div>
    </div>
  );
}
