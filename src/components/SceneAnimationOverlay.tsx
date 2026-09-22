import React, { useState } from 'react';
import { playCuteSound } from '../utils/audio';

interface SceneAnimationOverlayProps {
  mood: string;
  isMuted: boolean;
  isStopMotionActive: boolean;
}

export const SceneAnimationOverlay: React.FC<SceneAnimationOverlayProps> = ({
  mood,
  isMuted,
}) => {
  const [poppedBubbles, setPoppedBubbles] = useState<number[]>([]);

  const handleBubbleClick = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    playCuteSound('crunch', isMuted);
    setPoppedBubbles((prev) => [...prev, id]);
    setTimeout(() => {
      setPoppedBubbles((prev) => prev.filter((b) => b !== id));
    }, 2000);
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {/* 1. FLUTTER (Butterfly Meadow) */}
      {mood === 'flutter' && (
        <>
          <div
            className="absolute text-2xl animate-float-slow"
            style={{ top: '25%', left: '68%', animationDuration: '3.5s' }}
          >
            🦋
          </div>
          <div
            className="absolute text-xl animate-float-slow"
            style={{ top: '60%', left: '18%', animationDuration: '4.2s', animationDelay: '1s' }}
          >
            ✨
          </div>
          <div
            className="absolute text-sm animate-breathe"
            style={{ top: '15%', left: '30%', animationDuration: '2.5s' }}
          >
            🌸
          </div>
          <div
            className="absolute text-base animate-float-slow"
            style={{ top: '45%', right: '15%', animationDuration: '5s' }}
          >
            🌼
          </div>
        </>
      )}

      {/* 2. MUNCH (Giant Strawberry) */}
      {mood === 'munch' && (
        <>
          <div
            className="absolute text-xl animate-bounce"
            style={{ top: '42%', left: '56%', animationDuration: '1.2s' }}
          >
            🍓
          </div>
          <div
            className="absolute text-base animate-pulse"
            style={{ top: '35%', left: '48%', animationDuration: '0.8s' }}
          >
            ✨
          </div>
          <div
            className="absolute text-lg animate-float-slow"
            style={{ top: '20%', right: '25%' }}
          >
            🍯
          </div>
        </>
      )}

      {/* 3. FLOAT (Red Balloon) */}
      {mood === 'float' && (
        <>
          <div
            className="absolute text-2xl animate-float-slow opacity-80"
            style={{ top: '10%', right: '22%', animationDuration: '3s' }}
          >
            🎈
          </div>
          <div
            className="absolute text-3xl opacity-60 animate-float-slow"
            style={{ top: '18%', left: '10%', animationDuration: '6s' }}
          >
            ☁️
          </div>
          <div
            className="absolute text-2xl opacity-50 animate-float-slow"
            style={{ top: '55%', right: '8%', animationDuration: '7s' }}
          >
            ☁️
          </div>
        </>
      )}

      {/* 4. PEEK (Hide & Seek Mushroom) */}
      {mood === 'peek' && (
        <>
          <div
            className="absolute text-2xl animate-breathe"
            style={{ top: '28%', left: '22%', animationDuration: '2s' }}
          >
            🍄
          </div>
          <div
            className="absolute text-xl animate-float-slow"
            style={{ top: '65%', right: '20%', animationDuration: '3.5s' }}
          >
            🍃
          </div>
          <div
            className="absolute text-lg animate-pulse"
            style={{ top: '20%', right: '35%' }}
          >
            👀
          </div>
        </>
      )}

      {/* 5. CRAWL (Gentle Turtle) */}
      {mood === 'crawl' && (
        <>
          <div
            className="absolute text-xl animate-float-slow"
            style={{ bottom: '15%', left: '20%', animationDuration: '4s' }}
          >
            🐢
          </div>
          <div
            className="absolute text-base animate-breathe"
            style={{ top: '25%', right: '20%' }}
          >
            🍀
          </div>
          <div
            className="absolute text-lg animate-float-slow"
            style={{ top: '50%', left: '12%', animationDuration: '5s' }}
          >
            🍃
          </div>
        </>
      )}

      {/* 6. SPLASH (Puddle Rain) */}
      {mood === 'splash' && (
        <>
          <div
            className="absolute text-2xl animate-bounce"
            style={{ bottom: '25%', left: '48%', animationDuration: '0.9s' }}
          >
            💧
          </div>
          <div
            className="absolute text-lg animate-pulse"
            style={{ bottom: '18%', left: '35%' }}
          >
            💦
          </div>
          <div
            className="absolute text-xl animate-float-slow"
            style={{ top: '15%', left: '30%', animationDuration: '3s' }}
          >
            🌧️
          </div>
          <div
            className="absolute text-xl animate-breathe"
            style={{ top: '20%', right: '25%' }}
          >
            🌂
          </div>
        </>
      )}

      {/* 7. STORY (Baby Robin Bird) */}
      {mood === 'story' && (
        <>
          <div
            className="absolute text-2xl animate-float-slow"
            style={{ top: '35%', right: '25%', animationDuration: '3s' }}
          >
            🐤
          </div>
          <div
            className="absolute text-xl animate-breathe"
            style={{ top: '20%', left: '25%', animationDuration: '2.5s' }}
          >
            🎵
          </div>
          <div
            className="absolute text-base animate-float-slow"
            style={{ top: '15%', right: '35%', animationDuration: '4s' }}
          >
            📖
          </div>
        </>
      )}

      {/* 8. SPARKLE & BUBBLES (Interactive Soap Bubbles!) */}
      {mood === 'sparkle' && (
        <div className="absolute inset-0 pointer-events-auto">
          {[
            { id: 1, top: '22%', left: '42%', size: 'w-10 h-10', delay: '0s' },
            { id: 2, top: '38%', left: '65%', size: 'w-12 h-12', delay: '0.4s' },
            { id: 3, top: '52%', left: '22%', size: 'w-8 h-8', delay: '0.8s' },
            { id: 4, top: '18%', left: '72%', size: 'w-14 h-14', delay: '0.2s' },
            { id: 5, top: '65%', left: '55%', size: 'w-9 h-9', delay: '0.6s' },
          ].map((b) => (
            !poppedBubbles.includes(b.id) && (
              <button
                key={b.id}
                id={`bubble-particle-${b.id}`}
                onClick={(e) => handleBubbleClick(b.id, e)}
                style={{
                  top: b.top,
                  left: b.left,
                  animationDelay: b.delay,
                }}
                className={`absolute ${b.size} rounded-full cursor-pointer animate-float-slow bg-gradient-to-tr from-cyan-300/40 via-pink-300/30 to-yellow-200/50 backdrop-blur-[1px] border border-white/60 shadow-[0_0_12px_rgba(255,255,255,0.7)] flex items-center justify-center transition-transform hover:scale-125 active:scale-150`}
                title="Apasă să spargi balonul!"
              >
                <div className="w-2 h-2 rounded-full bg-white/80 absolute top-1.5 left-2" />
              </button>
            )
          ))}
          <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-xs text-xs px-2.5 py-1 rounded-full text-slate-700 shadow-xs pointer-events-none">
            🫧 Atinge baloanele să le spargi!
          </div>
        </div>
      )}

      {/* 9. BALANCE (Wobbly Tower) */}
      {mood === 'balance' && (
        <>
          <div
            className="absolute text-xl animate-bounce"
            style={{ top: '12%', left: '48%', animationDuration: '1.4s' }}
          >
            🟡
          </div>
          <div
            className="absolute text-lg animate-pulse"
            style={{ top: '22%', left: '52%' }}
          >
            ⭐
          </div>
          <div
            className="absolute text-xl animate-float-slow"
            style={{ top: '40%', right: '18%', animationDuration: '3s' }}
          >
            🧱
          </div>
        </>
      )}

      {/* 10. SLEEP (Cozy Bedtime) */}
      {mood === 'sleep' && (
        <>
          <div
            className="absolute text-xl opacity-75 animate-float-slow"
            style={{ top: '12%', left: '20%', animationDuration: '4s' }}
          >
            🌙
          </div>
          <div
            className="absolute text-lg opacity-80 animate-breathe"
            style={{ top: '22%', right: '25%', animationDuration: '3s' }}
          >
            ✨
          </div>
          <div
            className="absolute text-sm opacity-70 animate-float-slow"
            style={{ top: '35%', right: '15%', animationDuration: '3.5s' }}
          >
            💤
          </div>
          <div
            className="absolute text-xs opacity-60 animate-float-slow"
            style={{ top: '45%', right: '22%', animationDuration: '4.5s' }}
          >
            🧸
          </div>
        </>
      )}
    </div>
  );
};
