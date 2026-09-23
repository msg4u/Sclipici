import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, HelpCircle, Download, Copy, Check, Play, Pause, Maximize2 } from 'lucide-react';
import { Scene } from '../types';
import { playCuteSound, playStoryAudio, stopStoryAudio, isStoryAudioPlaying } from '../utils/audio';

interface AnimatedSceneCardProps {
  scene: Scene;
  isMuted: boolean;
  onOpenCinema?: (sceneId: number) => void;
  onOpenColoring?: (scene: Scene) => void;
}

export const AnimatedSceneCard: React.FC<AnimatedSceneCardProps> = ({
  scene,
  isMuted,
  onOpenCinema,
  onOpenColoring,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [answeredQuestion, setAnsweredQuestion] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  useEffect(() => {
    const handleAudioState = (e: Event) => {
      const customEvent = e as CustomEvent<{ activeSrc: string | null; isPlaying: boolean }>;
      if (customEvent.detail) {
        if (customEvent.detail.activeSrc === scene.audioSrc && customEvent.detail.isPlaying) {
          setIsSpeaking(true);
        } else {
          setIsSpeaking(false);
        }
      }
    };

    window.addEventListener('story-audio-state', handleAudioState);
    return () => {
      window.removeEventListener('story-audio-state', handleAudioState);
    };
  }, [scene.audioSrc]);

  const handlePlaySound = () => {
    playCuteSound(scene.soundType, isMuted);
  };

  const toggleSpeech = () => {
    if (isSpeaking) {
      stopStoryAudio();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      playCuteSound('click', isMuted);
      playStoryAudio(
        scene.audioSrc,
        () => setIsSpeaking(false),
        `${scene.titleRo}. ${scene.storyRo}`
      );
    }
  };

  const handleChildAnswered = (e: React.MouseEvent) => {
    e.stopPropagation();
    setAnsweredQuestion(true);
    playCuteSound('fanfare', isMuted);
    
    // Shoot celebratory kid confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#f97316', '#10b981', '#06b6d4', '#eab308', '#ec4899'],
      });
    } catch {
      // safe fallback
    }

    setTimeout(() => {
      setAnsweredQuestion(false);
    }, 4000);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(scene.promptDescription);
    setCopiedPrompt(true);
    playCuteSound('click', isMuted);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleDownloadImage = () => {
    const link = document.createElement('a');
    link.href = scene.imageSrc;
    link.download = `Sclipici_${scene.id}_${scene.titleEn.replace(/\s+/g, '_')}.jpg`;
    link.click();
    playCuteSound('click', isMuted);
  };

  return (
    <div
      id={`scene-card-${scene.id}`}
      className="bg-white rounded-3xl border border-stone-200/90 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col group hover:-translate-y-1"
    >
      {/* Card Header Tag */}
      <div className="px-5 pt-3.5 pb-2.5 flex items-center justify-between bg-gradient-to-r from-amber-50 to-orange-50 border-b border-stone-100">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-xs">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          {scene.badge}
        </span>
        <div className="flex items-center gap-1 text-xs text-stone-600 font-semibold">
          <span className="bg-white/80 text-stone-700 px-2.5 py-0.5 rounded-full border border-stone-200">
            {scene.characterEmotion}
          </span>
        </div>
      </div>

      {/* Main Image Stage (Static & Crisp) */}
      <div className="relative aspect-[3/4] bg-stone-900 overflow-hidden select-none">
        <img
          src={scene.imageSrc}
          alt={scene.titleRo}
          loading="eager"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* Top-right quick actions */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          {onOpenCinema && (
            <button
              id={`cinema-btn-${scene.id}`}
              onClick={() => onOpenCinema(scene.id)}
              className="p-2 rounded-full bg-white/90 hover:bg-white text-stone-800 backdrop-blur-md shadow-xs transition-colors cursor-pointer"
              title="Vezi pe tot ecranul / Cinema"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Audio / Story Interactive Triggers */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-20">
          <button
            id={`sound-btn-${scene.id}`}
            onClick={handlePlaySound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900/85 hover:bg-stone-900 text-white text-xs font-bold backdrop-blur-md shadow-sm transition-transform active:scale-95 cursor-pointer border border-white/20"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Sunet haios</span>
          </button>

          <button
            id={`narrate-btn-${scene.id}`}
            onClick={toggleSpeech}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md shadow-sm transition-transform active:scale-95 cursor-pointer border border-white/20 ${
              isSpeaking
                ? 'bg-emerald-600 text-white animate-pulse'
                : 'bg-white/95 hover:bg-white text-emerald-900'
            }`}
          >
            {isSpeaking ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pauză</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Ascultă Povestea</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Story & Educational Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div>
            <h3 className="font-display text-xl font-bold text-stone-900 leading-snug">
              {scene.titleRo}
            </h3>
            <p className="text-xs text-amber-800 font-semibold italic mt-0.5">{scene.subtitleRo}</p>
          </div>

          <p className="mt-2.5 text-sm text-stone-600 leading-relaxed font-normal">
            {scene.storyRo}
          </p>
        </div>

        {/* Interactive Kid Question Box */}
        <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 text-xs">
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold text-amber-950 block mb-0.5">
                Întrebare pentru micul explorator:
              </span>
              <p className="text-amber-900 font-medium">{scene.questionForKids}</p>

              <div className="mt-2.5 flex items-center justify-between">
                <button
                  id={`kid-answer-btn-${scene.id}`}
                  onClick={handleChildAnswered}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer shadow-xs ${
                    answeredQuestion
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                  }`}
                >
                  {answeredQuestion ? 'Bravo! Răspuns grozav! ⭐' : 'Am răspuns! 🎈'}
                </button>

                <span className="text-[11px] text-stone-500 font-medium">Vârstă 4-7 ani</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions: Download, Coloring, Copy AI Prompt */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <button
              id={`download-scene-${scene.id}`}
              onClick={handleDownloadImage}
              className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-700 hover:text-stone-900 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Descarcă imaginea la rezoluție înaltă"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descarcă</span>
            </button>

            {onOpenColoring && (
              <button
                id={`coloring-scene-${scene.id}`}
                onClick={() => onOpenColoring(scene)}
                className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 transition-colors flex items-center gap-1 cursor-pointer font-medium"
                title="Deschide ca planșă de colorat"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Planșă Colorat</span>
              </button>
            )}
          </div>

          <button
            id={`copy-prompt-btn-${scene.id}`}
            onClick={handleCopyPrompt}
            className="flex items-center gap-1 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer text-[11px] bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-md font-medium"
            title="Copiază descrierea promptului AI pentru consistență"
          >
            {copiedPrompt ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copiat!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Prompt AI</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
