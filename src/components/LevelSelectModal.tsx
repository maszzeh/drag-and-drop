'use client';

import React from 'react';
import { X, Lock, Play, Star, Sparkles } from 'lucide-react';
import { ROBOT_LEVELS } from '../data/robots';
import { RobotLevel } from '../types/robot';
import { sounds } from '../utils/audio';

interface LevelSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevelId: number;
  totalStars: number;
  onSelectLevel: (level: RobotLevel) => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  onClose,
  currentLevelId,
  totalStars,
  onSelectLevel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-blue-200 max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 lg:p-8 relative">
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

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-extrabold text-sm mb-2">
            <Sparkles className="w-4 h-4 fill-blue-500" />
            <span>PILIH PETUALANGAN ROBOTIK</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-slate-900">
            Mau Merakit Robot Apa Hari Ini? 🚀
          </h2>
          <p className="text-sm font-semibold text-slate-500 mt-1">
            Sentuh salah satu robot di bawah untuk mulai menyusun bagian tubuhnya!
          </p>
        </div>

        {/* Level Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {ROBOT_LEVELS.map(level => {
            const isUnlocked = totalStars >= level.starsRequired;
            const isCurrent = level.id === currentLevelId;

            return (
              <div
                key={level.id}
                className={`flex flex-col justify-between rounded-3xl p-5 border-3 transition-all duration-300 relative ${
                  isCurrent
                    ? 'border-blue-500 ring-4 ring-blue-100 bg-blue-50/40 shadow-lg scale-[1.02]'
                    : isUnlocked
                    ? 'border-slate-200 hover:border-blue-400 bg-white hover:shadow-md hover:-translate-y-1'
                    : 'border-slate-200 bg-slate-100/70 opacity-80'
                }`}
              >
                <div>
                  {/* Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[11px] font-black px-2.5 py-1 rounded-full border ${level.badgeColor}`}>
                      LVL {level.id}
                    </span>
                    {isUnlocked ? (
                      <div className="flex items-center text-amber-500">
                        <Star className="w-4 h-4 fill-amber-400" />
                        <span className="text-xs font-bold ml-1">{level.starsEarned}</span>
                      </div>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-200/80 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> {level.starsRequired} ⭐
                      </span>
                    )}
                  </div>

                  {/* Character Avatar Box */}
                  <div
                    className="w-full aspect-square rounded-2xl flex items-center justify-center text-5xl mb-3 shadow-inner"
                    style={{ backgroundColor: level.accentColor }}
                  >
                    <span className="animate-float">{level.previewEmoji}</span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-black text-base text-slate-900 leading-tight">{level.name}</h3>
                  <p className="text-xs font-bold text-blue-600 mt-0.5">{level.robotTitle}</p>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                    {level.description}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        sounds.playPop();
                        onSelectLevel(level);
                        onClose();
                      }}
                      className="w-full py-2.5 rounded-2xl font-black text-xs flex items-center justify-center gap-1.5 text-white shadow-md active:scale-95 transition"
                      style={{ backgroundColor: level.themeColor }}
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>{isCurrent ? 'MAIN SEKARANG' : 'PILIH RAKIT'}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 text-slate-400 bg-slate-200/80 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" />
                      <span>Kumpulkan {level.starsRequired} ⭐</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Teacher Tip */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <strong>Tips Guru / Orang Tua:</strong> Mulai dari Level 1 (Robo-Bobi) agar anak terbiasa dengan anatomi mirip manusia (kepala, mata, badan, tangan, kaki). Setelah itu kenalkan robot khusus seperti Rover luar angkasa dan Lengan mekanik!
          </div>
        </div>
      </div>
    </div>
  );
};
