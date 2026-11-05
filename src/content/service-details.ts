/** Long-form copy for /layanan/[slug]: who it is for, deliverables, process, FAQ. */

export type ServiceDetail = {
  intro: string;
  forWho: string[];
  deliverables: string[];
  process: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

const consultFaq = {
  q: "Bagaimana memulainya?",
  a: "Isi form konsultasi di halaman ini. Tim kami membalas lewat email untuk menjadwalkan sesi awal dan memahami kebutuhan Anda.",
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "konsultasi-it": {
    intro:
      "Teknologi yang tepat dimulai dari pertanyaan yang tepat. Kami membantu Anda menerjemahkan tujuan bisnis menjadi rencana teknologi yang realistis, dengan prioritas dan perkiraan biaya yang jelas.",
    forWho: ["Bisnis yang akan membangun atau memodernisasi sistem", "Tim yang ragu memilih antara membangun, membeli, atau mengintegrasikan", "Manajemen yang butuh pandangan independen sebelum berinvestasi"],
    deliverables: ["Peta jalan teknologi", "Rekomendasi arsitektur dan pemilihan vendor", "Estimasi biaya dan urutan prioritas", "Ringkasan eksekutif untuk pengambilan keputusan"],
    process: [
      { title: "Pemetaan", text: "Memahami tujuan bisnis, proses berjalan, dan sistem yang sudah ada." },
      { title: "Asesmen", text: "Menilai opsi teknologi, risiko, dan kesiapan tim." },
      { title: "Rekomendasi", text: "Menyusun rencana, prioritas, dan estimasi biaya." },
      { title: "Pendampingan", text: "Mendampingi pengambilan keputusan dan tahap awal pelaksanaan." },
    ],
    faqs: [
      { q: "Apakah konsultasi harus berlanjut ke pengembangan?", a: "Tidak. Rekomendasi bisa Anda jalankan sendiri, dengan vendor lain, atau bersama Omnity." },
      consultFaq,
    ],
  },
  "audit-it-keamanan": {
    intro:
      "Kami memeriksa sistem, jaringan, dan proses Anda untuk menemukan celah keamanan dan inefisiensi, lalu menyusun rekomendasi yang bisa langsung dikerjakan, diurutkan dari yang paling berisiko.",
    forWho: ["Perusahaan yang menangani data pelanggan atau transaksi", "Bisnis yang akan memenuhi persyaratan audit atau kepatuhan", "Tim IT yang ingin pandangan pihak ketiga"],
    deliverables: ["Laporan temuan berprioritas", "Rekomendasi perbaikan yang spesifik", "Ringkasan untuk manajemen", "Sesi pemaparan dan tanya-jawab"],
    process: [
      { title: "Penentuan ruang lingkup", text: "Menyepakati sistem, proses, dan batasan yang diperiksa." },
      { title: "Pemeriksaan", text: "Menilai konfigurasi, akses, jaringan, dan praktik operasional." },
      { title: "Pelaporan", text: "Merangkum temuan berdasarkan tingkat risiko dan dampak." },
      { title: "Tindak lanjut", text: "Membahas rencana perbaikan dan mendampingi pelaksanaannya bila diperlukan." },
    ],
    faqs: [
      { q: "Apakah audit mengganggu operasional?", a: "Ruang lingkup dan waktu pemeriksaan disepakati lebih dulu agar operasional tetap berjalan." },
      consultFaq,
    ],
  },
  solutioning: {
    intro:
      "Dari masalah bisnis sampai rancangan solusi end-to-end. Kami merancang proses, sistem, dan integrasinya sebagai satu kesatuan, lalu memvalidasinya lewat prototipe sebelum Anda berkomitmen penuh.",
    forWho: ["Bisnis dengan masalah lintas sistem atau lintas divisi", "Tim yang punya kebutuhan tetapi belum punya rancangan solusi", "Proyek yang membutuhkan integrasi beberapa produk"],
    deliverables: ["Rancangan solusi end-to-end", "Prototipe atau proof of concept", "Rencana implementasi bertahap", "Estimasi sumber daya dan waktu"],
    process: [
      { title: "Memahami masalah", text: "Mengurai masalah bisnis dan kendala yang ada." },
      { title: "Merancang", text: "Menyusun alur, arsitektur, dan integrasi yang dibutuhkan." },
      { title: "Memvalidasi", text: "Membuat prototipe untuk menguji asumsi lebih awal." },
      { title: "Merencanakan", text: "Menyusun tahapan implementasi yang bisa dijalankan." },
    ],
    faqs: [
      { q: "Apa bedanya dengan konsultasi IT?", a: "Konsultasi menjawab arah dan prioritas. Solutioning masuk lebih dalam: merancang solusi lengkap dan memvalidasinya lewat prototipe." },
      consultFaq,
    ],
  },
  "software-dev-integrasi": {
    intro:
      "Aplikasi web, mobile, dan sistem enterprise yang dibangun sesuai kebutuhan, serta integrasi dengan sistem yang sudah Anda pakai, dari pembayaran sampai HR dan inventori.",
    forWho: ["Bisnis yang membutuhkan aplikasi yang tidak tersedia di pasaran", "Tim yang ingin menghubungkan beberapa sistem", "Perusahaan yang ingin mengganti sistem lama secara bertahap"],
    deliverables: ["Aplikasi web dan/atau mobile", "Integrasi API dan sistem lama", "Pengujian dan dokumentasi", "Serah terima dan pendampingan"],
    process: [
      { title: "Spesifikasi", text: "Menyepakati kebutuhan, alur, dan prioritas fitur." },
      { title: "Desain", text: "Merancang antarmuka dan arsitektur teknis." },
      { title: "Pengembangan", text: "Membangun dalam iterasi pendek dengan demo berkala." },
      { title: "Peluncuran", text: "Menguji, meluncurkan, dan mendampingi masa awal pemakaian." },
    ],
    faqs: [
      { q: "Apakah kode sumber diserahkan?", a: "Hal ini disepakati di awal proyek dan dituangkan dalam penawaran." },
      consultFaq,
    ],
  },
  "managed-it": {
    intro:
      "Kami menjaga infrastruktur Anda tetap sehat: pemantauan, pengelolaan server, backup, dan pembaruan keamanan secara berkala, sehingga tim Anda fokus pada bisnis.",
    forWho: ["Bisnis tanpa tim IT internal", "Tim IT kecil yang kewalahan", "Perusahaan yang ingin infrastruktur lebih andal"],
    deliverables: ["Pemantauan sistem berkelanjutan", "Pengelolaan server", "Backup dan pemulihan", "Pembaruan dan patch keamanan"],
    process: [
      { title: "Inventarisasi", text: "Mendata server, jaringan, dan layanan yang dikelola." },
      { title: "Penyiapan", text: "Memasang pemantauan, backup, dan prosedur dasar." },
      { title: "Operasional", text: "Memantau, memelihara, dan menangani insiden." },
      { title: "Peninjauan", text: "Melaporkan kondisi dan merekomendasikan perbaikan berkala." },
    ],
    faqs: [
      { q: "Apa saja yang dikelola?", a: "Cakupan disesuaikan: server, jaringan, backup, dan pembaruan keamanan. Rinciannya dituangkan dalam penawaran." },
      consultFaq,
    ],
  },
  network: {
    intro:
      "Desain, instalasi, dan pemeliharaan jaringan kantor maupun multi-lokasi yang stabil dan aman, termasuk pemecahan masalah saat ada gangguan.",
    forWho: ["Kantor baru atau yang berpindah lokasi", "Bisnis multi-cabang", "Perusahaan dengan jaringan yang sering bermasalah"],
    deliverables: ["Survei dan desain jaringan", "Instalasi dan konfigurasi", "Dokumentasi topologi", "Pemeliharaan dan troubleshooting"],
    process: [
      { title: "Survei", text: "Mengukur kebutuhan dan kondisi lokasi." },
      { title: "Desain", text: "Merancang topologi, perangkat, dan pengamanan." },
      { title: "Instalasi", text: "Memasang dan mengonfigurasi perangkat." },
      { title: "Pemeliharaan", text: "Memantau dan memperbaiki bila ada gangguan." },
    ],
    faqs: [
      { q: "Apakah melayani lebih dari satu lokasi?", a: "Ya, jaringan multi-lokasi dapat dirancang dan dikelola sebagai satu kesatuan." },
      consultFaq,
    ],
  },
  "pembuatan-website": {
    intro:
      "Website company profile, toko online, hingga portal bisnis. Prosesnya dimulai dari survei singkat lewat Design Anything: Anda melihat mockup-nya lebih dulu, baru memutuskan.",
    forWho: ["UMKM dan bisnis baru yang butuh website cepat", "Perusahaan yang ingin merombak website lama", "Siapa pun yang ingin melihat gambaran sebelum membayar"],
    deliverables: ["Mockup desain sesuai survei", "Website responsif dan cepat", "Domain dan hosting (opsional)", "Panduan pengelolaan konten"],
    process: [
      { title: "Isi survei", text: "Ceritakan bisnis, tujuan, dan referensi Anda." },
      { title: "Terima mockup", text: "Tim kami menyiapkan mockup sesuai survei." },
      { title: "Setujui penawaran", text: "Lihat cakupan, biaya, dan estimasi waktu." },
      { title: "Website dibangun", text: "Pengerjaan dimulai setelah Anda setuju." },
    ],
    faqs: [
      { q: "Apakah domain dan hosting bisa dibantu?", a: "Bisa, sebagai tambahan opsional di dalam penawaran." },
      { q: "Bagaimana memulainya?", a: "Mulai dari Design Anything: isi survei singkat dan tim kami menyiapkan mockup-nya." },
    ],
  },
};
