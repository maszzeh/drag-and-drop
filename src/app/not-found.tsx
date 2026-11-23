import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-sky-50 text-slate-800 text-center">
      <div className="text-6xl mb-3">🤖</div>
      <h2 className="text-2xl font-black mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-sm text-slate-600 mb-4">Ayo kembali bermain merakit robot!</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-blue-600 text-white font-black rounded-2xl shadow-md hover:bg-blue-700 transition-all inline-flex items-center gap-2"
      >
        <span>🏠 Kembali ke Meja Rakit</span>
      </Link>
    </div>
  );
}
