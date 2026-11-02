import React, { useRef, useEffect, useState, useCallback } from 'react';
import { PlayerData, QuizQuestion } from '../types/game';
import { quizBank } from '../data/quizBank';
import { sounds, triggerHaptic } from '../utils/audio';
import { QuizModal } from './QuizModal';
import { 
  Pause, 
  Play, 
  RotateCcw, 
  Home, 
  Square, 
  Flame, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

interface GameCanvasProps {
  playerData: PlayerData;
  onGameOver: (finalScore: number, finalLevel: number) => void;
  onReturnToMenu: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  playerData,
  onGameOver,
  onReturnToMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [streak, setStreak] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState<QuizQuestion | null>(null);
  const [screenShake, setScreenShake] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for game loop
  const gridSize = 20;
  const tileCount = 20; // 400x400 virtual grid

  const snakeRef = useRef<{ x: number; y: number }[]>([
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ]);
  const dirRef = useRef<{ dx: number; dy: number }>({ dx: 1, dy: 0 });
  const nextDirRef = useRef<{ dx: number; dy: number }>({ dx: 1, dy: 0 });
  const foodRef = useRef<{ x: number; y: number }>({ x: 15, y: 10 });
  const particlesRef = useRef<Particle[]>([]);
  const lastTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Track touch start for swipe detection
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Speed calculation based on level
  const getSpeedInterval = useCallback((lvl: number) => {
    if (lvl === 1) return 150;
    if (lvl === 2) return 110;
    return 75; // Level 3 fast pace
  }, []);

  // Spawn random food not on snake
  const spawnFood = useCallback(() => {
    let newX = Math.floor(Math.random() * tileCount);
    let newY = Math.floor(Math.random() * tileCount);
    // Ensure food doesn't land on snake
    while (snakeRef.current.some((seg) => seg.x === newX && seg.y === newY)) {
      newX = Math.floor(Math.random() * tileCount);
      newY = Math.floor(Math.random() * tileCount);
    }
    foodRef.current = { x: newX, y: newY };
  }, [tileCount]);

  // Burst particle effect
  const createExplosion = (x: number, y: number, color: string, count = 16) => {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 1.5 + Math.random() * 3;
      particlesRef.current.push({
        x: x * gridSize + gridSize / 2,
        y: y * gridSize + gridSize / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 2 + Math.random() * 3,
        alpha: 1,
      });
    }
  };

  // Change direction safely (prevent 180 reverse)
  const setDirection = useCallback((dx: number, dy: number) => {
    const current = dirRef.current;
    if (dx !== 0 && current.dx === 0) {
      nextDirRef.current = { dx, dy: 0 };
    } else if (dy !== 0 && current.dy === 0) {
      nextDirRef.current = { dx: 0, dy };
    }
  }, []);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeQuiz) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setDirection(0, -1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setDirection(0, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        setDirection(-1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setDirection(1, 0);
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeQuiz, setDirection]);

  // Touch Swipe Handlers for mobile screens
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || activeQuiz) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    const minSwipe = 25; // minimum swipe threshold
    if (Math.max(absX, absY) > minSwipe) {
      triggerHaptic(15);
      if (absX > absY) {
        // Horizontal swipe
        if (dx > 0) setDirection(1, 0);
        else setDirection(-1, 0);
      } else {
        // Vertical swipe
        if (dy > 0) setDirection(0, 1);
        else setDirection(0, -1);
      }
    }
    touchStartRef.current = null;
  };

  // Reset snake to center on death
  const resetSnake = useCallback(() => {
    snakeRef.current = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 },
    ];
    dirRef.current = { dx: 1, dy: 0 };
    nextDirRef.current = { dx: 1, dy: 0 };
    spawnFood();
  }, [spawnFood]);

  // Handle collision
  const handleCollision = useCallback(() => {
    sounds.playHit();
    triggerHaptic(80);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);

    const head = snakeRef.current[0];
    if (head) {
      createExplosion(head.x, head.y, '#ef4444', 20);
    }

    setLives((prevLives) => {
      const nextLives = prevLives - 1;
      if (nextLives <= 0) {
        setTimeout(() => {
          onGameOver(score, level);
        }, 600);
      } else {
        resetSnake();
      }
      return nextLives;
    });
    setStreak(0);
  }, [level, onGameOver, resetSnake, score]);

  // Main game tick
  const gameTick = useCallback(() => {
    if (isPaused || activeQuiz) return;

    // Apply next direction
    dirRef.current = nextDirRef.current;
    const head = {
      x: snakeRef.current[0].x + dirRef.current.dx,
      y: snakeRef.current[0].y + dirRef.current.dy,
    };

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      handleCollision();
      return;
    }

    // Self collision
    for (let i = 0; i < snakeRef.current.length; i++) {
      if (head.x === snakeRef.current[i].x && head.y === snakeRef.current[i].y) {
        handleCollision();
        return;
      }
    }

    // Move snake
    snakeRef.current.unshift(head);

    // Check food eaten
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      sounds.playEat();
      triggerHaptic(25);
      createExplosion(foodRef.current.x, foodRef.current.y, '#ef4444', 12);

      // Trigger quiz modal
      const randomQ = quizBank[Math.floor(Math.random() * quizBank.length)];
      setActiveQuiz(randomQ);
    } else {
      snakeRef.current.pop();
    }
  }, [activeQuiz, handleCollision, isPaused, tileCount]);

  // Handle Quiz answer
  const handleQuizAnswer = (isCorrect: boolean) => {
    setActiveQuiz(null);

    if (isCorrect) {
      setScore((s) => {
        const newScore = s + 10;
        // Level up conditions
        if (newScore >= 70 && level < 3) {
          setLevel(3);
          sounds.playLevelUp();
        } else if (newScore >= 40 && level < 2) {
          setLevel(2);
          sounds.playLevelUp();
        }

        // Win threshold: 100 points
        if (newScore >= 100) {
          sounds.playLevelUp();
          setTimeout(() => {
            onGameOver(newScore, 3);
          }, 500);
        }
        return newScore;
      });
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }

    spawnFood();
  };

  // Drawing the canvas at 60fps
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let accumulator = 0;

    const render = (time: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current), 100);
      lastTimeRef.current = time;

      accumulator += dt;
      const speed = getSpeedInterval(level);

      while (accumulator >= speed) {
        gameTick();
        accumulator -= speed;
      }

      // 1. Clear canvas background
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw subtle cyberpunk grid lines
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y); ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 3. Draw particles
      particlesRef.current.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;

        if (p.alpha > 0) {
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          particlesRef.current.splice(idx, 1);
        }
      });

      // 4. Draw Apple Food with glow
      const food = foodRef.current;
      const fx = food.x * gridSize + gridSize / 2;
      const fy = food.y * gridSize + gridSize / 2;
      const pulse = Math.sin(time / 200) * 1.5;

      ctx.save();
      // Glow circle
      ctx.fillStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.beginPath();
      ctx.arc(fx, fy, gridSize / 2 + 3 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Apple Body
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(fx, fy + 1, gridSize / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Leaf & Stem
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fx, fy - 6);
      ctx.lineTo(fx + 3, fy - 10);
      ctx.stroke();

      // Binary '1' / '0' on apple
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1', fx, fy + 1);
      ctx.restore();

      // 5. Draw Snake Body
      const snake = snakeRef.current;
      snake.forEach((seg, i) => {
        const sx = seg.x * gridSize;
        const sy = seg.y * gridSize;

        ctx.save();
        if (i === 0) {
          // Head segment
          ctx.fillStyle = playerData.color;
          ctx.beginPath();
          ctx.roundRect(sx + 1, sy + 1, gridSize - 2, gridSize - 2, 5);
          ctx.fill();

          // Snake Eyes based on current direction
          ctx.fillStyle = '#0f172a';
          let eye1X = sx + 5;
          let eye1Y = sy + 5;
          let eye2X = sx + gridSize - 5;
          let eye2Y = sy + 5;

          if (dirRef.current.dx === 1) { // Moving Right
            eye1X = sx + gridSize - 5; eye1Y = sy + 5;
            eye2X = sx + gridSize - 5; eye2Y = sy + gridSize - 5;
          } else if (dirRef.current.dx === -1) { // Moving Left
            eye1X = sx + 5; eye1Y = sy + 5;
            eye2X = sx + 5; eye2Y = sy + gridSize - 5;
          } else if (dirRef.current.dy === 1) { // Moving Down
            eye1X = sx + 5; eye1Y = sy + gridSize - 5;
            eye2X = sx + gridSize - 5; eye2Y = sy + gridSize - 5;
          }

          ctx.beginPath();
          ctx.arc(eye1X, eye1Y, 2.5, 0, Math.PI * 2);
          ctx.arc(eye2X, eye2Y, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(eye1X + 0.5, eye1Y - 0.5, 1, 0, Math.PI * 2);
          ctx.arc(eye2X + 0.5, eye2Y - 0.5, 1, 0, Math.PI * 2);
          ctx.fill();

          // Accessory Drawing
          let accessoryEmoji = '';
          if (playerData.accessory === 'crown') accessoryEmoji = '👑';
          else if (playerData.accessory === 'hat') accessoryEmoji = '🎩';
          else if (playerData.accessory === 'glasses') accessoryEmoji = '👓';
          else if (playerData.accessory === 'bow') accessoryEmoji = '🎀';
          else if (playerData.accessory === 'ninja') accessoryEmoji = '🥷';

          if (accessoryEmoji) {
            ctx.font = '14px system-ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(accessoryEmoji, sx + gridSize / 2, sy - 4);
          }
        } else {
          // Body segments
          ctx.fillStyle = `${playerData.color}dd`;
          ctx.beginPath();
          ctx.roundRect(sx + 2, sy + 2, gridSize - 4, gridSize - 4, 3);
          ctx.fill();
        }
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [getSpeedInterval, gameTick, level, playerData.accessory, playerData.color]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    sounds.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`w-full max-w-lg mx-auto flex flex-col items-center select-none ${screenShake ? 'animate-bounce' : ''}`}>
      {/* Top Game Dashboard */}
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 mb-3 shadow-xl flex items-center justify-between text-xs font-mono">
        {/* Score */}
        <div className="flex items-center gap-1.5">
          <span className="text-amber-400 font-bold">⭐ SKOR:</span>
          <span className="text-white text-base font-black tabular-nums">{score}</span>
        </div>

        {/* Level */}
        <div className="flex items-center gap-1.5">
          <span className="text-emerald-400 font-bold">🏆 LVL:</span>
          <span className="text-white text-base font-black tabular-nums">{level}</span>
        </div>

        {/* Lives */}
        <div className="flex items-center gap-1">
          <span className="text-red-400 font-bold mr-1">❤️:</span>
          <div className="flex items-center text-sm">
            {Array.from({ length: 3 }).map((_, i) => (
              <span key={i} className={i < lives ? 'opacity-100' : 'opacity-20 grayscale'}>
                ❤️
              </span>
            ))}
          </div>
        </div>

        {/* Streak bonus */}
        {streak > 1 && (
          <div className="flex items-center gap-1 text-amber-400 font-bold animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>x{streak}</span>
          </div>
        )}
      </div>

      {/* Canvas Playfield Container */}
      <div 
        className="relative w-full aspect-square max-w-[420px] rounded-2xl overflow-hidden border-2 border-slate-800 shadow-2xl bg-black touch-action-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="w-full h-full block"
        />

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-white">
            <Pause className="w-12 h-12 text-amber-400 animate-pulse" />
            <h3 className="text-lg font-black tracking-wider uppercase">Permainan Dijeda</h3>
            <p className="text-xs text-slate-400">Tekan tombol Play untuk melanjutkan</p>
            <button
              onClick={() => {
                sounds.playClick();
                setIsPaused(false);
              }}
              className="mt-2 py-2.5 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-current" />
              Lanjutkan
            </button>
          </div>
        )}

        {/* Player Name Tag in playfield corner */}
        <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-lg text-[10px] text-slate-300 font-medium pointer-events-none border border-slate-800/80">
          {playerData.name || 'Siswa'} &bull; {playerData.major.split(' ')[0]}
        </div>
      </div>

      {/* Control Action Toolbar */}
      <div className="w-full flex items-center justify-between gap-2 mt-3 px-1 no-print">
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            setIsPaused((p) => !p);
          }}
          className="flex-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-current" /> : <Pause className="w-3.5 h-3.5 text-amber-400" />}
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            resetSnake();
          }}
          className="flex-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
        >
          <RotateCcw className="w-3.5 h-3.5 text-blue-400" />
          <span>Reload</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onGameOver(score, level);
          }}
          className="flex-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition"
        >
          <Square className="w-3.5 h-3.5 text-red-400" />
          <span>Stop</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onReturnToMenu();
          }}
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl text-slate-300 text-xs font-semibold flex items-center justify-center border border-slate-700 transition"
          title="Kembali ke Menu"
        >
          <Home className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="py-2 px-3 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded-xl text-slate-300 text-xs font-semibold flex items-center justify-center border border-slate-700 transition"
          title="Layar Penuh"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Ergonomic Mobile Virtual D-Pad (Touch-friendly 48px hitboxes) */}
      <div className="mt-4 p-2.5 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl flex flex-col items-center no-print touch-action-manipulation">
        {/* Up */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20);
            setDirection(0, -1);
          }}
          className="w-14 h-12 rounded-2xl bg-slate-800 hover:bg-emerald-500/20 active:bg-emerald-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center transition-all shadow active:scale-95 mb-1"
          aria-label="Atas"
        >
          <ArrowUp className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Middle row: Left, Center icon, Right */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              setDirection(-1, 0);
            }}
            className="w-14 h-12 rounded-2xl bg-slate-800 hover:bg-emerald-500/20 active:bg-emerald-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center transition-all shadow active:scale-95"
            aria-label="Kiri"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-slate-500 font-mono">
            🕹️
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic(20);
              setDirection(1, 0);
            }}
            className="w-14 h-12 rounded-2xl bg-slate-800 hover:bg-emerald-500/20 active:bg-emerald-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center transition-all shadow active:scale-95"
            aria-label="Kanan"
          >
            <ArrowRight className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Down */}
        <button
          type="button"
          onClick={() => {
            triggerHaptic(20);
            setDirection(0, 1);
          }}
          className="w-14 h-12 rounded-2xl bg-slate-800 hover:bg-emerald-500/20 active:bg-emerald-500 active:text-slate-950 text-slate-200 border border-slate-700 flex items-center justify-center transition-all shadow active:scale-95 mt-1"
          aria-label="Bawah"
        >
          <ArrowDown className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Touch swipe hint */}
      <p className="text-[11px] text-slate-400 mt-2 text-center no-print">
        Tip: Anda juga dapat menggesek (swipe) layar langsung untuk mengontrol arah ular.
      </p>

      {/* Quiz Modal when Apple eaten */}
      {activeQuiz && (
        <QuizModal
          question={activeQuiz}
          level={level}
          onAnswer={handleQuizAnswer}
        />
      )}
    </div>
  );
};
