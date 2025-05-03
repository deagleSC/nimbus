import AppLayout from "@/layouts/app-layout";

export default function Page() {
  return (
    <AppLayout
      breadcrumbs={[
        { title: "Dashboard", href: "/dashboard" },
        { title: "Overview", href: "/dashboard/overview" },
      ]}
    >
      <div>Hello</div>
    </AppLayout>
  );
}
