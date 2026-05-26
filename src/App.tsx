import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  CalendarDays, 
  MapPin, 
  CloudSun, 
  Share2, 
  RefreshCw, 
  Gift, 
  Sparkles, 
  Baby, 
  Loader2,
  Check
} from "lucide-react";

interface WeatherLabel {
  label: string;
  emoji: string;
  mood: "sunny" | "cloudy" | "rain" | "snow" | "storm" | "fog";
}

const WEATHER_LABELS: Record<number, WeatherLabel> = {
  0: { label: "Clear sky", emoji: "☀️", mood: "sunny" },
  1: { label: "Mainly clear", emoji: "🌤️", mood: "sunny" },
  2: { label: "Partly cloudy", emoji: "⛅", mood: "cloudy" },
  3: { label: "Overcast", emoji: "☁️", mood: "cloudy" },
  45: { label: "Fog", emoji: "🌫️", mood: "fog" },
  48: { label: "Depositing rime fog", emoji: "🌫️", mood: "fog" },
  51: { label: "Light drizzle", emoji: "🌦️", mood: "rain" },
  53: { label: "Moderate drizzle", emoji: "🌦️", mood: "rain" },
  55: { label: "Dense drizzle", emoji: "🌧️", mood: "rain" },
  56: { label: "Light freezing drizzle", emoji: "🌧️", mood: "rain" },
  57: { label: "Dense freezing drizzle", emoji: "🌧️", mood: "rain" },
  61: { label: "Slight rain", emoji: "🌧️", mood: "rain" },
  63: { label: "Moderate rain", emoji: "🌧️", mood: "rain" },
  65: { label: "Heavy rain", emoji: "🌧️", mood: "rain" },
  66: { label: "Light freezing rain", emoji: "🌧️", mood: "rain" },
  67: { label: "Heavy freezing rain", emoji: "🌧️", mood: "rain" },
  71: { label: "Slight snow fall", emoji: "❄️", mood: "snow" },
  73: { label: "Moderate snow fall", emoji: "❄️", mood: "snow" },
  75: { label: "Heavy snow fall", emoji: "❄️", mood: "snow" },
  77: { label: "Snow grains", emoji: "❄️", mood: "snow" },
  80: { label: "Slight rain showers", emoji: "🌦️", mood: "rain" },
  81: { label: "Moderate rain showers", emoji: "🌧️", mood: "rain" },
  82: { label: "Violent rain showers", emoji: "⛈️", mood: "storm" },
  85: { label: "Slight snow showers", emoji: "🌨️", mood: "snow" },
  86: { label: "Heavy snow showers", emoji: "🌨️", mood: "snow" },
  95: { label: "Thunderstorm", emoji: "⛈️", mood: "storm" },
  96: { label: "Thunderstorm with hail", emoji: "⛈️", mood: "storm" },
  99: { label: "Thunderstorm with heavy hail", emoji: "⛈️", mood: "storm" },
};

interface StoryTemplate {
  title: string;
  story: string;
  twist: string;
}

const RESULT_COPY: Record<"sunny" | "cloudy" | "rain" | "snow" | "storm" | "fog", StoryTemplate> = {
  sunny: {
    title: "A bright little entrance",
    story: "The sky showed up in a good mood that day. Sunshine, soft drama, and the kind of light that feels suspiciously like a main-character arrival.",
    twist: "Basically: your baby did not arrive quietly. They arrived like a tiny celebrity.",
  },
  cloudy: {
    title: "A soft and thoughtful kind of day",
    story: "The weather kept things calm, cozy, and just a little mysterious. The sky was clearly setting the stage for a baby with depth, opinions, and excellent future side-eye.",
    twist: "Not flashy. Just iconic in a low-key way.",
  },
  rain: {
    title: "A rainy-day legend was born",
    story: "A little rain outside, a lot of emotion inside. The world may have been damp, but your family’s story got a brand-new center of gravity that day.",
    twist: "Tiny human. Big entrance. Slight chance of lifelong chaos.",
  },
  snow: {
    title: "Cold outside, unforgettable inside",
    story: "The weather brought the drama in fluffy form. It was the kind of day that feels frozen in time — which is perfect, because this is exactly the sort of moment families replay forever.",
    twist: "Snow on the street. Warmth in the heart. Snacks probably required.",
  },
  storm: {
    title: "The dramatic one has entered the chat",
    story: "Thunder, energy, weather with opinions — honestly, the sky understood the assignment. Some babies are born. Others make an entrance worthy of a full soundtrack.",
    twist: "This was not a subtle arrival. And frankly, why start now?",
  },
  fog: {
    title: "A mysterious little arrival",
    story: "The day came wrapped in haze and softness, like the weather itself knew something special was happening but wanted to keep the reveal cinematic.",
    twist: "Low visibility. Maximum emotional impact.",
  },
};

