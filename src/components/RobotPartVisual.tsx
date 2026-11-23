'use client';

import React from 'react';

interface RobotPartVisualProps {
  partId: string;
  mode?: 'full' | 'silhouette';
  className?: string;
  animate?: boolean;
}

export const RobotPartVisual: React.FC<RobotPartVisualProps> = ({
  partId,
  mode = 'full',
  className = '',
  animate = false,
}) => {
  const isSilhouette = mode === 'silhouette';

  // --- 1. ROBO-BOBI PARTS ---
  if (partId === 'bobi-head') {
    return (
      <svg
        viewBox="0 0 220 170"
        className={`w-full h-full filter drop-shadow-md ${animate ? 'animate-bounce' : ''} ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isSilhouette ? (
          <g stroke="#38BDF8" strokeWidth="3" strokeDasharray="6 6" fill="rgba(56, 189, 248, 0.08)">
            {/* Antennae */}
            <path d="M70 45 L55 20" strokeWidth="4" />
            <circle cx="50" cy="15" r="12" fill="rgba(56, 189, 248, 0.15)" />
            <path d="M150 45 L165 20" strokeWidth="4" />
            <circle cx="170" cy="15" r="12" fill="rgba(56, 189, 248, 0.15)" />
            {/* Ears */}
            <rect x="15" y="65" width="16" height="40" rx="8" />
            <rect x="189" y="65" width="16" height="40" rx="8" />
            {/* Head Box */}
            <rect x="30" y="38" width="160" height="110" rx="28" />
            {/* Eyes guide */}
            <ellipse cx="80" cy="90" rx="14" ry="16" />
            <ellipse cx="140" cy="90" rx="14" ry="16" />
          </g>
        ) : (
          <g>
            <defs>
              <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
              <linearGradient id="bulbGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="100%" stopColor="#EAB308" />
              </linearGradient>
              <linearGradient id="visorGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#1E293B" />
              </linearGradient>
            </defs>

            {/* Left Antenna */}
            <line x1="70" y1="45" x2="55" y2="20" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            <circle cx="50" cy="14" r="13" fill="url(#bulbGrad)" stroke="#CA8A04" strokeWidth="2" className="animate-pulse" />

            {/* Right Antenna */}
            <line x1="150" y1="45" x2="165" y2="20" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
            <circle cx="170" cy="14" r="13" fill="url(#bulbGrad)" stroke="#CA8A04" strokeWidth="2" className="animate-pulse" />

            {/* Ear bolts */}
            <rect x="15" y="68" width="18" height="36" rx="8" fill="#475569" stroke="#1E293B" strokeWidth="2" />
            <rect x="187" y="68" width="18" height="36" rx="8" fill="#475569" stroke="#1E293B" strokeWidth="2" />

            {/* Head Body */}
            <rect x="30" y="38" width="160" height="110" rx="28" fill="url(#headGrad)" stroke="#1D4ED8" strokeWidth="4" />

            {/* Metallic Head Highlight */}
            <path d="M 50 48 Q 110 40 170 48" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

            {/* Glass Visor Screen */}
            <rect x="48" y="60" width="124" height="68" rx="18" fill="url(#visorGrad)" stroke="#38BDF8" strokeWidth="2.5" />

            {/* Glowing LED Eyes */}
            <ellipse cx="80" cy="90" rx="14" ry="18" fill="#38BDF8" className="animate-pulse" />
            <circle cx="84" cy="84" r="5" fill="#FFFFFF" />
            <ellipse cx="140" cy="90" rx="14" ry="18" fill="#38BDF8" className="animate-pulse" />
            <circle cx="144" cy="84" r="5" fill="#FFFFFF" />

            {/* Cute LED Smile */}
            <path d="M 98 108 Q 110 118 122 108" stroke="#38BDF8" strokeWidth="3.5" strokeLinecap="round" />

            {/* Cute Cheeks */}
            <circle cx="64" cy="104" r="6" fill="#F472B6" opacity="0.8" />
            <circle cx="156" cy="104" r="6" fill="#F472B6" opacity="0.8" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'bobi-body') {
    return (
      <svg
        viewBox="0 0 250 200"
        className={`w-full h-full filter drop-shadow-md ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isSilhouette ? (
          <g stroke="#3B82F6" strokeWidth="3" strokeDasharray="6 6" fill="rgba(59, 130, 246, 0.08)">
            {/* Neck collar */}
            <rect x="95" y="10" width="60" height="20" rx="8" />
            {/* Torso Box */}
            <rect x="25" y="25" width="200" height="155" rx="32" />
            {/* Chest screen */}
            <rect x="65" y="60" width="120" height="70" rx="16" />
          </g>
        ) : (
          <g>
            <defs>
              <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>
            </defs>

            {/* Neck Joint */}
            <rect x="95" y="10" width="60" height="24" rx="8" fill="#334155" stroke="#1E293B" strokeWidth="2" />

            {/* Main Torso */}
            <rect x="25" y="26" width="200" height="155" rx="32" fill="url(#bodyGrad)" stroke="#1E40AF" strokeWidth="4" />

            {/* Metallic Highlight line */}
            <path d="M 50 38 Q 125 32 200 38" stroke="#93C5FD" strokeWidth="4" strokeLinecap="round" opacity="0.5" />

            {/* Shoulder socket rivets */}
            <circle cx="42" cy="50" r="7" fill="#1E293B" stroke="#60A5FA" strokeWidth="2" />
            <circle cx="208" cy="50" r="7" fill="#1E293B" stroke="#60A5FA" strokeWidth="2" />

            {/* Chest Battery Screen Container */}
            <rect x="62" y="58" width="126" height="74" rx="18" fill="#0F172A" stroke="#22C55E" strokeWidth="3" />

            {/* Battery Level Gauge */}
            <rect x="74" y="70" width="102" height="40" rx="10" fill="#14532D" />
            <rect x="78" y="74" width="76" height="32" rx="7" fill="#22C55E" className="animate-pulse" />

            {/* Lightning bolt power icon */}
            <path d="M 116 78 L 108 92 L 115 92 L 110 102 L 122 88 L 115 88 Z" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1" />

            {/* Power text */}
            <text x="125" y="125" textAnchor="middle" fill="#4ADE80" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
              ⚡ DAYA: 100%
            </text>

            {/* Circuit button decorations */}
            <circle cx="85" cy="155" r="8" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            <circle cx="110" cy="155" r="8" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="135" cy="155" r="8" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            <rect x="155" y="151" width="35" height="8" rx="4" fill="#64748B" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'bobi-left-arm') {
    return (
      <svg
        viewBox="0 0 110 170"
        className={`w-full h-full filter drop-shadow-md ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isSilhouette ? (
          <g stroke="#3B82F6" strokeWidth="3" strokeDasharray="6 6" fill="rgba(59, 130, 246, 0.08)">
            {/* Shoulder */}
            <circle cx="65" cy="25" r="18" />
            {/* Arm column */}
            <rect x="45" y="35" width="38" height="75" rx="16" />
            {/* Hand wave */}
            <circle cx="60" cy="130" r="22" />
          </g>
        ) : (
          <g>
            {/* Shoulder Ball Joint */}
            <circle cx="65" cy="25" r="18" fill="#334155" stroke="#1E293B" strokeWidth="3" />
            <circle cx="65" cy="25" r="8" fill="#64748B" />

            {/* Upper Arm & Forearm Segment */}
            <rect x="46" y="38" width="38" height="76" rx="18" fill="#60A5FA" stroke="#2563EB" strokeWidth="3.5" />
            <rect x="52" y="68" width="26" height="8" rx="4" fill="#1D4ED8" />

            {/* Waving Hand (Yellow 3-finger robotic mitten) */}
            <g transform="translate(36, 108)">
              <circle cx="26" cy="26" r="22" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
              {/* Fingers */}
              <rect x="10" y="6" width="9" height="16" rx="4.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
              <rect x="22" y="2" width="9" height="18" rx="4.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
              <rect x="34" y="6" width="9" height="16" rx="4.5" fill="#FACC15" stroke="#CA8A04" strokeWidth="2" />
            </g>
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'bobi-right-arm') {
    return (
      <svg
        viewBox="0 0 110 170"
        className={`w-full h-full filter drop-shadow-md ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isSilhouette ? (
          <g stroke="#3B82F6" strokeWidth="3" strokeDasharray="6 6" fill="rgba(59, 130, 246, 0.08)">
            <circle cx="45" cy="25" r="18" />
            <rect x="27" y="35" width="38" height="75" rx="16" />
            <path d="M 20 120 C 20 150 70 150 70 120" strokeWidth="4" />
          </g>
        ) : (
          <g>
            {/* Shoulder Ball Joint */}
            <circle cx="45" cy="25" r="18" fill="#334155" stroke="#1E293B" strokeWidth="3" />
            <circle cx="45" cy="25" r="8" fill="#64748B" />

            {/* Upper Arm & Forearm */}
            <rect x="26" y="38" width="38" height="76" rx="18" fill="#60A5FA" stroke="#2563EB" strokeWidth="3.5" />
            <rect x="32" y="68" width="26" height="8" rx="4" fill="#1D4ED8" />

            {/* Magnetic Horseshoe Gripper */}
            <g transform="translate(14, 110)">
              {/* Horseshoe claw */}
              <path
                d="M 12 10 C 12 40 50 40 50 10 L 40 10 C 40 30 22 30 22 10 Z"
                fill="#EF4444"
                stroke="#B91C1C"
                strokeWidth="2.5"
              />
              {/* Silver magnetic tips */}
              <rect x="12" y="5" width="10" height="12" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
              <rect x="40" y="5" width="10" height="12" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
              {/* Sparkle spark */}
              <path d="M 31 18 L 33 24 L 39 25 L 34 29 L 36 35 L 31 31 L 26 35 L 28 29 L 23 25 L 29 24 Z" fill="#FACC15" />
            </g>
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'bobi-feet') {
    return (
      <svg
        viewBox="0 0 250 130"
        className={`w-full h-full filter drop-shadow-md ${className}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {isSilhouette ? (
          <g stroke="#334155" strokeWidth="3" strokeDasharray="6 6" fill="rgba(51, 65, 85, 0.08)">
            {/* Chassis Platform */}
            <rect x="25" y="10" width="200" height="45" rx="18" />
            {/* Wheels */}
            <circle cx="65" cy="80" r="32" />
            <circle cx="185" cy="80" r="32" />
          </g>
        ) : (
          <g>
            {/* Suspension Legs */}
            <rect x="52" y="5" width="26" height="40" rx="6" fill="#475569" stroke="#1E293B" strokeWidth="2" />
            <rect x="172" y="5" width="26" height="40" rx="6" fill="#475569" stroke="#1E293B" strokeWidth="2" />

            {/* Main Foot Base Platform */}
            <rect x="25" y="18" width="200" height="46" rx="18" fill="#1E293B" stroke="#0F172A" strokeWidth="3.5" />
            <rect x="40" y="34" width="170" height="8" rx="4" fill="#334155" />

            {/* Left Big Roller Wheel */}
            <circle cx="65" cy="82" r="34" fill="#0F172A" stroke="#334155" strokeWidth="4" />
            <circle cx="65" cy="82" r="22" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
            <circle cx="65" cy="82" r="8" fill="#F8FAFC" />

            {/* Right Big Roller Wheel */}
            <circle cx="185" cy="82" r="34" fill="#0F172A" stroke="#334155" strokeWidth="4" />
            <circle cx="185" cy="82" r="22" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
            <circle cx="185" cy="82" r="8" fill="#F8FAFC" />

            {/* Tread Grooves */}
            <line x1="33" y1="82" x2="43" y2="82" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
            <line x1="87" y1="82" x2="97" y2="82" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
            <line x1="153" y1="82" x2="163" y2="82" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
            <line x1="207" y1="82" x2="217" y2="82" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
      </svg>
    );
  }

  // --- 2. ROBO-ROVER PARTS ---
  if (partId === 'rover-chassis') {
    return (
      <svg viewBox="0 0 260 160" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <rect x="20" y="20" width="220" height="120" rx="26" stroke="#EA580C" strokeWidth="3" strokeDasharray="6 6" fill="rgba(234, 88, 12, 0.08)" />
        ) : (
          <g>
            <rect x="20" y="20" width="220" height="120" rx="26" fill="#EA580C" stroke="#9A3412" strokeWidth="4" />
            <rect x="50" y="45" width="160" height="70" rx="16" fill="#1E293B" stroke="#F97316" strokeWidth="2.5" />
            <text x="130" y="80" textAnchor="middle" fill="#FED7AA" fontSize="13" fontWeight="bold" fontFamily="sans-serif">
              🧠 KOMPUTER MARS
            </text>
            <circle cx="75" cy="98" r="6" fill="#22C55E" />
            <circle cx="95" cy="98" r="6" fill="#3B82F6" />
            <circle cx="115" cy="98" r="6" fill="#FACC15" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'rover-mast') {
    return (
      <svg viewBox="0 0 100 150" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <g stroke="#64748B" strokeWidth="3" strokeDasharray="6 6" fill="rgba(100, 116, 139, 0.08)">
            <rect x="42" y="45" width="16" height="95" rx="6" />
            <rect x="22" y="15" width="56" height="40" rx="14" />
            <circle cx="50" cy="35" r="14" />
          </g>
        ) : (
          <g>
            <rect x="42" y="45" width="16" height="95" rx="6" fill="#334155" stroke="#1E293B" strokeWidth="2" />
            <rect x="22" y="15" width="56" height="40" rx="14" fill="#475569" stroke="#1E293B" strokeWidth="3" />
            <circle cx="50" cy="35" r="16" fill="#0F172A" stroke="#38BDF8" strokeWidth="2" />
            <circle cx="50" cy="35" r="9" fill="#38BDF8" className="animate-pulse" />
            <circle cx="53" cy="32" r="3" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'rover-solar-left' || partId === 'rover-solar-right') {
    const isLeft = partId === 'rover-solar-left';
    return (
      <svg viewBox="0 0 130 110" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <rect x="10" y="15" width="110" height="80" rx="14" stroke="#2563EB" strokeWidth="3" strokeDasharray="6 6" fill="rgba(37, 99, 235, 0.08)" />
        ) : (
          <g>
            {/* Hinge connector */}
            <rect x={isLeft ? 100 : 8} y="40" width="22" height="30" rx="6" fill="#334155" stroke="#1E293B" strokeWidth="2" />
            {/* Solar Panel Wing */}
            <rect x="12" y="16" width="106" height="78" rx="14" fill="#1E3A8A" stroke="#60A5FA" strokeWidth="3" />
            {/* Solar Cell Grid Lines */}
            <line x1="12" y1="42" x2="118" y2="42" stroke="#93C5FD" strokeWidth="2" opacity="0.7" />
            <line x1="12" y1="68" x2="118" y2="68" stroke="#93C5FD" strokeWidth="2" opacity="0.7" />
            <line x1="48" y1="16" x2="48" y2="94" stroke="#93C5FD" strokeWidth="2" opacity="0.7" />
            <line x1="82" y1="16" x2="82" y2="94" stroke="#93C5FD" strokeWidth="2" opacity="0.7" />
            <text x="65" y="104" textAnchor="middle" fill="#93C5FD" fontSize="9" fontWeight="bold">☀️ SURYA</text>
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'rover-treads') {
    return (
      <svg viewBox="0 0 320 120" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <rect x="15" y="15" width="290" height="90" rx="30" stroke="#F97316" strokeWidth="3" strokeDasharray="6 6" fill="rgba(249, 115, 22, 0.08)" />
        ) : (
          <g>
            {/* Track Rubber Belt */}
            <rect x="12" y="16" width="296" height="88" rx="44" fill="#1E293B" stroke="#475569" strokeWidth="4" />
            <rect x="24" y="28" width="272" height="64" rx="32" fill="#0F172A" />

            {/* 6 Wheels inside tread */}
            {[52, 98, 144, 190, 236, 280].map((cx, i) => (
              <g key={i}>
                <circle cx={cx} cy="60" r="22" fill="#D97706" stroke="#92400E" strokeWidth="3" />
                <circle cx={cx} cy="60" r="10" fill="#FDE68A" />
                <circle cx={cx} cy="60" r="4" fill="#78350F" />
              </g>
            ))}
          </g>
        )}
      </svg>
    );
  }

  // --- 3. ROBO-ARM PARTS ---
  if (partId === 'arm-base') {
    return (
      <svg viewBox="0 0 200 110" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <ellipse cx="100" cy="55" rx="80" ry="35" stroke="#7C3AED" strokeWidth="3" strokeDasharray="6 6" fill="rgba(124, 58, 237, 0.08)" />
        ) : (
          <g>
            <ellipse cx="100" cy="70" rx="85" ry="32" fill="#1E293B" stroke="#0F172A" strokeWidth="3" />
            <ellipse cx="100" cy="50" rx="75" ry="28" fill="#475569" stroke="#334155" strokeWidth="3" />
            <ellipse cx="100" cy="35" rx="50" ry="20" fill="#7C3AED" stroke="#5B21B6" strokeWidth="3" />
            <circle cx="100" cy="35" r="12" fill="#FACC15" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'arm-lower' || partId === 'arm-upper') {
    return (
      <svg viewBox="0 0 140 160" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <rect x="45" y="20" width="50" height="120" rx="20" stroke="#7C3AED" strokeWidth="3" strokeDasharray="6 6" fill="rgba(124, 58, 237, 0.08)" />
        ) : (
          <g>
            <rect x="42" y="20" width="56" height="120" rx="22" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="4" />
            <circle cx="70" cy="38" r="14" fill="#334155" stroke="#1E293B" strokeWidth="3" />
            <circle cx="70" cy="122" r="14" fill="#334155" stroke="#1E293B" strokeWidth="3" />
            <rect x="58" y="58" width="24" height="44" rx="8" fill="#DDD6FE" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'arm-gripper') {
    return (
      <svg viewBox="0 0 130 130" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <path d="M 25 30 C 25 90 105 90 105 30" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6 6" fill="rgba(245, 158, 11, 0.08)" />
        ) : (
          <g>
            <rect x="45" y="10" width="40" height="30" rx="8" fill="#334155" stroke="#1E293B" strokeWidth="3" />
            <path d="M 28 35 C 28 85 55 95 65 95 C 75 95 102 85 102 35" stroke="#D97706" strokeWidth="12" strokeLinecap="round" />
            <rect x="20" y="30" width="16" height="35" rx="6" fill="#FACC15" stroke="#B45309" strokeWidth="2.5" />
            <rect x="94" y="30" width="16" height="35" rx="6" fill="#FACC15" stroke="#B45309" strokeWidth="2.5" />
          </g>
        )}
      </svg>
    );
  }

  // --- 4. ROBO-AERO (DRONE) PARTS ---
  if (partId === 'aero-core') {
    return (
      <svg viewBox="0 0 200 160" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <circle cx="100" cy="80" r="60" stroke="#0D9488" strokeWidth="3" strokeDasharray="6 6" fill="rgba(13, 148, 136, 0.08)" />
        ) : (
          <g>
            <circle cx="100" cy="80" r="62" fill="#0D9488" stroke="#042F2E" strokeWidth="4" />
            <circle cx="100" cy="80" r="38" fill="#14B8A6" stroke="#99F6E4" strokeWidth="3" />
            <circle cx="100" cy="80" r="20" fill="#0F172A" />
            <circle cx="100" cy="80" r="10" fill="#38BDF8" className="animate-pulse" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'aero-prop-1' || partId === 'aero-prop-2') {
    return (
      <svg viewBox="0 0 160 90" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <ellipse cx="80" cy="45" rx="70" ry="25" stroke="#0D9488" strokeWidth="3" strokeDasharray="6 6" fill="rgba(13, 148, 136, 0.08)" />
        ) : (
          <g>
            <circle cx="80" cy="45" r="14" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            <ellipse cx="80" cy="45" rx="68" ry="14" fill="#2DD4BF" stroke="#0F766E" strokeWidth="3" opacity="0.9" />
            <circle cx="80" cy="45" r="6" fill="#FACC15" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'aero-skids') {
    return (
      <svg viewBox="0 0 220 90" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <path d="M 20 65 L 200 65" stroke="#334155" strokeWidth="8" strokeDasharray="6 6" strokeLinecap="round" />
        ) : (
          <g>
            <path d="M 20 65 L 50 65 L 75 25 L 85 25 L 60 65 L 160 65 L 135 25 L 145 25 L 170 65 L 200 65" stroke="#334155" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
    );
  }

  // --- 5. ROBO-PUPPY PARTS ---
  if (partId === 'puppy-head') {
    return (
      <svg viewBox="0 0 180 150" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <g stroke="#DB2777" strokeWidth="3" strokeDasharray="6 6" fill="rgba(219, 39, 119, 0.08)">
            <ellipse cx="90" cy="80" rx="55" ry="45" />
            <ellipse cx="45" cy="55" rx="16" ry="32" />
            <ellipse cx="135" cy="55" rx="16" ry="32" />
          </g>
        ) : (
          <g>
            {/* Floppy ears */}
            <ellipse cx="45" cy="65" rx="16" ry="35" fill="#9D174D" stroke="#831843" strokeWidth="3" />
            <ellipse cx="135" cy="65" rx="16" ry="35" fill="#9D174D" stroke="#831843" strokeWidth="3" />
            {/* Head */}
            <ellipse cx="90" cy="80" rx="55" ry="46" fill="#F472B6" stroke="#DB2777" strokeWidth="3.5" />
            {/* Snout */}
            <ellipse cx="90" cy="98" rx="28" ry="20" fill="#FDF2F8" stroke="#F472B6" strokeWidth="2" />
            <circle cx="90" cy="90" r="7" fill="#1E293B" />
            {/* Joyful eyes */}
            <circle cx="72" cy="72" r="8" fill="#1E293B" />
            <circle cx="75" cy="70" r="3" fill="#FFFFFF" />
            <circle cx="108" cy="72" r="8" fill="#1E293B" />
            <circle cx="111" cy="70" r="3" fill="#FFFFFF" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'puppy-body') {
    return (
      <svg viewBox="0 0 220 140" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <rect x="25" y="20" width="170" height="95" rx="35" stroke="#DB2777" strokeWidth="3" strokeDasharray="6 6" fill="rgba(219, 39, 119, 0.08)" />
        ) : (
          <g>
            <rect x="25" y="20" width="170" height="95" rx="35" fill="#EC4899" stroke="#BE185D" strokeWidth="3.5" />
            <circle cx="110" cy="65" r="28" fill="#FDF2F8" stroke="#F43F5E" strokeWidth="2.5" />
            {/* Heart Core */}
            <path d="M 110 75 C 98 62 100 52 108 52 C 113 52 116 56 110 62 C 104 56 107 52 112 52 C 120 52 122 62 110 75 Z" fill="#F43F5E" className="animate-pulse" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'puppy-tail') {
    return (
      <svg viewBox="0 0 100 120" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <path d="M 60 90 Q 20 60 40 20" stroke="#F59E0B" strokeWidth="8" strokeDasharray="6 6" strokeLinecap="round" fill="none" />
        ) : (
          <g>
            <path d="M 60 95 Q 15 65 35 25" stroke="#F59E0B" strokeWidth="14" strokeLinecap="round" fill="none" className="animate-wiggle" />
            <circle cx="35" cy="25" r="10" fill="#FACC15" />
          </g>
        )}
      </svg>
    );
  }

  if (partId === 'puppy-legs') {
    return (
      <svg viewBox="0 0 220 100" className={`w-full h-full filter drop-shadow-md ${className}`} fill="none">
        {isSilhouette ? (
          <g stroke="#334155" strokeWidth="3" strokeDasharray="6 6" fill="rgba(51, 65, 85, 0.08)">
            <rect x="40" y="15" width="24" height="70" rx="12" />
            <rect x="75" y="15" width="24" height="70" rx="12" />
            <rect x="130" y="15" width="24" height="70" rx="12" />
            <rect x="165" y="15" width="24" height="70" rx="12" />
          </g>
        ) : (
          <g>
            {[40, 75, 130, 165].map((x, i) => (
              <g key={i}>
                <rect x={x} y="15" width="24" height="65" rx="12" fill="#334155" stroke="#1E293B" strokeWidth="3" />
                <ellipse cx={x + 12} cy="80" rx="16" ry="10" fill="#475569" stroke="#1E293B" strokeWidth="2.5" />
              </g>
            ))}
          </g>
        )}
      </svg>
    );
  }

  // Fallback icon box
  return (
    <div className={`w-full h-full flex items-center justify-center text-4xl rounded-2xl ${className}`}>
      🤖
    </div>
  );
};
