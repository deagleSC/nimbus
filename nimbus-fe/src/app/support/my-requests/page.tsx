"use client";

import { useEffect } from "react";
import SupportLayout from "@/layouts/support-layout";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { useSupportStore } from "@/zustand";

export default function MySupportRequests() {
  const { requests, requestStatus, fetchRequests } = useSupportStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <SupportLayout
      breadcrumbs={[
        { title: "Contact Support", href: "/support" },
        { title: "My Requests", href: "/support/my-requests" },
      ]}
    >
      <div className="container mx-auto py-6 max-w-full">
        {requestStatus.isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <DataTable columns={columns} data={requests} />
        )}
      </div>
    </SupportLayout>
  );
}
