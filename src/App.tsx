/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Sparkles,
  Film,
  BookOpen,
  Paintbrush,
  ShieldCheck,
  Volume2,
  VolumeX,
  Heart,
  Grid,
  Download,
  Share2,
  Play
} from 'lucide-react';
import { SCENES, CHARACTER_PROFILE } from './data/scenes';
import { Scene, ViewMode } from './types';
import { AnimatedSceneCard } from './components/AnimatedSceneCard';
import { CinemaPlayer } from './components/CinemaPlayer';
import { StoryBookView } from './components/StoryBookView';
import { ActivityGenerator } from './components/ActivityGenerator';
import { ConsistencyStudio } from './components/ConsistencyStudio';
import { playCuteSound, stopSpeaking } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewMode>('showcase');
  const [isMuted, setIsMuted] = useState(false);
  const [cinemaSceneIndex, setCinemaSceneIndex] = useState<number | null>(null);
  const [selectedForColoring, setSelectedForColoring] = useState<Scene>(SCENES[0]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const handleTabChange = (tab: ViewMode) => {
    stopSpeaking();
    playCuteSound('click', isMuted);
    setActiveTab(tab);
  };

  const handleOpenCinema = (sceneId: number) => {
    const idx = SCENES.findIndex((s) => s.id === sceneId);
    setCinemaSceneIndex(idx >= 0 ? idx : 0);
  };

  const handleOpenColoring = (scene: Scene) => {
    setSelectedForColoring(scene);
    setActiveTab('coloring');
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (!nextMuted) {
      playCuteSound('peekaboo', false);
    }
  };

  // Download all 10 images package
  const handleDownloadAll = () => {
    playCuteSound('fanfare', isMuted);
    SCENES.forEach((scene, index) => {
      setTimeout(() => {
        const link = document.createElement('a');
        link.href = scene.imageSrc;
        link.download = `Suflici_${scene.id}_${scene.titleEn.replace(/\s+/g, '_')}.jpg`;
        link.click();
      }, index * 250);
    });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col selection:bg-amber-200">
      {/* Top Friendly Notification Banner */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Character Title */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-display font-bold text-xl">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold text-stone-900 leading-none">
                  Suflici
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  10 Aventuri cu Suflici
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-900">
                  Vârstă 4-7 Ani
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block mt-0.5">
                Personajul haios & drăgălaș din argilă și fetru, cu consistență AI
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="top-cinema-btn"
              onClick={() => handleOpenCinema(1)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <Film className="w-4 h-4" />
              <span>Cinema Copii</span>
            </button>

            <button
              id="global-mute-toggle"
              onClick={handleToggleMute}
              className={`p-2 rounded-xl transition-colors cursor-pointer border ${
                isMuted
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-stone-100 hover:bg-stone-200 border-stone-200 text-stone-700'
              }`}
              title={isMuted ? 'Activează sunetele haioase' : 'Dezactivează sunetul'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-100 flex items-center justify-between overflow-x-auto py-2">
          <nav className="flex space-x-1 sm:space-x-2">
            {[
              { id: 'showcase', label: '10 Aventuri cu Suflici', icon: Grid, count: '10' },
              { id: 'book', label: 'Cartea de Povești', icon: BookOpen },
              { id: 'coloring', label: 'Atelier de Colorat', icon: Paintbrush },
              { id: 'studio', label: 'Consistență AI & Promturi', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => handleTabChange(tab.id as ViewMode)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-100/80 text-amber-900 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {tab.count && (
                    <span className="bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded-md text-[10px]">
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <button
            id="download-all-btn"
            onClick={handleDownloadAll}
            className="hidden lg:flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 transition-colors font-semibold cursor-pointer px-2.5 py-1 rounded-lg hover:bg-stone-100"
            title="Descarcă toate cele 10 planșe la rezoluție maximă"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descarcă Pachetul (10 Imagini)</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* VIEW 1: Showcase Grid of 10 Animated Scenes */}
        {activeTab === 'showcase' && (
          <div className="space-y-6">
            {/* Whimsical Character Presentation Header */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs">
              <div className="space-y-2 text-center sm:text-left max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Creat special pentru cei mici (4-7 ani)</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-stone-900">
                  Faceți cunoștință cu Suflici! 🎈
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Un mic spiriduș haios din argilă și lână colorată, cu bucle arămii, pălărie de tweed și un năsuc rotund ca o bobiță roșie. 
                  Fiecare imagine oferă detalii artizanale deosebite, sunete interactive și povestire audio în limba română!
                </p>
              </div>
            </div>

            {/* Grid of the 10 Animated Scenes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {SCENES.map((scene) => (
                <AnimatedSceneCard
                  key={scene.id}
                  scene={scene}
                  isMuted={isMuted}
                  onOpenCinema={handleOpenCinema}
                  onOpenColoring={handleOpenColoring}
                />
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: StoryBook Reader */}
        {activeTab === 'book' && (
          <StoryBookView
            scenes={SCENES}
            isMuted={isMuted}
            onOpenColoring={handleOpenColoring}
          />
        )}

        {/* VIEW 3: Coloring and Activity Studio */}
        {activeTab === 'coloring' && (
          <div className="space-y-6">
            <ActivityGenerator
              selectedScene={selectedForColoring}
              isMuted={isMuted}
              onSelectScene={(s) => setSelectedForColoring(s)}
            />
          </div>
        )}

        {/* VIEW 4: Consistency Studio & Prompts */}
        {activeTab === 'studio' && <ConsistencyStudio isMuted={isMuted} />}
      </main>

      {/* Cinema / Theater Modal */}
      {cinemaSceneIndex !== null && (
        <CinemaPlayer
          scenes={SCENES}
          initialSceneIndex={cinemaSceneIndex}
          isMuted={isMuted}
          onClose={() => setCinemaSceneIndex(null)}
        />
      )}

      {/* Kid-Friendly Footer with Requested Signature */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-display font-bold text-stone-800 text-sm">Suflici</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-stone-600 font-medium">
              @2026 by Suflețel Concept creat cu ❤️ pentru copii și părinți deopotrivă
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenCinema(1)}
              className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
            >
              Lansează Cinema Copii
            </button>
            <span>•</span>
            <button
              onClick={handleDownloadAll}
              className="text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
            >
              Descarcă toate cele 10 imagini
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
