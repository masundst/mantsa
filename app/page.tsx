"use client";

import { useEffect, useMemo, useState } from "react";

type City = { name: string; lat: number; lon: number; x: number; y: number };

const cities: City[] = [
  ["Helsinki", 60.17, 24.94, 70, 84], ["Espoo", 60.21, 24.66, 66, 82], ["Tampere", 61.50, 23.76, 51, 57],
  ["Vantaa", 60.29, 25.04, 72, 80], ["Oulu", 65.01, 25.47, 59, 17], ["Turku", 60.45, 22.27, 39, 80],
  ["Jyväskylä", 62.24, 25.75, 57, 46], ["Lahti", 60.98, 25.66, 67, 68], ["Kuopio", 62.89, 27.68, 72, 39],
  ["Pori", 61.49, 21.80, 27, 60], ["Kouvola", 60.87, 26.70, 78, 70], ["Joensuu", 62.60, 29.76, 85, 43],
  ["Lappeenranta", 61.06, 28.19, 87, 68], ["Hämeenlinna", 61.00, 24.46, 57, 68], ["Vaasa", 63.10, 21.62, 28, 40],
  ["Seinäjoki", 62.79, 22.84, 37, 43], ["Rovaniemi", 66.50, 25.73, 67, 5], ["Mikkeli", 61.69, 27.27, 77, 57],
  ["Kotka", 60.47, 26.95, 83, 77], ["Salo", 60.38, 23.13, 46, 81], ["Porvoo", 60.39, 25.66, 77, 81],
  ["Kokkola", 63.84, 23.13, 43, 31], ["Hyvinkää", 60.63, 24.86, 66, 75], ["Lohja", 60.25, 24.07, 57, 85],
  ["Nurmijärvi", 60.47, 24.81, 66, 82], ["Järvenpää", 60.47, 25.09, 72, 82], ["Rauma", 61.13, 21.50, 24, 66],
  ["Kirkkonummi", 60.12, 24.44, 60, 88], ["Tuusula", 60.40, 25.03, 71, 83], ["Kajaani", 64.23, 27.73, 73, 25],
  ["Sodankylä", 67.42, 26.59, 69, 0], ["Ivalo", 68.66, 27.54, 76, 0], ["Kittilä", 67.65, 24.90, 56, 0],
  ["Maarianhamina", 60.10, 19.93, 7, 95],
].map(([name, lat, lon, x, y]) => ({ name: name as string, lat: lat as number, lon: lon as number, x: x as number, y: y as number }));

const cityInfo: Record<string, { population: string; rank: number }> = {
  Helsinki: { population: "684,000", rank: 1 }, Espoo: { population: "320,000", rank: 2 }, Tampere: { population: "260,000", rank: 3 },
  Vantaa: { population: "250,000", rank: 4 }, Oulu: { population: "215,000", rank: 5 }, Turku: { population: "210,000", rank: 6 },
  Jyväskylä: { population: "145,000", rank: 7 }, Kuopio: { population: "125,000", rank: 8 }, Lahti: { population: "121,000", rank: 9 },
  Pori: { population: "84,000", rank: 10 }, Kouvola: { population: "80,000", rank: 11 }, Joensuu: { population: "78,000", rank: 12 },
  Lappeenranta: { population: "73,000", rank: 13 }, Hämeenlinna: { population: "69,000", rank: 14 }, Vaasa: { population: "68,000", rank: 15 },
  Seinäjoki: { population: "66,000", rank: 16 }, Rovaniemi: { population: "65,000", rank: 17 }, Mikkeli: { population: "52,000", rank: 18 },
  Kotka: { population: "50,000", rank: 19 }, Salo: { population: "51,000", rank: 20 }, Porvoo: { population: "51,000", rank: 21 },
  Kokkola: { population: "48,000", rank: 22 }, Kajaani: { population: "36,000", rank: 30 }, Sodankylä: { population: "8,000", rank: 115 },
  Ivalo: { population: "4,000", rank: 190 }, Kittilä: { population: "6,500", rank: 140 },
  Maarianhamina: { population: "11,700", rank: 55 },
};

