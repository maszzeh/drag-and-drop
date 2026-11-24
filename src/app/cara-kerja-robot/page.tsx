'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Play,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { ThreeRobotViewer } from '../../components/ThreeRobotViewer';
import { RobotType } from '../../types/robot';
import { sounds } from '../../utils/audio';

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

export default function CaraKerjaRobotPage() {
  const [activeConceptKey, setActiveConceptKey] = useState<ConceptKey>('brain');
  const [selectedRobotType, setSelectedRobotType] = useState<RobotType>('biped');
  const [current3DAction, setCurrent3DAction] = useState<string>('edu_brain');
  const [activeDialogue, setActiveDialogue] = useState<string>(CONCEPTS[0].dialogueText);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  const activeConcept = CONCEPTS.find(c => c.id === activeConceptKey) || CONCEPTS[0];

  const handleSelectConcept = (conceptKey: ConceptKey) => {
    const concept = CONCEPTS.find(c => c.id === conceptKey);
    if (!concept) return;

    setActiveConceptKey(conceptKey);
    sounds.playPop();

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

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) sounds.playPop();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-slate-50 to-indigo-50/40 text-slate-900 pb-12">
      {/* Top Main Navigation Bar */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b-2 border-slate-200 px-4 lg:px-8 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Back to Assembly Workbench Button */}
          <Link
            href="/"
            onClick={() => sounds.playPop()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs lg:text-sm transition shadow-xs active:scale-95 border border-slate-200"
          >
            <ArrowLeft className="w-4 h-4 text-slate-700" />
            <span>🏠 Kembali ke Meja Rakit</span>
          </Link>

          {/* Page Title & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white text-2xl shadow-md shadow-indigo-200">
              🔬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg lg:text-xl font-black text-slate-900 tracking-tight">
                  LABORATORIUM CARA KERJA ROBOT
                </h1>
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200 hidden sm:inline">
                  EDUKASI 3D
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500">
                Belajar Otak, Sensor, Motor, Baterai & Rangka lewat Analogi Tubuh Manusia
              </p>
            </div>
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleMute}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition active:scale-95 border border-slate-200"
            title={isMuted ? 'Nyalakan Suara' : 'Matikan Suara'}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5 text-red-500" />
            ) : (
              <Volume2 className="w-5 h-5 text-emerald-600" />
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-6 space-y-6">
        {/* Robot Switcher & 5 Analogy Navigation Tabs */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          {/* 3D Robot Model Switcher */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider flex-shrink-0">
              Pilih Robot 3D:
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {(
                [
                  { key: 'biped', label: 'Robo-Bobi', icon: '🤖' },
                  { key: 'rover', label: 'Robo-Rover', icon: '🚜' },
                  { key: 'arm', label: 'Robo-Arm', icon: '🦾' },
                  { key: 'drone', label: 'Robo-Aero', icon: '🚁' },
                  { key: 'pet', label: 'Robo-Puppy', icon: '🐶' },
                ] as { key: RobotType; label: string; icon: string }[]
              ).map(item => (
                <button
                  key={item.key}
                  onClick={() => {
                    sounds.playPop();
                    setSelectedRobotType(item.key);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-black border transition whitespace-nowrap active:scale-95 ${
                    selectedRobotType === item.key
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5">
            <span>✨ Sentuh tab di bawah untuk melihat bagian robot!</span>
          </div>
        </div>

        {/* 5 Concept Tabs (Tubuh Manusia ➔ Bagian Robot) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CONCEPTS.map(c => {
            const isActive = c.id === activeConceptKey;
            return (
              <button
                key={c.id}
                onClick={() => handleSelectConcept(c.id)}
                className={`p-3.5 rounded-3xl font-black text-left transition-all border-2 shadow-sm flex flex-col justify-between active:scale-95 ${
                  isActive
                    ? 'bg-white border-indigo-600 text-indigo-950 shadow-md ring-4 ring-indigo-100 scale-102'
                    : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{c.humanIcon}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                    {c.humanAnalogy}
                  </span>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-black text-slate-900 leading-tight">
                    {c.robotComponent.split('(')[0]}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-500 mt-1 line-clamp-1">
                    {c.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* 2 Columns: 3D Robot Interactive Stage & Educational Learning Pad */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: 3D Robot Stage (5 Cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-sky-50 via-indigo-50/40 to-purple-50/30 rounded-3xl p-5 border-2 border-indigo-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
            {/* Robot Spoken Dialogue Bubble */}
            <div className="w-full bg-white/95 rounded-2xl p-3.5 border-2 border-indigo-200 shadow-xs flex items-start gap-2.5 mb-2 relative">
              <button
                onClick={() => handleSpeakText(activeDialogue)}
                className="w-9 h-9 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-700 flex items-center justify-center flex-shrink-0 transition active:scale-90"
                title="Dengarkan Suara Robot"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider block">
                  Suara Robot:
                </span>
                <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">
                  "{activeDialogue}"
                </p>
              </div>
            </div>

            {/* 3D Model Live Canvas */}
            <div className="w-full h-[420px] sm:h-[480px] flex items-center justify-center relative">
              <ThreeRobotViewer
                className="w-full h-full"
                robotType={selectedRobotType}
                isDancing={false}
                actionTrigger={current3DAction}
              />

              {/* 360 Orbit Drag Badge */}
              <div className="absolute bottom-3 left-3 bg-slate-900/60 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full pointer-events-none">
                🔄 Geser layar untuk memutar robot 360°
              </div>
            </div>

            {/* System Status Pill */}
            <div className="mt-2 bg-white rounded-2xl p-3 border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700 shadow-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Sistem yang Diuji:</span>
              </span>
              <span className="text-indigo-600 font-extrabold truncate">
                {activeConcept.title}
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive Learning Pad & Experiments (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            {/* Active Concept Explanation Banner */}
            <div
              className={`p-5 rounded-3xl bg-gradient-to-r ${activeConcept.bgGradient} border-2 ${activeConcept.borderColor} shadow-sm`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${activeConcept.badgeColor}`}>
                    {activeConcept.humanIcon} {activeConcept.humanAnalogy} ➔ {activeConcept.robotIcon} {activeConcept.robotComponent}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                    {activeConcept.title}
                  </h2>
                  <p className="text-xs font-bold text-slate-600 mt-1">
                    {activeConcept.tagline}
                  </p>
                </div>

                <button
                  onClick={() => handleSpeakText(activeConcept.voiceText)}
                  className="p-3 rounded-2xl bg-white border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 shadow-xs transition active:scale-95 flex-shrink-0"
                  title="Bacakan Penjelasan Lengkap"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>

              {/* Comparison Box (Manusia vs Robot) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                <div className="p-3.5 bg-white/95 rounded-2xl border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 mb-1.5">
                    <span>🧒 PADA TUBUH KITA:</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {activeConcept.humanExplanation}
                  </p>
                </div>

                <div className="p-3.5 bg-white/95 rounded-2xl border border-indigo-200 shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900 mb-1.5">
                    <span>🤖 PADA TUBUH ROBOT:</span>
                  </div>
                  <p className="text-xs text-indigo-950/80 leading-relaxed font-medium">
                    {activeConcept.robotExplanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive 3D Experiment Buttons */}
            <div className="p-5 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3.5">
                <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-600 fill-emerald-500" />
                  <span>Ayo Coba Sendiri! (Picu Animasi 3D Robot 🎮)</span>
                </h3>
                <span className="text-[11px] font-bold text-slate-400">Sentuh tombol di bawah</span>
              </div>

              <div className="space-y-3">
                {activeConcept.experiments.map((exp, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border-2 border-slate-200 hover:border-indigo-300 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-xs sm:text-sm text-slate-900 truncate">
                        {exp.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {exp.description}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRunExperiment(exp)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-black text-xs shadow-md shadow-indigo-200 hover:from-indigo-700 hover:to-blue-700 transition active:scale-95 flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Tes 3D Sekarang!</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pedagogical Discussion Prompt */}
            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200 text-amber-950 flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-900 block mb-0.5">
                  💡 Tips Diskusi Seru Bersama Anak (Pedagogi PAUD/TK):
                </span>
                <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                  {activeConcept.pedagogicalQuestion}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Full Reference Summary Table */}
        <div className="bg-white rounded-3xl p-5 border-2 border-slate-200 shadow-sm overflow-x-auto">
          <div className="mb-3">
            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider block">
              Ringkasan Materi Cilik
            </span>
            <h3 className="text-base font-black text-slate-900">
              📚 Tabel Pintar: Analogi Tubuh Manusia vs Komponen Robot
            </h3>
          </div>

          <table className="w-full min-w-[700px] text-xs text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50">
                <th className="py-2.5 px-3 font-black text-slate-800 rounded-l-xl">Bagian Tubuh Kita</th>
                <th className="py-2.5 px-3 font-black text-indigo-800">Komponen Robot</th>
                <th className="py-2.5 px-3 font-black text-slate-800 rounded-r-xl">Fungsi Serunya untuk Robot</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {CONCEPTS.map(c => {
                const isCurrent = c.id === activeConceptKey;
                return (
                  <tr
                    key={c.id}
                    onClick={() => handleSelectConcept(c.id)}
                    className={`cursor-pointer transition ${
                      isCurrent ? 'bg-indigo-50/70 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3 px-3">
                      <span className="mr-1.5">{c.humanIcon}</span>
                      <strong className="text-slate-900">{c.humanAnalogy}</strong>
                    </td>
                    <td className="py-3 px-3 text-indigo-700 font-extrabold">
                      <span className="mr-1.5">{c.robotIcon}</span>
                      {c.robotComponent}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {c.tagline}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
