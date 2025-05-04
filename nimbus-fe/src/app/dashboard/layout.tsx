"use client";

import React from "react";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

// Since ProtectedRoute now handles its own loading state, we don't need Suspense here
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