const maakunnat: Record<string, string> = {
  Helsinki: "Uusimaa", Espoo: "Uusimaa", Vantaa: "Uusimaa", Porvoo: "Uusimaa", Hyvinkää: "Uusimaa", Lohja: "Uusimaa", Nurmijärvi: "Uusimaa", Järvenpää: "Uusimaa", Kirkkonummi: "Uusimaa", Tuusula: "Uusimaa",
  Tampere: "Pirkanmaa", Hämeenlinna: "Kanta-Häme", Lahti: "Päijät-Häme", Turku: "Varsinais-Suomi", Salo: "Varsinais-Suomi", Pori: "Satakunta", Rauma: "Satakunta",
  Oulu: "Pohjois-Pohjanmaa", Rovaniemi: "Lappi", Sodankylä: "Lappi", Ivalo: "Lappi", Kittilä: "Lappi", Kokkola: "Keski-Pohjanmaa", Vaasa: "Pohjanmaa", Seinäjoki: "Etelä-Pohjanmaa",
  Jyväskylä: "Keski-Suomi", Kuopio: "Pohjois-Savo", Joensuu: "Pohjois-Karjala", Kajaani: "Kainuu", Mikkeli: "Etelä-Savo", Lappeenranta: "Etelä-Karjala", Kouvola: "Kymenlaakso", Kotka: "Kymenlaakso", Maarianhamina: "Ahvenanmaa",
};

const maakuntaCapitals = new Set(["Helsinki", "Tampere", "Hämeenlinna", "Lahti", "Turku", "Pori", "Oulu", "Rovaniemi", "Joensuu", "Vaasa", "Seinäjoki", "Jyväskylä", "Kuopio", "Mikkeli", "Lappeenranta", "Kouvola", "Kajaani", "Kokkola", "Maarianhamina"]);

// The SVG boundary is projected with these same geographic bounds.
const MAP_BOUNDS = { west: 19, east: 32.5, north: 70.5, south: 59.5 };

function distanceKm(aLat: number, aLon: number, bLat: number, bLon: number) {
  const r = 6371;
  const p = Math.PI / 180;
  const dLat = (bLat - aLat) * p; const dLon = (bLon - aLon) * p;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * p) * Math.cos(bLat * p) * Math.sin(dLon / 2) ** 2;
  return Math.round(r * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h)));
}

