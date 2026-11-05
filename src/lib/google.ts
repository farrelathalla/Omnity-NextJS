import "server-only";
import { Google } from "arctic";
import { siteUrl } from "@/lib/site";

/** Google sign-in is optional: the button only appears when both env vars are set. */
export const googleEnabled = () =>
  !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export function googleClient() {
  return new Google(
    process.env.GOOGLE_CLIENT_ID!,
    process.env.GOOGLE_CLIENT_SECRET!,
    `${siteUrl}/api/auth/google/callback`,
  );
}
