"use client";

import { deletePost } from "@/app/(admin)/admin/blog/actions";

/** Delete with a native confirmation, as the brief asks ("hapus dengan konfirmasi"). */
export function DeletePostButton({ id, title }: { id: number; title: string }) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (!window.confirm(`Hapus artikel "${title}"? Tindakan ini tidak bisa dibatalkan.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
        Hapus
      </button>
    </form>
  );
}