export default function Home() {
  // Keep the first render identical on the server and client; later rounds are random.
  const [target, setTarget] = useState<City>(cities[0]);
  const [guess, setGuess] = useState<{ x: number; y: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  const [bestAverage, setBestAverage] = useState<number | null>(null);
  const [lastDistance, setLastDistance] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("");
  const [celebration, setCelebration] = useState<"" | "great" | "super" | "bullseye">("");
  const [previousRound, setPreviousRound] = useState<{ guess: { x: number; y: number }; city: City } | null>(null);
  const [showCities, setShowCities] = useState(false);

  useEffect(() => { const saved = localStorage.getItem("suomi-best-average"); if (saved) setBestAverage(Number(saved)); }, []);
  useEffect(() => {
    if (distance === null) return;
    const timer = window.setTimeout(nextRound, 1700);
    return () => window.clearTimeout(timer);
  }, [distance]);
  const average = useMemo(() => history.length ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : 0, [history]);

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    if (distance !== null) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const guessedLat = MAP_BOUNDS.north - (y / 100) * (MAP_BOUNDS.north - MAP_BOUNDS.south);
    const guessedLon = MAP_BOUNDS.west + (x / 100) * (MAP_BOUNDS.east - MAP_BOUNDS.west);
    const km = distanceKm(guessedLat, guessedLon, target.lat, target.lon);
    setGuess({ x, y }); setDistance(km);
    setLastDistance(km);
    const comments = km <= 5 ? ["🎆 Bullseye! The map is impressed.", "🎯 That’s suspiciously accurate!", "🚀 Basically standing on the city hall.", "✨ You could almost wave to the mayor."] : km < 10 ? ["That was fantastic!", "The cartographers are applauding.", "You’ve got Finland in your pocket!"] : km < 25 ? ["Very close!", "The compass is jealous.", "Excellent spotting!", "You nearly parked on the town square."] : km < 100 ? ["Nice work!", "You know your Finland!", "That was a respectable detour.", "Warm enough for a Finnish summer."] : km < 300 ? ["Not bad!", "Getting warmer.", "A solid guess.", "The reindeer would approve.", "You found the right general vibe."] : km < 600 ? ["A little way off.", "Keep exploring!", "You’re in the right region… sort of.", "The map says: try again, friend.", "That guess took the scenic route."] : ["Nowhere near!", "That was a long way off.", "Time to study the map!", "Did you ask a seagull for directions?", "Finland is big, but not that big.", "The compass has filed a complaint."];
    setFeedback(comments[Math.floor(Math.random() * comments.length)]);
    setCelebration(km <= 5 ? "bullseye" : km < 10 ? "super" : km < 25 ? "great" : "");
    const next = [...history, km].slice(-10); setHistory(next);
    const nextAverage = Math.round(next.reduce((total, value) => total + value, 0) / next.length);
    if (bestAverage === null || nextAverage < bestAverage) { setBestAverage(nextAverage); localStorage.setItem("suomi-best-average", String(nextAverage)); }
  }

  function nextRound() {
    if (guess && distance !== null) setPreviousRound({ guess, city: target });
    setTarget(cities[Math.floor(Math.random() * cities.length)]); setGuess(null); setDistance(null); setFeedback(""); setCelebration("");
  }

  const targetX = ((target.lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100;
  const targetY = ((MAP_BOUNDS.north - target.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100;
  const targetInfo = cityInfo[target.name] ?? { population: "—", rank: cities.findIndex((city) => city.name === target.name) + 1 };
  const targetMaakunta = maakunnat[target.name] ?? "Maakunta —";
  const commentLeft = targetX > 58 ? Math.max(4, targetX - 34) : Math.min(62, targetX + 7);
  const commentTop = targetY > 58 ? Math.max(7, targetY - 22) : Math.min(72, targetY + 8);

  return <main className="app-shell">
    <section className="game-card">
      <div className="map-tools"><span>FINLAND</span><button onClick={() => setShowCities((value) => !value)} aria-pressed={showCities}>{showCities ? "Hide cities" : "Show all cities"}</button></div>
      <div className="target-badge"><span>FIND</span><strong>{target.name}</strong>{maakuntaCapitals.has(target.name) && <small className="maakunta-name">maakuntakeskus</small>}<small className="region-name">{targetMaakunta}</small><small>Pop. {targetInfo.population} · #{targetInfo.rank} in Finland</small></div>
      <div className="map-wrap"><div className={`map ${celebration}`} onClick={handleMapClick} role="button" tabIndex={0} aria-label={`Map of Finland. Find ${target.name}`}>
        <svg className="finland-map" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path className="finland-fill" d="M73.73 13.39 L69.71 14.56 L72.60 15.13 L69.98 17.91 L71.58 20.87 L76.52 22.07 L81.55 25.58 L74.46 32.66 L80.74 39.93 L82.31 43.53 L79.28 44.28 L80.29 44.86 L78.37 47.86 L80.37 48.90 L78.51 49.69 L78.77 50.84 L82.36 52.11 L82.82 53.25 L81.15 53.92 L81.72 55.48 L85.62 57.09 L85.57 58.89 L81.34 61.44 L90.40 66.25 L93.11 69.04 L90.69 72.70 L75.58 84.13 L64.48 91.04 L60.85 90.14 L58.98 91.39 L55.43 91.20 L57.43 90.23 L56.73 89.53 L54.39 92.04 L51.24 91.04 L52.65 92.40 L50.68 91.80 L51.33 93.23 L49.40 92.14 L44.66 94.11 L41.14 94.04 L41.44 94.91 L40.34 95.52 L39.40 94.77 L32.81 95.85 L33.68 94.78 L31.49 96.90 L28.93 97.17 L32.05 95.37 L30.45 96.15 L31.54 95.09 L28.70 94.09 L30.23 92.23 L26.11 93.60 L27.02 92.92 L25.62 93.05 L26.85 91.83 L20.63 91.11 L21.04 89.74 L19.35 91.01 L17.84 90.18 L17.43 89.18 L18.30 88.81 L17.25 87.93 L17.99 87.25 L17.03 85.82 L18.39 85.82 L18.09 84.82 L18.95 84.51 L18.14 82.70 L19.06 82.58 L17.94 81.95 L20.12 81.57 L16.57 77.41 L17.59 74.85 L15.80 73.60 L16.25 71.81 L15.30 71.86 L15.66 70.17 L17.71 69.27 L18.10 67.81 L19.91 67.94 L18.49 66.28 L21.44 65.81 L22.10 66.88 L24.67 65.60 L23.67 64.26 L25.20 64.38 L24.31 63.40 L25.24 64.03 L26.59 61.79 L27.95 62.48 L28.91 60.96 L32.71 59.78 L32.57 58.58 L34.11 58.84 L33.88 58.12 L39.59 54.27 L41.03 51.77 L45.15 50.74 L47.07 51.55 L45.86 50.30 L47.73 50.30 L46.01 48.87 L46.87 47.94 L46.84 45.39 L42.04 44.22 L41.11 43.06 L42.30 41.71 L38.56 42.92 L34.74 38.57 L34.46 36.74 L36.16 35.79 L37.07 33.59 L33.94 30.43 L35.30 28.00 L32.82 27.40 L33.73 26.48 L33.19 23.96 L34.53 23.18 L28.21 19.14 L22.76 18.39 L12.02 13.31 L15.34 13.30 L15.54 11.46 L19.55 11.17 L25.25 16.25 L31.09 17.11 L36.51 15.31 L43.74 17.66 L45.94 15.34 L50.34 13.70 L49.91 11.65 L51.89 7.37 L55.81 5.23 L60.00 5.44 L65.68 3.86 L69.66 6.34 L75.16 7.60 L76.63 9.41 L72.98 11.79 L73.73 13.39 Z" />
          <path className="finland-border" d="M73.73 13.39 L69.71 14.56 L72.60 15.13 L69.98 17.91 L71.58 20.87 L76.52 22.07 L81.55 25.58 L74.46 32.66 L80.74 39.93 L82.31 43.53 L79.28 44.28 L80.29 44.86 L78.37 47.86 L80.37 48.90 L78.51 49.69 L78.77 50.84 L82.36 52.11 L82.82 53.25 L81.15 53.92 L81.72 55.48 L85.62 57.09 L85.57 58.89 L81.34 61.44 L90.40 66.25 L93.11 69.04 L90.69 72.70 L75.58 84.13 L64.48 91.04 L60.85 90.14 L58.98 91.39 L55.43 91.20 L57.43 90.23 L56.73 89.53 L54.39 92.04 L51.24 91.04 L52.65 92.40 L50.68 91.80 L51.33 93.23 L49.40 92.14 L44.66 94.11 L41.14 94.04 L41.44 94.91 L40.34 95.52 L39.40 94.77 L32.81 95.85 L33.68 94.78 L31.49 96.90 L28.93 97.17 L32.05 95.37 L30.45 96.15 L31.54 95.09 L28.70 94.09 L30.23 92.23 L26.11 93.60 L27.02 92.92 L25.62 93.05 L26.85 91.83 L20.63 91.11 L21.04 89.74 L19.35 91.01 L17.84 90.18 L17.43 89.18 L18.30 88.81 L17.25 87.93 L17.99 87.25 L17.03 85.82 L18.39 85.82 L18.09 84.82 L18.95 84.51 L18.14 82.70 L19.06 82.58 L17.94 81.95 L20.12 81.57 L16.57 77.41 L17.59 74.85 L15.80 73.60 L16.25 71.81 L15.30 71.86 L15.66 70.17 L17.71 69.27 L18.10 67.81 L19.91 67.94 L18.49 66.28 L21.44 65.81 L22.10 66.88 L24.67 65.60 L23.67 64.26 L25.20 64.38 L24.31 63.40 L25.24 64.03 L26.59 61.79 L27.95 62.48 L28.91 60.96 L32.71 59.78 L32.57 58.58 L34.11 58.84 L33.88 58.12 L39.59 54.27 L41.03 51.77 L45.15 50.74 L47.07 51.55 L45.86 50.30 L47.73 50.30 L46.01 48.87 L46.87 47.94 L46.84 45.39 L42.04 44.22 L41.11 43.06 L42.30 41.71 L38.56 42.92 L34.74 38.57 L34.46 36.74 L36.16 35.79 L37.07 33.59 L33.94 30.43 L35.30 28.00 L32.82 27.40 L33.73 26.48 L33.19 23.96 L34.53 23.18 L28.21 19.14 L22.76 18.39 L12.02 13.31 L15.34 13.30 L15.54 11.46 L19.55 11.17 L25.25 16.25 L31.09 17.11 L36.51 15.31 L43.74 17.66 L45.94 15.34 L50.34 13.70 L49.91 11.65 L51.89 7.37 L55.81 5.23 L60.00 5.44 L65.68 3.86 L69.66 6.34 L75.16 7.60 L76.63 9.41 L72.98 11.79 L73.73 13.39 Z" />
          <path className="aland-fill" d="M4 93 L7 92 L10 93 L11 95 L9 96 L10 98 L6 97 L3 98 L2 96 Z" />
          <path className="aland-border" d="M4 93 L7 92 L10 93 L11 95 L9 96 L10 98 L6 97 L3 98 L2 96 Z" />
        </svg>
        {showCities && cities.map((city) => <span key={city.name} className="city-marker" style={{ left: `${((city.lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100}%`, top: `${((MAP_BOUNDS.north - city.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100}%` }}><i /><b>{city.name}</b></span>)}
        {previousRound && <><span className="previous-guess" style={{ left: `${previousRound.guess.x}%`, top: `${previousRound.guess.y}%` }} /><span className="previous-answer" style={{ left: `${((previousRound.city.lon - MAP_BOUNDS.west) / (MAP_BOUNDS.east - MAP_BOUNDS.west)) * 100}%`, top: `${((MAP_BOUNDS.north - previousRound.city.lat) / (MAP_BOUNDS.north - MAP_BOUNDS.south)) * 100}%` }}><span>{previousRound.city.name}</span></span></>}
        {guess && <span className="guess-pin" style={{ left: `${guess.x}%`, top: `${guess.y}%` }} />}
        {distance !== null && <span className="answer-pin" style={{ left: `${targetX}%`, top: `${targetY}%` }}><span>{target.name}</span></span>}
        <span className="north">N</span>
        {feedback && <div className="attempt-comment" style={{ left: `${commentLeft}%`, top: `${commentTop}%` }} aria-live="polite">{feedback}</div>}
      </div></div>
      <div className="map-score"><div><span>LAST</span><strong>{lastDistance !== null ? `${lastDistance} km` : "—"}</strong></div><div><span>AVERAGE</span><strong>{history.length ? `${average} km` : "—"}</strong></div><div><span>BEST</span><strong>{bestAverage !== null ? `${bestAverage} km` : "—"}</strong></div></div>
    </section>
  </main>;
}
