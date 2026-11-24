"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ThreeRobotViewer = dynamic(
  () => import("@/components/ThreeRobotViewer").then((mod) => mod.ThreeRobotViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-cyan-400 gap-3">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold">Memuat Arena 3D Robo-Bobi...</span>
      </div>
    ),
  }
);

// Audio synthesizer using Web Audio API for arcade-like kids feedback
class KidAudioEffects {
  private ctx: AudioContext | null = null;

  private getContext() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Radio signal beam transmit
  playSignal() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  // Robot beep boop thinking
  playThink() {
    const ctx = this.getContext();
    if (!ctx) return;
    [600, 900, 750, 1100].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (idx + 1) * 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.08);
      osc.stop(ctx.currentTime + (idx + 1) * 0.08);
    });
  }

  // Motor drive hum
  playMotor() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  // Obstacle warning alert
  playObstacleAlert() {
    const ctx = this.getContext();
    if (!ctx) return;
    [880, 440, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.1, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (idx + 1) * 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + (idx + 1) * 0.12);
    });
  }

  // Battery charge cheer
  playBatteryCharge() {
    const ctx = this.getContext();
    if (!ctx) return;
    [400, 520, 660, 880].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (idx + 1) * 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.09);
      osc.stop(ctx.currentTime + (idx + 1) * 0.09);
    });
  }

  // Low battery sad whine
  playBatteryLow() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }

  // Shield / Casing protection ping
  playShield() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.35);
    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  }
}

const sfx = new KidAudioEffects();

// 5 Main Core Concept Cards
interface ConceptItem {
  id: string;
  humanAnalogy: string;
  humanIcon: string;
  robotComponent: string;
  robotIcon: string;
  badgeColor: string;
  badgeBorder: string;
  description: string;
  playgroundMode: string;
  signalActionLabel: string;
  funFact: string;
}

const CONCEPTS: ConceptItem[] = [
  {
    id: "brain",
    humanAnalogy: "Otak Kita",
    humanIcon: "🧠",
    robotComponent: "Komputer Kecil / Kontroler (Microcontroller)",
    robotIcon: "💻",
    badgeColor: "bg-purple-900/60 text-purple-300 border-purple-500/40",
    badgeBorder: "border-purple-500/50 hover:border-purple-400",
    description: "Tempat Robo-Bobi berpikir, mengingat kode perintahmu, dan mengatur kapan harus bergerak atau berhenti!",
    playgroundMode: "edu_brain_signal",
    signalActionLabel: "📡 Kirim Sinyal Pikir",
    funFact: "Otak Bobi bisa memproses 16 juta instruksi dalam 1 detik!",
  },
  {
    id: "sensor",
    humanAnalogy: "Mata, Telinga & Kulit",
    humanIcon: "👀 👂 ✋",
    robotComponent: "Sensor Jarak & Sentuh (Sensors)",
    robotIcon: "📡",
    badgeColor: "bg-cyan-900/60 text-cyan-300 border-cyan-500/40",
    badgeBorder: "border-cyan-500/50 hover:border-cyan-400",
    description: "Alat ajaib untuk melihat jalan, mendeteksi dinding, mendengar suara tepuk tangan, atau merasakan tabrakan.",
    playgroundMode: "edu_sensor_eye",
    signalActionLabel: "👁️ Pindai Radar Depan",
    funFact: "Sensor ultrasonik Bobi menembakkan gelombang suara yang memantul mirip kelelawar!",
  },
  {
    id: "motor",
    humanAnalogy: "Tangan & Kaki",
    humanIcon: "🦾 🦵",
    robotComponent: "Motor Listrik & Roda (Actuators)",
    robotIcon: "⚙️",
    badgeColor: "bg-emerald-900/60 text-emerald-300 border-emerald-500/40",
    badgeBorder: "border-emerald-500/50 hover:border-emerald-400",
    description: "Otot robot! Mengubah listrik menjadi gerakan berputar agar Bobi bisa berjalan, berbelok lincah, atau melambaikan tangan.",
    playgroundMode: "edu_motor_drive",
    signalActionLabel: "🚀 Putar Roda Motor",
    funFact: "Roda Segway Bobi selalu menjaga keseimbangannya agar tidak terjatuh!",
  },
  {
    id: "battery",
    humanAnalogy: "Nasi & Susu (Makanan)",
    humanIcon: "🍚 🥛",
    robotComponent: "Baterai Li-Po (Power Supply)",
    robotIcon: "🔋",
    badgeColor: "bg-amber-900/60 text-amber-300 border-amber-500/40",
    badgeBorder: "border-amber-500/50 hover:border-amber-400",
    description: "Makanan & energi robot! Kalau baterai habis, Bobi akan lemas tertidur. Ayo isi dayanya agar bugar dan bersemangat!",
    playgroundMode: "edu_battery_full",
    signalActionLabel: "⚡ Beri Makanan (Cas Baterai)",
    funFact: "Baterai Bobi menyimpan elektron-elektron kecil yang siap mengalir memberi tenaga!",
  },
  {
    id: "casing",
    humanAnalogy: "Tulang & Kulit",
    humanIcon: "🦴 🛡️",
    robotComponent: "Rangka & Casing (Chassis / Body)",
    robotIcon: "🤖",
    badgeColor: "bg-rose-900/60 text-rose-300 border-rose-500/40",
    badgeBorder: "border-rose-500/50 hover:border-rose-400",
    description: "Baju zirah pelindung! Menjaga komponen elektronik di dalam tubuh Bobi agar tetap aman dari benturan, debu, dan jatuh.",
    playgroundMode: "edu_casing",
    signalActionLabel: "🛡️ Aktifkan Perisai Rangka",
    funFact: "Casing Bobi dibuat dari polimer ringan anti lecet yang kuat dan kokoh!",
  },
];

