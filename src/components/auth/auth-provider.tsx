"use client";

import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/app/actions/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AuthModal } from "@/components/auth/auth-modal";

export type AuthUser = { name: string; role: string; badge: number };
type Mode = "login" | "register";
type ModalState = { mode: Mode; next?: string } | null;

type AuthContextValue = {
  user: AuthUser | null;
  /** "loading" until /api/session answered once (avoids flashing "Masuk" for signed-in users) */
  status: "loading" | "ready";
  googleEnabled: boolean;
  refresh: () => Promise<void>;
  /** Signs out, refreshes the navbar state and server data, then goes home. */
  signOut: () => Promise<void>;
  /** Opens the login/register modal; `next` is where to go (or stay) afterwards. */
  openAuth: (opts?: { mode?: Mode; next?: string }) => void;
  closeAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

/**
 * Session state for client components. Static marketing pages stay static: the
 * signed-in user is fetched once from /api/session after hydration.
 */
export function AuthProvider({ googleEnabled, children }: { googleEnabled: boolean; children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [modal, setModal] = useState<ModalState>(null);
  const router = useRouter();

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/session", { cache: "no-store" });
      const json = (await res.json()) as { user: AuthUser | null };
      setUser(json.user);
    } catch {
      setUser(null);
    } finally {
      setStatus("ready");
    }
  }, []);

  // Load on mount and re-check after every navigation, so the navbar follows sign-in, sign-out
  // and password changes. (setState only inside promise callbacks, never synchronously.)
  const pathname = usePathname();
  useEffect(() => {
    let cancelled = false;
    fetch("/api/session", { cache: "no-store" })
      .then((r) => r.json() as Promise<{ user: AuthUser | null }>)
      .then((j) => !cancelled && setUser(j.user))
      .catch(() => !cancelled && setUser(null))
      .finally(() => !cancelled && setStatus("ready"));
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  const doSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      googleEnabled,
      refresh,
      signOut: doSignOut,
      openAuth: (opts) => setModal({ mode: opts?.mode ?? "login", next: opts?.next }),
      closeAuth: () => setModal(null),
    }),
    [user, status, googleEnabled, refresh, doSignOut],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <AuthModal
        state={modal}
        onClose={() => setModal(null)}
        onMode={(mode) => setModal((m) => (m ? { ...m, mode } : m))}
      />
    </AuthContext.Provider>
  );
}
