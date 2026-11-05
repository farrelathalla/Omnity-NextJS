/**
 * What the visitor typed in the hero prompt / template picker, kept in localStorage for 24h.
 * localStorage (not sessionStorage) on purpose: the email-verification link usually opens in a
 * NEW tab, and the choice must survive that hop. Client-only module.
 */
export const START_KEY = "omnity:hero-prompt";

export type StartData = {
  prompt?: string;
  tab?: string;
  template?: string | null;
  savedAt?: number;
};

export function readStart(): StartData {
  try {
    const raw = localStorage.getItem(START_KEY);
    if (!raw) return {};
    const v = JSON.parse(raw) as StartData;
    if (v.savedAt && Date.now() - v.savedAt > 24 * 3600 * 1000) return {};
    return v;
  } catch {
    return {};
  }
}

export function writeStart(v: StartData) {
  try {
    localStorage.setItem(START_KEY, JSON.stringify({ ...v, savedAt: Date.now() }));
  } catch {
    /* storage unavailable: the choice just is not carried over */
  }
}

export function clearStart() {
  try {
    localStorage.removeItem(START_KEY);
  } catch {
    /* ignore */
  }
}
