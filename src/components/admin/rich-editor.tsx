"use client";

import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

async function uploadImage(file: File, kind: "cover" | "inline") {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("kind", kind);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = (await res.json().catch(() => ({}))) as { url?: string; path?: string; error?: string };
  if (!res.ok || !json.url) throw new Error(json.error ?? "Gagal mengunggah gambar.");
  return json as { url: string; path: string };
}
export { uploadImage };

function ToolButton({
  label,
  title,
  active,
  onClick,
  disabled,
}: {
  label: string;
  title: string;
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm font-medium transition-colors disabled:opacity-40",
        active ? "bg-ink text-white" : "text-ink/75 hover:bg-ink/5 hover:text-ink",
      )}
    >
      {label}
    </button>
  );
}

/** WordPress-like editor (Tiptap): headings, lists, quote, links, and inline images. */
export function RichEditor({
  value,
  onChange,
  invalid,
}: {
  value: string;
  onChange: (html: string) => void;
  invalid?: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const editor = useEditor({
    immediatelyRender: false, // avoid SSR/hydration mismatch
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: { openOnClick: false } }),
      Image.configure({ HTMLAttributes: { loading: "lazy" } }),
      Placeholder.configure({ placeholder: "Mulai menulis artikel..." }),
    ],
    content: value,
    onUpdate: ({ editor: e }) => onChange(e.isEmpty ? "" : e.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose-editor min-h-[22rem] px-5 py-4 text-[1.02rem] leading-[1.8] outline-none focus:outline-none",
        "aria-label": "Isi artikel",
      },
    },
  });

  if (!editor) {
    return <div className="min-h-[26rem] rounded-xl border border-line bg-surface" aria-busy="true" />;
  }
  const chain = () => editor.chain().focus();

  async function onPickImage(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { url } = await uploadImage(file, "inline");
      const alt = window.prompt("Teks alternatif gambar (untuk aksesibilitas), boleh dikosongkan:") ?? "";
      chain().setImage({ src: url, alt }).run();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal mengunggah gambar.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function setLink() {
    const prev = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Alamat tautan (https://...). Kosongkan untuk menghapus tautan.", prev ?? "https://");
    if (url === null) return;
    if (url.trim() === "" || url.trim() === "https://") {
      chain().unsetLink().run();
      return;
    }
    chain().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border bg-surface transition-shadow focus-within:ring-4 focus-within:ring-ink/5",
        invalid ? "border-red-500" : "border-line",
      )}
    >
      <div
        role="toolbar"
        aria-label="Format teks"
        className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-line bg-sand/90 px-2 py-1.5 backdrop-blur"
      >
        <ToolButton label="H2" title="Judul bagian" active={editor.isActive("heading", { level: 2 })} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
        <ToolButton label="H3" title="Sub-judul" active={editor.isActive("heading", { level: 3 })} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        <ToolButton label="B" title="Tebal" active={editor.isActive("bold")} onClick={() => chain().toggleBold().run()} />
        <ToolButton label="I" title="Miring" active={editor.isActive("italic")} onClick={() => chain().toggleItalic().run()} />
        <ToolButton label="U" title="Garis bawah" active={editor.isActive("underline")} onClick={() => chain().toggleUnderline().run()} />
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        <ToolButton label="• Daftar" title="Daftar poin" active={editor.isActive("bulletList")} onClick={() => chain().toggleBulletList().run()} />
        <ToolButton label="1. Daftar" title="Daftar nomor" active={editor.isActive("orderedList")} onClick={() => chain().toggleOrderedList().run()} />
        <ToolButton label="Kutipan" title="Kutipan" active={editor.isActive("blockquote")} onClick={() => chain().toggleBlockquote().run()} />
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        <ToolButton label="Tautan" title="Sisipkan tautan" active={editor.isActive("link")} onClick={setLink} />
        <ToolButton label={busy ? "Mengunggah..." : "Foto"} title="Sisipkan foto" disabled={busy} onClick={() => fileRef.current?.click()} />
        <span className="mx-1 h-5 w-px bg-line" aria-hidden="true" />
        <ToolButton label="Urungkan" title="Urungkan" disabled={!editor.can().undo()} onClick={() => chain().undo().run()} />
        <ToolButton label="Ulangi" title="Ulangi" disabled={!editor.can().redo()} onClick={() => chain().redo().run()} />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          className="hidden"
          onChange={(e) => onPickImage(e.target.files?.[0])}
        />
      </div>
      <EditorContent
        editor={editor}
        className={cn(
          "[&_.ProseMirror_h2]:mb-3 [&_.ProseMirror_h2]:mt-8 [&_.ProseMirror_h2]:font-serif [&_.ProseMirror_h2]:text-3xl [&_.ProseMirror_h2]:leading-tight",
          "[&_.ProseMirror_h3]:mb-2 [&_.ProseMirror_h3]:mt-6 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold",
          "[&_.ProseMirror_p]:my-3 [&_.ProseMirror_ul]:my-3 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-6 [&_.ProseMirror_ol]:my-3 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-6",
          "[&_.ProseMirror_a]:text-accent [&_.ProseMirror_a]:underline",
          "[&_.ProseMirror_blockquote]:my-5 [&_.ProseMirror_blockquote]:border-l-2 [&_.ProseMirror_blockquote]:border-brand [&_.ProseMirror_blockquote]:pl-5 [&_.ProseMirror_blockquote]:font-serif [&_.ProseMirror_blockquote]:text-2xl [&_.ProseMirror_blockquote]:italic",
          "[&_.ProseMirror_img]:my-5 [&_.ProseMirror_img]:h-auto [&_.ProseMirror_img]:max-w-full [&_.ProseMirror_img]:rounded-xl",
          "[&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0 [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-muted [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
        )}
      />
      {error ? (
        <p role="alert" className="border-t border-line bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
