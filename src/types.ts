export interface Scene {
  id: number;
  titleRo: string;
  titleEn: string;
  subtitleRo: string;
  storyRo: string;
  questionForKids: string;
  imageSrc: string;
  coloringImageSrc: string;
  soundType: 'butterfly' | 'crunch' | 'balloon' | 'peekaboo' | 'turtle' | 'splash' | 'chirp' | 'bubbles' | 'tower' | 'lullaby';
  animationMood: 'flutter' | 'munch' | 'float' | 'peek' | 'crawl' | 'splash' | 'story' | 'sparkle' | 'balance' | 'sleep';
  characterEmotion: string;
  educationalTip: string;
  badge: string;
  promptDescription: string;
}

export type ViewMode = 'showcase' | 'story' | 'cinema' | 'book' | 'coloring' | 'studio';

export type NarrationState = 'idle' | 'playing' | 'paused';
