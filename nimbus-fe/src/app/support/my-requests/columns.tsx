"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { SupportRequestStatusLabel } from "@/enums/support.enums";

const statusStyles = {
  PENDING: "bg-yellow-100/15 text-yellow-500",
  IN_PROGRESS: "bg-blue-100/15 text-blue-500",
  RESOLVED: "bg-emerald-100/15 text-emerald-500",
};

export type SupportRequest = {
  _id: string;
  subject: string;
  message: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
};

export const columns: ColumnDef<SupportRequest>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return format(date, "MMM d, yyyy");
    },
    size: 120,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => {
      const subject = row.getValue("subject") as string;
      return (
        <div className="max-w-[200px] break-words">
          {subject.length > 50 ? `${subject.substring(0, 50)}...` : subject}
        </div>
      );
    },
    size: 400,
  },
  {
    accessorKey: "message",
    header: "Message",
    cell: ({ row }) => {
      const message = row.getValue("message") as string;
      return (
        <div className="max-w-[400px] break-words">
          {message.length > 100 ? `${message.substring(0, 100)}...` : message}
        </div>
      );
    },
    size: 800,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant="default"
          className={statusStyles[status as keyof typeof statusStyles]}
        >
          {
            SupportRequestStatusLabel[
              status as keyof typeof SupportRequestStatusLabel
            ]
          }
        </Badge>
      );
    },
    size: 120,
  },
];
