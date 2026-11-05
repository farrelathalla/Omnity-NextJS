"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId } from "react";
import {
  changePassword,
  completeProfile,
  login,
  register,
  requestPasswordReset,
  resendVerification,
  resetPassword,
  updateProfile,
  type AuthState,
} from "@/app/actions/auth";
import { useAuth } from "@/components/auth/auth-provider";
import { useFormAction } from "@/components/forms/use-form-action";
import { SpamGuard } from "@/components/forms/spam-guard";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/form";

const idle: AuthState = { status: "idle" };

function Alert({ state }: { state: AuthState }) {
  if (state.status === "error" && state.message) {
    return (
      <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {state.message}
      </p>
    );
  }
  if (state.status === "ok" && state.message) {
    return (
      <p role="status" className="rounded-xl border border-leaf/20 bg-leaf-50 px-4 py-3 text-sm text-leaf">
        {state.message}
      </p>
    );
  }
  return null;
}

/** Navigate (and refresh server data) once an action reports success with a destination. */
function useRedirectOnOk(state: AuthState, onDone?: (to: string) => void) {
  const router = useRouter();
  const { refresh } = useAuth();
  useEffect(() => {
    if (state.status === "ok" && state.redirectTo) {
      void refresh();
      onDone?.(state.redirectTo);
      router.push(state.redirectTo);
      router.refresh();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
}

export function GoogleButton({ next }: { next?: string }) {
  const { googleEnabled } = useAuth();
  if (!googleEnabled) return null;
  return (
    <>
      <a
        href={`/api/auth/google${next ? `?next=${encodeURIComponent(next)}` : ""}`}
        className="flex h-11 w-full items-center justify-center gap-3 rounded-[11px] border border-line bg-surface text-sm font-medium transition-colors hover:border-ink/30 hover:bg-sand"
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.8Z" />
          <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24Z" />
          <path fill="#FBBC05" d="M5.4 14.4a7.2 7.2 0 0 1 0-4.8V6.5H1.4a12 12 0 0 0 0 11l4-3.1Z" />
          <path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8Z" />
        </svg>
        Lanjutkan dengan Google
      </a>
      <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-muted">
        <span className="h-px flex-1 bg-line" /> atau <span className="h-px flex-1 bg-line" />
      </div>
    </>
  );
}

export function ResendVerification({ email, next }: { email: string; next?: string }) {
  const { state, pending, onSubmit } = useFormAction(resendVerification, idle);
  return (
    <form onSubmit={onSubmit} className="mt-3">
      <input type="hidden" name="email" value={email} />
      {next ? <input type="hidden" name="next" value={next} /> : null}
      {state.status === "ok" ? (
        <p role="status" className="text-sm text-leaf">{state.message}</p>
      ) : (
        <button type="submit" disabled={pending} className="text-sm font-semibold text-accent hover:underline disabled:opacity-60">
          {pending ? "Mengirim..." : "Kirim ulang email verifikasi"}
        </button>
      )}
      {state.status === "error" ? <p role="alert" className="mt-1 text-sm text-red-600">{state.message}</p> : null}
    </form>
  );
}

export function LoginForm({
  next,
  onNavigate,
  onSwitchToRegister,
}: {
  next?: string;
  onNavigate?: (to: string) => void;
  onSwitchToRegister?: () => void;
}) {
  const uid = useId();
  const { state, pending, onSubmit } = useFormAction(login, idle);
  useRedirectOnOk(state, onNavigate);

  return (
    <div>
      <GoogleButton next={next} />
      <form noValidate onSubmit={onSubmit} className="space-y-5">
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <Field label="Email" htmlFor={`${uid}-email`}>
          <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" required />
        </Field>
        <Field label="Kata sandi" htmlFor={`${uid}-password`}>
          <Input id={`${uid}-password`} name="password" type="password" autoComplete="current-password" required />
        </Field>
        <div className="-mt-2 text-right">
          <Link href="/lupa-password" className="text-sm font-medium text-accent hover:underline">
            Lupa kata sandi?
          </Link>
        </div>
        <Alert state={state} />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Memeriksa..." : "Masuk"}
          {!pending ? <Icon name="arrow-right" className="size-4" /> : null}
        </Button>
      </form>
      {/* Outside the login <form>: nested forms are invalid and would also fire the login submit. */}
      {state.unverifiedEmail ? <ResendVerification email={state.unverifiedEmail} next={next} /> : null}
      <p className="mt-6 text-center text-sm text-muted">
        Belum punya akun?{" "}
        {onSwitchToRegister ? (
          <button type="button" onClick={onSwitchToRegister} className="font-semibold text-accent hover:underline">
            Daftar
          </button>
        ) : (
          <Link href={`/daftar${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-accent hover:underline">
            Daftar
          </Link>
        )}
      </p>
    </div>
  );
}

export function RegisterForm({
  next,
  onSwitchToLogin,
}: {
  next?: string;
  onSwitchToLogin?: () => void;
}) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const { state, pending, onSubmit } = useFormAction(register, idle);
  const e = state.errors ?? {};
  const err = (k: string) => (e[k] ? `${id(k)}-error` : undefined);

  if (state.status === "ok") {
    return (
      <div role="status" className="py-4 text-center">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-leaf-50 text-leaf">
          <Icon name="mail" className="size-6" />
        </span>
        <h3 className="mt-4 font-serif text-3xl tracking-tight">Cek email Anda.</h3>
        <p className="mx-auto mt-2 max-w-sm text-muted">
          Kami mengirim tautan verifikasi{state.email ? <> ke <strong className="text-ink">{state.email}</strong></> : null}.
          Klik tautan itu untuk mengaktifkan akun dan langsung masuk.
        </p>
        {state.email ? <ResendVerification email={state.email} next={next} /> : null}
      </div>
    );
  }

  return (
    <div>
      <GoogleButton next={next} />
      <form noValidate onSubmit={onSubmit} className="space-y-4">
        <SpamGuard />
        {next ? <input type="hidden" name="next" value={next} /> : null}
        <Field label="Nama lengkap" htmlFor={id("name")} error={e.name}>
          <Input id={id("name")} name="name" autoComplete="name" required aria-invalid={!!e.name} aria-describedby={err("name")} />
        </Field>
        <Field label="Nama perusahaan" htmlFor={id("company")} error={e.company} hint='Boleh "Perorangan".'>
          <Input id={id("company")} name="company" autoComplete="organization" required aria-invalid={!!e.company} aria-describedby={e.company ? err("company") : `${id("company")}-hint`} />
        </Field>
        <Field label="Nomor ponsel" htmlFor={id("phone")} error={e.phone} hint="Format Indonesia, dipakai untuk WhatsApp. Tidak ditampilkan publik.">
          <Input id={id("phone")} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0812..." required aria-invalid={!!e.phone} aria-describedby={e.phone ? err("phone") : `${id("phone")}-hint`} />
        </Field>
        <Field label="Email" htmlFor={id("email")} error={e.email}>
          <Input id={id("email")} name="email" type="email" autoComplete="email" required aria-invalid={!!e.email} aria-describedby={err("email")} />
        </Field>
        <Field label="Kata sandi" htmlFor={id("password")} error={e.password} hint="Minimal 8 karakter.">
          <Input id={id("password")} name="password" type="password" autoComplete="new-password" required aria-invalid={!!e.password} aria-describedby={e.password ? err("password") : `${id("password")}-hint`} />
        </Field>
        <div>
          <label className="flex items-start gap-3 text-sm text-muted">
            <input type="checkbox" name="consent" required aria-invalid={!!e.consent} className="mt-1 size-4 shrink-0 rounded border-line accent-brand" />
            <span>
              Saya setuju dengan{" "}
              <Link href="/syarat" target="_blank" className="font-medium text-ink underline underline-offset-2">Syarat &amp; Ketentuan</Link>{" "}
              dan{" "}
              <Link href="/privasi" target="_blank" className="font-medium text-ink underline underline-offset-2">Kebijakan Privasi</Link>.
            </span>
          </label>
          {e.consent ? <p role="alert" className="mt-1.5 text-sm text-red-600">{e.consent}</p> : null}
        </div>
        <Alert state={state} />
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Mendaftarkan..." : "Daftar"}
          {!pending ? <Icon name="arrow-right" className="size-4" /> : null}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Sudah punya akun?{" "}
        {onSwitchToLogin ? (
          <button type="button" onClick={onSwitchToLogin} className="font-semibold text-accent hover:underline">Masuk</button>
        ) : (
          <Link href={`/masuk${next ? `?next=${encodeURIComponent(next)}` : ""}`} className="font-semibold text-accent hover:underline">Masuk</Link>
        )}
      </p>
    </div>
  );
}

export function ForgotForm() {
  const uid = useId();
  const { state, pending, onSubmit } = useFormAction(requestPasswordReset, idle);
  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <Field label="Email akun" htmlFor={`${uid}-email`} error={state.errors?.email}>
        <Input id={`${uid}-email`} name="email" type="email" autoComplete="email" required />
      </Field>
      <Alert state={state} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Mengirim..." : "Kirim tautan atur ulang"}
      </Button>
    </form>
  );
}

export function ResetForm({ token }: { token: string }) {
  const uid = useId();
  const { state, pending, onSubmit } = useFormAction(resetPassword, idle);
  useRedirectOnOk(state);
  const e = state.errors ?? {};
  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <Field label="Kata sandi baru" htmlFor={`${uid}-p`} error={e.password} hint="Minimal 8 karakter.">
        <Input id={`${uid}-p`} name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Field label="Ulangi kata sandi" htmlFor={`${uid}-c`} error={e.confirm}>
        <Input id={`${uid}-c`} name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <Alert state={state} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Menyimpan..." : "Simpan kata sandi"}
      </Button>
    </form>
  );
}

export function ProfileForm({ user }: { user: { name: string; company: string; phone: string; email: string } }) {
  const uid = useId();
  const { state, pending, onSubmit } = useFormAction(updateProfile, idle);
  const e = state.errors ?? {};
  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      <Field label="Email" htmlFor={`${uid}-email`} hint="Email tidak bisa diubah dan tidak pernah ditampilkan publik.">
        <Input id={`${uid}-email`} value={user.email} readOnly disabled />
      </Field>
      <Field label="Nama lengkap" htmlFor={`${uid}-name`} error={e.name}>
        <Input id={`${uid}-name`} name="name" defaultValue={user.name} autoComplete="name" required />
      </Field>
      <Field label="Nama perusahaan" htmlFor={`${uid}-company`} error={e.company}>
        <Input id={`${uid}-company`} name="company" defaultValue={user.company} autoComplete="organization" required />
      </Field>
      <Field label="Nomor ponsel" htmlFor={`${uid}-phone`} error={e.phone}>
        <Input id={`${uid}-phone`} name="phone" type="tel" defaultValue={user.phone} autoComplete="tel" required />
      </Field>
      <Alert state={state} />
      <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan perubahan"}</Button>
    </form>
  );
}

export function PasswordForm({ hasPassword }: { hasPassword: boolean }) {
  const uid = useId();
  const { state, pending, onSubmit } = useFormAction(changePassword, idle);
  const e = state.errors ?? {};
  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {hasPassword ? (
        <Field label="Kata sandi saat ini" htmlFor={`${uid}-cur`} error={e.current}>
          <Input id={`${uid}-cur`} name="current" type="password" autoComplete="current-password" required />
        </Field>
      ) : (
        <p className="text-sm text-muted">Akun ini masuk lewat Google. Buat kata sandi jika ingin bisa masuk dengan email juga.</p>
      )}
      <Field label="Kata sandi baru" htmlFor={`${uid}-new`} error={e.password} hint="Minimal 8 karakter.">
        <Input id={`${uid}-new`} name="password" type="password" autoComplete="new-password" required />
      </Field>
      <Field label="Ulangi kata sandi baru" htmlFor={`${uid}-conf`} error={e.confirm}>
        <Input id={`${uid}-conf`} name="confirm" type="password" autoComplete="new-password" required />
      </Field>
      <Alert state={state} />
      <Button type="submit" variant="secondary" disabled={pending}>{pending ? "Menyimpan..." : "Ubah kata sandi"}</Button>
    </form>
  );
}

export function CompleteProfileForm({ next, defaults }: { next?: string; defaults: { company: string; phone: string } }) {
  const uid = useId();
  const { state, pending, onSubmit } = useFormAction(completeProfile, idle);
  useRedirectOnOk(state);
  const e = state.errors ?? {};
  return (
    <form noValidate onSubmit={onSubmit} className="space-y-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}
      <Field label="Nama perusahaan" htmlFor={`${uid}-company`} error={e.company} hint='Boleh "Perorangan".'>
        <Input id={`${uid}-company`} name="company" defaultValue={defaults.company} autoComplete="organization" required />
      </Field>
      <Field label="Nomor ponsel" htmlFor={`${uid}-phone`} error={e.phone} hint="Format Indonesia, dipakai untuk WhatsApp.">
        <Input id={`${uid}-phone`} name="phone" type="tel" defaultValue={defaults.phone} autoComplete="tel" placeholder="0812..." required />
      </Field>
      <Alert state={state} />
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Menyimpan..." : "Lanjutkan"}
        {!pending ? <Icon name="arrow-right" className="size-4" /> : null}
      </Button>
    </form>
  );
}
