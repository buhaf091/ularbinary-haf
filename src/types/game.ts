export type SnakeAccessory = 'none' | 'crown' | 'hat' | 'glasses' | 'bow' | 'ninja';

export type GameScreen = 'register' | 'materi' | 'game' | 'certificate';

export interface PlayerData {
  name: string;
  class: string;
  major: string;
  color: string;
  accessory: SnakeAccessory;
}

export interface QuizQuestion {
  id: number;
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  category: 'biner-to-dec' | 'dec-to-biner' | 'hex-to-dec' | 'oktal-to-dec' | 'concept';
}

export interface GameScoreRecord {
  name: string;
  score: number;
  level: number;
  date: string;
}
