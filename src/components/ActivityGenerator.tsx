import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Printer, Download, Paintbrush, Undo2, Check, PaintBucket, Eraser, Sparkles, Image as ImageIcon, Eye, FileDown } from 'lucide-react';
import { Scene } from '../types';
import { SCENES } from '../data/scenes';
import { playCuteSound } from '../utils/audio';

interface ActivityGeneratorProps {
  selectedScene: Scene;
  isMuted: boolean;
  onSelectScene?: (scene: Scene) => void;
  onClose?: () => void;
}

const PALETTE = [
  { name: 'Năsuc Portocaliu', color: '#ea580c' },
  { name: 'Păr Arămiu', color: '#c2410c' },
  { name: 'Haină Salvie', color: '#16a34a' },
  { name: 'Verde Crud', color: '#65a30d' },
  { name: 'Cizmulițe Galbene', color: '#eab308' },
  { name: 'Cer Senin', color: '#38bdf8' },
  { name: 'Roz Îmbujorat', color: '#fb7185' },
  { name: 'Roșu Căpșună', color: '#dc2626' },
  { name: 'Albastru Regal', color: '#2563eb' },
  { name: 'Violet Clopoțel', color: '#9333ea' },
  { name: 'Maro Buștean', color: '#78350f' },
  { name: 'Alb Curat', color: '#ffffff' },
];

