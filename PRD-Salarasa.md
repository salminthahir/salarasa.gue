# Product Requirements Document (PRD)
# Salarasa — Digital Invitation Platform

**Versi:** 1.0
**Tanggal:** 15 Juli 2026
**Status:** Draft

---

## 1. Ringkasan Eksekutif

Salarasa adalah platform digital invitation berbasis dashboard modular yang memungkinkan pengguna membuat undangan digital untuk berbagai jenis acara (pernikahan, ulang tahun, khitanan, dan lainnya) tanpa perlu keahlian teknis. Platform ini dibangun dengan arsitektur berbasis **block/module system**, sehingga setiap jenis undangan dapat dirakit dari kombinasi fitur (blocks) yang dapat digunakan kembali lintas kategori acara.

---

## 2. Latar Belakang & Masalah

Undangan digital saat ini umumnya:
- Dibuat manual per klien (tidak scalable), atau
- Berbasis template kaku yang sulit dikustomisasi, atau
- Terpisah-pisah antara jenis acara (platform pernikahan ≠ platform ulang tahun)

Salarasa hadir untuk menyatukan semua kebutuhan ini dalam satu dashboard, dengan sistem modular yang membuat penambahan jenis acara baru menjadi cepat dan efisien secara development.

---

## 3. Tujuan Produk

1. Memungkinkan pengguna membuat undangan digital sendiri melalui dashboard self-service.
2. Mendukung banyak jenis acara dalam satu platform (multi-tenant by event type).
3. Menyediakan fitur inti: buka undangan, ucapan/kartu greeting, lokasi acara, RSVP, dan fitur pendukung lain.
4. Membangun arsitektur yang scalable — penambahan jenis undangan baru tidak memerlukan perubahan besar pada core system.

---

## 4. Target Pengguna

| Persona | Deskripsi | Kebutuhan Utama |
|---|---|---|
| Calon pengantin | Membuat undangan pernikahan digital | Tema elegan, RSVP, lokasi, galeri, amplop digital |
| Orang tua/individu | Membuat undangan ulang tahun anak/diri sendiri | Simple, ceria, cepat dibuat |
| Event organizer/vendor | Membuat banyak undangan untuk klien | Dashboard multi-project, branding kustom |

---

## 5. Ruang Lingkup Produk (Scope)

### 5.1 In Scope (MVP)
- Dashboard pembuatan undangan (create, edit, preview, publish)
- Sistem block/module modular per undangan
- Tipe acara awal: **Pernikahan** dan **Ulang Tahun**
- Fitur inti (lihat Section 6)
- Deploy undangan ke subdomain unik (`nama.salarasa.id`)

### 5.2 Out of Scope (Fase Awal)
- Custom domain milik sendiri (fase selanjutnya)
- Multi-bahasa
- Marketplace tema pihak ketiga
- Aplikasi mobile native (fokus web responsive dulu)

---

## 6. Fitur Produk

### 6.1 Core Platform (Dashboard)
- Autentikasi (register/login/reset password)
- Manajemen project undangan (create, duplicate, delete, archive)
- Pemilihan tipe acara & tema
- Editor block (drag/toggle block, isi konten, atur urutan)
- Preview real-time sebelum publish
- Publish & unpublish undangan
- Manajemen custom slug/subdomain
- Dashboard analytics dasar (jumlah pengunjung, jumlah RSVP)

### 6.2 Invitation Blocks (Modul Fitur Undangan)

| Block | Deskripsi | Berlaku untuk |
|---|---|---|
| Cover / Buka Undangan | Halaman pembuka dengan animasi & nama tamu personal | Semua tipe |
| Countdown Timer | Hitung mundur ke hari acara | Semua tipe |
| Couple Profile | Profil mempelai (foto, nama, keluarga) | Pernikahan |
| Event Detail | Tanggal, waktu, rangkaian acara | Semua tipe |
| Lokasi (Maps) | Peta lokasi acara terintegrasi Google Maps | Semua tipe |
| RSVP | Form konfirmasi kehadiran + jumlah tamu | Semua tipe |
| Guestbook / Greetings | Kartu ucapan dari tamu, dapat publik/privat | Semua tipe |
| Galeri Foto/Video | Galeri momen | Semua tipe |
| Amplop Digital | Info rekening/e-wallet untuk hadiah | Pernikahan (opsional tipe lain) |
| Music Player | Musik latar undangan | Semua tipe |
| Bagikan (Share) | Share ke WhatsApp dengan preview kartu | Semua tipe |

> Catatan: daftar block akan terus bertambah ("many more" sesuai visi awal project). Arsitektur harus mendukung penambahan block tanpa migrasi besar.

### 6.3 Fitur Masa Depan (Roadmap Pasca-MVP)
- Tipe acara baru: khitanan, aqiqah, syukuran, seminar/corporate event
- Custom domain
- Undangan multi-bahasa
- Integrasi pembayaran (untuk paket premium tema)
- Template marketplace (kreator tema pihak ketiga)
- Notifikasi WhatsApp otomatis ke tamu

---

## 7. Arsitektur Teknis

