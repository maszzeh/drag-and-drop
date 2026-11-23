'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, Play, RotateCcw, ArrowRight, Sparkles, Check, Volume2 } from 'lucide-react';
import { RobotLevel } from '../types/robot';
import { sounds } from '../utils/audio';
import { ThreeRobotViewer } from './ThreeRobotViewer';

interface VictoryCodingModalProps {
  isOpen: boolean;
  level: RobotLevel;
  onReplay: () => void;
  onNextLevel: () => void;
  hasNextLevel: boolean;
}

export const VictoryCodingModal: React.FC<VictoryCodingModalProps> = ({
  isOpen,
  level,
  onReplay,
  onNextLevel,
  hasNextLevel,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [current3DAction, setCurrent3DAction] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Fallback if canvas-confetti is not available
      }
      sounds.speak(level.dialogueSuccess);
    } else {
      setActiveStepIndex(-1);
      setIsRunningCode(false);
      setCurrent3DAction(null);
    }
  }, [isOpen, level]);

  if (!isOpen) return null;

  // Run the sequence of coding blocks step-by-step
  const handleRunCodeSequence = async () => {
    if (isRunningCode) return;
    setIsRunningCode(true);
    sounds.playPop();

    const blocks = level.codingBlocks;

    for (let i = 0; i < blocks.length; i++) {
      setActiveStepIndex(i);
      const action = blocks[i].action;
      setCurrent3DAction(action);

      if (action === 'start') {
        sounds.playPop();
      } else if (action === 'move_forward') {
        sounds.playMotorSound();
      } else if (action === 'beep_sound') {
        sounds.playRobotBeep();
      } else if (action === 'wave_hand' || action === 'wag_tail' || action === 'spin_propeller') {
        sounds.playPop();
      }

      // Wait 1.1s per step so the child can observe the execution
      await new Promise(res => setTimeout(res, 1100));
    }

    setActiveStepIndex(-1);
    setCurrent3DAction('wave_hand');
    setIsRunningCode(false);
    sounds.playSuccess();
    sounds.speak(`Hebat! Program robot ${level.name} berhasil dijalankan!`);
  };

  const robotTypeKey =
    level.slug === 'robo-bobi'
      ? 'biped'
      : level.slug === 'robo-rover'
      ? 'rover'
      : level.slug === 'robo-arm'
      ? 'arm'
      : level.slug === 'robo-aero'
      ? 'drone'
      : 'pet';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 lg:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-sky-400 max-w-4xl w-full p-6 lg:p-8 relative my-auto">
        {/* Celebration Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-black text-sm mb-2 shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600 fill-blue-500 animate-spin" />
            <span>ROBOT BERHASIL DIRAKIT & HIDUP! ⚡</span>
          </div>

          <h2 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Horeee! {level.name} Sudah Menyala! 🎉
          </h2>

          {/* 3 Golden Stars */}
          <div className="flex items-center justify-center gap-2 mt-2">
            {[1, 2, 3].map(starIndex => (
              <Star
                key={starIndex}
                className="w-7 h-7 text-amber-400 fill-amber-400 animate-wiggle drop-shadow-sm"
              />
            ))}
            <span className="text-sm font-black text-amber-600 ml-2">3 / 3 BINTANG SEMPURNA!</span>
          </div>
        </div>

        {/* 2 Columns: 3D Robot Stage & Mini-Coding Sequence */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* LEFT: 3D Robot Interactive Stage (5 Cols) */}
          <div className="md:col-span-5 bg-gradient-to-b from-sky-50 to-emerald-50/40 rounded-3xl p-4 border-2 border-emerald-300 shadow-inner flex flex-col justify-between items-center relative overflow-hidden">
            {/* Robot Speech Bubble */}
            <div className="w-full bg-white rounded-2xl p-3 border border-emerald-200 shadow-xs text-xs font-bold text-emerald-900 flex items-start gap-2 mb-2">
              <span className="text-xl">💬</span>
              <p className="leading-tight">"{level.dialogueSuccess}"</p>
            </div>

            {/* Live 3D Robot Model */}
            <div className="w-full h-80 flex items-center justify-center">
              <ThreeRobotViewer
                robotType={robotTypeKey}
                isDancing={true}
                actionTrigger={current3DAction}
              />
            </div>

            {/* Battery Status */}
            <div className="w-full bg-white/90 rounded-2xl p-2.5 border border-emerald-200 flex items-center justify-between text-xs font-extrabold text-emerald-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Baterai: 100% Penuh</span>
              </span>
              <span className="text-slate-500">Status: Siap Bergerak</span>
            </div>
          </div>

          {/* RIGHT: Pre-Coding Sequences (7 Cols) */}
          <div className="md:col-span-7 bg-slate-50 rounded-3xl p-5 border-2 border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>🧩 URUTAN PERINTAH KODE (Algoritma Cilik)</span>
                </h3>
              </div>
              <p className="text-xs font-semibold text-slate-500 mb-3">
                Tekan tombol hijau di bawah untuk menjalankan urutan kode langkah demi langkah:
              </p>

              {/* Coding Step Blocks */}
              <div className="space-y-2.5">
                {level.codingBlocks.map((block, idx) => {
                  const isActive = activeStepIndex === idx;

                  return (
                    <div
                      key={block.id}
                      className={`p-3 rounded-2xl border-2 transition-all duration-300 flex items-center gap-3 ${
                        isActive
                          ? 'border-emerald-500 bg-emerald-100 shadow-md scale-102 ring-4 ring-emerald-200'
                          : `${block.color} ${block.borderColor} border-opacity-60`
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{block.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-black ${block.textColor} truncate`}>
                            {block.label}
                          </h4>
                          {isActive && (
                            <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full animate-bounce">
                              Sedang Jalan ⚡
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{block.sublabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Run Code Big Action Button */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <button
                onClick={handleRunCodeSequence}
                disabled={isRunningCode}
                className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 text-white shadow-lg transition active:scale-95 ${
                  isRunningCode
                    ? 'bg-emerald-400 cursor-not-allowed opacity-80'
                    : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-200'
                }`}
              >
                <Play className="w-5 h-5 fill-white" />
                <span>{isRunningCode ? 'KODE SEDANG BERJALAN...' : '▶ JALANKAN KODE ROBOT! (TEST RUN)'}</span>
              </button>

              <p className="text-[11px] text-center font-semibold text-slate-400 mt-2">
                💡 Konsep Usia 4 Th: Robot bergerak sesuai urutan instruksi yang anak buat!
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => {
              sounds.playPop();
              onReplay();
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Rakit Ulang Robot Ini</span>
          </button>

          {hasNextLevel ? (
            <button
              onClick={() => {
                sounds.playPop();
                onNextLevel();
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-sm shadow-md shadow-orange-200 transition active:scale-95"
            >
              <span>Lanjut ke Level Berikutnya</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs font-black text-emerald-700 bg-emerald-100 px-4 py-2 rounded-2xl">
              🎉 Selamat! Kamu telah menamatkan semua jenis robot!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
