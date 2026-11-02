import React, { useState, useEffect, useRef } from 'react';
import { PlayerData, SnakeAccessory } from '../types/game';
import { sounds, triggerHaptic } from '../utils/audio';
import { Sparkles, Trophy, BookOpen, Download, Volume2, VolumeX, ShieldCheck } from 'lucide-react';

interface RegistrationScreenProps {
  playerData: PlayerData;
  setPlayerData: React.Dispatch<React.SetStateAction<PlayerData>>;
  onStartMateri: () => void;
  onOpenInstallModal: () => void;
  highScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const COLOR_OPTIONS = [
  { id: '#10b981', label: 'Emerald Matrix', bg: 'bg-emerald-500', hex: '#10b981' },
  { id: '#3b82f6', label: 'Ocean Blue', bg: 'bg-blue-500', hex: '#3b82f6' },
  { id: '#ec4899', label: 'Cyber Pink', bg: 'bg-pink-500', hex: '#ec4899' },
  { id: '#f59e0b', label: 'Solar Amber', bg: 'bg-amber-500', hex: '#f59e0b' },
  { id: '#8b5cf6', label: 'Electric Purple', bg: 'bg-purple-500', hex: '#8b5cf6' },
  { id: '#ef4444', label: 'Crimson Red', bg: 'bg-red-500', hex: '#ef4444' },
  { id: '#06b6d4', label: 'Cyan Byte', bg: 'bg-cyan-500', hex: '#06b6d4' },
  { id: '#84cc16', label: 'Lime Hacker', bg: 'bg-lime-500', hex: '#84cc16' },
];

const ACCESSORY_OPTIONS: { id: SnakeAccessory; label: string; icon: string; desc: string }[] = [
  { id: 'none', label: 'Polos', icon: '❌', desc: 'Tanpa aksesoris' },
  { id: 'crown', label: 'Mahkota', icon: '👑', desc: 'Mahkota Emas Raja' },
  { id: 'hat', label: 'Topi', icon: '🎩', desc: 'Topi Pesulap Mewah' },
  { id: 'glasses', label: 'Kacamata', icon: '👓', desc: 'Kacamata Cyber Cerdas' },
  { id: 'bow', label: 'Pita', icon: '🎀', desc: 'Pita Anggun' },
  { id: 'ninja', label: 'Ninja', icon: '🥷', desc: 'Ikat Kepala Ninja' },
];

const MAJORS = [
  'Desain Komunikasi Visual (DKV)',
  'Desain Produksi Busana (DPB)',
  'Teknik Komputer & Jaringan (TKJ)',
  'Rekayasa Perangkat Lunak (RPL)',
  'Teknik Kendaraan Ringan (TKR)',
  'Manajemen Perkantoran (MP)'
];

export const RegistrationScreen: React.FC<RegistrationScreenProps> = ({
  playerData,
  setPlayerData,
  onStartMateri,
  onOpenInstallModal,
  highScore,
  soundEnabled,
  onToggleSound,
}) => {
  const [name, setName] = useState(playerData.name || '');
  const [selectedClass, setSelectedClass] = useState(playerData.class || 'X');
  const [major, setMajor] = useState(playerData.major || MAJORS[0]);
  const [color, setColor] = useState(playerData.color || '#10b981');
  const [accessory, setAccessory] = useState<SnakeAccessory>(playerData.accessory || 'none');
  const [errorMsg, setErrorMsg] = useState('');

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Mini Snake Preview
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let tick = 0;

    const renderPreview = () => {
      tick += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle background grid
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw Apple
      const appleX = canvas.width - 40;
      const appleY = canvas.height / 2;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(appleX, appleY, 10, 0, Math.PI * 2);
      ctx.fill();
      // Stem
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(appleX, appleY - 8);
      ctx.lineTo(appleX + 4, appleY - 14);
      ctx.stroke();

      // Draw wiggling snake body
      const segments = 6;
      const startX = 40;
      const segSize = 14;

      for (let i = segments - 1; i >= 0; i--) {
        const segX = startX + i * 18;
        const wiggle = Math.sin(tick + i * 0.7) * 6;
        const segY = canvas.height / 2 + wiggle;

        ctx.fillStyle = i === segments - 1 ? color : `${color}cc`;
        ctx.beginPath();
        ctx.roundRect(segX - segSize / 2, segY - segSize / 2, segSize, segSize, 4);
        ctx.fill();

        // Draw Head on the last segment
        if (i === segments - 1) {
          // Snake Eyes
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(segX + 2, segY - 3, 2.5, 0, Math.PI * 2);
          ctx.arc(segX + 2, segY + 3, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(segX + 3, segY - 3, 1, 0, Math.PI * 2);
          ctx.arc(segX + 3, segY + 3, 1, 0, Math.PI * 2);
          ctx.fill();

          // Accessory Emoji
          let emoji = '';
          if (accessory === 'crown') emoji = '👑';
          else if (accessory === 'hat') emoji = '🎩';
          else if (accessory === 'glasses') emoji = '👓';
          else if (accessory === 'bow') emoji = '🎀';
          else if (accessory === 'ninja') emoji = '🥷';

          if (emoji) {
            ctx.font = '16px system-ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emoji, segX, segY - 14);
          }
        }
      }

      animFrame = requestAnimationFrame(renderPreview);
    };

    animFrame = requestAnimationFrame(renderPreview);
    return () => cancelAnimationFrame(animFrame);
  }, [color, accessory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Silakan masukkan nama lengkap Anda.');
      triggerHaptic(50);
      return;
    }
    setErrorMsg('');
    sounds.playClick();
    triggerHaptic(20);

    setPlayerData({
      name: name.trim(),
      class: selectedClass,
      major,
      color,
      accessory,
    });

    onStartMateri();
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top Banner / School Branding */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xl shrink-0">
              🐍
            </div>
            <div>
              <span className="text-[11px] font-semibold text-emerald-400 tracking-wider uppercase block">
                SMKS Purnama Gempol
              </span>
              <h1 className="text-base font-bold text-white tracking-tight">
                Game Edukasi Bilangan Biner
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sound Toggle */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onToggleSound();
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Install App button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenInstallModal();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Pasang App</span>
            </button>
          </div>
        </div>

        {/* High Score & Teacher Credit */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Trophy className="w-3.5 h-3.5" />
            <span>Skor Tertinggi: <span className="text-white font-mono">{highScore}</span></span>
          </div>
          <div className="text-[11px] text-slate-400">
            Guru: <span className="text-slate-300 font-medium">Hafilah Farhana, S.Kom.</span>
          </div>
        </div>
      </div>

      {/* Main Registration & Customization Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Identitas Siswa & Kustomisasi Ular
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Lengkapi data diri sebelum memulai kuis & permainan
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nama Lengkap Siswa:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Hafilah Farhana"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 transition"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kelas:
              </label>
              <input
                type="text"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Jurusan:
              </label>
              <select
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-emerald-500 transition"
              >
                {MAJORS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live Snake Preview Box */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Pratinjau Ular Anda:</span>
            <span className="text-emerald-400 font-mono text-[11px]">Gerakan Aktif</span>
          </div>
          <div className="w-full h-20 bg-black/60 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800/80">
            <canvas ref={previewCanvasRef} width={260} height={70} className="w-full max-w-[260px] h-full" />
          </div>
        </div>

        {/* Snake Color Swatches */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Pilih Warna Ular:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {COLOR_OPTIONS.map((c) => {
              const isSelected = color === c.hex;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => {
                    sounds.playClick();
                    triggerHaptic(15);
                    setColor(c.hex);
                  }}
                  className={`h-10 rounded-xl ${c.bg} transition-all relative flex items-center justify-center ${
                    isSelected
                      ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-105 shadow-lg'
                      : 'opacity-85 hover:opacity-100 hover:scale-95'
                  }`}
                  title={c.label}
                  aria-label={c.label}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-white shadow" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Snake Accessories */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Pilih Aksesoris Kepala Ular:
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {ACCESSORY_OPTIONS.map((acc) => {
              const isSelected = accessory === acc.id;
              return (
                <button
                  type="button"
                  key={acc.id}
                  onClick={() => {
                    sounds.playClick();
                    triggerHaptic(15);
                    setAccessory(acc.id);
                  }}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-2xl">{acc.icon}</span>
                  <span className="text-[11px] font-medium truncate max-w-full">{acc.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-transform active:scale-[0.99] text-sm"
        >
          <BookOpen className="w-4 h-4" />
          <span>Lanjut ke Modul Materi Pembelajaran ➔</span>
        </button>

        {/* Trust marker */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Aplikasi Resmi Pembelajaran SMKS Purnama Gempol</span>
        </div>
      </form>
    </div>
  );
};
