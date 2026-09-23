# 🎈 Sclipici — 10 Aventuri cu Sclipici

**Sclipici** este o aplicație web interactivă creată pentru copii (4–7 ani), construită în jurul unui personaj haios din argilă și lână colorată — un spiriduș cu bucle arămii, pălărie de tweed și un năsuc rotund ca o bobiță roșie. Aplicația oferă 10 aventuri ilustrate, cu detalii artizanale, sunete interactive și povestire audio în limba română.

> Un mic spiriduș haios din argilă și lână colorată, cu bucle arămii, pălărie de tweed și un năsuc rotund ca o bobiță roșie.

![4-7 ani](https://img.shields.io/badge/vârstă-4--7%20ani-orange)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-informational?logo=typescript&logoColor=white)

---

## ✨ Funcționalități

- **10 Aventuri cu Sclipici** — o galerie de episoade ilustrate (ex. *În Poiană*, *Micul Dejun*, *În Văzduh*), fiecare cu propria temă și stare emoțională a personajului.
- **Cartea de Povești** — conținutul aventurilor prezentat ca o carte de povești pentru cei mici.
- **Atelier de Colorat** — activități de colorat pornind de la imaginile personajului.
- **Consistență AI & Prompturi** — set de prompturi și reguli folosite pentru a păstra aspectul personajului identic în toate cele 10 imagini generate.
- **Descărcare pachet complet** — toate cele 10 imagini pot fi descărcate dintr-un singur pachet.
- **Povestire audio** în limba română și sunete interactive pentru fiecare scenă.
- Generare de conținut asistată de **Google Gemini API**.

---

## 🛠️ Stack tehnic

| Categorie | Tehnologie |
|---|---|
| Framework UI | [React 19](https://react.dev/) |
| Build tool | [Vite 8](https://vitejs.dev/) |
| Limbaj | TypeScript |
| Stilizare | [Tailwind CSS 4](https://tailwindcss.com/) |
| AI | [`@google/genai`](https://www.npmjs.com/package/@google/genai) (Gemini API) |
| Server | Express |
| Animații | [Motion](https://motion.dev/) |
| Iconițe | [Lucide React](https://lucide.dev/) |
| Efecte | [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| Package manager | [Bun](https://bun.sh/) (`bun.lock`) |

Proiectul a fost generat cu [Google AI Studio](https://aistudio.google.com/).

---

## 📁 Structura proiectului

```
Sclipici/
├── public/
│   └── images/          # Ilustrațiile celor 10 aventuri
├── src/                 # Codul sursă al aplicației React
├── .env.example         # Șablon de variabile de mediu
├── index.html           # Punctul de intrare HTML
├── metadata.json        # Metadate ale aplicației (AI Studio)
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Instalare și rulare locală

### Cerințe

- [Node.js](https://nodejs.org/) 18+ (sau [Bun](https://bun.sh/))
- O cheie API [Google Gemini](https://aistudio.google.com/app/apikey)

### Pași

1. **Clonează repo-ul**

   ```bash
   git clone https://github.com/msg4u/Sclipici.git
   cd Sclipici
   ```

2. **Instalează dependențele**

   ```bash
   npm install
   # sau
   bun install
   ```

3. **Configurează variabilele de mediu**

   Copiază `.env.example` în `.env.local` și completează valorile:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   GEMINI_API_KEY="cheia_ta_gemini"
   APP_URL="http://localhost:3000"
   ```

4. **Pornește serverul de dezvoltare**

   ```bash
   npm run dev
   ```

   Aplicația va fi disponibilă la `http://localhost:3000`.

### Alte comenzi disponibile

| Comandă | Descriere |
|---|---|
| `npm run dev` | Pornește serverul de dezvoltare (Vite) |
| `npm run build` | Creează build-ul de producție |
| `npm run preview` | Previzualizează build-ul de producție |
| `npm run lint` | Verifică tipurile TypeScript (`tsc --noEmit`) |
| `npm run clean` | Șterge folderul `dist` și `server.js` |

---

## 🔑 Variabile de mediu

| Variabilă | Descriere |
|---|---|
| `GEMINI_API_KEY` | Cheia API pentru apelurile către Gemini AI. În AI Studio este injectată automat din panoul de Secrete. |
| `APP_URL` | URL-ul unde este găzduită aplicația (folosit pentru linkuri interne, callback-uri OAuth, endpoint-uri API). Injectat automat de AI Studio cu URL-ul Cloud Run. |

> ⚠️ Nu comite niciodată fișierul `.env` sau `.env.local` cu chei reale — acestea sunt excluse deja prin `.gitignore`.

---

## 🎨 Despre personaj

**Sclipici** este proiectat pentru a rămâne vizual consistent în toate cele 10 aventuri: aceleași bucle arămii, aceeași pălărie de tweed, același năsuc rotund roșu — indiferent de scenă sau context. Consistența este menținută printr-un set dedicat de prompturi AI, documentate în secțiunea **Consistență AI & Prompturi** din aplicație.

---

## 🤝 Contribuții

Contribuțiile sunt binevenite! Pentru a contribui:

1. Fă un fork al repo-ului
2. Creează un branch pentru funcționalitatea ta (`git checkout -b feature/nume-functionalitate`)
3. Fă commit la modificări (`git commit -m 'Adaugă X'`)
4. Trimite modificările (`git push origin feature/nume-functionalitate`)
5. Deschide un Pull Request

---

## 🙋 Contact

Pentru întrebări sau sugestii, deschide un [issue](https://github.com/msg4u/Sclipici/issues) în acest repository.
