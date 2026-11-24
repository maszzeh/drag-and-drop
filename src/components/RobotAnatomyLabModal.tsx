'use client';

import React, { useState } from 'react';
import {
  X,
  Brain,
  Eye,
  Activity,
  Zap,
  Shield,
  Volume2,
  Sparkles,
  RotateCcw,
  Play,
  Heart,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react';
import { ThreeRobotViewer } from './ThreeRobotViewer';
import { RobotType } from '../types/robot';
import { sounds } from '../utils/audio';

interface RobotAnatomyLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRobotType?: RobotType;
}

type ConceptKey = 'brain' | 'sensor' | 'motor' | 'battery' | 'casing';

interface ConceptData {
  id: ConceptKey;
  humanAnalogy: string;
  humanIcon: string;
  robotComponent: string;
  robotIcon: string;
  title: string;
  tagline: string;
  badgeColor: string;
  borderColor: string;
  bgGradient: string;
  humanExplanation: string;
  robotExplanation: string;
  voiceText: string;
  dialogueText: string;
  experiments: {
    label: string;
    actionTrigger: string;
    soundType: 'pop' | 'snap' | 'success' | 'beep' | 'motor';
    voiceResponse: string;
    description: string;
  }[];
  pedagogicalQuestion: string;
}

const CONCEPTS: ConceptData[] = [
  {
    id: 'brain',
    humanAnalogy: 'Otak di Kepala',
    humanIcon: '🧠',
    robotComponent: 'Komputer Kecil / Kontroler (Mikrokontroler)',
    robotIcon: '💻',
    title: 'Otak Robot (Pusat Berpikir & Memori)',
    tagline: 'Tempat robot berpikir dan mengingat perintah coding.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    borderColor: 'border-purple-400',
    bgGradient: 'from-purple-500/10 via-indigo-50/40 to-white',
    humanExplanation:
      'Otak di dalam kepala kita berfungsi untuk berpikir, mengingat nama teman, dan menyuruh tubuh kita bergerak saat bermain.',
    robotExplanation:
      'Robot punya komputer kecil (mikrokontroler)! Chip ini membaca kode perintah dari anak-anak, lalu memberi tahu motor kapan harus maju, berbelok, atau berhenti.',
    voiceText:
      'Otak robot adalah komputer kecil. Di sinilah robot berpikir dan mengingat semua perintah dari kamu!',
    dialogueText:
      'Bip bop! Otak komputermu menerima instruksi kode! Aku siap berpikir dan memimpin seluruh gerakanku!',
    experiments: [
      {
        label: '🧠 Kirim Perintah Berpikir',
        actionTrigger: 'edu_brain',
        soundType: 'beep',
        voiceResponse:
          'Bip bip! Otak komputer menerima sinyal berpikir! Lampu data di kepala menyala!',
        description: 'Lihat cincin data digital dan lampu antena di kepala robot berkedip aktif!',
      },
      {
        label: '🧩 Logika: "Jika Ada Rintangan ➔ Belok!"',
        actionTrigger: 'edu_brain',
        soundType: 'pop',
        voiceResponse:
          'Logika cerdas berjalan! Jika sensor melihat tembok, otak memerintahkan motor berbelok!',
        description: 'Robot memproses logika sebab-akibat (kondisional IF-THEN) seperti komputer cerdas.',
      },
    ],
    pedagogicalQuestion:
      'Tanya anak: "Kalau kita mau melompat, siapa yang menyuruh kaki kita bergerak? Ya, otak kita! Robot juga punya otak kecil di kepalanya."',
  },
  {
    id: 'sensor',
    humanAnalogy: 'Mata, Telinga, & Kulit (Panca Indera)',
    humanIcon: '👀👂🖐️',
    robotComponent: 'Sensor Penglihatan, Suara, & Sentuh',
    robotIcon: '📡',
    title: 'Sensor Robot (Panca Indera Canggih)',
    tagline: 'Alat untuk melihat jalan, mendengar tepuk tangan, atau merasakan benda di depannya.',
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    borderColor: 'border-sky-400',
    bgGradient: 'from-sky-500/10 via-cyan-50/40 to-white',
    humanExplanation:
      'Kita punya mata untuk melihat warna pelangi, telinga untuk mendengar suara mama, dan kulit untuk merasakan sentuhan hangat.',
    robotExplanation:
      'Robot tidak punya mata biologis, tapi punya Sensor Kamera, Radar Ultrasonik, dan Sensor Sentuh. Robot jadi bisa tahu jika ada meja di depan agar tidak menabrak!',
    voiceText:
      'Sensor adalah mata dan telinga robot. Dengan sensor, robot bisa melihat jalan dan mendengar tepuk tanganmu!',
    dialogueText:
      'Mata sensor dan telingaku aktif! Aku bisa melihat sekeliling dan mendeteksi kamu teman baikku!',
    experiments: [
      {
        label: '👀 Nyalakan Radar Sensor Mata',
        actionTrigger: 'edu_sensor_eye',
        soundType: 'pop',
        voiceResponse:
          'Wuuusshh! Sinar radar kamera aktif memancar ke depan untuk mendeteksi rintangan!',
        description: 'Muncul pancaran sinar radar sensor 3D berwarna cyan dari mata robot!',
      },
      {
        label: '👏 Tepuk Tangan (Sensor Suara)',
        actionTrigger: 'edu_sensor_sound',
        soundType: 'beep',
        voiceResponse:
          'Prok prok! Sensor suara mendengar tepukan tanganmu! Antena robot bergetar gembira!',
        description: 'Antena robot bergetar menyerap frekuensi suara tepuk tangan anak.',
      },
      {
        label: '🖐️ Sentuh Bumper (Sensor Raba)',
        actionTrigger: 'edu_sensor_touch',
        soundType: 'snap',
        voiceResponse:
          'Tit tit! Sensor sentuh bumper merasakan sentuhan tanganmu di bodi robot!',
        description: 'Sensor mikro-saklar (bumper) mendeteksi kontak fisik lembut.',
      },
    ],
    pedagogicalQuestion:
      'Ajak anak menutup mata: "Bisakah kita jalan tanpa mata? Susah kan? Robot juga butuh sensor kamera agar tidak menabrak pintu!"',
  },
  {
    id: 'motor',
    humanAnalogy: 'Otot, Tangan, & Kaki',
    humanIcon: '🦾🛹',
    robotComponent: 'Motor Listrik, Roda, & Lengan Servo',
    robotIcon: '⚙️',
    title: 'Motor & Roda Robot (Penggerak Aksi)',
    tagline: 'Alat untuk berjalan, berputar, meluncur, atau mengambil barang.',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    borderColor: 'border-amber-400',
    bgGradient: 'from-amber-500/10 via-orange-50/40 to-white',
    humanExplanation:
      'Otot di kaki kita membuat kita bisa berlari kencang, dan tangan kita bisa memegang krayon untuk menggambar.',
    robotExplanation:
      'Robot menggunakan Motor Listrik dan Servo! Motor memutar roda karet untuk meluncur maju-mundur, serta menggerakkan capit magnet untuk mengambil balok mainan.',
    voiceText:
      'Motor dan roda adalah tangan dan kaki robot. Motor ini memutar roda dan menggerakkan capit robot!',
    dialogueText:
      'Vrooom! Motor penggerakku bertenaga! Aku siap meluncur kencang dan melambaikan tangan menyapamu!',
    experiments: [
      {
        label: '🛹 Putar Motor Roda (Maju Cepat!)',
        actionTrigger: 'edu_motor_drive',
        soundType: 'motor',
        voiceResponse:
          'Vroooom! Motor listrik memutar roda kencang, robot meluncur dengan seimbang!',
        description: 'Roda robot berputar secara 3D dan bodi robot bersiap meluncur.',
      },
      {
        label: '👋 Lambaikan Tangan Robot (Motor Servo)',
        actionTrigger: 'edu_motor_arm',
        soundType: 'pop',
        voiceResponse:
          'Halo teman cilik! Motor servo bahu dan siku menggerakkan tangan melambai ramah!',
        description: 'Sendi servo di siku dan bahu mengangkat tangan melambai ke anak.',
      },
      {
        label: '🧲 Aktifkan Capit Magnet',
        actionTrigger: 'edu_motor_arm',
        soundType: 'beep',
        voiceResponse:
          'Zzzzzzt! Capit magnetik menyala menghasilkan daya tarik untuk mengangkat balok!',
        description: 'Ujung capit magnetik memancarkan kilau gaya tarik magnet 3D.',
      },
    ],
    pedagogicalQuestion:
      'Ajak anak menggerakkan siku: "Coba tekuk tanganmu! Di siku robot ada motor bulat kecil bernama servo yang bekerja persis seperti sikumu!"',
  },
  {
    id: 'battery',
    humanAnalogy: 'Nasi, Sayur, & Susu (Makanan Sehat)',
    humanIcon: '🍚🥛',
    robotComponent: 'Baterai Tenaga Listrik & Panel Surya',
    robotIcon: '⚡',
    title: 'Baterai Robot (Makanan & Sumber Energi)',
    tagline: 'Makanan robot supaya kuat bergerak dan tidak lemas (mati).',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    borderColor: 'border-emerald-400',
    bgGradient: 'from-emerald-500/10 via-green-50/40 to-white',
    humanExplanation:
      'Kalau kita lupa sarapan nasi dan minum susu, badan kita jadi lemas, mengantuk, dan tidak kuat lari.',
    robotExplanation:
      'Robot tidak makan nasi, tapi robot "makan" energi listrik dari Baterai! Baterai dialirkan ke komputer dan motor. Kalau baterai habis, robot akan tertidur lemas.',
    voiceText:
      'Baterai adalah makanan untuk robot. Seperti kamu makan nasi dan susu, robot butuh baterai agar kuat bergerak!',
    dialogueText:
      'Nyam nyam! Bateraiku terisi penuh dengan energi listrik bersih! Aku bertenaga penuh dan tidak lemas!',
    experiments: [
      {
        label: '⚡ Beri Makan Robot (Cas 100% Penuh)',
        actionTrigger: 'edu_battery_full',
        soundType: 'success',
        voiceResponse:
          'Nyam nyam nyam! Baterai 100 persen penuh! Robot berdiri gagah, kenyang, dan melompat gembira!',
        description: 'Partikel energi listrik hijau mengalir ke dada robot, bodi robot melompat riang!',
      },
      {
        label: '🥱 Baterai Habis (Lemas 0%)',
        actionTrigger: 'edu_battery_low',
        soundType: 'beep',
        voiceResponse:
          'Aduuuh... bateraiku habis nol persen... mataku redup dan badanku lemas butuh makanan listrik...',
        description: 'Robot menunduk terkulai lemas, lampu mata meredup, dan denyut dada melemah.',
      },
      {
        label: '☀️ Cas dengan Sinar Matahari (Surya)',
        actionTrigger: 'edu_battery_full',
        soundType: 'pop',
        voiceResponse:
          'Sinar matahari hangat diserap panel surya menjadi aliran listrik ramah lingkungan!',
        description: 'Mencontohkan teknologi energi bersih ramah lingkungan bagi anak-anak.',
      },
    ],
    pedagogicalQuestion:
      'Beri pesan moral: "Supaya kamu sekuat robot bertenaga penuh, jangan lupa selalu habiskan sarapan nasi dan sayurmu ya!"',
  },
  {
    id: 'casing',
    humanAnalogy: 'Tulang & Kulit Pelindung',
    humanIcon: '🦴🛡️',
    robotComponent: 'Rangka Baja & Casing Pelindung Bodi',
    robotIcon: '🛡️',
    title: 'Rangka & Casing Robot (Baju Pelindung)',
    tagline: 'Pelindung bagian dalam robot agar tidak mudah rusak saat jatuh.',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    borderColor: 'border-rose-400',
    bgGradient: 'from-rose-500/10 via-red-50/40 to-white',
    humanExplanation:
      'Di dalam kepala ada tengkorak keras pelindung otak. Kulit di luar melindungi daging kita dari kotoran dan debu.',
    robotExplanation:
      'Robot punya Rangka Baja dan Casing Plastik Tebal! Casing ini melindungi chip komputer dan baterai di dalam agar tidak pecah saat robot tersenggol atau jatuh.',
    voiceText:
      'Rangka dan casing adalah tulang dan baju pelindung robot. Gunanya agar bagian dalam robot tidak rusak saat terbentur!',
    dialogueText:
      'Kliing! Rangka bajaku sangat kuat dan kokoh! Bagian dalam komputer dan kabelku terlindungi aman!',
    experiments: [
      {
        label: '🛡️ Nyalakan Perisai Rangka Pelindung',
        actionTrigger: 'edu_casing',
        soundType: 'snap',
        voiceResponse:
          'Klinggg! Kubah perisai rangka pelindung aktif berkilau mengamankan seluruh bodi robot!',
        description: 'Kubah perisai hologram 3D menyala mengelilingi robot untuk memperlihatkan fungsi perlindungan.',
      },
      {
        label: '🧱 Tes Ketahanan Benturan Casing',
        actionTrigger: 'edu_casing',
        soundType: 'pop',
        voiceResponse:
          'Tung tung! Rangka tebal menahan benturan meja! Komputer dan baterai di dalam tetap aman terlindungi!',
        description: 'Menjelaskan fungsi struktural casing sebagai peredam getaran benturan mekanik.',
      },
    ],
    pedagogicalQuestion:
      'Tanya anak: "Kenapa kita pakai helm saat naik sepeda? Untuk melindungi kepala! Casing robot itu seperti helm kuat untuk komputernya."',
  },
];