export const ActivityGenerator: React.FC<ActivityGeneratorProps> = ({
  selectedScene: initialSelectedScene,
  isMuted,
  onSelectScene,
}) => {
  const [activeScene, setActiveScene] = useState<Scene>(initialSelectedScene);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cleanLineArtCanvasRef = useRef<HTMLCanvasElement | null>(null);
  
  const [toolMode, setToolMode] = useState<'bucket' | 'brush' | 'eraser'>('bucket');
  const [selectedColor, setSelectedColor] = useState(PALETTE[0].color);
  const [brushSize, setBrushSize] = useState(18);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showColorReference, setShowColorReference] = useState<boolean>(true);

  // Sync when prop changes
  useEffect(() => {
    setActiveScene(initialSelectedScene);
  }, [initialSelectedScene]);

  // Load and render pure black & white coloring line art on canvas
  const renderColoringPage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    setIsLoading(true);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = activeScene.coloringImageSrc || `/images/colorat_${activeScene.id}.jpg`;

    img.onload = () => {
      const w = 600;
      const h = 800;
      canvas.width = w;
      canvas.height = h;

      // Draw coloring book image
      ctx.drawImage(img, 0, 0, w, h);

      // Threshold image data to ensure 100% crisp pure black outlines (#000000) on pure white (#FFFFFF)
      // Removes any compression gray or subtle texture
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 4) {
        // Luminance calculation
        const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;

        if (lum > 185) {
          // Pure white paper
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
        } else if (lum < 135) {
          // Pure bold black ink outline
          data[i] = 0;
          data[i + 1] = 0;
          data[i + 2] = 0;
        }
        data[i + 3] = 255;
      }

      ctx.putImageData(imgData, 0, 0);

      // Draw clean coloring book border
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, w - 16, h - 16);

      // Clean footer caption for coloring sheet
      ctx.fillStyle = '#1c1917';
      ctx.font = 'bold 18px "Baloo 2", Nunito, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Sclipici • Episodul ${activeScene.id}: ${activeScene.titleRo}`, w / 2, h - 30);

      ctx.fillStyle = '#78716c';
      ctx.font = '500 11px "Baloo 2", Nunito, sans-serif';
      ctx.fillText('@2026 by Suflețel Concept • Planșă de colorat pentru copii (4-7 ani)', w / 2, h - 14);

      // Keep clean line art backup in memory for flood fill and reset
      const cleanCanvas = document.createElement('canvas');
      cleanCanvas.width = w;
      cleanCanvas.height = h;
      const cleanCtx = cleanCanvas.getContext('2d');
      if (cleanCtx) {
        cleanCtx.drawImage(canvas, 0, 0);
        cleanLineArtCanvasRef.current = cleanCanvas;
      }

      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };
  }, [activeScene]);

  useEffect(() => {
    renderColoringPage();
  }, [renderColoringPage]);

  // Flood fill algorithm for instant coloring inside outlines
  const handleFloodFill = (startX: number, startY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    const startIndex = (startY * w + startX) * 4;
    const startR = data[startIndex];
    const startG = data[startIndex + 1];
    const startB = data[startIndex + 2];

    // Convert selected hex color to RGB
    const fillR = parseInt(selectedColor.slice(1, 3), 16);
    const fillG = parseInt(selectedColor.slice(3, 5), 16);
    const fillB = parseInt(selectedColor.slice(5, 7), 16);

    // If clicking on dark outline or same color, skip
    const isDarkBoundary = (r: number, g: number, b: number) => {
      return (r * 0.299 + g * 0.587 + b * 0.114) < 90;
    };

    if (isDarkBoundary(startR, startG, startB)) return;
    if (Math.abs(startR - fillR) < 10 && Math.abs(startG - fillG) < 10 && Math.abs(startB - fillB) < 10) return;

    // Queue-based flood fill with 32-bit fast pixel packing
    const pixelStack: [number, number][] = [[startX, startY]];
    const seen = new Uint8Array(w * h);

    const matchStart = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      if (isDarkBoundary(r, g, b)) return false;
      return Math.abs(r - startR) < 40 && Math.abs(g - startG) < 40 && Math.abs(b - startB) < 40;
    };

    while (pixelStack.length > 0) {
      const [curX, curY] = pixelStack.pop()!;
      let y1 = curY;
      while (y1 >= 0 && matchStart((y1 * w + curX) * 4)) {
        y1--;
      }
      y1++;

      let spanLeft = false;
      let spanRight = false;

      while (y1 < h && matchStart((y1 * w + curX) * 4)) {
        const idx = (y1 * w + curX) * 4;
        const pIdx = y1 * w + curX;
        seen[pIdx] = 1;

        data[idx] = fillR;
        data[idx + 1] = fillG;
        data[idx + 2] = fillB;
        data[idx + 3] = 255;

        if (!spanLeft && curX > 0) {
          if (matchStart((y1 * w + (curX - 1)) * 4) && !seen[y1 * w + (curX - 1)]) {
            pixelStack.push([curX - 1, y1]);
            spanLeft = true;
          }
        } else if (spanLeft && curX > 0 && !matchStart((y1 * w + (curX - 1)) * 4)) {
          spanLeft = false;
        }

        if (!spanRight && curX < w - 1) {
          if (matchStart((y1 * w + (curX + 1)) * 4) && !seen[y1 * w + (curX + 1)]) {
            pixelStack.push([curX + 1, y1]);
            spanRight = true;
          }
        } else if (spanRight && curX < w - 1 && !matchStart((y1 * w + (curX + 1)) * 4)) {
          spanRight = false;
        }

        y1++;
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // Overlay clean black lines to keep vector outlines 100% crisp
    if (cleanLineArtCanvasRef.current) {
      ctx.globalCompositeOperation = 'multiply';
      ctx.drawImage(cleanLineArtCanvasRef.current, 0, 0);
      ctx.globalCompositeOperation = 'source-over';
    }

    playCuteSound('click', isMuted);
  };

  // Drawing event handlers
  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.floor((clientX - rect.left) * scaleX),
      y: Math.floor((clientY - rect.top) * scaleY),
    };
  };

  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const { x, y } = getCoordinates(e);

    if (toolMode === 'bucket') {
      handleFloodFill(x, y);
      return;
    }

    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || toolMode === 'bucket') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCoordinates(e);

    if (toolMode === 'eraser') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = brushSize * 1.5;
    } else {
      // Multiply keeps pure black outlines sharp
      ctx.globalCompositeOperation = 'multiply';
      ctx.strokeStyle = selectedColor;
      ctx.lineWidth = brushSize;
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    ctx.globalCompositeOperation = 'source-over';
  };

  const handlePointerUp = () => {
    if (isDrawing && cleanLineArtCanvasRef.current && toolMode !== 'bucket') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.beginPath();
          // Re-multiply crisp black lines
          ctx.globalCompositeOperation = 'multiply';
          ctx.drawImage(cleanLineArtCanvasRef.current, 0, 0);
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    }
    setIsDrawing(false);
  };

  const handleResetCanvas = () => {
    playCuteSound('click', isMuted);
    renderColoringPage();
  };

  const handlePrint = () => {
    playCuteSound('click', isMuted);
    window.print();
  };

  // Download clean uncolored line art sheet (pure B&W A4 format)
  const handleDownloadCleanSheet = () => {
    playCuteSound('click', isMuted);
    if (!cleanLineArtCanvasRef.current) return;
    const link = document.createElement('a');
    link.href = cleanLineArtCanvasRef.current.toDataURL('image/png');
    link.download = `Plansa_Colorat_Curata_Sclipici_Ep${activeScene.id}.png`;
    link.click();
  };

  // Download colored masterpiece
  const handleDownloadColoredArtwork = () => {
    playCuteSound('click', isMuted);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `Desenul_Meu_Colorat_Sclipici_Ep${activeScene.id}.png`;
    link.click();
  };

  const handleSelectSceneInternal = (scene: Scene) => {
    playCuteSound('click', isMuted);
    setActiveScene(scene);
    if (onSelectScene) {
      onSelectScene(scene);
    }
  };

  return (
    <div id="activity-coloring-section" className="space-y-6">
      {/* 10 Coloring Pages Quick Selector Gallery */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="font-display text-base font-bold text-stone-900">
              Alege una din cele 10 Planșe de Colorat cu Sclipici:
            </h3>
          </div>
          <span className="text-xs text-stone-400 font-medium hidden sm:inline">
            Fiecare planșă cu contururi clare, fără culori sau umbre
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleSelectSceneInternal(scene)}
              className={`group flex flex-col items-center p-2 rounded-2xl border transition-all text-center cursor-pointer ${
                activeScene.id === scene.id
                  ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-400/40 shadow-xs'
                  : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 hover:border-stone-300'
              }`}
            >
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-white border border-stone-200 mb-1.5 shadow-2xs">
                <img
                  src={scene.coloringImageSrc || `/images/colorat_${scene.id}.jpg`}
                  alt={scene.titleRo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <span className={`text-[11px] font-bold line-clamp-1 ${activeScene.id === scene.id ? 'text-amber-900' : 'text-stone-700'}`}>
                Ep. {scene.id}
              </span>
              <span className="text-[10px] text-stone-400 line-clamp-1">
                {scene.titleRo.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Coloring Workshop Workspace */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-lg max-w-5xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                <Paintbrush className="w-5 h-5" />
              </span>
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-900">
                  Planșa de Colorat: {activeScene.titleRo}
                </h2>
                <p className="text-xs text-stone-500">
                  Episodul {activeScene.id} • Linii îngroșate de contur, spații largi pentru colorat, fundal alb curat
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="print-sheet-btn"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
              title="Tipărește direct pe hârtie A4"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimă Fișa (A4)</span>
            </button>

            <button
              id="download-clean-btn"
              onClick={handleDownloadCleanSheet}
              className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer border border-stone-200 shadow-xs"
              title="Descarcă schița curată necolorată"
            >
              <FileDown className="w-3.5 h-3.5 text-stone-600" />
              <span>Descarcă Schița</span>
            </button>

            <button
              id="download-sheet-btn"
              onClick={handleDownloadColoredArtwork}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
              title="Salvează desenul pe care l-ai colorat"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Salvează Desenul</span>
            </button>
          </div>
        </div>

        {/* Workspace: Canvas + Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Canvas Stage */}
          <div className="lg:col-span-2 flex flex-col items-center">
            {/* Tool Selection Bar */}
            <div className="w-full max-w-[480px] bg-stone-100 p-1.5 rounded-2xl flex items-center justify-between mb-3 border border-stone-200 shadow-inner">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setToolMode('bucket');
                    playCuteSound('click', isMuted);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    toolMode === 'bucket'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Apasă pe o zonă pentru a o umple cu culoare instantaneu"
                >
                  <PaintBucket className="w-3.5 h-3.5" />
                  <span>Umplere Magică</span>
                </button>

                <button
                  onClick={() => {
                    setToolMode('brush');
                    playCuteSound('click', isMuted);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    toolMode === 'brush'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Colorează manual cu pensula / creionul"
                >
                  <Paintbrush className="w-3.5 h-3.5" />
                  <span>Crayon / Pensulă</span>
                </button>

                <button
                  onClick={() => {
                    setToolMode('eraser');
                    playCuteSound('click', isMuted);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    toolMode === 'eraser'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-stone-700 hover:bg-stone-200'
                  }`}
                  title="Șterge culorile aplicate"
                >
                  <Eraser className="w-3.5 h-3.5" />
                  <span>Radieră</span>
                </button>
              </div>

              <button
                onClick={handleResetCanvas}
                className="text-xs text-rose-600 hover:text-rose-800 font-bold flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                title="Curăță toate culorile și reia schița albă"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Reia de la zero</span>
              </button>
            </div>

            {/* Interactive Canvas */}
            <div className="relative w-full max-w-[480px] bg-white rounded-2xl overflow-hidden shadow-md border-2 border-stone-300 touch-none">
              {isLoading && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="text-center space-y-2">
                    <div className="w-8 h-8 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <span className="text-xs font-bold text-stone-800 block">
                      Se încarcă planșa curată de colorat...
                    </span>
                  </div>
                </div>
              )}
              <canvas
                ref={canvasRef}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                className={`w-full h-auto bg-white ${
                  toolMode === 'bucket' ? 'cursor-pointer' : 'cursor-crosshair'
                }`}
              />
            </div>

            <div className="flex items-center justify-between w-full max-w-[480px] mt-2.5 text-[11px] text-stone-500 px-1">
              <span>
                {toolMode === 'bucket'
                  ? '💡 Sfat: Atinge orice zonă albă pentru a o colora dintr-o mișcare!'
                  : '💡 Sfat: Trasează liber cu mouse-ul sau degetul! Liniile negre rămân intacte.'}
              </span>
            </div>
          </div>

          {/* Right Column: Colors & Tools */}
          <div className="space-y-4 bg-stone-50/90 rounded-2xl p-5 border border-stone-200/80">
            {/* Color Reference Card (Shows the original colorful scene) */}
            <div className="bg-white rounded-xl p-3 border border-stone-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
                  Ghid vizual de culori (Scena originală)
                </span>
                <button
                  onClick={() => setShowColorReference(!showColorReference)}
                  className="text-[11px] text-amber-700 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Eye className="w-3 h-3" />
                  {showColorReference ? 'Ascunde' : 'Arată'}
                </button>
              </div>

              {showColorReference && (
                <div className="flex items-center gap-3 pt-1">
                  <img
                    src={activeScene.imageSrc}
                    alt={activeScene.titleRo}
                    className="w-16 h-20 object-cover rounded-lg border border-stone-200 shadow-xs"
                  />
                  <div className="text-[11px] text-stone-600 space-y-1">
                    <p className="font-bold text-stone-800">{activeScene.titleRo}</p>
                    <p className="text-stone-500 italic leading-snug">
                      Năsuc portocaliu rotund, bucle arămii moi, hăinuță verde și cizmulițe vesele.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Color Palette for Kids */}
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
              <label className="text-xs font-bold text-stone-800 block">
                Paletă de Culori pentru Sclipici:
              </label>
              <div className="grid grid-cols-6 gap-2">
                {PALETTE.map((item) => (
                  <button
                    key={item.color}
                    onClick={() => {
                      setSelectedColor(item.color);
                      if (toolMode === 'eraser') setToolMode('bucket');
                      playCuteSound('click', isMuted);
                    }}
                    className={`w-full aspect-square rounded-xl transition-all active:scale-90 flex items-center justify-center border border-stone-300 shadow-2xs cursor-pointer ${
                      selectedColor === item.color && toolMode !== 'eraser'
                        ? 'ring-3 ring-amber-400 scale-110 shadow-xs'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: item.color }}
                    title={item.name}
                  >
                    {selectedColor === item.color && toolMode !== 'eraser' && (
                      <Check
                        className={`w-3.5 h-3.5 ${
                          item.color === '#ffffff' || item.color === '#eab308' || item.color === '#65a30d'
                            ? 'text-stone-900'
                            : 'text-white'
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-stone-600 font-medium">
                Culoare activă:{' '}
                <strong className="text-stone-900">
                  {PALETTE.find((p) => p.color === selectedColor)?.name}
                </strong>
              </p>
            </div>

            {/* Brush Size Slider (Visible if in brush or eraser mode) */}
            {toolMode !== 'bucket' && (
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                  <span>Grosime Crayon / Pensulă:</span>
                  <span className="text-amber-600 font-bold">{brushSize}px</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="36"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            )}

            {/* Pedagogical Note */}
            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs text-amber-950 leading-relaxed shadow-2xs">
              <span className="font-bold block mb-1">🖍️ Recomandat pentru vârstele 4–7 ani:</span>
              Toate cele 10 planșe sunt create special cu contururi netede și spații închise mari, fără umbre sau tonuri de gri, fiind ideale atât pentru colorat digital pe tabletă, cât și pentru tipărire clasică pe hârtie A4.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
