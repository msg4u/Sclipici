import React, { useState } from 'react';
import { BookOpen, ChevronLeft, ChevronRight, Volume2, Sparkles, Printer } from 'lucide-react';
import { Scene } from '../types';
import { playCuteSound, speakStory, stopSpeaking } from '../utils/audio';

interface StoryBookViewProps {
  scenes: Scene[];
  isMuted: boolean;
  onOpenColoring: (scene: Scene) => void;
}

export const StoryBookView: React.FC<StoryBookViewProps> = ({
  scenes,
  isMuted,
  onOpenColoring,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const scene = scenes[currentPage];

  const handleNext = () => {
    if (currentPage < scenes.length - 1) {
      stopSpeaking();
      setIsSpeaking(false);
      playCuteSound('click', isMuted);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      stopSpeaking();
      setIsSpeaking(false);
      playCuteSound('click', isMuted);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleToggleNarrate = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      playCuteSound('click', isMuted);
      speakStory(`${scene.titleRo}. ${scene.storyRo}`, () => {
        setIsSpeaking(false);
      });
    }
  };

  return (
    <div id="storybook-container" className="max-w-5xl mx-auto space-y-6">
      {/* Book Navigation Header */}
      <div className="flex items-center justify-between bg-amber-100/60 border border-amber-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 text-amber-950">
          <BookOpen className="w-5 h-5 text-amber-700" />
          <span className="font-display font-bold text-base">
            Cartea de Povești cu Suflici
          </span>
          <span className="text-xs bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full font-semibold">
            Pagina {currentPage + 1} din {scenes.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="book-narrate-btn"
            onClick={handleToggleNarrate}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isSpeaking
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-300/80'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSpeaking ? 'Oprește Nararea' : 'Citește-mi cu voce tare'}</span>
          </button>
        </div>
      </div>

      {/* Two-Page Storybook Layout */}
      <div className="bg-[#fcf9f2] border-4 border-[#e8dec9] rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2 relative min-h-[500px]">
        {/* Book Spine Shadow in the center (visible on desktop) */}
        <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-8 -ml-4 bg-gradient-to-r from-black/5 via-black/15 to-transparent pointer-events-none z-20" />

        {/* Left Page: Large Illustration */}
        <div className="p-6 md:p-8 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-[#e8dec9]/80 bg-[#faf6ed]">
          <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-md border-4 border-white bg-stone-900">
            <img
              src={scene.imageSrc}
              alt={scene.titleRo}
              loading="eager"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            {/* Watermark in bottom of image */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent pt-4 pb-2 px-2.5 z-20 text-center pointer-events-none">
              <p className="text-[10px] sm:text-[11px] text-amber-200 font-medium tracking-wide drop-shadow-sm">
                @2026 by Suflețel Concept creat cu ❤️ pentru copii și părinți deopotrivă
              </p>
            </div>
            <div className="absolute top-2 right-2 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md backdrop-blur-xs font-semibold">
              Foto {scene.id}
            </div>
          </div>
          <span className="mt-3 text-xs text-stone-500 font-medium italic">
            „{scene.subtitleRo}”
          </span>
        </div>

        {/* Right Page: Story Text & Educational Content */}
        <div className="p-6 md:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-amber-200/80 pb-3">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-700">
                {scene.badge}
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                {scene.titleRo}
              </h2>
            </div>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed font-sans font-medium">
              {scene.storyRo}
            </p>

            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60 space-y-2">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Întrebare de explorat împreună:
              </span>
              <p className="text-xs sm:text-sm text-amber-800 italic">
                {scene.questionForKids}
              </p>
            </div>

            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200/60 text-xs text-emerald-800">
              <span className="font-bold">Notă educativă: </span>
              {scene.educationalTip}
            </div>
          </div>

          {/* Book Page Controls */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            <button
              id="book-prev-btn"
              onClick={handlePrev}
              disabled={currentPage === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                currentPage === 0
                  ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400'
                  : 'bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 shadow-xs'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Pagina Anterioară</span>
            </button>

            <button
              id="book-print-card-btn"
              onClick={() => onOpenColoring(scene)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Transformă în planșă de colorat"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Planșă Colorat</span>
            </button>

            <button
              id="book-next-btn"
              onClick={handleNext}
              disabled={currentPage === scenes.length - 1}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                currentPage === scenes.length - 1
                  ? 'opacity-40 cursor-not-allowed bg-stone-100 text-stone-400'
                  : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
              }`}
            >
              <span>Pagina Următoare</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