export default function CaraKerjaRobotPage() {
  // Always Robo-Bobi ("biped") for all tests
  const robotType = "biped";

  // Active state
  const [activeConcept, setActiveConcept] = useState<string>("brain");
  const [eduAnimation, setEduAnimation] = useState<string>("edu_brain");
  const [controllerSignalActive, setControllerSignalActive] = useState<boolean>(false);
  const [signalBeamText, setSignalBeamText] = useState<string>("");
  const [bobiStatusMessage, setBobiStatusMessage] = useState<string>(
    "Hai teman kecil! Aku Robo-Bobi! Coba tekan tombol di Remote Kontrolmu!"
  );
  const [batteryLevel, setBatteryLevel] = useState<number>(100);
  const [radarActive, setRadarActive] = useState<boolean>(false);
  const [logicStep, setLogicStep] = useState<string>("standby");
  const [obstacleDistance, setObstacleDistance] = useState<number>(150);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const distanceIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger Signal Transmission from Controller to Bobi
  const triggerControllerCommand = (
    mode: string,
    signalName: string,
    bobiReply: string,
    sfxType: "signal" | "think" | "motor" | "alert" | "battery" | "low" | "shield" = "signal",
    durationMs: number = 3200
  ) => {
    if (timerRef.current) clearTimeout(timerRef.current);

    // Audio SFX
    if (sfxType === "signal") sfx.playSignal();
    else if (sfxType === "think") sfx.playThink();
    else if (sfxType === "motor") sfx.playMotor();
    else if (sfxType === "alert") sfx.playObstacleAlert();
    else if (sfxType === "battery") sfx.playBatteryCharge();
    else if (sfxType === "low") sfx.playBatteryLow();
    else if (sfxType === "shield") sfx.playShield();

    // Signal beam animation
    setControllerSignalActive(true);
    setSignalBeamText(`📡 ~ ~ ~ [${signalName}] ~ ~ ~ ⚡ ➔ 🧠`);
    setEduAnimation(mode);
    setBobiStatusMessage(bobiReply);

    timerRef.current = setTimeout(() => {
      setControllerSignalActive(false);
      setSignalBeamText("");
    }, 1800);
  };

  // Complex Logic Test Simulation: Bobi drives across the field -> encounters wall obstacle -> brakes -> reverses & turns away!
  const runObstacleAvoidanceLogic = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (distanceIntervalRef.current) clearInterval(distanceIntervalRef.current);

    setLogicStep("moving_forward");
    setObstacleDistance(150);
    sfx.playMotor();
    setControllerSignalActive(true);
    setSignalBeamText("📡 ~ ~ ~ [LAPANGAN: MAJU MENUJU ARAH DEPAN] ~ ~ ~ ⚡ ➔ 🧠");
    setEduAnimation("edu_move_obstacle");
    setBobiStatusMessage("1️⃣ LAPANGAN: Bobi meluncur maju menjelajahi lapangan menuju arah depan! 🚗💨");

    // Dynamic distance countdown from 150cm to 25cm
    let currentDist = 150;
    distanceIntervalRef.current = setInterval(() => {
      currentDist = Math.max(25, currentDist - 15);
      setObstacleDistance(currentDist);
      if (currentDist <= 25 && distanceIntervalRef.current) {
        clearInterval(distanceIntervalRef.current);
      }
    }, 280);

    // Phase 2: Approaching wall (3.0s) - Sensor radar turns red, warning beacon flashes!
    setTimeout(() => {
      setLogicStep("wall_detected");
      setObstacleDistance(25);
      sfx.playObstacleAlert();
      setBobiStatusMessage("2️⃣ AWAS TEMBOK! 🚨 Sensor mata melihat ada rintangan tembok di jarak 25 cm! Rem darurat!");
    }, 3000);

    // Phase 3: Thinking decision (4.5s)
    setTimeout(() => {
      setLogicStep("thinking");
      sfx.playThink();
      setBobiStatusMessage("3️⃣ OTAK BERPIKIR: 'Tembok berbahaya di depan! Keputusan logika: Mundur & Belok Kanan!' 🧠💭");
    }, 4500);

    // Phase 4: Evasive turn away (5.8s)
    setTimeout(() => {
      setLogicStep("turn_away");
      setObstacleDistance(65);
      sfx.playMotor();
      setBobiStatusMessage("4️⃣ MOTOR MENGHINDAR: Roda berputar mundur lalu berbelok 37° ke kanan! Tembok terhindari! 🔄✨");
    }, 5800);

    // Phase 5: Success & Safe (8.0s)
    setTimeout(() => {
      setLogicStep("standby");
      setObstacleDistance(150);
      setControllerSignalActive(false);
      setSignalBeamText("");
      sfx.playBatteryCharge();
      setBobiStatusMessage("🎉 Hore! Robo-Bobi berhasil melewati rintangan tembok di lapangan dengan selamat! Hebat!");
    }, 8000);
  };

  // Battery Full vs Empty simulation
  const handleFeedBattery = (level: "full" | "empty") => {
    if (level === "full") {
      setBatteryLevel(100);
      triggerControllerCommand(
        "edu_battery_full",
        "ENERGY: 100% KENYANG",
        "Yummy! 🍚🥛 Baterai Bobi penuh 100%! Tubuhku berenergi dan siap melompat gembira! ⚡⚡⚡",
        "battery"
      );
    } else {
      setBatteryLevel(10);
      triggerControllerCommand(
        "edu_battery_low",
        "ENERGY: 0% LEMAS",
        "Aduuh... Bobi lapar belum makan baterai... Badanku lemas tidak kuat bergerak... Zzz 😴🪫",
        "low"
      );
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (distanceIntervalRef.current) clearInterval(distanceIntervalRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Header & Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/70 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 border border-slate-700/60 transition shadow-sm"
            >
              <span>⬅️</span>
              <span>Kembali ke Bengkel</span>
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🎪</span>
                <h1 className="text-base sm:text-lg font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-300 to-amber-300">
                  Taman Bermain Robo-Bobi 3D
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Khusus Robo-Bobi
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden md:block">
                Laboratorium visual seru untuk anak-anak mengenal Otak, Sensor, Motor, Baterai, dan Rangka Robot!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/70 px-3 py-1.5 rounded-xl text-xs font-medium">
              <span>🔋 Baterai:</span>
              <span className={`font-bold ${batteryLevel > 30 ? "text-emerald-400" : "text-rose-400"}`}>
                {batteryLevel}%
              </span>
              <div className="w-12 h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/80 ml-1">
                <div
                  className={`h-full transition-all duration-500 ${
                    batteryLevel > 30 ? "bg-gradient-to-r from-emerald-500 to-cyan-400" : "bg-rose-500"
                  }`}
                  style={{ width: `${batteryLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Interactive Playground */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Signal Beam Visualizer Banner */}
        <div
          className={`relative overflow-hidden rounded-2xl p-3 sm:p-4 border transition-all duration-300 ${
            controllerSignalActive
              ? "bg-gradient-to-r from-purple-950/80 via-cyan-950/80 to-purple-950/80 border-cyan-400/60 shadow-[0_0_30px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/30"
              : "bg-slate-900/60 border-slate-800/80"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-transform ${
                  controllerSignalActive ? "scale-110 rotate-12 bg-cyan-500/30 border border-cyan-400" : "bg-slate-800"
                }`}
              >
                {controllerSignalActive ? "📡" : "🎮"}
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                  {controllerSignalActive ? "Transmisi Sinyal Aktif!" : "Status Kendali Robot"}
                </div>
                <div className="text-sm font-semibold text-slate-200">
                  {controllerSignalActive ? (
                    <span className="text-cyan-300 font-mono tracking-wider animate-pulse">
                      {signalBeamText}
                    </span>
                  ) : (
                    <span>Remote Kontrol Siap Mengirim Sinyal ke Robo-Bobi</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bubble speech Bobi */}
            <div className="w-full sm:w-auto sm:max-w-md bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2 text-xs flex items-center gap-2">
              <span className="text-base flex-shrink-0">🤖</span>
              <p className="text-slate-300 italic font-medium leading-relaxed">
                &ldquo;{bobiStatusMessage}&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* 2-Column Split: 3D Canvas + Virtual Remote Controller */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: 3D Stage (7 Columns) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="relative w-full h-[460px] sm:h-[520px] rounded-3xl overflow-hidden border-2 border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl">
              {/* Three.js Viewer Canvas */}
              <ThreeRobotViewer
                robotType={robotType}
                actionTrigger={eduAnimation}
                className="w-full h-full"
              />

              {/* Status Badge & Sensor HUD in 3D Stage */}
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 shadow-lg">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-bold text-cyan-200">Robo-Bobi di Lapangan</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">🏟️ Arena 3D</span>
                </div>
                {logicStep !== "standby" && (
                  <div className="bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 px-3.5 py-1.5 rounded-2xl shadow-xl flex items-center gap-2 animate-pulse">
                    <span className="text-sm">
                      {logicStep === "moving_forward" && "🟢"}
                      {logicStep === "wall_detected" && "🚨"}
                      {logicStep === "thinking" && "🧠"}
                      {logicStep === "turn_away" && "🔄"}
                    </span>
                    <span className="text-xs font-black text-cyan-200">
                      {logicStep === "moving_forward" && "1. Meluncur di Lapangan Menuju Arah Depan"}
                      {logicStep === "wall_detected" && "2. AWAS TEMBOK! Terdeteksi di Jarak 25cm!"}
                      {logicStep === "thinking" && "3. Otak Menghitung: Mundur & Belok Kanan!"}
                      {logicStep === "turn_away" && "4. Motor Roda Berbelok Menghindar!"}
                    </span>
                  </div>
                )}
              </div>

              {/* Top-Right: Live Obstacle & Ultrasonic Distance HUD */}
              <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2">
                <div className="bg-slate-950/85 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-end gap-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <span>📡 Sensor Mata (Ultrasonik)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-300">Jarak Tembok:</span>
                    <span
                      className={`text-sm font-black font-mono px-2 py-0.5 rounded-md border ${
                        obstacleDistance <= 30
                          ? "bg-rose-950/80 text-rose-300 border-rose-500 animate-pulse"
                          : obstacleDistance <= 70
                          ? "bg-amber-950/80 text-amber-300 border-amber-500"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-500"
                      }`}
                    >
                      {obstacleDistance} cm
                    </span>
                  </div>
                  <div className="text-[9px] text-slate-500 flex items-center gap-1">
                    <span>🧱 Rintangan: Tembok di Depan</span>
                  </div>
                </div>
              </div>

              {/* Controls prompt overlay bottom */}
              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 px-3 py-1.5 rounded-xl shadow-lg">
                  🖱️ <span className="text-slate-400">Putar sudut 3D dengan drag mouse / sentuhan layar</span>
                </div>
                <div className="bg-slate-950/85 backdrop-blur-md border border-slate-800 text-[11px] text-cyan-300 px-3 py-1.5 rounded-xl font-mono shadow-lg">
                  Modus: {eduAnimation.replace("edu_", "").toUpperCase()}
                </div>
              </div>
            </div>

            {/* Quick 3D Camera / Pose Presets */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>💡 Cobalah putar Bobi ke samping untuk melihat roda motor & casing belakangnya!</span>
            </div>
          </div>

          {/* Right: The Virtual Gamepad / Robot Controller (5 Columns) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border-2 border-cyan-500/30 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
              {/* Controller Header Decoration */}
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-black tracking-wider uppercase text-slate-300 ml-1">
                      Remote Kendali Robo-Bobi
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-0.5 rounded-lg border border-cyan-800/60">
                    <span>TX 2.4GHz</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping ml-0.5" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  Tekan tombol di bawah untuk mengirimkan <strong className="text-cyan-300">sinyal radio</strong> ke otak Bobi dan saksikan responnya di panggung 3D!
                </p>

                {/* Section A: Otak & Logika (The Core Request) */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2 flex items-center gap-1.5">
                    <span>🧠</span>
                    <span>1. Otak & Komputer (Logika)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      onClick={() =>
                        triggerControllerCommand(
                          "edu_brain_signal",
                          "KIRIM SINYAL PIKIR",
                          "Otakku sedang berpikir keras dan mengolah instruksi coding dari kamu! Cincin data menyala ungu! 🧠✨",
                          "think"
                        )
                      }
                      className="p-2.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 hover:border-purple-400 text-left transition flex items-center gap-2.5 shadow-sm active:scale-95 group"
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform">🧠</span>
                      <div>
                        <div className="text-xs font-bold text-purple-200">Kirim Sinyal Pikir</div>
                        <div className="text-[10px] text-purple-400">Halo digital otak aktif</div>
                      </div>
                    </button>

                    <button
                      onClick={runObstacleAvoidanceLogic}
                      className={`p-3 rounded-2xl border text-left transition flex items-center gap-2.5 shadow-lg active:scale-95 group col-span-1 sm:col-span-2 ${
                        logicStep !== "standby"
                          ? "bg-gradient-to-r from-cyan-900/90 via-purple-900/90 to-amber-900/90 border-cyan-300 ring-2 ring-cyan-400/50 animate-pulse"
                          : "bg-gradient-to-r from-cyan-950/70 to-purple-950/70 hover:from-cyan-900/90 hover:to-purple-900/90 border-cyan-400/60 hover:border-cyan-300"
                      }`}
                    >
                      <span className="text-2xl group-hover:scale-125 transition-transform flex-shrink-0">🧱</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-cyan-200">Uji Logika Tembok di Lapangan!</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-400/40">
                            {logicStep !== "standby" ? "Sedang Menguji ⚡" : "Simulasi Seru"}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-300 mt-0.5">
                          Bobi meluncur di lapangan ➔ ada rintangan tembok ➔ sensor mendeteksi ➔ mundur & belok!
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Section B: Mata & Sensor */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                    <span>👀</span>
                    <span>2. Mata & Telinga (Sensor)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() =>
                        triggerControllerCommand(
                          "edu_sensor_eye",
                          "RADAR MATA AKTIF",
                          "Mata ultrasonikku memancarkan radar cyan untuk mengukur jarak benda di depanku! 👁️📐",
                          "alert"
                        )
                      }
                      className="p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-300 text-center transition active:scale-95 group"
                    >
                      <span className="text-lg block group-hover:scale-125 transition-transform">👁️</span>
                      <span className="text-[10px] font-bold text-cyan-200 block mt-0.5">Mata Radar</span>
                    </button>

                    <button
                      onClick={() =>
                        triggerControllerCommand(
                          "edu_sensor_sound",
                          "DETEKSI SUARA",
                          "Telinga mikrofonku mendengar tepukan tanganmu! Prok prok prok! 👂🎶",
                          "signal"
                        )
                      }
                      className="p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-300 text-center transition active:scale-95 group"
                    >
                      <span className="text-lg block group-hover:scale-125 transition-transform">👂</span>
                      <span className="text-[10px] font-bold text-cyan-200 block mt-0.5">Sensor Suara</span>
                    </button>

                    <button
                      onClick={() =>
                        triggerControllerCommand(
                          "edu_sensor_touch",
                          "SENSOR SENTUH",
                          "Kulit bumperku merasakan sentuhan! Bobi tahu ada yang memegang! ✋⚡",
                          "signal"
                        )
                      }
                      className="p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 hover:border-cyan-300 text-center transition active:scale-95 group"
                    >
                      <span className="text-lg block group-hover:scale-125 transition-transform">✋</span>
                      <span className="text-[10px] font-bold text-cyan-200 block mt-0.5">Kulit Sentuh</span>
                    </button>
                  </div>
                </div>

                {/* Section C: Tangan & Kaki (Motor & D-Pad) */}
                <div className="mb-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span>🦾</span>
                      <span>3. Tangan & Kaki (Motor Listrik)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">D-Pad Kontroler</span>
                  </div>

                  {/* D-Pad Layout */}
                  <div className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
                    <button
                      onClick={() =>
                        triggerControllerCommand(
                          "edu_motor_drive",
                          "MAJU RODA",
                          "Kedua motor roda berputar ke depan! Bobi meluncur maju! 🚗💨",
                          "motor"
                        )
                      }
                      className="px-5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 font-bold text-xs flex items-center gap-1 active:scale-95 transition shadow-sm"
                    >
                      <span>⬆️</span>
                      <span>Maju Depan</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          triggerControllerCommand(
                            "edu_turn_left",
                            "BELOK KIRI",
                            "Motor kanan berputar lebih cepat, Bobi berbelok ke kiri! ⬅️🔄",
                            "motor"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 font-bold text-xs flex items-center gap-1 active:scale-95 transition shadow-sm"
                      >
                        <span>⬅️</span>
                        <span>Belok Kiri</span>
                      </button>

                      <button
                        onClick={() =>
                          triggerControllerCommand(
                            "edu_motor_arm",
                            "LAMBAI TANGAN",
                            "Motor servo di lengan kananku bergerak: Halo teman-teman semua! 👋🤖",
                            "signal"
                          )
                        }
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs flex items-center gap-1 active:scale-95 transition"
                      >
                        <span>👋</span>
                        <span>Sapa</span>
                      </button>

                      <button
                        onClick={() =>
                          triggerControllerCommand(
                            "edu_turn_right",
                            "BELOK KANAN",
                            "Motor kiri berputar lebih cepat, Bobi berbelok ke kanan! ➡️🔄",
                            "motor"
                          )
                        }
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-800/80 border border-emerald-500/50 text-emerald-200 font-bold text-xs flex items-center gap-1 active:scale-95 transition shadow-sm"
                      >
                        <span>Belok Kanan</span>
                        <span>➡️</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() =>
                          triggerControllerCommand(
                            "edu_magnet",
                            "CAPIT MAGNET",
                            "Lengan kiri mengaktifkan elektromagnet! Benda logam menempel kuat! 🧲⚡",
                            "signal"
                          )
                        }
                        className="px-3 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 active:scale-95"
                      >
                        <span>🧲 Capit Magnet</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section D: Makanan (Baterai) & Tulang (Rangka) */}
                <div className="grid grid-cols-2 gap-2">
                  {/* Baterai */}
                  <div className="p-3 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex flex-col justify-between">
                    <div className="text-[11px] font-bold uppercase text-amber-300 flex items-center gap-1 mb-2">
                      <span>🔋</span>
                      <span>4. Makanan Robot</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => handleFeedBattery("full")}
                        className="w-full py-1.5 rounded-lg bg-amber-500/30 hover:bg-amber-500/40 border border-amber-400 text-amber-200 text-xs font-bold active:scale-95 transition flex items-center justify-center gap-1"
                      >
                        <span>⚡ Cas 100%</span>
                      </button>
                      <button
                        onClick={() => handleFeedBattery("empty")}
                        className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-rose-300 text-[10px] font-semibold active:scale-95 transition flex items-center justify-center gap-1"
                      >
                        <span>🪫 Buat Lemas (0%)</span>
                      </button>
                    </div>
                  </div>

                  {/* Rangka & Casing */}
                  <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex flex-col justify-between">
                    <div className="text-[11px] font-bold uppercase text-rose-300 flex items-center gap-1 mb-2">
                      <span>🛡️</span>
                      <span>5. Rangka & Casing</span>
                    </div>
                    <button
                      onClick={() =>
                        triggerControllerCommand(
                          "edu_casing",
                          "PERISAI RANGKA",
                          "Kubah pelindung hologram aktif! Tulang dan casing kokoh menjaga komponen dalam Bobi tetap aman! 🛡️🤖",
                          "shield"
                        )
                      }
                      className="w-full py-2.5 rounded-xl bg-rose-500/30 hover:bg-rose-500/40 border border-rose-400 text-rose-200 text-xs font-bold active:scale-95 transition flex flex-col items-center justify-center gap-0.5 shadow-sm"
                    >
                      <span>🛡️ Uji Kekuatan Casing</span>
                      <span className="text-[9px] text-rose-300/80 font-normal">Aktifkan Kubah Perisai</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Controller Footer Tag */}
              <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                🎮 Remote Controller Virtual • Mode Belajar Anak • Robo-Bobi Playground
              </div>
            </div>
          </div>
        </div>

        {/* 5 Pedagogical Analogy Cards */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-100 flex items-center gap-2">
                <span>📖</span>
                <span>5 Bagian Tubuh Robot vs Tubuh Manusia</span>
              </h2>
              <p className="text-xs text-slate-400">
                Pahami cara robot hidup dan bekerja lewat perbandingan dengan tubuh kita sendiri!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CONCEPTS.map((c) => {
              const isSelected = activeConcept === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setActiveConcept(c.id);
                    triggerControllerCommand(
                      c.playgroundMode,
                      c.humanAnalogy.toUpperCase(),
                      c.description,
                      "think"
                    );
                  }}
                  className={`cursor-pointer rounded-2xl p-4 transition-all duration-300 flex flex-col justify-between border ${
                    isSelected
                      ? `bg-slate-900 border-2 ${c.badgeBorder} shadow-lg ring-1 ring-cyan-500/20`
                      : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90"
                  }`}
                >
                  <div>
                    {/* Badge comparison */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
                        <span className="text-base">{c.humanIcon}</span>
                        <span className="text-xs font-bold text-slate-200">{c.humanAnalogy}</span>
                      </div>
                      <span className="text-slate-500 text-xs font-bold">➔</span>
                      <div className={`px-2.5 py-1 rounded-xl border text-[11px] font-bold ${c.badgeColor}`}>
                        <span>{c.robotIcon}</span> {c.robotComponent.split("(")[0].trim()}
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {c.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-amber-300/90 flex items-center gap-1 italic">
                      💡 {c.funFact}
                    </span>
                    <button
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition ${
                        isSelected
                          ? "bg-cyan-500 text-slate-950 border-cyan-400"
                          : "bg-slate-800 text-slate-300 border-slate-700"
                      }`}
                    >
                      Uji 3D
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Bonus Interactive Card: Summary Table */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-cyan-950/40 via-purple-950/30 to-slate-900 border border-cyan-500/40 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-cyan-300">
                  <span className="text-xl">🏆</span>
                  <h3 className="text-xs font-black uppercase tracking-wider">Kesimpulan Cepat</h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Robot bukanlah benda magis, melainkan mesin cerdas yang bekerja sama:
                </p>
                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded-lg">
                    <span>1. Sensor menerima informasi</span>
                    <span className="text-cyan-400 font-bold">Melihat</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded-lg">
                    <span>2. Kontroler mengambil keputusan</span>
                    <span className="text-purple-400 font-bold">Berpikir</span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950/60 px-2 py-1 rounded-lg">
                    <span>3. Motor melakukan tindakan</span>
                    <span className="text-emerald-400 font-bold">Bergerak</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 text-center">
                <Link
                  href="/"
                  className="inline-block w-full text-center text-xs font-bold py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md transition"
                >
                  🚀 Ayo Rakit & Beri Perintah Coding!
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Educational Table */}
        <section className="mt-2 bg-slate-900/60 border border-slate-800 rounded-3xl p-5 overflow-x-auto">
          <h3 className="text-sm font-black text-slate-200 mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>Tabel Perbandingan Lengkap: Tubuh Manusia vs Tubuh Robo-Bobi</span>
          </h3>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                <th className="py-2.5 px-3">Tubuh Manusia</th>
                <th className="py-2.5 px-3">Bagian Robot</th>
                <th className="py-2.5 px-3">Tugas & Fungsi</th>
                <th className="py-2.5 px-3">Contoh di Robo-Bobi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-850/40">
                <td className="py-2.5 px-3 font-semibold text-purple-300">🧠 Otak</td>
                <td className="py-2.5 px-3 font-medium text-purple-400">Komputer Kecil / Kontroler</td>
                <td className="py-2.5 px-3">Tempat berpikir, menghitung logika, dan mengingat perintah program.</td>
                <td className="py-2.5 px-3 text-slate-400">Microcontroller Arduino / ESP32 di dalam dada Bobi</td>
              </tr>
              <tr className="hover:bg-slate-850/40">
                <td className="py-2.5 px-3 font-semibold text-cyan-300">👀 👂 ✋ Mata, Telinga, Kulit</td>
                <td className="py-2.5 px-3 font-medium text-cyan-400">Sensor (Ultrasonik, Suara, Sentuh)</td>
                <td className="py-2.5 px-3">Melihat jalan, mendeteksi jarak, mendengar tepukan, dan merasakan benda.</td>
                <td className="py-2.5 px-3 text-slate-400">Sensor jarak ultrasonik di kacamata Bobi</td>
              </tr>
              <tr className="hover:bg-slate-850/40">
                <td className="py-2.5 px-3 font-semibold text-emerald-300">🦾 🦵 Tangan & Kaki</td>
                <td className="py-2.5 px-3 font-medium text-emerald-400">Motor / Roda / Servo</td>
                <td className="py-2.5 px-3">Alat untuk berjalan lurus, berbelok, melambai, atau mengambil barang.</td>
                <td className="py-2.5 px-3 text-slate-400">Dua roda hoverboard & servo lengan Bobi</td>
              </tr>
              <tr className="hover:bg-slate-850/40">
                <td className="py-2.5 px-3 font-semibold text-amber-300">🍚 🥛 Nasi & Susu (Makanan)</td>
                <td className="py-2.5 px-3 font-medium text-amber-400">Baterai (Power Supply)</td>
                <td className="py-2.5 px-3">Makanan robot supaya bugar, kuat bergerak, dan tidak lemas (mati daya).</td>
                <td className="py-2.5 px-3 text-slate-400">Baterai Lithium rechargeable di punggung Bobi</td>
              </tr>
              <tr className="hover:bg-slate-850/40">
                <td className="py-2.5 px-3 font-semibold text-rose-300">🦴 🛡️ Tulang & Kulit</td>
                <td className="py-2.5 px-3 font-medium text-rose-400">Rangka / Casing (Chassis)</td>
                <td className="py-2.5 px-3">Pelindung bagian dalam agar komponen elektronik tidak rusak saat jatuh.</td>
                <td className="py-2.5 px-3 text-slate-400">Rangka bodi biru kokoh anti gores milik Bobi</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
