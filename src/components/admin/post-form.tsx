"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useId, useRef, useState } from "react";
import { savePost, type SavePostState } from "@/app/(admin)/admin/blog/actions";
import { RichEditor, uploadImage } from "@/components/admin/rich-editor";
import { Button } from "@/components/ui/button";
import { Field, Input, Textarea } from "@/components/ui/form";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

type Mode = "draft" | "now" | "schedule";

export type PostFormInitial = {
  id?: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverPath: string | null;
  mode: Mode;
  /** ISO string of the (scheduled) publish time */
  publishedAt: string | null;
};

const initialState: SavePostState = {};

/** Date -> value for <input type="datetime-local"> in the admin's own timezone. */
function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function PostForm({ initial }: { initial: PostFormInitial }) {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;
  const [state, action, pending] = useActionState(savePost, initialState);
  const errors = state.errors ?? {};

  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const slugTouched = useRef(!!initial.slug);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [content, setContent] = useState(initial.content);
  const [cover, setCover] = useState(initial.coverPath);
  const [mode, setMode] = useState<Mode>(initial.mode);
  const [local, setLocal] = useState("");
  const [coverBusy, setCoverBusy] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [clientError, setClientError] = useState("");

  // Prefill the schedule picker in the browser's timezone (avoids an SSR mismatch).
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (initial.publishedAt && initial.mode === "schedule") setLocal(toLocalInput(initial.publishedAt));
    });
    return () => cancelAnimationFrame(frame);
  }, [initial.publishedAt, initial.mode]);

  async function onCover(file: File | undefined) {
    if (!file) return;
    setCoverBusy(true);
    setCoverError("");
    try {
      const { path } = await uploadImage(file, "cover");
      setCover(path);
    } catch (e) {
      setCoverError(e instanceof Error ? e.message : "Gagal mengunggah.");
    } finally {
      setCoverBusy(false);
    }
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setClientError("");
        const data = new FormData(e.currentTarget);
        if (mode === "schedule") {
          if (!local) {
            setClientError("Pilih tanggal dan jam terbit.");
            return;
          }
          data.set("publishAt", new Date(local).toISOString());
        }
        startTransition(() => action(data));
      }}
      className="grid gap-8 xl:grid-cols-[1fr_20rem]"
    >
      {initial.id ? <input type="hidden" name="id" value={initial.id} /> : null}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="coverPath" value={cover ?? ""} />

      <div className="min-w-0 space-y-6">
        <Field label="Judul" htmlFor={id("title")} error={errors.title}>
          <Input
            id={id("title")}
            name="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (!slugTouched.current) setSlug(slugify(e.target.value));
            }}
            className="h-14 font-serif text-2xl"
            placeholder="Judul artikel"
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? `${id("title")}-error` : undefined}
            required
          />
        </Field>

        <div>
          <span className="mb-1.5 block text-sm font-medium">Isi artikel</span>
          <RichEditor value={initial.content} onChange={setContent} invalid={!!errors.content} />
          {errors.content ? (
            <p role="alert" className="mt-1.5 text-sm text-red-600">
              {errors.content}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="space-y-6">
        <fieldset className="rounded-card border border-line bg-surface p-5">
          <legend className="px-1 text-sm font-semibold">Penerbitan</legend>
          <div className="mt-2 space-y-2.5">
            {(
              [
                ["draft", "Simpan sebagai draf"],
                ["now", "Terbitkan sekarang"],
                ["schedule", "Jadwalkan"],
              ] as [Mode, string][]
            ).map(([value, label]) => (
              <label key={value} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name="mode"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                  className="size-4 accent-brand"
                />
                {label}
              </label>
            ))}
          </div>
          {mode === "schedule" ? (
            <div className="mt-3">
              <label htmlFor={id("when")} className="mb-1.5 block text-sm font-medium">
                Waktu terbit
              </label>
              <Input
                id={id("when")}
                type="datetime-local"
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                aria-invalid={!!errors.publishAt || !!clientError}
              />
              {errors.publishAt || clientError ? (
                <p role="alert" className="mt-1.5 text-sm text-red-600">
                  {errors.publishAt ?? clientError}
                </p>
              ) : (
                <p className="mt-1.5 text-xs text-muted">Sesuai zona waktu perangkat Anda.</p>
              )}
            </div>
          ) : null}

          {state.message ? (
            <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {state.message}
            </p>
          ) : null}

          <Button type="submit" className="mt-5 w-full" disabled={pending}>
            {pending
              ? "Menyimpan..."
              : mode === "draft"
                ? "Simpan draf"
                : mode === "now"
                  ? "Terbitkan"
                  : "Jadwalkan"}
          </Button>
          {initial.id ? (
            <Link
              href={`/admin/blog/${initial.id}/preview`}
              target="_blank"
              className="mt-2 block text-center text-sm font-medium text-accent hover:underline"
            >
              Pratinjau versi tersimpan
            </Link>
          ) : null}
        </fieldset>

        <div className="rounded-card border border-line bg-surface p-5">
          <p className="text-sm font-semibold">Foto sampul</p>
          <p className="mt-0.5 text-xs text-muted">Dipotong otomatis 16:9 dan dikompres.</p>
          <div
            className={cn(
              "relative mt-3 aspect-video overflow-hidden rounded-lg border border-dashed border-line bg-sand",
              cover && "border-solid",
            )}
          >
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={`/uploads/${cover}`} alt="Sampul artikel" className="h-full w-full object-cover" />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                Belum ada foto
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center gap-3">
            <label
              className={cn(
                "inline-flex h-9 cursor-pointer items-center rounded-lg border border-line bg-surface px-3 text-sm font-medium hover:border-ink/30",
                coverBusy && "pointer-events-none opacity-60",
              )}
            >
              {coverBusy ? "Mengunggah..." : cover ? "Ganti" : "Unggah foto"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                className="sr-only"
                onChange={(e) => onCover(e.target.files?.[0])}
              />
            </label>
            {cover ? (
              <button type="button" onClick={() => setCover(null)} className="text-sm text-muted hover:text-ink">
                Hapus
              </button>
            ) : null}
          </div>
          {coverError ? (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {coverError}
            </p>
          ) : null}
        </div>

        <div className="rounded-card border border-line bg-surface p-5">
          <Field
            label="Alamat (slug)"
            htmlFor={id("slug")}
            error={errors.slug}
            hint="Dibuat otomatis dari judul, boleh diubah."
          >
            <Input
              id={id("slug")}
              name="slug"
              value={slug}
              onChange={(e) => {
                slugTouched.current = true;
                setSlug(slugify(e.target.value));
              }}
              placeholder="judul-artikel"
            />
          </Field>
          <Field
            label="Ringkasan (opsional)"
            htmlFor={id("excerpt")}
            error={errors.excerpt}
            hint="Kosongkan agar diambil otomatis dari paragraf pertama."
            className="mt-5"
          >
            <Textarea
              id={id("excerpt")}
              name="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              maxLength={400}
              className="min-h-20"
            />
          </Field>
        </div>
      </aside>
    </form>
  );
}
