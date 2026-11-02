import { QuizQuestion } from '../types/game';

export const quizBank: QuizQuestion[] = [
  {
    id: 1,
    q: "Berapa nilai Desimal dari Biner 0011?",
    options: ["2", "3", "4", "5"],
    answer: 1,
    explanation: "0011 = (0×8) + (0×4) + (1×2) + (1×1) = 2 + 1 = 3.",
    category: "biner-to-dec"
  },
  {
    id: 2,
    q: "Berapa nilai Biner dari Desimal 5?",
    options: ["0100", "0101", "0110", "0111"],
    answer: 1,
    explanation: "5 = 4 + 1, sehingga bit bernilai 1 ada di posisi 4 dan 1 -> 0101.",
    category: "dec-to-biner"
  },
  {
    id: 3,
    q: "Sistem bilangan Hexadesimal berbasis...",
    options: ["2", "8", "10", "16"],
    answer: 3,
    explanation: "Hexadesimal berasal dari hexa (6) + desimal (10) = basis 16.",
    category: "concept"
  },
  {
    id: 4,
    q: "Nilai Hexadesimal dari Desimal 10 adalah...",
    options: ["A", "B", "C", "D"],
    answer: 0,
    explanation: "Pada Hexadesimal: A=10, B=11, C=12, D=13, E=14, F=15.",
    category: "hex-to-dec"
  },
  {
    id: 5,
    q: "Sistem bilangan Biner berbasis...",
    options: ["2", "8", "10", "16"],
    answer: 0,
    explanation: "Sistem Biner (Binary) berbasis 2, hanya mengenal digit 0 dan 1.",
    category: "concept"
  },
  {
    id: 6,
    q: "Berapa nilai Oktal dari Desimal 8?",
    options: ["8", "10", "12", "14"],
    answer: 1,
    explanation: "8 dalam desimal sama dengan 10 dalam oktal (1×8¹ + 0×8⁰).",
    category: "oktal-to-dec"
  },
  {
    id: 7,
    q: "Berapa nilai Biner dari Desimal 12?",
    options: ["1010", "1100", "1101", "1111"],
    answer: 1,
    explanation: "12 = 8 + 4 -> bit aktif pada posisi 8 dan 4 -> 1100.",
    category: "dec-to-biner"
  },
  {
    id: 8,
    q: "Huruf 'F' pada Hexadesimal bernilai Desimal...",
    options: ["12", "13", "14", "15"],
    answer: 3,
    explanation: "Huruf 'F' adalah digit tertinggi pada hexadesimal bernilai 15 (biner 1111).",
    category: "hex-to-dec"
  },
  {
    id: 9,
    q: "Nilai Desimal dari Biner 1000 adalah...",
    options: ["6", "7", "8", "9"],
    answer: 2,
    explanation: "1000 memiliki bit 1 pada posisi ke-4 bernilai 2³ = 8.",
    category: "biner-to-dec"
  },
  {
    id: 10,
    q: "Sistem bilangan Oktal berbasis...",
    options: ["2", "8", "10", "16"],
    answer: 1,
    explanation: "Sistem Oktal berbasis 8, menggunakan angka 0 sampai 7.",
    category: "concept"
  },
  {
    id: 11,
    q: "Berapa nilai Biner dari Desimal 9?",
    options: ["1001", "1010", "1100", "1101"],
    answer: 0,
    explanation: "9 = 8 + 1 -> bit posisi 8 dan 1 aktif -> 1001.",
    category: "dec-to-biner"
  },
  {
    id: 12,
    q: "Nilai Desimal dari Biner 1111 adalah...",
    options: ["13", "14", "15", "16"],
    answer: 2,
    explanation: "1111 = 8 + 4 + 2 + 1 = 15 (atau 'F' dalam hex).",
    category: "biner-to-dec"
  },
  {
    id: 13,
    q: "Huruf 'C' dalam Hexadesimal bernilai desimal...",
    options: ["10", "11", "12", "13"],
    answer: 2,
    explanation: "A=10, B=11, C=12, D=13.",
    category: "hex-to-dec"
  },
  {
    id: 14,
    q: "Berapa nilai Biner dari Desimal 6?",
    options: ["0110", "0101", "0011", "1001"],
    answer: 0,
    explanation: "6 = 4 + 2 -> bit posisi 4 dan 2 aktif -> 0110.",
    category: "dec-to-biner"
  },
  {
    id: 15,
    q: "Nilai Desimal dari Biner 0100 adalah...",
    options: ["2", "4", "6", "8"],
    answer: 1,
    explanation: "0100 = 2² = 4.",
    category: "biner-to-dec"
  }
];

export const conversionTableData = [
  { dec: 0, bin: "0000", oct: "0", hex: "0" },
  { dec: 1, bin: "0001", oct: "1", hex: "1" },
  { dec: 2, bin: "0010", oct: "2", hex: "2" },
  { dec: 3, bin: "0011", oct: "3", hex: "3" },
  { dec: 4, bin: "0100", oct: "4", hex: "4" },
  { dec: 5, bin: "0101", oct: "5", hex: "5" },
  { dec: 6, bin: "0110", oct: "6", hex: "6" },
  { dec: 7, bin: "0111", oct: "7", hex: "7" },
  { dec: 8, bin: "1000", oct: "10", hex: "8" },
  { dec: 9, bin: "1001", oct: "11", hex: "9" },
  { dec: 10, bin: "1010", oct: "12", hex: "A" },
  { dec: 11, bin: "1011", oct: "13", hex: "B" },
  { dec: 12, bin: "1100", oct: "14", hex: "C" },
  { dec: 13, bin: "1101", oct: "15", hex: "D" },
  { dec: 14, bin: "1110", oct: "16", hex: "E" },
  { dec: 15, bin: "1111", oct: "17", hex: "F" },
];
