import React, { useState } from 'react';
import { Sparkles, Copy, Check, ShieldCheck, Wand2, RefreshCw } from 'lucide-react';
import { CHARACTER_PROFILE } from '../data/scenes';
import { playCuteSound } from '../utils/audio';

interface ConsistencyStudioProps {
  isMuted: boolean;
}

const PRESET_ADVENTURES = [
  {
    title: "Pe barcă din coajă de nucă",
    action: "navigând pe un pârâu mic într-o barcă făcută dintr-o jumătate de coajă de nucă cu pânză dintr-o frunză galbenă",
    actionEn: "sailing on a tiny crystal brook inside a walnut shell boat with an autumn leaf sail, holding a twig paddle",
  },
  {
    title: "Omul de zăpadă miniatural",
    action: "construind un omuleț de zăpadă minuscul și punându-i o bobiță mică drept nas, râzând cu fulgi de nea prinși în buclele arămii",
    actionEn: "building a tiny miniature snowman and placing a tiny red berry as its nose, giggling with snowflakes on his ginger hair",
  },
  {
    title: "Plăcinta cu mere la bucătărie",
    action: "amestecând cu o lingură mică de lemn într-un bol cu făină, cu puțină făină albă pe năsucul rotund",
    actionEn: "stirring flour in a tiny bowl with a wooden spoon, comically dusting white flour on his round orange-red nose",
  },
  {
    title: "Patinaj pe lacul de gheață",
    action: "alunecând pe gheață lucioasă cu patine mici improvizate din ace de siguranță, făcând echilibristică haioasă",
    actionEn: "ice-skating on smooth pond ice with funny wobbly balance arms, wool scarf fluttering",
  },
];

export const ConsistencyStudio: React.FC<ConsistencyStudioProps> = ({ isMuted }) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESET_ADVENTURES[0]);
  const [customIdea, setCustomIdea] = useState("");
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const activeActionEn = customIdea.trim() ? customIdea.trim() : selectedPreset.actionEn;
  const activeActionRo = customIdea.trim() ? customIdea.trim() : selectedPreset.action;

  const generatedPrompt = `Same handcrafted clay and felt puppet boy character: curly fluffy orange ginger hair, pale doll face, rosy round cheeks, round orange-red ball nose, vintage tweed flat cap, olive green rustic coat with mismatched pastel buttons, striped wool socks and small tan leather boots. He is ${activeActionEn}, funny and cute expression for children 4-7 years old, stop-motion animation claymation puppet style, macro photography, shallow depth of field, warm cozy lighting.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedPrompt(true);
    playCuteSound('click', isMuted);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div id="consistency-studio-section" className="max-w-5xl mx-auto space-y-8">
      {/* Overview Banner */}
      <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-amber-500/5 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-md">
        <div className="flex items-center gap-3 text-amber-900 mb-2">
          <span className="p-2 bg-amber-500 text-white rounded-xl shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold">
            Ghidul Tehnologic: Cum se Menține Consistența Personajului cu AI
          </h2>
        </div>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-3xl mt-2">
          Pentru copiii mici (4-7 ani), este esențial ca personajul să fie imediat recognoscibil de la o planșă la alta. Iată cele 3 principii fundamentale folosite în generarea acestei serii:
        </p>

        {/* 3 Consistency Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-stone-200 shadow-xs">
            <span className="text-2xl block mb-1">🧬</span>
            <h4 className="font-bold text-stone-900 text-sm">1. Ancora Genetică Vizuală</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Trăsăturile cheie (năsucul sferic portocaliu-roșiatic, buclele arămii de lână, șapca de tweed, haina rustică verde) sunt specificate identic în fiecare prompt.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-stone-200 shadow-xs">
            <span className="text-2xl block mb-1">🧶</span>
            <h4 className="font-bold text-stone-900 text-sm">2. Textura & Tehnica</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Stilul de animație stop-motion fizic (lut modelat, postav, fetru, lână) și fotografia macro creează iluzia unei păpuși reale atinse cu drag.
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-stone-200 shadow-xs">
            <span className="text-2xl block mb-1">🖼️</span>
            <h4 className="font-bold text-stone-900 text-sm">3. Ghidaj prin Imagine de Referință</h4>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Fiecare scenă a folosit imaginea inițială drept canal de referință vizuală prin AI, menținând proporțiile anatomice și expresia caldă.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive New Adventure Prompt Builder */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-lg space-y-6">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-amber-600" />
            <h3 className="font-display text-xl font-bold text-stone-900">
              Creează o Nouă Aventură pentru Suflici
            </h3>
          </div>
          <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
            Generator Consistență AI
          </span>
        </div>

        {/* Preset Selector */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-2">
            Alege o idee amuzantă pentru copii:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_ADVENTURES.map((preset) => (
              <button
                key={preset.title}
                onClick={() => {
                  setSelectedPreset(preset);
                  setCustomIdea("");
                  playCuteSound('click', isMuted);
                }}
                className={`p-3 rounded-2xl text-left border transition-all cursor-pointer text-xs ${
                  selectedPreset.title === preset.title && !customIdea
                    ? 'bg-amber-50 border-amber-400 shadow-xs ring-2 ring-amber-300'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                }`}
              >
                <span className="font-bold block text-stone-900 mb-1">
                  {preset.title}
                </span>
                <span className="text-[11px] text-stone-500 line-clamp-2">
                  {preset.action}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Input */}
        <div>
          <label className="text-xs font-bold text-stone-700 block mb-1">
            Sau scrie propria ta idee de ghidușie:
          </label>
          <input
            type="text"
            value={customIdea}
            onChange={(e) => setCustomIdea(e.target.value)}
            placeholder="Ex: 'desenând cu cretă pe asfalt', 'culegând cireșe pe o scară minusculă'..."
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
          />
        </div>

        {/* Result Prompt Box */}
        <div className="bg-stone-900 rounded-2xl p-5 text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Promptul AI Rezultat (Păstrează 100% Consistența)
            </span>
            <button
              id="copy-generated-prompt-btn"
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              {copiedPrompt ? (
                <>
                  <Check className="w-3.5 h-3.5 text-stone-950" />
                  <span>Copiat în Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiază Promptul</span>
                </>
              )}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 font-mono leading-relaxed bg-black/40 p-3.5 rounded-xl border border-stone-800 break-words">
            {generatedPrompt}
          </p>

          <p className="text-[11px] text-stone-400 italic">
            💡 Sfat: Folosește acest prompt în orice model de generare de imagini pentru a păstra exact aceeași păpușă, hainuță, expresie și stil cald de poveste!
          </p>
        </div>

        {/* Dedicated Coloring Page Conversion Prompt Card */}
        <div className="bg-amber-500/10 border border-amber-300/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Prompt Standard pentru Conversia în Planșe Profesionale de Colorat (4–7 ani)
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`Convert the images into a professional children's coloring-book page for ages 4–7.

