import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { Prose } from "@/components/prose";
import { Container, Em, Section } from "@/components/ui/section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "Syarat dan ketentuan penggunaan situs Omnity dan layanan Design Anything.",
  alternates: { canonical: "/syarat" },
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        crumbs={[{ label: "Syarat & Ketentuan", href: "/syarat" }]}
        title={
          <>
            Syarat &amp; <Em tone="ink">Ketentuan.</Em>
          </>
        }
        lead="Terakhir diperbarui: 5 November 2026."
      />
      <Section className="pt-0 sm:pt-0">
        <Container>
          <Prose>
            <p>
              Dengan memakai situs ini dan layanan {site.legalName} (&quot;Omnity&quot;), Anda menyetujui
              ketentuan berikut. Bila tidak setuju, mohon tidak menggunakan situs ini.
            </p>

            <h2>1. Penggunaan situs</h2>
            <p>
              Anda setuju memakai situs secara sah, tidak mengganggu operasionalnya, dan tidak mencoba mengakses
              bagian yang bukan hak Anda. Anda bertanggung jawab menjaga kerahasiaan akun dan kata sandi.
            </p>

            <h2>2. Design Anything</h2>
            <ul>
              <li>
                Anda mengisi survei kebutuhan website; tim Omnity menyiapkan mockup berdasarkan survei tersebut.
              </li>
              <li>
                Setelah mockup tersedia, Anda menerima penawaran yang memuat cakupan, biaya, jumlah revisi,
                estimasi waktu, dan apakah domain atau hosting termasuk.
              </li>
              <li>
                Pengerjaan dimulai setelah Anda menyetujui penawaran dan ketentuan pembayarannya. Isi penawaran
                yang disetujui berlaku di atas ketentuan umum ini.
              </li>
            </ul>

            <h2>3. Konten dari Anda</h2>
            <p>
              Teks, logo, dan gambar yang Anda berikan tetap menjadi milik Anda. Anda menjamin berhak
              menggunakannya dan memberi Omnity izin memakainya untuk mengerjakan proyek Anda.
            </p>

            <h2>4. Hak kekayaan intelektual</h2>
            <p>
              Desain, kode, dan materi di situs ini milik Omnity atau pemberi lisensinya. Kepemilikan hasil
              pekerjaan untuk proyek Anda diatur dalam penawaran atau perjanjian proyek.
            </p>

            <h2>5. Batasan tanggung jawab</h2>
            <p>
              Informasi di situs ini bersifat umum dan dapat berubah. Sejauh diizinkan hukum, Omnity tidak
              bertanggung jawab atas kerugian tidak langsung yang timbul dari penggunaan situs.
            </p>

            <h2>6. Perubahan</h2>
            <p>Kami dapat memperbarui ketentuan ini; versi terbaru berlaku sejak dipublikasikan di halaman ini.</p>

            <h2>7. Hukum yang berlaku</h2>
            <p>Ketentuan ini tunduk pada hukum Republik Indonesia.</p>

            <h2>Kontak</h2>
            <p>
              Pertanyaan tentang ketentuan ini: <a href={`mailto:${site.email}`}>{site.email}</a>. Lihat juga{" "}
              <Link href="/privasi">Kebijakan Privasi</Link>.
            </p>
          </Prose>
        </Container>
      </Section>
    </>
  );
}
