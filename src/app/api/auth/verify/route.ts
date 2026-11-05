import { redirect } from "next/navigation";
import { finishVerification } from "@/lib/account";
import { createSession, safeNext } from "@/lib/auth";
import { consumeToken } from "@/lib/tokens";

/**
 * Target of the verification email link. A valid, unused token proves control
 * of the inbox, so we mark the email verified, sign the user in, and send them
 * on to whatever they were doing when they registered.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const userId = await consumeToken(url.searchParams.get("token") ?? "", "verify");
  if (!userId) redirect("/masuk?verifikasi=gagal");

  const user = await finishVerification(userId);
  if (!user) redirect("/masuk?verifikasi=gagal");

  await createSession(user);
  redirect(safeNext(url.searchParams.get("next")) ?? "/?verifikasi=ok");
}