Preserve the main subject, recognizable features, pose and overall composition, but simplify everything into clean, friendly line art.

Use:
- bold, smooth black outlines
- consistent line thickness
- rounded child-friendly shapes
- large areas for coloring
- simple recognizable details
- closed, clearly defined shapes
- clean white background

Remove:
- all colors
- gradients
- shadows
- shading
- photographic textures
- realistic details
- tiny unnecessary elements
- visual clutter

Simplify the background into only a few large, easy-to-color elements.

The final image must be pure black-and-white line art, high contrast, printable, uncluttered and suitable for children aged 4–7. No gray, no color, no text, no watermark, no sketchy or broken lines.

Make it look like a professionally illustrated coloring-book page, NOT like a photograph converted into grayscale.`);
                setCopiedPrompt(true);
                playCuteSound('click', isMuted);
                setTimeout(() => setCopiedPrompt(false), 2000);
              }}
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-xs"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiază Prompt Planșe</span>
            </button>
          </div>
          <p className="text-xs text-stone-700 font-mono leading-relaxed bg-white/80 p-3.5 rounded-xl border border-stone-200">
            Convert the images into a professional children's coloring-book page for ages 4–7.<br/>
            Preserve the main subject, recognizable features, pose and overall composition, but simplify everything into clean, friendly line art.<br/>
            <strong>Use:</strong> bold, smooth black outlines, consistent line thickness, rounded child-friendly shapes, large areas for coloring, simple recognizable details, closed clearly defined shapes, clean white background.<br/>
            <strong>Remove:</strong> all colors, gradients, shadows, shading, photographic textures, realistic details, tiny unnecessary elements, visual clutter.<br/>
            Simplify the background into only a few large, easy-to-color elements. Pure black-and-white line art, high contrast, printable, uncluttered.
          </p>
        </div>
      </div>
    </div>
  );
};
