import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s | Admin Omnity" },
  robots: { index: false, follow: false },
};

// Layouts are not re-run on every navigation, so each page and action also calls requireAdmin().
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await requireAdmin();
  return <AdminShell user={{ name: user.name, email: user.email }}>{children}</AdminShell>;
}
