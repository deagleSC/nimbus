import { ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import NimbusTabs from "@/components/common/nimbus-tabs";

interface SupportLayoutProps {
  children: ReactNode;
  breadcrumbs: { title: string; href: string }[];
}

export default function SupportLayout({
  children,
  breadcrumbs,
}: SupportLayoutProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div>
        <NimbusTabs
          items={[
            { label: "Create", path: "/support/create" },
            { label: "My Requests", path: "/support/my-requests" },
          ]}
          className="mt-5"
        />
        {children}
      </div>
    </AppLayout>
  );
}