interface Product {
  title: string;
  description: string;
  cta: string;
  href: string;
}

const PRODUCT_MATCH: Record<"sunny" | "cloudy" | "rain" | "snow" | "storm" | "fog", Product[]> = {
  sunny: [
    {
      title: "Funny Baby Tee for Little Sunshine Energy",
      description: "Perfect for babies who enter the world like they already own the room.",
      cta: "Shop sunny little legend styles",
      href: "#shop",
    },
    {
      title: "Funny Mug for Sleep-Deprived Parents",
      description: "Because sunshine babies still wake people up at 4:52 a.m.",
      cta: "See parent survival mugs",
      href: "#shop",
    },
  ],
  cloudy: [
    {
      title: "Cozy Baby Tee with Big Personality",
      description: "For tiny humans with calm faces and suspiciously strong opinions.",
      cta: "Browse cozy classics",
      href: "#shop",
    },
    {
      title: "Funny Fridge Magnet",
      description: "A small daily reminder that your child was born iconic, not average.",
      cta: "See funny magnets",
      href: "#shop",
    },
  ],
  rain: [
    {
      title: "Superhero Baby Tee",
      description: "For babies whose birth weather already hinted at dramatic plot development.",
      cta: "Explore superhero picks",
      href: "#shop",
    },
    {
      title: "Funny Parent Mug",
      description: "Pairs well with rain, memories, and reheated coffee.",
      cta: "See funny mugs",
      href: "#shop",
    },
  ],
  snow: [
    {
      title: "Funny Baby Tee for Cool Little Legends",
      description: "Cold forecast. Warm family chaos. Great outfit potential.",
      cta: "See winter-born favorites",
      href: "#shop",
    },
    {
      title: "Nursery Decor Gift",
      description: "For the kind of memory that deserves wall-worthy storytelling.",
      cta: "Browse decor ideas",
      href: "#shop",
    },
  ],
  storm: [
    {
      title: "Born-to-be-a-Legend Style",
      description: "For babies who arrived with thunder and have not lowered the volume since.",
      cta: "Shop dramatic arrivals",
      href: "#shop",
    },
    {
      title: "Funny Magnet or Mug",
      description: "Because some birth stories deserve to live on the fridge forever.",
      cta: "See giftable keepsakes",
      href: "#shop",
    },
  ],
  fog: [
    {
      title: "Soft, Playful Baby Tee",
      description: "For little ones who arrived quietly and then built a full personality empire.",
      cta: "Browse soft-story styles",
      href: "#shop",
    },
    {
      title: "Funny Keepsake Gift",
      description: "A sweet reminder of a beautifully mysterious day.",
      cta: "See keepsake ideas",
      href: "#shop",
    },
  ],
};

