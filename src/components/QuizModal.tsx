import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types/game';
import { sounds, triggerHaptic } from '../utils/audio';
import { Clock, CheckCircle2, XCircle, Sparkles, BookOpen } from 'lucide-react';

interface QuizModalProps {
  question: QuizQuestion;
  level: number;
  onAnswer: (isCorrect: boolean) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ question, level, onAnswer }) => {
  const maxTime = level === 1 ? 15 : level === 2 ? 10 : 7;
  const [timeLeft, setTimeLeft] = useState(maxTime);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  // Countdown timer effect
  useEffect(() => {
    if (answered) return;

    if (timeLeft <= 0) {
      handleOptionClick(-1); // Timeout
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, answered]);

  const handleOptionClick = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIdx(idx);

    const isCorrect = idx === question.answer;

    if (isCorrect) {
      sounds.playCorrect();
      triggerHaptic(30);
    } else {
      sounds.playWrong();
      triggerHaptic(60);
    }

    // Give 1.4s for student to absorb the explanation before returning to game
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1500);
  };

  const timerPercent = (timeLeft / maxTime) * 100;
  const timerColor =
    timerPercent > 50 ? 'bg-emerald-500' : timerPercent > 25 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-slate-900 border-2 border-emerald-500/80 rounded-3xl p-5 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated Background Glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Top Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍎</span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Apel Biner Dimakan!
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-full text-xs font-mono font-bold">
            <Clock className={`w-3.5 h-3.5 ${timerPercent <= 25 ? 'text-red-400 animate-pulse' : 'text-slate-400'}`} />
            <span className={timerPercent <= 25 ? 'text-red-400' : 'text-white'}>
              {timeLeft}s
            </span>
          </div>
        </div>

        {/* Animated Timer Progress Bar */}
        <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden mb-4 border border-slate-800">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${timerColor}`}
            style={{ width: `${timerPercent}%` }}
          />
        </div>

        {/* Question Text */}
        <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/90 mb-4 text-center">
          <p className="text-base font-bold text-white leading-relaxed">
            {question.q}
          </p>
        </div>

        {/* Options Grid */}
        <div className="space-y-2 mb-4">
          {question.options.map((opt, idx) => {
            let btnStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700';

            if (answered) {
              if (idx === question.answer) {
                btnStyle = 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold';
              } else if (idx === selectedIdx) {
                btnStyle = 'bg-red-500/30 border-red-500 text-red-200';
              } else {
                btnStyle = 'bg-slate-950/50 border-slate-800/40 text-slate-500';
              }
            }

            return (
              <button
                type="button"
                key={idx}
                disabled={answered}
                onClick={() => handleOptionClick(idx)}
                className={`w-full py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-between transition-all active:scale-[0.98] ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-slate-800/80 flex items-center justify-center text-xs font-mono font-bold shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-mono text-base">{opt}</span>
                </div>
                {answered && idx === question.answer && (
                  <CheckCircle2 className="w-5 h-5 text-slate-950 fill-emerald-200 shrink-0" />
                )}
                {answered && idx === selectedIdx && idx !== question.answer && (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation Alert when answered */}
        {answered && (
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 animate-in fade-in duration-200 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              {selectedIdx === question.answer ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Jawaban Tepat! (+10 Skor)
                </span>
              ) : (
                <span className="text-red-400 flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Waktu Habis / Kurang Tepat
                </span>
              )}
            </div>
            <p className="text-slate-300">
              {question.explanation}
            </p>
          </div>
        )}

        {/* Helpful hint footer */}
        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 mt-2">
          <BookOpen className="w-3 h-3 text-slate-400" />
          <span>Level {level} &bull; Kecepatan bertambah tiap kenaikan level</span>
        </div>
      </div>
    </div>
  );
};
