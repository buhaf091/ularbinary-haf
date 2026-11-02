import { useState, useEffect } from 'react';
import { PlayerData, GameScreen } from './types/game';
import { RegistrationScreen } from './components/RegistrationScreen';
import { MateriScreen } from './components/MateriScreen';
import { GameCanvas } from './components/GameCanvas';
import { CertificateScreen } from './components/CertificateScreen';
import { InstallPromptModal } from './components/InstallPromptModal';
import { sounds } from './utils/audio';
import { usePWAInstall } from './hooks/usePWAInstall';
import { Download, Volume2, VolumeX, WifiOff, Smartphone, Apple } from 'lucide-react';

const STORAGE_KEY_PLAYER = 'ular_biner_player';
const STORAGE_KEY_HIGHSCORE = 'ular_biner_highscore';
const STORAGE_KEY_SOUND = 'ular_biner_sound';

export default function App() {
  // Load saved player data from localStorage
  const [playerData, setPlayerData] = useState<PlayerData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PLAYER);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore parse errors
    }
    return {
      name: '',
      class: 'X SMKS Purnama Gempol',
      major: 'Desain Komunikasi Visual (DKV)',
      color: '#10b981',
      accessory: 'none',
    };
  });

  // Current screen
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('register');
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastLevel, setLastLevel] = useState<number>(1);

  // High score
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HIGHSCORE);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // PWA Install hook & modal
  const { isInstallable, isInstalled, isIOS, isAndroid } = usePWAInstall();
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);

  // Online status indicator
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    sounds.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Persist player data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PLAYER, JSON.stringify(playerData));
    } catch {
      // Safe fallback
    }
  }, [playerData]);

  // Persist sound preference
  const toggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sounds.enabled = next;
      try {
        localStorage.setItem(STORAGE_KEY_SOUND, String(next));
      } catch {
        // Safe fallback
      }
      return next;
    });
  };

  // Handle Game Over
  const handleGameOver = (finalScore: number, finalLevel: number) => {
    setLastScore(finalScore);
    setLastLevel(finalLevel);

    if (finalScore > highScore) {
      setHighScore(finalScore);
      try {
        localStorage.setItem(STORAGE_KEY_HIGHSCORE, String(finalScore));
      } catch {
        // Safe fallback
      }
    }

    setCurrentScreen('certificate');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between pt-safe pb-safe pl-safe pr-safe selection:bg-emerald-500 selection:text-black">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 no-print">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          {/* Brand Wordmark Zone */}
          <div 
            onClick={() => {
              sounds.playClick();
              if (currentScreen !== 'register') setCurrentScreen('register');
            }}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-base">
              🐍
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                Ular Biner
                {(isAndroid || isIOS) && (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                    {isAndroid ? 'Android' : 'iOS'}
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Sound Mute/Unmute */}
            <button
              type="button"
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition"
              title={soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
              aria-label="Toggle Sound"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {/* Install App Button */}
            {!isInstalled && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setShowInstallModal(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition active:scale-95"
              >
                {isIOS ? (
                  <Apple className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5" />
                )}
                <span className="whitespace-nowrap">
                  {isInstallable ? 'Pasang App' : 'Pasang di HP'}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Offline Toast if disconnected */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-slate-950 font-bold px-4 py-1.5 text-xs flex items-center justify-center gap-2 shadow no-print">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Mode Offline aktif — Game dan materi tetap berjalan lancar tanpa kuota internet!</span>
        </div>
      )}

      {/* Main Dynamic Content Frame */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-4 flex flex-col justify-center">
        {currentScreen === 'register' && (
          <RegistrationScreen
            playerData={playerData}
            setPlayerData={setPlayerData}
            onStartMateri={() => setCurrentScreen('materi')}
            onOpenInstallModal={() => setShowInstallModal(true)}
            highScore={highScore}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        )}

        {currentScreen === 'materi' && (
          <MateriScreen
            onStartGame={() => setCurrentScreen('game')}
            onBackToRegister={() => setCurrentScreen('register')}
          />
        )}

        {currentScreen === 'game' && (
          <GameCanvas
            playerData={playerData}
            onGameOver={handleGameOver}
            onReturnToMenu={() => setCurrentScreen('register')}
          />
        )}

        {currentScreen === 'certificate' && (
          <CertificateScreen
            playerData={playerData}
            score={lastScore}
            level={lastLevel}
            onRestartAll={() => {
              setCurrentScreen('register');
            }}
          />
        )}
      </main>

      {/* Native-feeling App Footer */}
      <footer className="py-3 px-4 text-center text-xs text-slate-400 border-t border-slate-900 no-print">
        <p className="text-[11px]">
          Game Edukasi Bilangan Biner &copy; SMKS Purnama Gempol &bull; Diciptakan oleh{' '}
          <span className="text-slate-300 font-semibold">Hafilah Farhana, S.Kom.</span>
        </p>
      </footer>

      {/* Dedicated Android & iOS Install Instructions Modal */}
      <InstallPromptModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
      />
    </div>
  );
}
