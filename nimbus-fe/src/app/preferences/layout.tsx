"use client";

import React from "react";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

export default function PreferencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
