import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Robo-Builder Kids: Game Drag and Drop Robotik & Coding Cilik (4+ Tahun)',
  description: 'Game edukasi web interaktif untuk anak usia 4 tahun belajar mengenal berbagai jenis robot dan logika coding sederhana.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-indigo-50/30 text-slate-900">
        {children}
      </body>
    </html>
  );
}
