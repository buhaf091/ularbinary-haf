import React, { useState } from 'react';
import { conversionTableData } from '../data/quizBank';
import { sounds, triggerHaptic } from '../utils/audio';
import { Play, ArrowLeft, Lightbulb, Binary, Hash, Calculator, Search, CheckCircle2 } from 'lucide-react';

interface MateriScreenProps {
  onStartGame: () => void;
  onBackToRegister: () => void;
}

export const MateriScreen: React.FC<MateriScreenProps> = ({ onStartGame, onBackToRegister }) => {
  // Interactive 4-bit converter state: [bit8, bit4, bit2, bit1]
  const [bits, setBits] = useState<[number, number, number, number]>([0, 1, 0, 1]); // default: 5 (0101)
  const [searchTerm, setSearchTerm] = useState('');

  const toggleBit = (index: number) => {
    sounds.playClick();
    triggerHaptic(20);
    setBits((prev) => {
      const copy = [...prev] as [number, number, number, number];
      copy[index] = copy[index] === 1 ? 0 : 1;
      return copy;
    });
  };

  // Calculate live values from bit state
  const decimalVal = bits[0] * 8 + bits[1] * 4 + bits[2] * 2 + bits[3] * 1;
  const binaryString = bits.join('');
  const octalVal = decimalVal.toString(8);
  const hexVal = decimalVal.toString(16).toUpperCase();

  const filteredTable = conversionTableData.filter(
    (item) =>
      item.dec.toString().includes(searchTerm) ||
      item.bin.includes(searchTerm) ||
      item.hex.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.oct.includes(searchTerm)
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between gap-3 mb-2">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onBackToRegister();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kustomisasi</span>
          </button>
          <div className="flex items-center gap-1 text-emerald-400 text-xs font-mono">
            <Binary className="w-3.5 h-3.5" />
            <span>MODUL INTERAKTIF</span>
          </div>
        </div>

        <h1 className="text-lg font-bold text-white flex items-center gap-2">
          📚 Modul Materi: Bilangan Biner Dasar
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Pelajari konsep konversi 4 sistem bilangan komputer sebelum bermain kuis & ular biner.
        </p>
      </div>

      {/* Interactive 4-Bit Switch Visualizer */}
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 shadow-xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">
              Simulator Interaktif 4-Bit (8 - 4 - 2 - 1)
            </h2>
          </div>
          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
            Ketuk Saklar
          </span>
        </div>

        <p className="text-xs text-slate-300">
          Setiap digit biner memiliki bobot perpangkatan dua (2³=8, 2²=4, 2¹=2, 2⁰=1). Ketuk tombol di bawah untuk menyalakan/mematikan bit:
        </p>

        {/* The 4 Bit Switches */}
        <div className="grid grid-cols-4 gap-2.5">
          {[
            { label: 'Bit 3', weight: 8, val: bits[0], idx: 0 },
            { label: 'Bit 2', weight: 4, val: bits[1], idx: 1 },
            { label: 'Bit 1', weight: 2, val: bits[2], idx: 2 },
            { label: 'Bit 0', weight: 1, val: bits[3], idx: 3 },
          ].map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => toggleBit(item.idx)}
              className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all active:scale-95 ${
                item.val === 1
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-lg shadow-emerald-500/30 font-bold'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider opacity-80">{item.label} (2^{3 - item.idx})</span>
              <span className="text-2xl font-mono font-black">{item.val}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                item.val === 1 ? 'bg-slate-950 text-emerald-300' : 'bg-slate-900 text-slate-400'
              }`}>
                Bobot: {item.weight}
              </span>
            </button>
          ))}
        </div>

        {/* Live Calculation Output Card */}
        <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
          <div className="text-xs font-mono text-slate-400 flex flex-wrap items-center gap-1">
            <span>Perhitungan:</span>
            <span className="text-emerald-400">
              ({bits[0]}×8) + ({bits[1]}×4) + ({bits[2]}×2) + ({bits[3]}×1)
            </span>
            <span>=</span>
            <span className="text-white font-bold">{decimalVal}</span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-800/80 text-center font-mono">
            <div className="p-1.5 rounded-lg bg-slate-900/80">
              <span className="text-[10px] text-slate-400 block">Biner (2)</span>
              <span className="text-sm font-bold text-emerald-400">{binaryString}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/80">
              <span className="text-[10px] text-slate-400 block">Desimal (10)</span>
              <span className="text-sm font-bold text-white">{decimalVal}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/80">
              <span className="text-[10px] text-slate-400 block">Oktal (8)</span>
              <span className="text-sm font-bold text-amber-400">{octalVal}</span>
            </div>
            <div className="p-1.5 rounded-lg bg-slate-900/80">
              <span className="text-[10px] text-slate-400 block">Hex (16)</span>
              <span className="text-sm font-bold text-cyan-400">{hexVal}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Systems Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          1. Empat Sistem Bilangan Komputer
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <Hash className="w-3.5 h-3.5" />
              <span>Biner (Base-2)</span>
            </div>
            <p className="text-slate-300">
              Hanya menggunakan angka <strong className="text-emerald-400 font-mono">0</strong> dan <strong className="text-emerald-400 font-mono">1</strong>. Bahasa asli yang diproses sirkuit elektronik mikroprosesor.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-blue-400 font-semibold mb-1">
              <Hash className="w-3.5 h-3.5" />
              <span>Desimal (Base-10)</span>
            </div>
            <p className="text-slate-300">
              Menggunakan angka <strong className="text-blue-400 font-mono">0 - 9</strong>. Sistem bilangan sehari-hari yang dipakai manusia dalam menghitung.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-1">
              <Hash className="w-3.5 h-3.5" />
              <span>Oktal (Base-8)</span>
            </div>
            <p className="text-slate-300">
              Menggunakan angka <strong className="text-amber-400 font-mono">0 - 7</strong>. Setiap digit oktal mewakili kombinasi tepat 3 digit biner.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
              <Hash className="w-3.5 h-3.5" />
              <span>Hexadesimal (Base-16)</span>
            </div>
            <p className="text-slate-300">
              Menggunakan <strong className="text-cyan-400 font-mono">0-9</strong> dan huruf <strong className="text-cyan-400 font-mono">A-F</strong> (A=10, B=11, C=12, D=13, E=14, F=15). Biasa dipakai untuk kode warna dan alamat memori.
            </p>
          </div>
        </div>
      </div>

      {/* Complete Conversion Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            2. Tabel Konversi Lengkap (0 - 15)
          </h2>
          {/* Quick search input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari angka..."
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-full sm:w-36"
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-300 border-b border-slate-800 font-mono">
                <th className="py-2.5 px-3">Desimal (10)</th>
                <th className="py-2.5 px-3 text-emerald-400">Biner (2)</th>
                <th className="py-2.5 px-3 text-amber-400">Oktal (8)</th>
                <th className="py-2.5 px-3 text-cyan-400">Hex (16)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredTable.length > 0 ? (
                filteredTable.map((row) => (
                  <tr key={row.dec} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-2 px-3 font-semibold text-white">{row.dec}</td>
                    <td className="py-2 px-3 text-emerald-300">{row.bin}</td>
                    <td className="py-2 px-3 text-amber-300">{row.oct}</td>
                    <td className="py-2 px-3 text-cyan-300 font-bold">{row.hex}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500">
                    Tidak ada hasil pencarian
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Start Game CTA Button */}
      <button
        type="button"
        onClick={() => {
          sounds.playClick();
          sounds.playEat();
          triggerHaptic(25);
          onStartGame();
        }}
        className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/20 transition-transform active:scale-[0.98] text-base cursor-pointer"
      >
        <Play className="w-5 h-5 fill-current" />
        <span>Mulai Bermain Game Ular Biner! 🎮</span>
      </button>
    </div>
  );
};
