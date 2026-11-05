"use client";

import { deleteDraft } from "@/app/actions/projects";

/** Deleting a draft asks for confirmation first. */
export function DeleteDraftButton({ id }: { id: string }) {
  return (
    <form
      action={deleteDraft}
      onSubmit={(e) => {
        if (!window.confirm("Hapus draf survei ini? Tindakan ini tidak bisa dibatalkan.")) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-sm font-medium text-red-600 hover:underline">
        Hapus
      </button>
    </form>
  );
}