export const RobotAnatomyLabModal: React.FC<RobotAnatomyLabModalProps> = ({
  isOpen,
  onClose,
  initialRobotType = 'biped',
}) => {
  const [activeConceptKey, setActiveConceptKey] = useState<ConceptKey>('brain');
  const [selectedRobotType, setSelectedRobotType] = useState<RobotType>(initialRobotType);
  const [current3DAction, setCurrent3DAction] = useState<string>('edu_brain');
  const [activeDialogue, setActiveDialogue] = useState<string>(CONCEPTS[0].dialogueText);

  if (!isOpen) return null;

  const activeConcept = CONCEPTS.find(c => c.id === activeConceptKey) || CONCEPTS[0];

  const handleSelectConcept = (conceptKey: ConceptKey) => {
    const concept = CONCEPTS.find(c => c.id === conceptKey);
    if (!concept) return;

    setActiveConceptKey(conceptKey);
    sounds.playPop();

    // Default trigger for concept
    const defaultTrigger =
      conceptKey === 'brain'
        ? 'edu_brain'
        : conceptKey === 'sensor'
        ? 'edu_sensor_eye'
        : conceptKey === 'motor'
        ? 'edu_motor_drive'
        : conceptKey === 'battery'
        ? 'edu_battery_full'
        : 'edu_casing';

    setCurrent3DAction(defaultTrigger);
    setActiveDialogue(concept.dialogueText);
    sounds.speak(concept.voiceText);
  };

  const handleRunExperiment = (exp: ConceptData['experiments'][0]) => {
    if (exp.soundType === 'beep') sounds.playRobotBeep();
    else if (exp.soundType === 'motor') sounds.playMotorSound();
    else if (exp.soundType === 'snap') sounds.playSnap();
    else if (exp.soundType === 'success') sounds.playSuccess();
    else sounds.playPop();

    setCurrent3DAction(exp.actionTrigger);
    setActiveDialogue(exp.voiceResponse);
    sounds.speak(exp.voiceResponse);
  };

  const handleSpeakText = (text: string) => {
    sounds.playPop();
    sounds.speak(text);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border-4 border-indigo-400 max-w-6xl w-full max-h-[94vh] flex flex-col overflow-hidden relative my-auto">
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-indigo-700 via-purple-700 to-sky-600 text-white flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner border border-white/30">
              🔬
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-white/25 text-white border border-white/40">
                  ⭐ FITUR KHUSUS EDUKASI STEM (ANAK 4+)
                </span>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                  3D ANIMASI
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                Laboratorium Cara Kerja Robot 🤖
              </h2>
              <p className="text-xs text-indigo-100 font-medium">
                Pahami rahasia sensor, otak, baterai, motor, & rangka robot lewat analogi tubuh manusia!
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition active:scale-90 flex-shrink-0"
            title="Tutup Laboratorium"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 5 Concept Nav Tabs (Analogies) */}
        <div className="p-3 bg-slate-100 border-b-2 border-slate-200 overflow-x-auto flex items-center gap-2 scrollbar-none">
          {CONCEPTS.map(c => {
            const isActive = c.id === activeConceptKey;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectConcept(c.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex-shrink-0 border-2 shadow-xs active:scale-95 ${
                  isActive
                    ? 'bg-white border-indigo-600 text-indigo-900 shadow-md scale-102 ring-2 ring-indigo-200'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                }`}
              >
                <span className="text-xl">{c.humanIcon}</span>
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black truncate">{c.humanAnalogy}</span>
                    <span className="text-[10px] text-slate-400">➔</span>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-600 truncate block">
                    {c.robotComponent.split('(')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Main Body: 2 Columns (3D Robot Stage + Educational Lab Pad) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch bg-slate-50/60">
          {/* LEFT COLUMN: 3D Robot Live Stage (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-sky-50 via-indigo-50/30 to-purple-50/20 rounded-3xl p-4 border-2 border-indigo-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Robot Model Switcher */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                Model Robot 3D:
              </span>
              <div className="flex items-center gap-1">
                {(['biped', 'rover', 'arm', 'drone', 'pet'] as RobotType[]).map(typeKey => (
                  <button
                    key={typeKey}
                    onClick={() => {
                      sounds.playPop();
                      setSelectedRobotType(typeKey);
                    }}
                    className={`px-2 py-1 rounded-xl text-[11px] font-black border transition ${
                      selectedRobotType === typeKey
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {typeKey === 'biped'
                      ? 'Bobi'
                      : typeKey === 'rover'
                      ? 'Rover'
                      : typeKey === 'arm'
                      ? 'Arm'
                      : typeKey === 'drone'
                      ? 'Aero'
                      : 'Puppy'}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Robot Spoken Dialogue Bubble */}
            <div className="w-full bg-white/95 rounded-2xl p-3 border-2 border-indigo-200 shadow-sm flex items-start gap-2.5 mb-2 relative">
              <button
                onClick={() => handleSpeakText(activeDialogue)}
                className="w-8 h-8 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0 transition active:scale-90"
                title="Dengarkan Suara Robot"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <p className="text-xs font-bold text-slate-800 leading-snug">
                "{activeDialogue}"
              </p>
            </div>

            {/* 3D Viewer Canvas */}
            <div className="w-full h-[380px] sm:h-[420px] flex items-center justify-center relative">
              <ThreeRobotViewer
                className="w-full h-full"
                robotType={selectedRobotType}
                isDancing={false}
                actionTrigger={current3DAction}
              />

              {/* 360 Orbit Drag Badge */}
              <div className="absolute bottom-2 left-2 bg-slate-900/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
                🔄 Geser layar untuk putar 3D
              </div>
            </div>

            {/* Active System Status Pill */}
            <div className="mt-2 bg-white rounded-2xl p-2.5 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 shadow-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Status Sistem:</span>
              </span>
              <span className="text-indigo-600 font-extrabold truncate">
                {activeConcept.title}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Science Pad & Action Buttons (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            {/* Concept Banner */}
            <div className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-r ${activeConcept.bgGradient} border-2 ${activeConcept.borderColor} shadow-sm`}>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${activeConcept.badgeColor}`}>
                    {activeConcept.humanIcon} {activeConcept.humanAnalogy} ➔ {activeConcept.robotIcon} {activeConcept.robotComponent}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-2">
                    {activeConcept.title}
                  </h3>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {activeConcept.tagline}
                  </p>
                </div>

                <button
                  onClick={() => handleSpeakText(activeConcept.voiceText)}
                  className="p-2.5 rounded-2xl bg-white border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-xs transition active:scale-95 flex-shrink-0"
                  title="Bacakan Penjelasan Lengkap"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>

              {/* Comparison Cards (Human vs Robot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="p-3 bg-white/90 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 mb-1">
                    <span>🧒 PADA TUBUH KITA:</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeConcept.humanExplanation}
                  </p>
                </div>

                <div className="p-3 bg-white/90 rounded-2xl border border-indigo-200 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 mb-1">
                    <span>🤖 PADA TUBUH ROBOT:</span>
                  </div>
                  <p className="text-xs text-indigo-950/80 leading-relaxed font-medium">
                    {activeConcept.robotExplanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive 3D Experiment Pad (Play & Learn for 4-year-olds) */}
            <div className="p-4 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-600 fill-emerald-500" />
                  <span>Ayo Coba Sendiri! (Picu Animasi 3D Robot 🎮)</span>
                </h4>
                <span className="text-[11px] font-bold text-slate-400">Sentuh tombol di bawah</span>
              </div>

              <div className="space-y-2.5">
                {activeConcept.experiments.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border-2 border-slate-200 hover:border-indigo-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h5 className="font-black text-xs sm:text-sm text-slate-900 truncate">
                        {exp.label}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {exp.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRunExperiment(exp)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-xs shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-blue-700 transition active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tes 3D!</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pedagogical Question for Teachers / Parents */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 flex items-start gap-2.5">
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-900 block mb-0.5">
                  💡 Tips Diskusi Seru Bersama Anak:
                </span>
                <p className="text-xs text-amber-900/90 leading-relaxed">
                  {activeConcept.pedagogicalQuestion}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quick Reference Table (Summary of All 5 Analogies) */}
        <div className="p-3 sm:p-4 bg-slate-100 border-t-2 border-slate-200 overflow-x-auto">
          <div className="text-[11px] font-black text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <span>📚 Tabel Pintar: Tubuh Kita vs Tubuh Robot</span>
          </div>

          <div className="grid grid-cols-5 gap-2 min-w-[620px] text-xs">
            {CONCEPTS.map(c => {
              const isCurrent = c.id === activeConceptKey;
              return (
                <div
                  key={c.id}
                  onClick={() => handleSelectConcept(c.id)}
                  className={`p-2.5 rounded-2xl cursor-pointer transition border-2 ${
                    isCurrent
                      ? 'bg-white border-indigo-500 shadow-sm'
                      : 'bg-white/60 border-slate-200 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-1 text-[11px] font-black text-slate-800">
                    <span>{c.humanIcon}</span>
                    <span className="truncate">{c.humanAnalogy}</span>
                  </div>
                  <div className="text-[11px] font-bold text-indigo-600 mt-1 truncate">
                    {c.robotIcon} {c.robotComponent.split('/')[0]}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2 leading-tight">
                    {c.tagline}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
