import type { Metadata } from "next";
import { StartRunner } from "@/components/projects/start-runner";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Memulai proyek",
  robots: { index: false, follow: false },
};

/** Landing point after sign-up/sign-in: turns the saved prompt + template into a draft project. */
export default async function NewProjectPage() {
  await requireUser("/mulai/baru");
  return <StartRunner />;
}
