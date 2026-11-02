import React, { useEffect, useRef } from 'react';
import { PlayerData } from '../types/game';
import { sounds, triggerHaptic } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Printer, Download, Share2, RotateCcw, Award, CheckCircle } from 'lucide-react';

interface CertificateScreenProps {
  playerData: PlayerData;
  score: number;
  level: number;
  onRestartAll: () => void;
}

export const CertificateScreen: React.FC<CertificateScreenProps> = ({
  playerData,
  score,
  onRestartAll,
}) => {
  const certificateRef = useRef<HTMLDivElement | null>(null);

  // Determine achievement status
  let statusText = 'LULUS ISTIMEWA';
  let statusColor = 'text-emerald-700';
  let badgeIcon = '🏆';

  if (score >= 100) {
    statusText = 'LULUS ISTIMEWA';
    statusColor = 'text-emerald-700';
    badgeIcon = '🏆';
  } else if (score >= 70) {
    statusText = 'LULUS TERBAIK';
    statusColor = 'text-blue-700';
    badgeIcon = '⭐';
  } else if (score >= 40) {
    statusText = 'LULUS BAIK';
    statusColor = 'text-amber-700';
    badgeIcon = '👍';
  } else {
    statusText = 'PERLU REMEDIAL';
    statusColor = 'text-red-700';
    badgeIcon = '🔄';
  }

  // Trigger celebration confetti
  useEffect(() => {
    sounds.playLevelUp();
    if (score >= 40) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // Safe fallback
      }
    }
  }, [score]);

  // Current Indonesian date
  const currentDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Print Handler
  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  // Download high-resolution PNG image
  const handleDownloadImage = () => {
    sounds.playClick();
    triggerHaptic(20);

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 820;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background & Borders
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Elegant Double Border
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);

    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);

    // Corner Ornaments
    ctx.fillStyle = '#0f172a';
    const corners = [
      [55, 55],
      [canvas.width - 55, 55],
      [55, canvas.height - 55],
      [canvas.width - 55, canvas.height - 55],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    // School Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px "Times New Roman", Georgia, serif';
    ctx.fillText('SMKS PURNAMA GEMPOL', canvas.width / 2, 110);

    ctx.font = '600 20px system-ui, sans-serif';
    ctx.fillStyle = '#059669';
    ctx.fillText('MATA PELAJARAN INFORMATIKA', canvas.width / 2, 145);

    ctx.font = 'bold 42px "Times New Roman", Georgia, serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('SERTIFIKAT HASIL BELAJAR', canvas.width / 2, 205);

    ctx.font = '16px system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Evaluasi & Kompetensi Sistem Bilangan Biner Dasar', canvas.width / 2, 235);

    // Divider
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - 250, 255);
    ctx.lineTo(canvas.width / 2 + 250, 255);
    ctx.stroke();

    // Recipient
    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillStyle = '#334155';
    ctx.fillText('Diberikan dengan bangga kepada:', canvas.width / 2, 295);

    ctx.font = 'bold 38px system-ui, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText((playerData.name || 'Nama Siswa').toUpperCase(), canvas.width / 2, 350);

    // Underline
    const nameWidth = ctx.measureText((playerData.name || 'Nama Siswa').toUpperCase()).width;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - nameWidth / 2 - 20, 360);
    ctx.lineTo(canvas.width / 2 + nameWidth / 2 + 20, 360);
    ctx.stroke();

    // Class & Major
    ctx.font = '18px system-ui, sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Kelas: ${playerData.class || 'X SMKS Purnama Gempol'}   |   Jurusan: ${playerData.major || 'DKV'}`, canvas.width / 2, 395);

    // Evaluation achievement description
    ctx.font = '16px system-ui, sans-serif';
    ctx.fillStyle = '#1e293b';
    ctx.fillText('Telah berhasil menyelesaikan simulasi dan evaluasi Game Edukasi Bilangan Biner Dasar dengan pencapaian:', canvas.width / 2, 450);

    // Score Banner
    ctx.font = 'bold 50px monospace';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(`SKOR: ${score}`, canvas.width / 2, 515);

    // Status predicate
    ctx.font = 'bold 24px system-ui, sans-serif';
    ctx.fillStyle = score >= 100 ? '#059669' : score >= 70 ? '#2563eb' : '#d97706';
    ctx.fillText(`${badgeIcon} ${statusText} ${badgeIcon}`, canvas.width / 2, 555);

    // Signatures
    const sigY = 660;

    // Left Signature: Guru Informatika
    ctx.textAlign = 'center';
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Guru Pengampu Informatika', 280, sigY - 50);

    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(170, sigY + 15);
    ctx.lineTo(390, sigY + 15);
    ctx.stroke();

    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('HAFILAH FARHANA, S.Kom.', 280, sigY + 38);

    // Right Signature: Kepala Sekolah
    ctx.font = '15px system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText('Kepala Sekolah', canvas.width - 280, sigY - 50);

    ctx.beginPath();
    ctx.moveTo(canvas.width - 390, sigY + 15);
    ctx.lineTo(canvas.width - 170, sigY + 15);
    ctx.stroke();

    ctx.font = 'bold 16px system-ui, sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText('M. HARIS ROMLI, S.Kom.', canvas.width - 280, sigY + 38);

    // Date & Stamp
    ctx.font = 'italic 14px system-ui, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Pasuruan, ${currentDate}`, canvas.width / 2, sigY + 70);

    // Trigger download
    const link = document.createElement('a');
    link.download = `Sertifikat_Biner_${(playerData.name || 'Siswa').replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Web Share API for native Android & iOS sharing
  const handleShare = async () => {
    sounds.playClick();
    triggerHaptic(20);

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Sertifikat Bilangan Biner - ${playerData.name}`,
          text: `Saya telah menyelesaikan evaluasi Game Edukasi Bilangan Biner di SMKS Purnama Gempol dengan skor ${score}! Predikat: ${statusText}.`,
          url: window.location.href,
        });
      } catch {
        // User cancelled or ignored
      }
    } else {
      // Fallback copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Tautan sertifikat berhasil disalin!');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5 animate-in fade-in duration-300">
      {/* Top action cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Sertifikat Kelulusan Siswa
          </span>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            onRestartAll();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Main Lagi</span>
        </button>
      </div>

      {/* Printable Certificate Frame */}
      <div
        id="printable-certificate"
        ref={certificateRef}
        className="bg-white text-slate-900 p-6 sm:p-10 rounded-2xl shadow-2xl border-[10px] border-double border-slate-800 relative overflow-hidden"
      >
        {/* Subtle Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none text-[120px] font-black">
          SMK
        </div>

        {/* Certificate Header */}
        <div className="text-center border-b pb-4 mb-4 border-slate-300">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-700 mb-0.5">
            SMKS PURNAMA GEMPOL
          </p>
          <p className="text-[11px] text-slate-500 mb-2">
            Mata Pelajaran Informatika &bull; Tahun Ajaran 2026/2027
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight">
            SERTIFIKAT HASIL BELAJAR
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            Evaluasi Kompetensi Konversi Sistem Bilangan Biner Dasar
          </p>
        </div>

        {/* Recipient Details */}
        <div className="text-center my-6">
          <p className="text-xs italic text-slate-500 mb-1">
            Diberikan dengan bangga kepada:
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 underline decoration-slate-400 underline-offset-4 tracking-wide uppercase">
            {playerData.name || 'Nama Siswa'}
          </h3>
          <p className="text-xs text-slate-600 mt-2">
            Kelas: <strong className="text-slate-800">{playerData.class || 'X SMKS Purnama Gempol'}</strong>
            {'  '}&bull;{'  '}
            Jurusan: <strong className="text-slate-800">{playerData.major || 'DKV'}</strong>
          </p>
        </div>

        {/* Evaluation Summary */}
        <div className="text-center my-5 px-4 py-3 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-xs text-slate-600">
            Telah menyelesaikan simulasi game edukasi bilangan biner dengan pencapaian:
          </p>
          <div className="text-3xl sm:text-4xl font-mono font-black text-slate-900 my-1">
            SKOR: {score}
          </div>
          <div className={`text-base font-bold ${statusColor} flex items-center justify-center gap-1.5`}>
            <span>{badgeIcon}</span>
            <span>{statusText}</span>
            <span>{badgeIcon}</span>
          </div>
        </div>

        {/* Signatures Block */}
        <div className="mt-8 pt-4 flex items-end justify-between px-2 sm:px-6 text-xs text-center gap-4">
          {/* Guru Signature */}
          <div className="w-40 sm:w-48">
            <p className="text-slate-500 mb-12">Guru Pengampu</p>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
              HAFILAH FARHANA, S.Kom.
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Guru Informatika</p>
          </div>

          {/* School Stamp Badge */}
          <div className="hidden sm:flex flex-col items-center">
            <div className="w-14 h-14 rounded-full border-2 border-emerald-600/60 flex items-center justify-center text-emerald-700 text-xs font-bold text-center p-1 leading-tight">
              TERVERIFIKASI RESMI
            </div>
          </div>

          {/* Kepala Sekolah Signature */}
          <div className="w-40 sm:w-48">
            <p className="text-slate-500 mb-12">Kepala Sekolah</p>
            <div className="border-b border-slate-900 pb-1 font-bold text-slate-900 text-xs sm:text-sm whitespace-nowrap">
              M. HARIS ROMLI, S.Kom.
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Kepala SMKS Purnama</p>
          </div>
        </div>

        {/* Issuance Date */}
        <div className="text-center text-[10px] text-slate-400 mt-6 pt-3 border-t border-slate-100 flex items-center justify-center gap-1">
          <CheckCircle className="w-3 h-3 text-emerald-600" />
          <span>Pasuruan, {currentDate} &bull; ID Sertifikat: #{Math.abs(score * 31 + 4210)}</span>
        </div>
      </div>

      {/* Action Buttons for Mobile & Desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 no-print">
        {/* Print / Save PDF */}
        <button
          type="button"
          onClick={handlePrint}
          className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 border border-slate-700 shadow transition active:scale-95"
        >
          <Printer className="w-4 h-4 text-emerald-400" />
          <span>Cetak / Simpan PDF</span>
        </button>

        {/* Download High-Res PNG for phone gallery */}
        <button
          type="button"
          onClick={handleDownloadImage}
          className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Unduh Gambar (PNG)</span>
        </button>

        {/* Native Share */}
        <button
          type="button"
          onClick={handleShare}
          className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow transition active:scale-95"
        >
          <Share2 className="w-4 h-4" />
          <span>Bagikan (Share)</span>
        </button>
      </div>

      {/* Restart Button Full Width */}
      <button
        type="button"
        onClick={() => {
          sounds.playClick();
          onRestartAll();
        }}
        className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 no-print transition"
      >
        <RotateCcw className="w-4 h-4 text-amber-400" />
        <span>Mainkan Kembali Permainan Dari Awal</span>
      </button>
    </div>
  );
};
