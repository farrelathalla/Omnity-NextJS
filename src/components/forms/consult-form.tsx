"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useId, useState } from "react";
import { submitInquiry, type InquiryState } from "@/app/actions/inquiry";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { topics } from "@/content/topics";

const initial: InquiryState = { status: "idle" };

/**
 * Consultation form. Protected by a honeypot field and a fill-time check, rate
 * limited per IP on the server, and stored before any email is sent.
 */
export function ConsultForm({
  defaultTopic = "umum",
  defaultMessage = "",
  source,
  className,
}: {
  defaultTopic?: string;
  defaultMessage?: string;
  /** page path stored with the request, e.g. "/layanan/network" */
  source: string;
  className?: string;
}) {
  const uid = useId();
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const [startedAt, setStartedAt] = useState(0);
  const errors = state.errors ?? {};
  const id = (n: string) => `${uid}-${n}`;

  // Fill-time check: stamped on the client (a cached page cannot fake it). Controlled on
  // purpose: React resets uncontrolled hidden inputs after a server round trip.
  useEffect(() => {
    const id = requestAnimationFrame(() => setStartedAt(Date.now()));
    return () => cancelAnimationFrame(id);
  }, []);

  if (state.status === "ok") {
    return (
      <div
        role="status"
        className="flex flex-col items-start gap-4 rounded-card border border-line bg-surface p-8 shadow-card"
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-leaf-50 text-leaf">
          <Icon name="check" className="size-6" />
        </span>
        <h3 className="font-serif text-3xl tracking-tight">Permintaan terkirim.</h3>
        <p className="max-w-md text-muted">{state.message}</p>
        <Link href="/" className="text-sm font-semibold text-accent hover:underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

  return (
    <form
      // Not `action={...}`: React 19 would reset every field after the action, wiping
      // what the visitor typed whenever validation fails.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      noValidate
      className={className}
      aria-describedby={state.status === "error" ? id("status") : undefined}
    >
      {/* honeypot + fill-time stamp */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <input type="hidden" name="t" value={startedAt} readOnly />
      <input type="hidden" name="source" value={source} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nama lengkap" htmlFor={id("name")} error={errors.name}>
          <Input
            id={id("name")}
            name="name"
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? `${id("name")}-error` : undefined}
          />
        </Field>
        <Field label="Email" htmlFor={id("email")} error={errors.email}>
          <Input
            id={id("email")}
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${id("email")}-error` : undefined}
          />
        </Field>
        <Field label="Perusahaan (opsional)" htmlFor={id("company")}>
          <Input id={id("company")} name="company" autoComplete="organization" />
        </Field>
        <Field
          label="Ponsel / WhatsApp (opsional)"
          htmlFor={id("phone")}
          error={errors.phone}
          hint="Format Indonesia, mis. 0812xxxxxxxx"
        >
          <Input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={!!errors.phone}
            aria-describedby={`${id("phone")}-${errors.phone ? "error" : "hint"}`}
          />
        </Field>
        <Field label="Topik" htmlFor={id("topic")} className="sm:col-span-2">
          <div className="relative">
            <Select id={id("topic")} name="topic" defaultValue={defaultTopic}>
              {topics.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </Select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted"
            />
          </div>
        </Field>
        <Field label="Ceritakan kebutuhan Anda" htmlFor={id("message")} error={errors.message} className="sm:col-span-2">
          <Textarea
            id={id("message")}
            name="message"
            defaultValue={defaultMessage}
            rows={5}
            required
            aria-invalid={!!errors.message}
            aria-describedby={errors.message ? `${id("message")}-error` : undefined}
          />
        </Field>
      </div>

      <div className="mt-5">
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={!!errors.consent}
            className="mt-1 size-4 shrink-0 rounded border-line accent-brand"
          />
          <span>
            Saya setuju data saya diproses sesuai{" "}
            <Link href="/privasi" className="font-medium text-ink underline underline-offset-2">
              Kebijakan Privasi
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p role="alert" className="mt-1.5 text-sm text-red-600">
            {errors.consent}
          </p>
        ) : null}
      </div>

      {state.status === "error" && state.message ? (
        <p
          id={id("status")}
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.message}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full sm:w-auto" disabled={pending}>
        {pending ? "Mengirim..." : "Kirim permintaan"}
        {!pending ? <Icon name="arrow-right" className="size-4" /> : null}
      </Button>
    </form>
  );
}