function formatDisplayDate(dateString: string): string {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function average(numbers: number[]): number | null {
  if (!numbers?.length) return null;
  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function pickMoodFromCode(code: number): "sunny" | "cloudy" | "rain" | "snow" | "storm" | "fog" {
  return WEATHER_LABELS[code]?.mood || "cloudy";
}

function resolveWeatherDescriptor(code: number): WeatherLabel {
  return WEATHER_LABELS[code] || { label: "Unknown weather", emoji: "🌤️", mood: "cloudy" };
}

interface ResultData {
  cityInput: string;
  date: string;
  locationName: string;
  weatherLabel: string;
  weatherEmoji: string;
  mood: "sunny" | "cloudy" | "rain" | "snow" | "storm" | "fog";
  title: string;
  story: string;
  twist: string;
  tempC: number | null;
  tempMax: number | null;
  tempMin: number | null;
  precipitation: number | null;
  products: Product[];
}

export default function App() {
  const [date, setDate] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ResultData | null>(null);
  const [copied, setCopied] = useState(false);

  const maxDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!date || !city.trim()) {
      setError("Please enter both a date and a city.");
      return;
    }

    setLoading(true);

    try {
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city.trim())}&count=1&language=en&format=json`;
      const geoRes = await fetch(geoUrl);
      if (!geoRes.ok) throw new Error("Could not find that city.");
      const geoData = await geoRes.json();
      const location = geoData?.results?.[0];

      if (!location) {
        throw new Error("I couldn’t find that city. Try adding a state, province, or country.");
      }

      const weatherUrl = `https://archive-api.open-meteo.com/v1/archive?latitude=${location.latitude}&longitude=${location.longitude}&start_date=${date}&end_date=${date}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;
      const weatherRes = await fetch(weatherUrl);
      if (!weatherRes.ok) throw new Error("Historical weather could not be loaded.");
      const weatherData = await weatherRes.json();

      const code = weatherData?.daily?.weather_code?.[0];
      const maxTemp = weatherData?.daily?.temperature_2m_max?.[0];
      const minTemp = weatherData?.daily?.temperature_2m_min?.[0];
      const precipitation = weatherData?.daily?.precipitation_sum?.[0];
      const meanTemp = average([minTemp, maxTemp].filter((v) => typeof v === "number") as number[]);

      // Default to 3 if code is undefined or not in the record
      const validCode = (typeof code === "number" && WEATHER_LABELS[code]) ? code : 3;

      const descriptor = resolveWeatherDescriptor(validCode);
      const mood = pickMoodFromCode(validCode);
      const copy = RESULT_COPY[mood];
      const products = PRODUCT_MATCH[mood] || PRODUCT_MATCH.cloudy;

      setResult({
        cityInput: city.trim(),
        date,
        locationName: [location.name, location.admin1, location.country].filter(Boolean).join(", "),
        weatherLabel: descriptor.label,
        weatherEmoji: descriptor.emoji,
        mood,
        title: copy.title,
        story: copy.story,
        twist: copy.twist,
        tempC: typeof meanTemp === "number" ? Math.round(meanTemp) : null,
        tempMax: typeof maxTemp === "number" ? Math.round(maxTemp) : null,
        tempMin: typeof minTemp === "number" ? Math.round(minTemp) : null,
        precipitation: typeof precipitation === "number" ? precipitation : null,
        products,
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    if (!result) return;
    const text = `${result.weatherEmoji} ${result.locationName} — ${formatDisplayDate(result.date)}. ${result.weatherLabel}. ${result.title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Baby Birth Weather Story",
          text,
          url: window.location.href,
        });
        return;
      } catch {
        // user cancelled share
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore clipboard error
    }
  }

  function resetForm() {
    setResult(null);
    setError("");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* BirthSkies Clean Minimalism Header */}
      <header className="flex justify-between items-center px-6 md:px-12 pt-10 pb-6 max-w-6xl mx-auto w-full shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path>
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">BirthSkies</span>
        </div>
        <nav className="flex gap-6 md:gap-8 text-sm font-medium text-slate-500">
          <a href="#" className="hover:text-slate-900 transition-colors">The Story</a>
          <a href="#shop" className="hover:text-slate-900 transition-colors">Gift Shop</a>
          <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
        </nav>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-12 py-6 space-y-16">
        <section className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-widest rounded-full">
                Tiny date. Big memory.
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
                What was the weather when they arrived?
              </h1>
              <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                Enter a birth date and city to reveal the historical weather—then turn it into a sweet, funny story worth sharing with family and friends.
              </p>
            </div>

            {/* Premium Minimalist Lookup Form */}
            <form onSubmit={handleLookup} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200/80 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth Date</label>
                  <div className="relative">
                    <input
                      type="date"
                      max={maxDate}
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full h-12 bg-slate-50 hover:bg-slate-100/50 transition-colors border-none rounded-xl px-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-medium text-slate-700 cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Birth City</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Toronto, London, Chicago..."
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-12 bg-slate-50 hover:bg-slate-100/50 transition-colors border-none rounded-xl px-4 text-sm focus:outline-hidden focus:ring-2 focus:ring-slate-900 font-medium text-slate-700"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors duration-200 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                )}
                Check the weather story
              </button>

              <p className="text-center text-xs text-slate-400 font-medium">
                Historical weather data compiled for over 200,000 cities worldwide.
              </p>

              {error ? (
                <div className="text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-2 justify-center">
                  <span>⚠️</span> {error}
                </div>
              ) : null}
            </form>
          </div>

          {/* Example Reveal with soft background blur-blobs */}
          <div className="relative">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
            
            <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Example Reveal</p>
                  <p className="text-sm text-slate-400">London, Ontario • May 14, 2024</p>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                </div>
              </div>

              <div className="text-6xl">🌧️</div>

              <div className="space-y-4">
                <h2 className="font-display text-3xl font-bold leading-tight">A rainy-day legend was born.</h2>
                <p className="text-lg text-slate-300 leading-relaxed">
                  A little rain outside, a lot of emotion inside. The world may have been damp, but your family's story got a brand-new center of gravity that day.
                </p>
                <div className="pt-4 border-t border-white/10">
                  <p className="text-amber-300 font-semibold italic text-lg">
                    "Tiny human. Big entrance. Slight chance of lifelong chaos."
                  </p>
                </div>
              </div>

              {/* High-Low-Mood detail panel from the style guide */}
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center flex-1">
                  <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">High</p>
                  <p className="text-xl font-bold text-white">18°C</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center flex-1">
                  <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Low</p>
                  <p className="text-xl font-bold text-white">12°C</p>
                </div>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-center flex-1">
                  <p className="text-[10px] uppercase text-slate-500 font-bold mb-1">Mood</p>
                  <p className="text-xl font-bold text-white">Cozy</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Informative Value Cards with ID about for smooth scroll */}
        <section id="about" className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Sparkles,
              title: "Emotional first",
              text: "This feels like a beautiful memory reveal, not just a statistics report.",
            },
            {
              icon: Gift,
              title: "Shareable by design",
              text: "A sweet keepsake worth sharing with family, grandparents, and the registry group chat.",
            },
            {
              icon: CloudSun,
              title: "Soft product bridge",
              text: "Our story bridges baby's atmospheric debut to lovely baby shirts, mugs, and decor.",
            },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-300">
                <div className="mb-4 inline-flex rounded-2xl bg-amber-50 border border-amber-200 px-3.5 py-3.5 text-amber-800">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            );
          })}
        </section>

        {/* Dynamic Lookup Screen Outputs */}
        <section className="pb-12">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <div className="rounded-[40px] border border-slate-200/60 bg-slate-900 text-white shadow-xl relative overflow-hidden p-12 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent opacity-60" />
                  <div className="relative z-10 flex flex-col items-center justify-center min-h-[220px]">
                    <Loader2 className="mb-5 h-12 w-12 animate-spin text-amber-400" />
                    <h3 className="text-2xl font-bold tracking-tight">Checking the skies…</h3>
                    <p className="mt-3 max-w-lg text-sm text-slate-300 leading-relaxed">
                      Rewinding time, locating the perfect coordinates, and preparing a weather story with more personality than your average forecast.
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                {/* Result Block Card with Minimal Slate styling */}
                <div className="bg-white rounded-[40px] border border-slate-200/80 overflow-hidden shadow-2xl grid lg:grid-cols-[1.2fr_0.8fr]">
                  {/* Results story and details parameters */}
                  <div className="p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 space-y-8">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-slate-700 font-semibold">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" />
                        {result.locationName}
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3.5 py-1.5 text-slate-700 font-mono font-semibold">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                        {formatDisplayDate(result.date)}
                      </span>
                    </div>

                    <div className="flex items-start gap-6">
                      <div className="text-6xl shrink-0 p-4 bg-slate-50 rounded-3xl border border-slate-100">{result.weatherEmoji}</div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Weather on that birth day</p>
                        <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight text-slate-900 leading-tight">
                          {result.title}
                        </h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">
                          {result.weatherLabel} {result.tempC !== null ? `• approx ${result.tempC}°C` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4 text-base leading-relaxed text-slate-700">
                      <p className="text-lg">{result.story}</p>
                      <p className="font-semibold text-slate-900 border-l-4 border-amber-400 pl-4 py-2 italic bg-amber-500/5 rounded-r-xl">
                        "{result.twist}"
                      </p>
                    </div>

                    {/* Highly polished weather metrics table */}
                    <div className="grid gap-4 sm:grid-cols-3 pt-4">
                      <div className="rounded-2xl bg-slate-50/70 p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">High Temperature</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">{result.tempMax !== null ? `${result.tempMax}°C` : "—"}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Low Temperature</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">{result.tempMin !== null ? `${result.tempMin}°C` : "—"}</p>
                      </div>
                      <div className="rounded-2xl bg-slate-50/70 p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Precipitation</p>
                        <p className="mt-1 text-2xl font-bold text-slate-800">
                          {result.precipitation !== null ? `${result.precipitation} mm` : "—"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Share actions or print configuration card container */}
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 p-8 sm:p-12 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Shareable Card</p>
                      <div className="mt-4 rounded-3xl bg-white p-6 shadow-xs border border-slate-100/80 transition-all">
                        <p className="text-xs uppercase tracking-wider font-semibold text-slate-400">Baby’s Birth Skies</p>
                        <p className="mt-4 text-5xl">{result.weatherEmoji}</p>
                        <h3 className="mt-4 text-xl font-bold text-slate-900 leading-snug">{result.title}</h3>
                        <p className="mt-2 text-xs font-medium text-slate-500">{formatDisplayDate(result.date)} • {result.locationName}</p>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600 italic">"{result.twist}"</p>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-col gap-3">
                      <button
                        onClick={handleShare}
                        className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-400" />
                            Copied to Clipboard!
                          </>
                        ) : (
                          <>
                            <Share2 className="h-4 w-4" />
                            Share or Copy Story
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={resetForm}
                        className="w-full h-12 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Check Another Date
                      </button>
                    </div>
                  </div>
                </div>

                {/* Kids Boutique soft bridge options */}
                <section id="shop" className="space-y-6 pt-4 scroll-mt-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                      Gift Collections
                    </span>
                    <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                      Born with distinct vibes. Shop keeping custom.
                    </h2>
                    <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
                      Here are custom product ideas matching baby's atmospheric arrival. These funny coordinates make wonderful keepsakes, baby shower gifts, and nursery accessories.
                    </p>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {result.products.map((product, idx) => (
                      <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all duration-300 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-slate-900">{product.title}</h3>
                          <p className="text-sm leading-relaxed text-slate-600 pb-4">{product.description}</p>
                        </div>
                        <a
                          href={product.href}
                          className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center transition-colors cursor-pointer text-center"
                        >
                          {product.cta}
                        </a>
                      </div>
                    ))}
                  </div>
                </section>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="rounded-[32px] border-2 border-dashed border-slate-300/85 bg-white/60 p-12 text-center">
                  <p className="text-base text-slate-500 leading-relaxed font-medium">
                    Enter birth coordinates above to generate baby's story! After looking up, the dynamic, interactive weather memory, postcard, and gifts option will expand here.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Clean Minimalism Styled Footer */}
      <footer className="shrink-0 border-t border-slate-100 bg-white/50 px-6 md:px-12 py-8 mt-auto flex flex-col gap-4 md:flex-row justify-between items-center w-full">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-xs text-slate-400 font-medium">
            Weather data compiled from <a className="underline hover:text-slate-600 transition-colors" href="https://open-meteo.com/" target="_blank" rel="noreferrer">Open-Meteo.com</a>
          </p>
          <p className="text-[10px] text-slate-400 leading-normal max-w-xl">
            Pro tip: In Shopify or boutique shops, map each weather mood tag to a dynamic Shopify Tag collection (e.g., sunny, rainy) to make custom styles load automatically.
          </p>
        </div>
        <div className="flex gap-6">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider cursor-pointer hover:text-slate-600 transition-colors">Instagram</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider cursor-pointer hover:text-slate-600 transition-colors">Twitter</span>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider cursor-pointer hover:text-slate-600 transition-colors">Privacy</span>
        </div>
      </footer>
    </div>
  );
}
