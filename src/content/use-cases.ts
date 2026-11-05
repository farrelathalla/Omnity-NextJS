import type { IconName } from "@/components/icon";

export type UseCase = {
  title: string;
  icon: IconName;
  problem: string;
  solution: string;
  outcome: string;
};

/**
 * Illustrative scenarios, NOT client case studies: no figures are claimed.
 * Real studies with numbers are supplied by the client (docs/CONTENT_TODO.md).
 */
export const useCases: UseCase[] = [
  {
    title: "Chatbot layanan pelanggan",
    icon: "message",
    problem:
      "Tim layanan kewalahan menjawab pertanyaan yang sama berulang kali, terutama di luar jam kerja.",
    solution:
      "Asisten AI yang menjawab pertanyaan umum dari dokumen dan FAQ perusahaan, lalu meneruskan kasus rumit ke staf.",
    outcome: "Respons lebih cepat, dan tim fokus ke kasus yang butuh penanganan manusia.",
  },
  {
    title: "Otomasi dokumen HR",
    icon: "file-text",
    problem:
      "Kontrak, surat, dan formulir karyawan disusun manual, rawan salah dan memakan waktu.",
    solution:
      "Dokumen dibuat dan dirutekan otomatis dari data karyawan, terhubung ke alur persetujuan di Omnidoc.",
    outcome: "Dokumen konsisten, jejak persetujuan jelas, dan beban administrasi HR berkurang.",
  },
  {
    title: "Deteksi anomali transaksi",
    icon: "shield-check",
    problem: "Transaksi mencurigakan baru ketahuan setelah rekonsiliasi akhir periode.",
    solution:
      "Model analitik memantau pola transaksi dan menandai yang menyimpang secara real-time untuk ditinjau.",
    outcome: "Risiko terdeteksi lebih awal, dengan peringatan yang bisa ditindaklanjuti tim.",
  },
];