### 7.1 Prinsip Arsitektur
Sistem dibangun dengan pendekatan **Block-Based Modular Architecture**:
- Setiap undangan = kumpulan block yang tersusun dan terkonfigurasi lewat data, bukan hardcode.
- Menambah tipe acara baru = menyusun kombinasi block yang sudah ada + (jika perlu) menambah block baru, tanpa mengubah core system.

### 7.2 Tech Stack

| Layer | Teknologi | Alasan |
|---|---|---|
| Frontend Framework | **TanStack Start** | Full-stack React, SSR, file-based routing |
| Routing | **TanStack Router** | Type-safe routing untuk dashboard kompleks |
| Data Fetching | **TanStack Query** | Caching & sinkronisasi data real-time (RSVP, greetings) |
| Tabel Data | **TanStack Table** | Tabel tamu, daftar RSVP di dashboard |
| Form | **TanStack Form** + **Zod** | Form dinamis per block, validasi schema |
| Styling | **Tailwind CSS** + **shadcn/ui** | Cepat, konsisten, komponen dashboard siap pakai |
| ORM | **Drizzle ORM** | Type-safe, cocok dengan ekosistem TanStack |
| Database | **PostgreSQL** (Supabase/Neon) | Relasional, kolom JSONB untuk config block |
| Storage | **Supabase Storage / Cloudflare R2** | Foto, video, musik undangan |
| Auth | **Supabase Auth / Lucia Auth** | Autentikasi pengguna dashboard |
| Deployment | **Vercel / Cloudflare Pages** | Wildcard subdomain per undangan |
| Realtime (opsional) | **Supabase Realtime** | Update guestbook/RSVP live |

### 7.3 Struktur Data (Skema Awal)

```
users
  id, name, email, password_hash, created_at

invitations
  id, user_id, event_type, title, slug, theme_id, status, event_date, created_at

invitation_blocks
  id, invitation_id, block_type, config (JSONB), order_index, is_active

themes
  id, name, preview_thumbnail, style_config (JSONB)

guests
  id, invitation_id, name, phone, whatsapp_link, invited_at

rsvp_responses
  id, invitation_id, guest_name, attendance_status, jumlah_tamu, submitted_at

greetings
  id, invitation_id, name, message, is_public, created_at
```

**Catatan kunci:** kolom `config` berbentuk JSONB pada `invitation_blocks` adalah inti modularitas — setiap `block_type` punya schema config sendiri (divalidasi via Zod di layer aplikasi), sehingga penambahan block baru tidak memerlukan perubahan struktur tabel.

### 7.4 Alur Deploy Undangan
1. User membuat invitation baru di dashboard → pilih tipe acara & tema
2. User menyusun & mengisi block-block yang dibutuhkan
3. Sistem generate preview via slug sementara
4. User publish → slug final aktif di `[slug].salarasa.id`
5. Halaman undangan dirender SSR dari data block (bukan static build per undangan) agar update konten instan tanpa re-deploy

---

## 8. User Flow Utama (Ringkas)

**Flow Pembuatan Undangan:**
Login → Buat Undangan Baru → Pilih Tipe Acara → Pilih Tema → Susun Block → Isi Konten tiap Block → Preview → Publish → Bagikan Link

**Flow Tamu Membuka Undangan:**
Buka Link → Halaman Cover (masukkan nama jika personalized) → Scroll konten (event detail, lokasi, galeri) → Isi RSVP → Tulis Ucapan → Selesai

---

## 9. Metrik Keberhasilan (Success Metrics)

| Metrik | Target Awal |
|---|---|
| Jumlah undangan dibuat per bulan | Baseline growth |
| Waktu rata-rata pembuatan undangan | < 30 menit |
| Tingkat penyelesaian RSVP oleh tamu | > 60% dari tamu yang membuka |
| Retention pengguna (buat undangan kedua) | Tracked pasca-MVP |

---

## 10. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Kompleksitas config JSONB sulit di-maintain | Standarisasi schema per block type dengan Zod, dokumentasikan tiap block |
| Performa render undangan lambat karena SSR dinamis | Cache layer (TanStack Query + edge caching) |
| Skalabilitas subdomain wildcard | Gunakan provider dengan dukungan wildcard domain native (Vercel/Cloudflare) |
| Terlalu banyak fitur di MVP | Batasi MVP ke 2 tipe acara & block inti dulu (lihat Section 5.1) |

---

## 11. Timeline Fase Pengembangan (High-Level)

| Fase | Fokus | Estimasi |
|---|---|---|
| Fase 1 — MVP | Dashboard dasar, 2 tipe acara, block inti, deploy subdomain | 6-8 minggu |
| Fase 2 | Tambah tipe acara, custom domain, analytics lanjutan | 4-6 minggu |
| Fase 3 | Marketplace tema, integrasi pembayaran, notifikasi WA | TBD |

---

## 12. Pertanyaan Terbuka

- Model monetisasi: sekali bayar per undangan, subscription, atau freemium dengan watermark?
- Apakah dashboard akan multi-user per project (kolaborasi pasangan pengantin)?
- Apakah dibutuhkan white-label untuk vendor/EO?

