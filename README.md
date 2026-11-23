# 🤖 ROBO-BUILDER KIDS: Game Web Drag & Drop Robotik & Coding Cilik (4+ Tahun)

Aplikasi game web edukatif yang dirancang khusus untuk pembelajaran **Ekskul Robotik & Coding Anak Usia 4 Tahun (PAUD / TK)** berbasis **Next.js 14**, **Tailwind CSS**, dan visualisasi **3D Interaktif Three.js**.

---

## 🌟 Fitur Utama

1. **5 Level Petualangan & Ragam Jenis Robot:**
   - **Level 1: Robo-Bobi (Humanoid/Bipedal):** Mengenal kepala sensor kamera, otak baterai, tangan menyapa, dan kaki roda meluncur.
   - **Level 2: Robo-Rover (Mars Explorer):** Mengenal 6 roda rantai medan pasir gurun, tiang periskop 360°, dan sayap panel surya.
   - **Level 3: Robo-Arm (Lengan Mekanik Pabrik):** Mengenal sendi engsel servo siku, dudukan meja putar 360°, dan capit magnetik.
   - **Level 4: Robo-Aero (Drone Pengantar Terbang):** Mengenal 4 baling-baling motor udara, sensor gyro ketinggian, dan kaki pendarat.
   - **Level 5: Robo-Puppy (Robot Peliharaan Bionik):** Mengenal sensor suara telinga, baterai hati, 4 kaki bionik, dan ekor goyang ceria.

2. **Dukungan 3D Interaktif (Three.js WebGL):**
   - Robot dapat dilihat dalam mode **Blueprint 2D** saat dirakit, dan dapat di-toggle ke mode **3D Interaktif**.
   - Model 3D dapat disentuh dan diputar 360° menggunakan sentuhan jari maupun mouse.
   - Dilengkapi animasi gerakan idle, tarian gembira saat menang, baling-baling berputar, ekor bergoyang, dan lambaian tangan.

3. **Drag-and-Drop & Tap-to-Snap Ramah Balita:**
   - Didesain khusus untuk anak usia 4 tahun yang motorik halusnya masih berkembang.
   - Mendukung **Drag-and-Drop** dengan siluet putus-putus dan efek magnetik (*snapping*).
   - Mendukung **Tap-to-Snap** (cukup sentuh bagian robot untuk memasangkannya).
   - Zero-failure state: permainan santai tanpa batasan waktu kalah.

4. **Sintesis Audio & Narasi Guru (Web Audio API & Speech Synthesis):**
   - Efek suara riang bawaan (*pop, snap, victory fanfare, robot beep, motor sound*) tanpa memerlukan file MP3 eksternal.
   - Panduan suara otomatis berbahasa Indonesia untuk memandu anak yang belum lancar membaca.

5. **Modul Pre-Coding (Algoritma Cilik):**
   - Setelah robot selesai dirakit, robot akan menyala dan anak dapat menguji robotnya menggunakan blok urutan instruksi:
     - `[ 🟢 1. KETIKA TOMBOL DITEKAN ]`
     - `[ ➡️ 2. MAJU 2 LANGKAH ]`
     - `[ 🎵 3. BUNYIKAN "BIP BIP" ]`
     - `[ 👋 4. LAMBAI TANGAN GEMBIRA ]`
   - Menanamkan konsep dasar komputasi: **Input ➔ Proses ➔ Output & Sequencing**.

---

## 🚀 Cara Menjalankan

Buka terminal di folder project ini:

```bash
# 1. Jalankan development server
npm run dev
```

Buka browser dan akses:
👉 **`http://localhost:3000`**

Untuk build produksi:
```bash
npm run build
npm run start
```

---

## 📁 Struktur Direktori

```
drag-and-drop/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout aplikasi
│   │   ├── page.tsx           # Halaman utama game
│   │   └── globals.css        # Styling Tailwind CSS
│   ├── components/
│   │   ├── Navbar.tsx             # Header navigasi & audio prompt
│   │   ├── RobotAssemblyBoard.tsx # Meja perakitan drag-and-drop
│   │   ├── ThreeRobotViewer.tsx   # Viewer 3D interaktif Three.js
│   │   ├── VictoryCodingModal.tsx # Layar perayaan & mini-coding
│   │   ├── LevelSelectModal.tsx   # Modal pemilihan level & robot
│   │   └── EduGuideModal.tsx      # Panduan kurikulum & pedagogi guru
│   ├── data/
│   │   └── robots.ts          # Katalog data 5 jenis robot & anatomi
│   ├── types/
│   │   └── robot.ts           # Definisi TypeScript
│   └── utils/
│       └── audio.ts           # Web Audio API & TTS Bahasa Indonesia
├── robo-builder-game.figcraft # File desain asli FigCraft
├── package.json
└── tailwind.config.js
```
