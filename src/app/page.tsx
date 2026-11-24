'use client';

import React, { useState } from 'react';
import { ROBOT_LEVELS } from '../data/robots';
import { RobotLevel } from '../types/robot';
import { Navbar } from '../components/Navbar';
import { RobotAssemblyBoard } from '../components/RobotAssemblyBoard';
import { VictoryCodingModal } from '../components/VictoryCodingModal';
import { LevelSelectModal } from '../components/LevelSelectModal';
import { EduGuideModal } from '../components/EduGuideModal';
import { RobotAnatomyLabModal } from '../components/RobotAnatomyLabModal';

export default function HomePage() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState<number>(0);
  const currentLevel = ROBOT_LEVELS[currentLevelIndex];

  // Independent state for parts so child can install them
  const [partsState, setPartsState] = useState(
    currentLevel.parts.map(p => ({ ...p, isInstalled: false }))
  );

  const [starsCount, setStarsCount] = useState<number>(5);
  const [isVictoryOpen, setIsVictoryOpen] = useState<boolean>(false);
  const [isLevelSelectOpen, setIsLevelSelectOpen] = useState<boolean>(false);
  const [isEduGuideOpen, setIsEduGuideOpen] = useState<boolean>(false);
  const [isAnatomyLabOpen, setIsAnatomyLabOpen] = useState<boolean>(false);

  // Switch level
  const handleSelectLevel = (selectedLevel: RobotLevel) => {
    const idx = ROBOT_LEVELS.findIndex(l => l.id === selectedLevel.id);
    if (idx !== -1) {
      setCurrentLevelIndex(idx);
      setPartsState(selectedLevel.parts.map(p => ({ ...p, isInstalled: false })));
      setIsVictoryOpen(false);
    }
  };

  // When a part is installed on the workbench
  const handlePartInstalled = (partId: string) => {
    setPartsState(prev =>
      prev.map(p => (p.id === partId ? { ...p, isInstalled: true } : p))
    );
  };

  // When all parts of the current robot are installed
  const handleAllCompleted = () => {
    setStarsCount(prev => prev + 3);
    setIsVictoryOpen(true);
  };

  // Reset current level
  const handleResetLevel = () => {
    setPartsState(currentLevel.parts.map(p => ({ ...p, isInstalled: false })));
    setIsVictoryOpen(false);
  };

  // Advance to next level
  const handleNextLevel = () => {
    if (currentLevelIndex + 1 < ROBOT_LEVELS.length) {
      const nextIdx = currentLevelIndex + 1;
      setCurrentLevelIndex(nextIdx);
      setPartsState(ROBOT_LEVELS[nextIdx].parts.map(p => ({ ...p, isInstalled: false })));
      setIsVictoryOpen(false);
    }
  };

  const hasNextLevel = currentLevelIndex + 1 < ROBOT_LEVELS.length;

  return (
    <main className="min-h-screen flex flex-col justify-between">
      {/* Top Interactive Navigation Bar */}
      <Navbar
        currentLevelTitle={currentLevel.name}
        starsCount={starsCount}
        onOpenLevelSelect={() => setIsLevelSelectOpen(true)}
        onOpenEduGuide={() => setIsEduGuideOpen(true)}
        onOpenAnatomyLab={() => setIsAnatomyLabOpen(true)}
        onResetLevel={handleResetLevel}
        audioGuideText={currentLevel.audioGuide}
      />

      {/* Main Drag-and-Drop Assembly Workbench */}
      <div className="flex-1 flex flex-col justify-center">
        <RobotAssemblyBoard
          level={currentLevel}
          parts={partsState}
          onPartInstalled={handlePartInstalled}
          onAllCompleted={handleAllCompleted}
          onOpenAnatomyLab={() => setIsAnatomyLabOpen(true)}
        />
      </div>

      {/* Footer info bar */}
      <footer className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-3 text-center text-xs font-semibold text-slate-400">
        Robo-Builder Kids • Dirancang khusus untuk Ekskul Robotik & Coding Usia 4 Tahun (PAUD/TK) • Didukung 3D WebGL
      </footer>

      {/* Victory & Mini-Coding Test Run Modal */}
      <VictoryCodingModal
        isOpen={isVictoryOpen}
        level={currentLevel}
        onReplay={handleResetLevel}
        onNextLevel={handleNextLevel}
        hasNextLevel={hasNextLevel}
        onOpenAnatomyLab={() => setIsAnatomyLabOpen(true)}
      />

      {/* Level Selection Modal */}
      <LevelSelectModal
        isOpen={isLevelSelectOpen}
        onClose={() => setIsLevelSelectOpen(false)}
        currentLevelId={currentLevel.id}
        totalStars={starsCount}
        onSelectLevel={handleSelectLevel}
      />

      {/* Teacher / Educational Guide Modal */}
      <EduGuideModal
        isOpen={isEduGuideOpen}
        onClose={() => setIsEduGuideOpen(false)}
        onOpenAnatomyLab={() => {
          setIsEduGuideOpen(false);
          setIsAnatomyLabOpen(true);
        }}
      />

      {/* Special Feature: 3D Robot Anatomy & How It Works Lab Modal */}
      <RobotAnatomyLabModal
        isOpen={isAnatomyLabOpen}
        onClose={() => setIsAnatomyLabOpen(false)}
        initialRobotType={
          currentLevel.slug === 'robo-bobi'
            ? 'biped'
            : currentLevel.slug === 'robo-rover'
            ? 'rover'
            : currentLevel.slug === 'robo-arm'
            ? 'arm'
            : currentLevel.slug === 'robo-aero'
            ? 'drone'
            : 'pet'
        }
      />
    </main>
  );
}
