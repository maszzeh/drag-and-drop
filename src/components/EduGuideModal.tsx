'use client';

import React from 'react';
import { X, BookOpen, Heart, Brain, Zap, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface EduGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAnatomyLab?: () => void;
}

export const EduGuideModal: React.FC<EduGuideModalProps> = ({ isOpen, onClose, onOpenAnatomyLab }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-emerald-300 max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 relative">
        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playPop();
            onClose();
          }}
          className="absolute top-5 right-5 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition active:scale-90"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm mb-2">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>PANDUAN PENGAMPU EKSKUL ROBOTIK (ANAK 4 TAHUN)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Pedagogi STEM & Pre-Coding PAUD/TK 🤖
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Panduan bagi guru/fasilitator untuk memandu anak bermain sambil belajar konsep komputasi dasar.
          </p>
        </div>

        {/* 4 Pillars of Early Robotics Learning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-2.5 text-blue-900 font-black text-sm mb-1.5">
              <Heart className="w-5 h-5 text-blue-600" />
              <span>1. Hubungkan dengan Tubuh Anak</span>
            </div>
            <p className="text-xs text-blue-950/80 leading-relaxed">
              Anak usia 4 tahun belajar secara konkret. Ajak mereka menunjuk mata mereka: <em>"Mata kita untuk melihat jalan. Kamera robot itu seperti mata kita agar robot tidak menabrak tembok!"</em>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2.5 text-amber-900 font-black text-sm mb-1.5">
              <Zap className="w-5 h-5 text-amber-600" />
              <span>2. Pengenalan Energi (Baterai & Surya)</span>
            </div>
            <p className="text-xs text-amber-950/80 leading-relaxed">
              Beri analogi: Anak butuh makan nasi, sayur, dan istirahat agar punya tenaga lari. Robot butuh baterai dan sayap surya untuk menyerap sinar matahari agar motor penggeraknya bisa berputar!
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200">
            <div className="flex items-center gap-2.5 text-purple-900 font-black text-sm mb-1.5">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>3. Logika Pre-Coding (Sebab & Akibat)</span>
            </div>
            <p className="text-xs text-purple-950/80 leading-relaxed">
              Coding untuk balita bukan mengetik kode, melainkan memahami urutan (*sequencing*): <strong>[Tekan Tombol] ➔ [Maju] ➔ [Bunyi Bip]</strong>. Tanamkan bahwa robot adalah mesin cerdas yang selalu patuh pada perintah anak.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200">
            <div className="flex items-center gap-2.5 text-pink-900 font-black text-sm mb-1.5">
              <Sparkles className="w-5 h-5 text-pink-600" />
              <span>4. Bangun Kepercayaan Diri (*Self-Efficacy*)</span>
            </div>
            <p className="text-xs text-pink-950/80 leading-relaxed">
              Berikan apresiasi saat anak berhasil: <em>"Wah, kamu hebat sudah jadi Insinyur Robot Cilik!"</em> Penguatan positif menumbuhkan rasa ingin tahu dan kecintaan terhadap sains sejak dini.
            </p>
          </div>
        </div>

        {/* 5 Kinds of Robots Covered */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <h3 className="font-black text-sm text-slate-800 mb-2">
            🤖 Anatomi & Karakter 5 Macam Robot:
          </h3>
          <ul className="space-y-1.5 text-xs text-slate-600">
            <li>• <strong>Level 1 (Robo-Bobi):</strong> Robot bipedal / sahabat manusia (Kamera, Otak Baterai, Tangan, Kaki Roda).</li>
            <li>• <strong>Level 2 (Robo-Rover):</strong> Robot penjelajah Mars (6 Roda rantai anti-slip, Sayap panel surya, Tiang periskop).</li>
            <li>• <strong>Level 3 (Robo-Arm):</strong> Lengan robotik industri (Sendi engsel servo siku, Dudukan putar 360°, Capit balok).</li>
            <li>• <strong>Level 4 (Robo-Aero):</strong> Drone terbang pengantar paket (4 Baling-baling motor udara, Sensor gyro ketinggian).</li>
            <li>• <strong>Level 5 (Robo-Puppy):</strong> Robot hewan bionik (Sensor telinga suara, 4 Kaki bionik, Ekor ceria gembira).</li>
          </ul>

          {onOpenAnatomyLab && (
            <div className="mt-4 pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-indigo-50/60 p-3 rounded-xl border-indigo-200">
              <div className="text-xs text-indigo-950 font-bold">
                <span>💡 Guru dapat menggunakan <strong>Laboratorium Cara Kerja Robot (3D)</strong> untuk demonstrasi interaktif sensor, otak, dan baterai.</span>
              </div>
              <button
                onClick={() => {
                  sounds.playPop();
                  onOpenAnatomyLab();
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs shadow-md shadow-indigo-200 transition active:scale-95 flex-shrink-0"
              >
                🔬 Buka Lab 3D Sekarang
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
