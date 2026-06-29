"use client";

import { AdminAlertProvider } from "@/contexts/AdminAlertContext";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAlertProvider>{children}</AdminAlertProvider>;
}
