import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { Container, Em, Section } from "@/components/ui/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description: "Bagaimana Omnity mengumpulkan, memakai, dan melindungi data pribadi Anda sesuai UU Pelindungan Data Pribadi.",
  alternates: { canonical: "/privasi" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        crumbs={[{ label: "Kebijakan Privasi", href: "/privasi" }]}
        title={
          <>
            Kebijakan <Em tone="ink">Privasi.</Em>
          </>
        }
        lead="Terakhir diperbarui: 5 November 2026."
      />
      <Section className="pt-0 sm:pt-0">
        <Container>
          <Prose>
            <p>
              {site.legalName} (&quot;Omnity&quot;, &quot;kami&quot;) menghargai privasi Anda. Kebijakan ini
              menjelaskan data pribadi apa yang kami kumpulkan lewat situs ini, untuk apa, dan hak Anda
              berdasarkan Undang-Undang Pelindungan Data Pribadi (UU PDP).
            </p>

            <h2>Data yang kami kumpulkan</h2>
            <ul>
              <li>
                <strong>Form konsultasi dan kontak:</strong> nama, email, perusahaan, nomor ponsel, dan isi
                pesan Anda.
              </li>
              <li>
                <strong>Akun dan Design Anything:</strong> nama lengkap, nama perusahaan, nomor ponsel, email,
                kata sandi (disimpan dalam bentuk hash), jawaban survei, dan file yang Anda unggah.
              </li>
              <li>
                <strong>Data teknis:</strong> alamat IP dan data perangkat dasar untuk keamanan dan pembatasan
                penyalahgunaan.
              </li>
            </ul>

            <h2>Untuk apa data dipakai</h2>
            <ul>
              <li>Membalas pertanyaan dan permintaan konsultasi Anda.</li>
              <li>Menyiapkan mockup, penawaran, dan menjalankan proyek yang Anda ajukan.</li>
              <li>Mengelola akun Anda dan mengirim notifikasi terkait proyek.</li>
              <li>Menjaga keamanan situs dan mencegah spam atau penyalahgunaan.</li>
            </ul>

            <h2>Dasar pemrosesan</h2>
            <p>
              Kami memproses data berdasarkan persetujuan Anda (misalnya saat mencentang persetujuan di form
              atau saat mendaftar) dan untuk melaksanakan permintaan Anda.
            </p>

            <h2>Berbagi data</h2>
            <p>
              Kami tidak menjual data pribadi Anda. Data hanya dapat diakses tim Omnity yang berkepentingan dan
              penyedia layanan yang membantu operasional (misalnya hosting dan pengiriman email), yang terikat
              kewajiban menjaga kerahasiaan. Kami juga dapat mengungkapkan data bila diwajibkan oleh hukum.
            </p>

            <h2>Penyimpanan dan keamanan</h2>
            <p>
              Data disimpan selama diperlukan untuk tujuan di atas atau selama diwajibkan hukum. Kami memakai
              langkah keamanan yang wajar, termasuk penyimpanan kata sandi dalam bentuk hash, pembatasan akses,
              dan pembatasan percobaan masuk. Email dan nomor ponsel Anda tidak pernah ditampilkan di profil
              publik.
            </p>

            <h2>Hak Anda</h2>
            <p>
              Anda berhak mengakses, memperbaiki, dan meminta penghapusan data Anda, serta menarik persetujuan
              kapan saja. Kirim permintaan ke{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> dan kami akan menanggapinya.
            </p>

            <h2>Cookie</h2>
            <p>
              Situs ini memakai cookie yang diperlukan untuk menjaga sesi masuk Anda. Bila kami mengaktifkan
              analitik, pengaturannya akan dijelaskan di sini.
            </p>

            <h2>Perubahan kebijakan</h2>
            <p>
              Kami dapat memperbarui kebijakan ini. Tanggal pembaruan terakhir tercantum di bagian atas halaman.
            </p>

            <h2>Kontak</h2>
            <p>
              {site.legalName}, {site.address.line1}, {site.address.line2}, {site.address.city}. Email:{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a>. Lihat juga <Link href="/syarat">Syarat &amp; Ketentuan</Link>.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  );
}
