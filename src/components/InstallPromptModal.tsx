import React, { useState } from 'react';
import { Smartphone, Apple, Check, Share, PlusSquare, ArrowDownToLine, X, Sparkles, WifiOff } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { sounds } from '../utils/audio';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallPromptModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [isInstalling, setIsInstalling] = useState(false);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    sounds.playClick();
    setIsInstalling(true);
    try {
      const success = await install();
      if (success) {
        onClose();
      }
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />

        {/* Close Button */}
        <button
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl shrink-0">
            🐍
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              Pasang di Android & iOS
              <Sparkles className="w-4 h-4 text-emerald-400" />
            </h3>
            <p className="text-xs text-slate-400">
              Jadikan aplikasi mandiri di ponsel tanpa browser
            </p>
          </div>
        </div>

        {/* Status If Already Installed */}
        {isInstalled && (
          <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
            <Check className="w-4 h-4 shrink-0" />
            <span>Aplikasi sudah terpasang di perangkat Anda! Buka langsung dari Layar Utama.</span>
          </div>
        )}

        {/* Platform Selector Tabs */}
        <div className="flex p-1 bg-slate-950 rounded-xl mb-4 border border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('android');
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'android'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Android {isAndroid && <span className="text-[10px] opacity-75">(Ponsel ini)</span>}
          </button>
          <button
            onClick={() => {
              sounds.playClick();
              setActiveTab('ios');
            }}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ios'
                ? 'bg-slate-100 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Apple className="w-4 h-4" />
            iOS (iPhone/iPad) {isIOS && <span className="text-[10px] opacity-75">(Ponsel ini)</span>}
          </button>
        </div>

        {/* Tab Content: Android */}
        {activeTab === 'android' && (
          <div className="space-y-3.5 text-xs text-slate-300">
            {isInstallable ? (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <p className="font-semibold text-emerald-300 mb-2">
                  ✓ Siap dipasang dengan 1-Klik!
                </p>
                <button
                  onClick={handleInstallClick}
                  disabled={isInstalling}
                  className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-[0.98]"
                >
                  <ArrowDownToLine className="w-4 h-4" />
                  {isInstalling ? 'Memasang...' : 'Pasang Aplikasi di Android'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <p className="font-medium text-slate-200">
                  Cara pasang melalui Google Chrome / Browser Android:
                </p>
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-emerald-400">1</span>
                  <span>Buka menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser Chrome.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-emerald-400">2</span>
                  <span>Pilih <strong>"Pasang aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-emerald-400">3</span>
                  <span>Ikon <strong>Ular Biner</strong> akan muncul di beranda ponsel Anda dan dapat dimainkan layar penuh!</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: iOS (iPhone / iPad) */}
        {activeTab === 'ios' && (
          <div className="space-y-2.5 text-xs text-slate-300">
            <p className="font-medium text-slate-200">
              Cara pasang di iPhone / iPad melalui Safari:
            </p>
            <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-blue-400">1</span>
              <div>
                Buka di browser <strong>Safari</strong>, lalu ketuk tombol <strong>Bagikan</strong> (ikon kotak dengan panah ke atas: <Share className="inline w-3.5 h-3.5 text-blue-400 mx-0.5" />) di bilah bawah.
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-blue-400">2</span>
              <div>
                Gulir ke bawah dan ketuk opsi <strong className="text-white">"Tambahkan ke Layar Utama"</strong> (<PlusSquare className="inline w-3.5 h-3.5 text-emerald-400 mx-0.5" />).
              </div>
            </div>
            <div className="flex items-start gap-2.5 p-2.5 bg-slate-950/70 rounded-xl border border-slate-800">
              <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold shrink-0 text-blue-400">3</span>
              <div>
                Ketuk <strong>"Tambah"</strong> di pojok kanan atas. Game akan langsung tersedia seperti aplikasi App Store!
              </div>
            </div>
          </div>
        )}

        {/* Copy App Link Option */}
        <div className="mt-3.5 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <span>Link Aplikasi untuk dibuka di HP:</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-qwkrlr2e473ijdeqps6dwd-404940166174.asia-east1.run.app'}
              className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 text-xs font-mono truncate focus:outline-none"
            />
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                navigator.clipboard.writeText(window.location.href);
                alert('Tautan aplikasi berhasil disalin! Silakan kirim ke WhatsApp atau buka di browser HP Anda.');
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 whitespace-nowrap transition"
            >
              Salin Link
            </button>
          </div>
        </div>

        {/* Benefits Footnote */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <WifiOff className="w-3.5 h-3.5" />
            <span>Dapat dimainkan 100% Offline</span>
          </div>
          <span className="text-slate-400 font-mono">v2.0 PWA</span>
        </div>
      </div>
    </div>
  );
};
