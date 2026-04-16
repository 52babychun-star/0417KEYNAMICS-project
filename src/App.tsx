/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Music, 
  Cpu, 
  Zap, 
  Layers, 
  ChevronRight, 
  Download, 
  RefreshCcw,
  Monitor,
  Volume2,
  Sparkles,
  Info,
  X
} from 'lucide-react';

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GENERATION_PROMPT = "Realistic 4K ultra-HD concept art illustration of a futuristic 'Keynamics' keytar. Tech-heavy hardware design, sleek obsidian and brushed metal aesthetic, glowing integrated neon cyan light strips, advanced digital touchpads, modular keybed, floating holographic interface elements, volumetric cinematic lighting, high-performance professional music gear, hyper-detailed textures, 8k resolution style.";

interface InsightCard {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const INSIGHTS: InsightCard[] = [
  { title: "Material", value: "Bio-Carbon", icon: <Layers className="w-4 h-4" /> },
  { title: "Latency", value: "0.02ms", icon: <Zap className="w-4 h-4" /> },
  { title: "Computing", value: "Neuro-Core", icon: <Cpu className="w-4 h-4" /> },
];

export default function App() {
  const [images, setImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ url: string; index: number } | null>(null);

  const generateVisions = async () => {
    setIsGenerating(true);
    setError(null);
    setImages([]);

    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

    try {
      const newImages: string[] = [];
      
      // We generate 4 images. Adding a delay between requests to avoid 429 Rate Limit.
      for (let i = 0; i < 4; i++) {
        if (i > 0) await delay(2000); // 2-second cooldown between requests

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `${GENERATION_PROMPT} Variation ${i + 1}. Perspective change.` }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
            }
          }
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData) {
            newImages.push(`data:image/png;base64,${part.inlineData.data}`);
          }
        }
        
        // Update images array as they come in to show progress
        if (newImages.length > 0) {
          setImages([...newImages]);
        }
      }

      if (newImages.length === 0) {
        throw new Error("Failed to capture visionary data.");
      }

    } catch (err: any) {
      console.error(err);
      const isQuotaError = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
      const isAuthError = err.message?.includes('403') || err.message?.includes('PERMISSION_DENIED');

      if (isQuotaError) {
        setError("Transmission Throttled: API Quota exceeded. Please wait a moment before trying to sync again.");
      } else if (isAuthError) {
        setError("Access Denied: Please ensure your API key has permission for the Image model.");
      } else {
        setError("Vision link failed. Ensure your API core is synchronized.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    generateVisions();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-text-main font-sans selection:bg-accent/30 overflow-x-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border py-[30px] px-6 md:px-[50px] bg-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl tracking-[4px] uppercase bg-gradient-to-r from-white to-[#888] bg-clip-text text-transparent">
              Keynamics
            </span>
          </div>
          
          <nav className="hidden md:flex items-center gap-[30px]">
            {['Technology', 'Portfolio', 'Craftsmanship'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-[11px] uppercase tracking-[2px] font-sans text-text-dim hover:text-white transition-colors"
              >
                {item}
              </a>
            ))}
            <span className="text-[11px] uppercase tracking-[2px] font-sans text-white">Series One</span>
          </nav>

          <button 
            onClick={generateVisions}
            disabled={isGenerating}
            className="flex items-center gap-2 group transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 text-accent ${isGenerating ? 'animate-spin' : ''}`} />
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-accent">Sync</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto md:px-0">
        {/* Hero Section */}
        <div className="py-[40px] px-6 md:px-[50px] mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display italic text-[42px] leading-tight text-text-main mb-2">
              未来主義的 4K 鍵盤吉他
            </h1>
            <p className="text-[13px] text-text-dim uppercase tracking-[1px] font-sans">
              KEYNAMICS NEXT-GEN SERIES // ULTIMATE HIGH-FIDELITY INSTRUMENTATION
            </p>
          </motion.div>
        </div>

        {/* Gallery Section */}
        <section className="px-6 md:px-[50px] pb-[40px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-[20px]">
            <AnimatePresence mode="popLayout">
              {isGenerating && images.length === 0 ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <motion.div 
                    key={`skeleton-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="aspect-[3/4] bg-card-bg border border-border flex flex-col items-center justify-center gap-4 relative overflow-hidden p-[15px]"
                  >
                    <RefreshCcw className="w-8 h-8 text-accent animate-spin" />
                  </motion.div>
                ))
              ) : error ? (
                <div className="col-span-full py-24 text-center border border-dashed border-red-500/20 rounded-xl bg-red-500/5 font-sans">
                  <p className="text-red-400 font-mono text-xs">{error}</p>
                </div>
              ) : (
                images.map((img, idx) => (
                  <motion.div 
                    key={`image-${idx}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedImage({ url: img, index: idx })}
                    className="card group relative flex flex-col p-[15px] bg-card-bg border border-border aspect-[3/4] cursor-pointer"
                  >
                    <div className="absolute top-[15px] right-[15px] z-20 text-[9px] text-accent border border-accent px-1.5 py-1 uppercase font-sans">
                      New Release
                    </div>
                    
                    <div className="flex-1 mb-[15px] overflow-hidden relative bg-gradient-to-br from-[#1a1a1c] to-black flex items-center justify-center">
                      <img 
                        src={img} 
                        alt={`Keynamics Vision ${idx + 1}`} 
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    <div className="card-info pt-[10px]">
                      <h3 className="text-[14px] text-text-main tracking-[1px] font-sans uppercase">K-1 SERIES {idx + 1}</h3>
                      <span className="text-[10px] text-text-dim uppercase font-sans">Titanium / Carbon Fusion</span>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-[20px] px-6 md:px-[50px] border-t border-border bg-white/[0.02]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-[40px]">
            {[
              { label: "Render quality", value: "4K ULTRA-HD" },
              { label: "Latency", value: "0.14ms ZERO-LAG" },
              { label: "Keys", value: "49 HAPTIC SENSORS" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-[9px] text-text-dim uppercase mb-1">{stat.label}</span>
                <span className="text-[12px] font-mono text-text-main">{stat.value}</span>
              </div>
            ))}
          </div>
          <div className="px-3 py-1 border border-text-dim text-text-dim text-[10px] font-bold font-sans">
            GENATIVE ENGINE v4.0
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%) skewX(-12deg); }
          100% { transform: translateX(150%) skewX(-12deg); }
        }
      `}</style>

      {/* Hero Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/95 backdrop-blur-xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative max-w-6xl w-full bg-card-bg border border-border rounded-xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white hover:text-accent rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-[2] bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-border">
                <img 
                  src={selectedImage.url} 
                  alt="Keynamics Full Vision" 
                  className="w-full h-full object-contain max-h-[70vh] md:max-h-[85vh]"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 p-8 flex flex-col justify-center">
                <div className="mb-8">
                  <span className="text-[10px] text-accent border border-accent px-2 py-1 uppercase tracking-widest inline-block mb-4">
                    Series One Concept
                  </span>
                  <h2 className="font-display italic text-4xl text-text-main mb-4">
                    K-1 SERIES {selectedImage.index + 1}
                  </h2>
                  <p className="text-text-dim text-sm leading-relaxed font-sans">
                    A high-fidelity technological masterpiece. Synthesized using the latest Keynamics Genative Engine, 
                    this model features a titanium alloy frame with integrated carbon-fiber resonators and bio-haptic sensors.
                    Current latency metrics show a record-breaking 0.14ms response time across all 49 sensory keys.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Material Architecture", value: "Bio-Carbon / Titanium" },
                    { label: "Sensory Interface", value: "49 Haptic Zones" },
                    { label: "Sync Engine", value: "v4.0 Final Burst" }
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between items-center py-3 border-b border-border/50">
                      <span className="text-[9px] text-text-dim uppercase tracking-wider">{spec.label}</span>
                      <span className="text-xs font-mono text-text-main">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <button 
                  className="mt-8 w-full py-4 bg-accent text-black font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors"
                >
                  Download HD Vision Data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
