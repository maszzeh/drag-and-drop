export type RobotType = 'biped' | 'rover' | 'arm' | 'drone' | 'pet';

export interface RobotPart {
  id: string;
  name: string;
  type: string;
  role: string;
  icon: string;
  color: string;
  targetId: string;
  isInstalled: boolean;
  hintPosition: { top: string; left: string; width: string; height: string };
  svgShape?: string;
}

export interface CodingBlock {
  id: string;
  stepNumber: number;
  label: string;
  sublabel: string;
  action: 'start' | 'move_forward' | 'beep_sound' | 'wave_hand' | 'spin_propeller' | 'wag_tail';
  icon: string;
  color: string;
  textColor: string;
  borderColor: string;
}

export interface RobotLevel {
  id: number;
  slug: string;
  name: string;
  robotTitle: string;
  subtitle: string;
  description: string;
  themeColor: string;
  accentColor: string;
  badgeText: string;
  badgeColor: string;
  starsRequired: number;
  starsEarned: number;
  parts: RobotPart[];
  audioGuide: string;
  dialogueSuccess: string;
  pedagogicalTip: string;
  codingBlocks: CodingBlock[];
  previewEmoji: string;
}
