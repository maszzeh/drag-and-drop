'use client';

import React, { useState } from 'react';
import { CheckCircle2, Sparkles, Volume2, Box, Eye, Check } from 'lucide-react';
import { RobotLevel, RobotPart } from '../types/robot';
import { sounds } from '../utils/audio';
import { ThreeRobotViewer } from './ThreeRobotViewer';
import { RobotPartVisual } from './RobotPartVisual';

interface RobotAssemblyBoardProps {
  level: RobotLevel;
  parts: RobotPart[];
  onPartInstalled: (partId: string) => void;
  onAllCompleted: () => void;
}

export const RobotAssemblyBoard: React.FC<RobotAssemblyBoardProps> = ({
  level,
  parts,
  onPartInstalled,
  onAllCompleted,
}) => {
  const [draggedPartId, setDraggedPartId] = useState<string | null>(null);
  const [activeDropZone, setActiveDropZone] = useState<string | null>(null);
  const [view3D, setView3D] = useState<boolean>(false);

  const installedCount = parts.filter(p => p.isInstalled).length;
  const totalCount = parts.length;
  const progressPercent = Math.round((installedCount / totalCount) * 100);

  // Drag start handler - ONLY drags the robot part graphic (no text/labels)
  const handleDragStart = (e: React.DragEvent, part: RobotPart) => {
    if (part.isInstalled) return;
    setDraggedPartId(part.id);
    e.dataTransfer.setData('text/plain', part.id);
    e.dataTransfer.effectAllowed = 'copyMove';

    // Tell the browser to only render the robot part graphic as the drag preview
    const cardEl = e.currentTarget as HTMLElement;
    const visualEl = cardEl.querySelector('.robot-part-drag-preview') as HTMLElement;
    if (visualEl && e.dataTransfer.setDragImage) {
      const offsetX = visualEl.offsetWidth / 2;
      const offsetY = visualEl.offsetHeight / 2;
      e.dataTransfer.setDragImage(visualEl, offsetX, offsetY);
    }

    sounds.playPop();
    sounds.speak(`Tarik ${part.name}`);
  };

  // Drag over target slot
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setActiveDropZone(targetId);
  };

  const handleDragLeave = () => {
    setActiveDropZone(null);
  };

  // Drop part into slot
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    setActiveDropZone(null);
    const droppedPartId = e.dataTransfer.getData('text/plain') || draggedPartId;

    if (!droppedPartId) return;

    const matchedPart = parts.find(p => p.id === droppedPartId);
    if (matchedPart && matchedPart.targetId === targetId && !matchedPart.isInstalled) {
      installPart(matchedPart);
    } else {
      sounds.playPop();
    }
    setDraggedPartId(null);
  };

  // Tap-to-snap accessibility (great for 4-year-olds on touchscreens)
  const handlePartTap = (part: RobotPart) => {
    if (part.isInstalled) return;
    installPart(part);
  };

  const installPart = (part: RobotPart) => {
    sounds.playSnap();
    sounds.speak(`${part.name} terpasang!`);
    onPartInstalled(part.id);

    // If this was the last part
    if (installedCount + 1 >= totalCount) {
      setTimeout(() => {
        sounds.playSuccess();
        onAllCompleted();
      }, 700);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-6">
      {/* Top Banner Progress */}
      <div className="mb-6 bg-white rounded-3xl p-4 lg:p-5 border-2 border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white shadow-md"
            style={{ backgroundColor: level.themeColor }}
          >
            {level.previewEmoji}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{level.name}</h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${level.badgeColor}`}>
                {level.badgeText}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{level.subtitle}</p>
          </div>
        </div>

        {/* Progress Bar & 3D Toggle */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Rakit Robot: {installedCount}/{totalCount} Bagian</span>
              <span className="text-blue-600 font-extrabold">{progressPercent}%</span>
            </div>
            <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-emerald-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3D Mode Toggle Button */}
          <button
            onClick={() => {
              sounds.playPop();
              setView3D(!view3D);
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs transition shadow-sm active:scale-95 border-2 ${
              view3D
                ? 'bg-blue-600 border-blue-700 text-white shadow-blue-200'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Box className="w-4 h-4" />
            <span>{view3D ? 'Mode Bagian Robot' : 'Lihat Mode 3D'}</span>
          </button>
        </div>
      </div>

      {/* Main Workbench Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: The Assembly Workbench Pad (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border-3 border-blue-200/80 shadow-lg p-6 relative overflow-hidden min-h-[580px] flex flex-col justify-between">
          {/* Subtle Blueprint Pattern Background */}
          <div
            className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#3b82f6 1.5px, transparent 1.5px)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Workbench Header Tag */}
          <div className="flex items-center justify-between relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <span>MEJA PERAKITAN ROBOT</span>
            </div>

            <div className="text-xs font-semibold text-slate-400">
              {view3D ? 'Pratinjau Interaktif 3D' : 'Bentuk Nyata Bagian Robot (Bukan Kotak Polos)'}
            </div>
          </div>

          {/* STAGE: Either 3D Live View OR 2D Anatomical Robot Parts Assembly */}
          <div className="relative flex-1 flex items-center justify-center my-4 min-h-[520px]">
            {view3D ? (
              <div className="w-full h-[520px] flex flex-col items-center justify-center relative">
                <ThreeRobotViewer
                  className="w-full h-full"
                  robotType={
                    level.slug === 'robo-bobi'
                      ? 'biped'
                      : level.slug === 'robo-rover'
                      ? 'rover'
                      : level.slug === 'robo-arm'
                      ? 'arm'
                      : level.slug === 'robo-aero'
                      ? 'drone'
                      : 'pet'
                  }
                />
                <div className="text-center mt-2 text-xs font-bold text-slate-500">
                  {installedCount === totalCount
                    ? '🎉 Robot sudah selesai dirakit! Putar 3D sesukamu!'
                    : `Masih dalam proses (${installedCount}/${totalCount} terpasang)`}
                </div>
              </div>
            ) : (
              <div className="w-full max-w-[480px] h-[450px] relative select-none">
                {/* Visual Target Drop Zones with Real Robot Part Contours */}
                {parts.map(part => {
                  const isHovered = activeDropZone === part.targetId;

                  return (
                    <div
                      key={part.id}
                      onDragOver={e => handleDragOver(e, part.targetId)}
                      onDragLeave={handleDragLeave}
                      onDrop={e => handleDrop(e, part.targetId)}
                      onClick={() => !part.isInstalled && installPart(part)}
                      className={`absolute flex items-center justify-center transition-all duration-300 cursor-pointer ${
                        part.isInstalled
                          ? 'z-20 scale-100 filter drop-shadow-md animate-fadeIn'
                          : isHovered
                          ? 'z-30 scale-105 filter drop-shadow-lg ring-4 ring-sky-300 rounded-3xl animate-pulse'
                          : 'z-10 opacity-75 hover:opacity-100 hover:scale-102'
                      }`}
                      style={{
                        top: part.hintPosition.top,
                        left: part.hintPosition.left,
                        width: part.hintPosition.width,
                        height: part.hintPosition.height,
                      }}
                      title={part.isInstalled ? `${part.name} (Terpasang)` : `Pasang ${part.name} di sini!`}
                    >
                      {/* RENDER ACTUAL ROBOT PART SHAPE! */}
                      {part.isInstalled ? (
                        <div className="w-full h-full relative group">
                          <RobotPartVisual partId={part.id} mode="full" animate={false} />
                          {/* Subtle installed indicator badge */}
                          <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500 text-white p-1 rounded-full shadow-md">
                            <Check className="w-3 h-3" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-full h-full relative flex items-center justify-center">
                          <RobotPartVisual partId={part.id} mode="silhouette" />
                          {/* Center hint pill */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-1 text-center">
                            <span className="text-[10px] font-black text-sky-700 bg-white/90 px-2 py-0.5 rounded-full shadow-xs border border-sky-200">
                              Pasang {part.name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Workbench Bottom Helper Hint */}
          <div className="relative z-10 p-3 rounded-2xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>
                {installedCount === totalCount
                  ? '🎉 Hebat! Semua bagian robot tersambung sempurna menjadi robot utuh!'
                  : `Tarik bagian robot yang berbentuk sama ke siluetnya di atas meja!`}
              </span>
            </span>
            <button
              onClick={() => sounds.speak(level.audioGuide)}
              className="text-xs bg-white text-blue-700 px-2.5 py-1 rounded-xl border border-blue-200 shadow-xs hover:bg-blue-100 font-extrabold flex items-center gap-1 active:scale-95"
            >
              <Volume2 className="w-3.5 h-3.5" /> Dengar
            </button>
          </div>
        </div>

        {/* RIGHT: Parts Tray Organizer (5 Cols) with Actual Robot Parts Rendering */}
        <div className="lg:col-span-5 bg-amber-50/60 rounded-3xl border-3 border-amber-200 p-5 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-black text-amber-950 flex items-center gap-2">
                  <span>🧰 KOTAK BAGIAN ROBOT</span>
                </h3>
                <p className="text-xs font-semibold text-amber-800">
                  Bentuk bagian robot asli — Sentuh atau tarik ke siluetnya 👆
                </p>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-amber-200 text-amber-900">
                {parts.filter(p => !p.isInstalled).length} Sisa
              </span>
            </div>

            {/* Draggable Part Cards List with Real Visual Artwork */}
            <div className="space-y-3">
              {parts.map(part => {
                return (
                  <div
                    key={part.id}
                    draggable={!part.isInstalled}
                    onDragStart={e => handleDragStart(e, part)}
                    onClick={() => handlePartTap(part)}
                    className={`rounded-2xl p-3 border-2 transition-all duration-200 flex items-center gap-3 ${
                      part.isInstalled
                        ? 'bg-slate-100/90 border-slate-200 opacity-60 cursor-default'
                        : 'bg-white hover:bg-blue-50/50 border-amber-300 hover:border-blue-400 shadow-sm hover:shadow-md cursor-grab active:cursor-grabbing hover:-translate-y-0.5 active:scale-95'
                    }`}
                  >
                    {/* Real Robot Part Vector Visual (Used as the solitary drag preview) */}
                    <div
                      className={`robot-part-drag-preview w-24 h-18 rounded-2xl flex items-center justify-center p-1.5 flex-shrink-0 relative ${
                        part.isInstalled ? 'bg-slate-200 opacity-60' : 'bg-white border-2 border-blue-200 shadow-md shadow-blue-100/50'
                      }`}
                    >
                      <RobotPartVisual partId={part.id} mode="full" />
                    </div>

                    {/* Part Information */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="font-black text-sm text-slate-900 truncate">{part.name}</h4>
                        {part.isInstalled ? (
                          <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex-shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terpasang
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full flex-shrink-0 animate-pulse">
                            Tarik Saya!
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-bold text-blue-600">{part.type}</span>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {part.role}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Robot Vocab Educational Box for 4-year-olds */}
          <div className="mt-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs">
            <div className="font-black flex items-center gap-1 text-emerald-800 mb-1">
              <span>📚 KATA PINTAR ROBOTIK</span>
            </div>
            <p className="text-[11px] text-emerald-900 leading-relaxed">
              <strong>Sensor:</strong> Bagian mata kamera dan telinga robot untuk melihat serta mendeteksi rintangan di depan.
            </p>
            <p className="text-[11px] text-emerald-900 leading-relaxed mt-1">
              <strong>Aktuator:</strong> Roda penggerak, sayap, dan tangan robot untuk bergerak sesuai perintah kode.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
