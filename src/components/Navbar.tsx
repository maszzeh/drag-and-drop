'use client';

import React from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Sparkles, BookOpen, RotateCcw, LayoutGrid } from 'lucide-react';
import { sounds } from '../utils/audio';

interface NavbarProps {
  currentLevelTitle: string;
  starsCount: number;
  onOpenLevelSelect: () => void;
  onOpenEduGuide: () => void;
  onResetLevel: () => void;
  audioGuideText: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLevelTitle,
  starsCount,
  onOpenLevelSelect,
  onOpenEduGuide,
  onResetLevel,
  audioGuideText,
}) => {
  const [isMuted, setIsMuted] = React.useState(false);

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playPop();
    }
  };

  const handleSpeakGuide = () => {
    sounds.playPop();
    sounds.speak(audioGuideText);
  };

  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b-2 border-slate-100 px-4 lg:px-8 py-3 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center text-white text-2xl shadow-md shadow-blue-200 animate-float">
            🤖
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              ROBO-BUILDER <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">KIDS 4+</span>
            </h1>
            <p className="text-xs font-semibold text-slate-500">Bengkel Ekskul Robotik & Coding Cilik</p>
          </div>
        </div>

        {/* Level Switcher & Audio Prompt Pill */}
        <div className="flex items-center gap-2 lg:gap-3 flex-wrap">
          {/* Level Badge Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenLevelSelect();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-50 border-2 border-blue-200 text-blue-800 font-extrabold text-sm hover:bg-blue-100 transition shadow-sm active:scale-95"
            title="Ganti Pilihan Robot"
          >
            <LayoutGrid className="w-4 h-4 text-blue-600" />
            <span>{currentLevelTitle}</span>
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Ganti</span>
          </button>

          {/* 3D Robot Anatomy & How It Works Lab Page Link */}
          <Link
            href="/cara-kerja-robot"
            onClick={() => sounds.playPop()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs hover:from-purple-700 hover:to-indigo-700 transition shadow-sm active:scale-95 animate-pulseGlow"
            title="Buka Halaman Khusus Cara Kerja Sensor, Otak & Baterai Robot"
          >
            <span className="text-sm">🔬</span>
            <span className="hidden sm:inline">Cara Kerja Robot</span>
            <span className="text-[10px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.2 rounded-full">
              3D
            </span>
          </Link>

          {/* Interactive Voice Narration Pill */}
          <button
            onClick={handleSpeakGuide}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 font-bold text-xs lg:text-sm hover:bg-amber-100 transition shadow-sm active:scale-95 animate-pulseGlow"
            title="Dengarkan Suara Petunjuk"
          >
            <Volume2 className="w-5 h-5 text-amber-600 flex-shrink-0 animate-bounce" />
            <span className="max-w-[200px] lg:max-w-[280px] truncate">"{audioGuideText}"</span>
          </button>
        </div>

        {/* Right Tools (Mute, Reset, Guide, Stars) */}
        <div className="flex items-center gap-2">
          {/* Stars Pill */}
          <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 font-black text-sm">
            <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>{starsCount}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-500" /> : <Volume2 className="w-5 h-5 text-emerald-600" />}
          </button>

          {/* Reset Current Level */}
          <button
            onClick={() => {
              sounds.playPop();
              onResetLevel();
            }}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95"
            title="Rakit Ulang Robot Ini"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Teacher / Curriculum Guide */}
          <button
            onClick={() => {
              sounds.playPop();
              onOpenEduGuide();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Panduan Guru</span>
          </button>
        </div>
      </div>
    </header>
  );
};
