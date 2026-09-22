import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, X, Volume2, RotateCcw } from 'lucide-react';
import { Scene } from '../types';
import { playCuteSound, speakStory, stopSpeaking } from '../utils/audio';

interface CinemaPlayerProps {
  scenes: Scene[];
  initialSceneIndex: number;
  isMuted: boolean;
  onClose: () => void;
}

export const CinemaPlayer: React.FC<CinemaPlayerProps> = ({
  scenes,
  initialSceneIndex,
  isMuted,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialSceneIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoNarrate, setAutoNarrate] = useState(true);

  const currentScene = scenes[currentIndex];

  const goToNext = useCallback(() => {
    playCuteSound('click', isMuted);
    setCurrentIndex((prev) => (prev + 1) % scenes.length);
  }, [scenes.length, isMuted]);

  const goToPrev = useCallback(() => {
    playCuteSound('click', isMuted);
    setCurrentIndex((prev) => (prev - 1 + scenes.length) % scenes.length);
  }, [scenes.length, isMuted]);

  // Handle current scene speech & sound
  useEffect(() => {
    playCuteSound(currentScene.soundType, isMuted);

    if (autoNarrate) {
      speakStory(`${currentScene.titleRo}. ${currentScene.storyRo}`, () => {
        if (isPlaying) {
          // Advance after a brief reading pause
          setTimeout(() => {
            goToNext();
          }, 2500);
        }
      });
    }

    return () => {
      stopSpeaking();
    };
  }, [currentIndex, autoNarrate, currentScene, isMuted, isPlaying, goToNext]);

  // Slideshow auto-advance timer if autoNarrate is off
  useEffect(() => {
    if (!isPlaying || autoNarrate) return;

    const timer = setInterval(() => {
      goToNext();
    }, 7000);

    return () => clearInterval(timer);
  }, [isPlaying, autoNarrate, goToNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, onClose]);

  return (
    <div
      id="cinema-modal"
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between text-white select-none animate-in fade-in duration-200"
    >
      {/* Top Header Bar */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-stone-800/80">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-stone-950">
            Cinema Copii 4-7 Ani
          </span>
          <span className="text-sm text-stone-300 font-medium">
            Episodul {currentScene.id} din {scenes.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="cinema-auto-narrate-btn"
            onClick={() => setAutoNarrate(!autoNarrate)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              autoNarrate
                ? 'bg-emerald-600 text-white'
                : 'bg-stone-800 text-stone-400 hover:text-white'
            }`}
            title="Povestire vocală automată"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Voce Povestitor {autoNarrate ? 'Activă' : 'Oprită'}</span>
          </button>

          <button
            id="cinema-close-btn"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Închide Cinema"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Theater Display */}
      <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
        {/* Previous Button */}
        <button
          id="cinema-prev-btn"
          onClick={goToPrev}
          className="absolute left-4 z-30 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white transition-transform active:scale-95 cursor-pointer backdrop-blur-sm"
          title="Episodul Anterior (Săgeată Stânga)"
        >
          <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        {/* Center Stage Card */}
        <div className="relative max-h-[68vh] aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-amber-300/30 bg-stone-900">
          <img
            src={currentScene.imageSrc}
            alt={currentScene.titleRo}
            loading="eager"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover select-none"
          />

          {/* Watermark in bottom of image */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent pt-6 pb-2.5 px-3 z-30 pointer-events-none text-center">
            <p className="text-xs sm:text-sm text-amber-200 font-semibold tracking-wide drop-shadow-md">
              @2026 by Suflețel Concept creat cu ❤️ pentru copii și părinți deopotrivă
            </p>
          </div>
        </div>

        {/* Next Button */}
        <button
          id="cinema-next-btn"
          onClick={goToNext}
          className="absolute right-4 z-30 p-3 sm:p-4 rounded-full bg-black/50 hover:bg-black/80 text-white transition-transform active:scale-95 cursor-pointer backdrop-blur-sm"
          title="Episodul Următor (Săgeată Dreapta)"
        >
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
        </button>
      </div>

      {/* Bottom Subtitles & Play Controls */}
      <div className="bg-stone-900/90 border-t border-stone-800 p-4 sm:p-6 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="text-center">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-amber-300">
              {currentScene.titleRo}
            </h2>
            <p className="mt-1 text-sm sm:text-base text-stone-200 leading-relaxed font-medium">
              {currentScene.storyRo}
            </p>
          </div>

          {/* Interactive Controls & Progress Indicators */}
          <div className="pt-2 flex items-center justify-between gap-4">
            {/* Dots */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              {scenes.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-7 bg-amber-400'
                      : 'w-2.5 bg-stone-700 hover:bg-stone-500'
                  }`}
                  title={`Sari la Episodul ${s.id}`}
                />
              ))}
            </div>

            {/* Play/Pause center */}
            <div className="flex items-center gap-3">
              <button
                id="cinema-play-pause-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold transition-transform active:scale-95 cursor-pointer shadow-md text-sm"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current" />
                    <span>Pauză Proiecție</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Redare Automată</span>
                  </>
                )}
              </button>

              <button
                id="cinema-replay-btn"
                onClick={() => {
                  stopSpeaking();
                  speakStory(`${currentScene.titleRo}. ${currentScene.storyRo}`);
                  playCuteSound(currentScene.soundType, isMuted);
                }}
                className="p-2.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                title="Repetă povestea"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
