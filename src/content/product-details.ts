/**
 * Long-form copy for /produk/[slug] (brief chapter 10 template):
 * problem, features, use cases, integrations/certifications, FAQ.
 * Rewritten from the old site descriptions; no figures are claimed.
 */

export type ProductDetail = {
  problem: string;
  features: { title: string; text: string }[];
  useCases: { title: string; text: string }[];
  /** supported channels / partners, shown as chips */
  integrations?: string[];
  certifications?: string[];
  faqs: { q: string; a: string }[];
};

const demoFaq = (name: string) => ({
  q: `Bagaimana cara mencoba ${name}?`,
  a: `Klik "Minta demo" dan ceritakan kebutuhan Anda. Tim Omnity akan menghubungi Anda untuk menjadwalkan demo dan membahas kecocokannya dengan bisnis Anda.`,
});

export const productDetails: Record<string, ProductDetail> = {
  omnipay: {
    problem:
      "Bisnis yang menerima pembayaran sering memakai penyedia yang terpisah untuk kartu, QRIS, dan e-wallet, dengan laporan yang tidak menyatu dan proses rekonsiliasi yang melelahkan.",
    features: [
      { title: "Kartu dan contactless", text: "Terima kartu debit dan kredit, termasuk pembayaran contactless yang cepat di kasir." },
      { title: "QRIS dan e-wallet", text: "Satu kode untuk banyak dompet digital, tanpa menempel banyak QR di meja kasir." },
      { title: "Standar keamanan PCI DSS", text: "Pemrosesan pembayaran mengikuti standar keamanan industri kartu pembayaran." },
      { title: "Laporan terpusat", text: "Pantau transaksi dari berbagai metode pembayaran dalam satu tampilan." },
    ],
    useCases: [
      { title: "Toko dan kafe", text: "Kasir menerima semua metode pembayaran populer dari satu perangkat, antrean tetap lancar." },
      { title: "Bisnis jasa", text: "Tagihan dan pembayaran pelanggan tercatat rapi tanpa input manual." },
    ],
    integrations: ["Visa", "Mastercard", "JCB", "UnionPay", "GPN", "QRIS", "GoPay", "OVO", "ShopeePay", "DANA", "LinkAja"],
    certifications: ["PCI DSS"],
    faqs: [
      { q: "Metode pembayaran apa saja yang didukung?", a: "Kartu debit dan kredit (termasuk contactless), QRIS, dan berbagai e-wallet. Daftar lengkap yang aktif untuk bisnis Anda dikonfirmasi saat demo." },
      { q: "Apakah OmniPay aman?", a: "OmniPay dibangun mengikuti standar keamanan PCI DSS untuk pemrosesan data kartu." },
      demoFaq("OmniPay"),
    ],
  },
  omnidoc: {
    problem:
      "Administrasi HR yang bertumpu pada spreadsheet dan kertas menyita waktu, rawan salah, dan menyulitkan manajemen mengambil keputusan berbasis data.",
    features: [
      { title: "Otomasi proses HR", text: "Proses HR harian berjalan otomatis sehingga tim bisa fokus pada hal yang strategis." },
      { title: "Mobile-first", text: "Dirancang untuk dipakai dari ponsel, oleh karyawan maupun tim HR." },
      { title: "Insight yang bisa ditindaklanjuti", text: "Data SDM diolah menjadi gambaran yang membantu membangun tempat kerja yang lebih baik." },
      { title: "Interaksi yang lebih sederhana", text: "Pengajuan dan persetujuan antara karyawan dan HR menjadi lebih ringkas." },
    ],
    useCases: [
      { title: "Perusahaan multi-lokasi", text: "Satu sistem HR untuk karyawan di berbagai kantor dan lapangan." },
      { title: "Tim HR yang ingin lebih strategis", text: "Kurangi pekerjaan administratif agar waktu beralih ke pengembangan SDM." },
    ],
    faqs: [
      { q: "Untuk perusahaan seperti apa Omnidoc cocok?", a: "Omnidoc dirancang untuk kebutuhan enterprise, tetapi cakupan modul disesuaikan dengan skala dan proses HR Anda." },
      { q: "Apakah bisa dipakai dari ponsel?", a: "Ya. Omnidoc dibangun dengan pendekatan mobile-first." },
      demoFaq("Omnidoc"),
    ],
  },
  omnicard: {
    problem:
      "Mengelola kartu prabayar tanpa laporan dan pemantauan yang jelas membuat pengawasan transaksi dan pengguna menjadi sulit.",
    features: [
      { title: "Laporan transaksi", text: "Riwayat transaksi tercatat dan bisa ditelusuri kapan saja." },
      { title: "Monitoring real-time", text: "Pantau aktivitas kartu saat itu juga, bukan menunggu laporan akhir periode." },
      { title: "Manajemen pengguna", text: "Atur siapa memegang kartu dan hak aksesnya dari satu panel." },
      { title: "Laporan layanan", text: "Ringkasan layanan untuk evaluasi dan penagihan." },
    ],
    useCases: [
      { title: "Program kartu perusahaan", text: "Kartu prabayar untuk operasional atau tunjangan dengan kontrol yang jelas." },
      { title: "Ekosistem tertutup", text: "Kartu untuk kampus, kawasan, atau komunitas dengan pelaporan terpusat." },
    ],
    faqs: [
      { q: "Apa itu sistem kartu prabayar OmniCard?", a: "Sistem untuk menerbitkan dan mengelola kartu prabayar, lengkap dengan pelaporan transaksi, pemantauan real-time, dan manajemen pengguna." },
      demoFaq("OmniCard"),
    ],
  },
  omniassettracker: {
    problem:
      "Pengajuan dan persetujuan dokumen atau aset yang berpindah dari meja ke meja membuat proses lambat dan sulit dilacak.",
    features: [
      { title: "Persiapan hingga persetujuan", text: "Siapkan, ajukan, dan setujui dokumen atau aset dalam satu alur yang cepat." },
      { title: "Disposisi mudah", text: "Teruskan dokumen ke pihak yang tepat tanpa kehilangan jejak." },
      { title: "Kolaborasi dokumen", text: "Edit dokumen bersama secara kolaboratif, tidak lagi bolak-balik lampiran." },
      { title: "Fokus pada hal penting", text: "Tim tidak lagi tersita urusan administrasi yang berulang." },
    ],
    useCases: [
      { title: "Pengadaan dan persetujuan internal", text: "Permintaan dan persetujuan antar divisi tercatat lengkap." },
      { title: "Pengelolaan aset", text: "Siklus aset dari persiapan sampai disposisi bisa ditelusuri." },
    ],
    faqs: [
      { q: "Apa yang bisa dilakukan OmniAssetTracker?", a: "Mempercepat persiapan, pengajuan, dan persetujuan dokumen atau aset, termasuk disposisi dan kolaborasi penyuntingan dokumen." },
      demoFaq("OmniAssetTracker"),
    ],
  },
  omniwhere: {
    problem:
      "Tanpa pemantauan yang baik, armada kendaraan sulit diawasi: lokasi, penggunaan bahan bakar, dan kondisi di lapangan baru diketahui setelah ada masalah.",
    features: [
      { title: "Lokasi real-time", text: "Lihat posisi kendaraan secara langsung di peta." },
      { title: "Konektivitas", text: "Pantau status koneksi perangkat pada kendaraan." },
      { title: "Bahan bakar", text: "Awasi penggunaan bahan bakar untuk efisiensi operasional." },
      { title: "Rekaman suara", text: "Fitur rekaman suara tersedia sesuai model perangkat yang dipakai." },
    ],
    useCases: [
      { title: "Armada operasional", text: "Pantau kendaraan pengiriman atau layanan dari satu dashboard." },
      { title: "Kendaraan perusahaan", text: "Pastikan penggunaan kendaraan sesuai peruntukan." },
    ],
    faqs: [
      { q: "Fitur apa saja yang tersedia?", a: "Pemantauan lokasi, konektivitas, bahan bakar, dan rekaman suara. Ketersediaan sebagian fitur bergantung pada model perangkat yang terpasang." },
      demoFaq("OmniWHERE"),
    ],
  },
  omnipos: {
    problem:
      "Kasir yang berdiri sendiri membuat data penjualan, stok, dan pemasaran terpisah, sehingga keputusan bisnis diambil tanpa gambaran utuh.",
    features: [
      { title: "Penjualan dan kasir", text: "Kasir sederhana dan fleksibel yang bisa dikonfigurasi sesuai kebutuhan toko Anda." },
      { title: "Inventori", text: "Stok terhubung langsung dengan penjualan." },
      { title: "Marketing", text: "Data penjualan dipakai untuk mendukung promosi dan program pelanggan." },
      { title: "E-commerce", text: "Terhubung dengan toko online agar penjualan offline dan online menyatu." },
    ],
    useCases: [
      { title: "Toko ritel", text: "Satu sistem untuk kasir, stok, dan penjualan online." },
      { title: "Kafe dan restoran", text: "Pesanan, pembayaran, dan stok bahan tercatat tanpa input ganda." },
    ],
    faqs: [
      { q: "Apakah OmniPOS bisa disesuaikan?", a: "Ya, OmniPOS bisa dikonfigurasi sesuai kebutuhan spesifik toko Anda." },
      demoFaq("OmniPOS"),
    ],
  },
  omnitrans: {
    problem:
      "Transportasi publik membutuhkan banyak komponen yang harus bekerja serempak: sistem, perangkat, dan komunikasi. Bila terpisah, kualitas layanan sulit dijaga.",
    features: [
      { title: "Software terpadu", text: "Perangkat lunak untuk operasional dan layanan penumpang." },
      { title: "Hardware", text: "Perangkat keras yang terintegrasi dengan sistem." },
      { title: "Komunikasi", text: "Pertukaran data antara kendaraan, operator, dan penumpang." },
      { title: "Efisiensi, keselamatan, kualitas", text: "Dirancang untuk meningkatkan efisiensi, keselamatan, dan kualitas layanan secara keseluruhan." },
    ],
    useCases: [
      { title: "Operator transportasi", text: "Pantau dan kelola operasional layanan dari sisi operator." },
      { title: "Pengalaman penumpang", text: "Layanan yang lebih tertib dan informatif bagi penumpang." },
    ],
    faqs: [
      { q: "Apa cakupan OmniTRANS?", a: "Sistem transportasi publik terpadu yang mencakup software, hardware, dan komunikasi, untuk penumpang dan operator." },
      demoFaq("OmniTRANS"),
    ],
  },
  "solusi-ai": {
    problem:
      "Banyak bisnis tahu AI bisa membantu, tetapi belum jelas di bagian mana ia benar-benar berguna dan bagaimana memasangkannya ke sistem yang sudah berjalan.",
    features: [
      { title: "Chatbot dan asisten AI", text: "Asisten yang menjawab pertanyaan pelanggan atau karyawan dari pengetahuan perusahaan Anda." },
      { title: "Otomasi dokumen", text: "Dokumen dibaca, diklasifikasi, dan dirutekan otomatis." },
      { title: "Analitik dan prediksi", text: "Pola dalam data Anda diolah menjadi peringatan dan perkiraan yang bisa ditindaklanjuti." },
      { title: "Integrasi ke produk yang ada", text: "AI dipasang ke sistem yang sudah Anda pakai, termasuk produk Omnity." },
    ],
    useCases: [
      { title: "Layanan pelanggan", text: "Pertanyaan umum dijawab otomatis, kasus rumit diteruskan ke staf." },
      { title: "Operasional internal", text: "Dokumen HR dan administrasi diproses lebih cepat dan konsisten." },
      { title: "Keuangan dan risiko", text: "Transaksi yang menyimpang ditandai lebih awal untuk ditinjau." },
    ],
    faqs: [
      { q: "Bagaimana cara menentukan use case AI yang tepat?", a: "Kami mulai dari konsultasi: memetakan masalah, data yang tersedia, dan hasil yang ingin dicapai, lalu merekomendasikan solusi yang paling masuk akal." },
      { q: "Apakah data perusahaan saya aman?", a: "Penanganan data dibahas sejak awal dan disesuaikan dengan kebijakan keamanan serta regulasi yang berlaku untuk bisnis Anda." },
      demoFaq("Solusi AI"),
    ],
  },
};
