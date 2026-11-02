import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { PredatorFlashcardsModal } from './PredatorFlashcardsModal';
import {
  FileText,
  Lock,
  Sparkles,
  Zap,
  ChevronRight,
  Flame,
  Shield,
  Layers,
  Crown,
  BookOpen,
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToStudy: () => void;
  onNavigateToLibrary: () => void;
  onNavigateToBacklog: () => void;
  onNavigateToInsights: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToStudy,
  onNavigateToLibrary,
  onNavigateToBacklog,
  onNavigateToInsights,
}) => {
  const { stats } = useStudy();
  const [qualitiesModalMode, setQualitiesModalMode] = useState<'panther' | 'wolf' | null>(null);
  const [showQueenModal, setShowQueenModal] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] py-4 px-3 sm:px-4 pb-28 bg-[#050402]">
      {/* NATIVE HIGH-AURA REAL LUXURY DASHBOARD */}
      <div className="w-full max-w-[480px] rounded-[36px] bg-[#0A0805] border-2 border-[#D4AF37]/60 p-5 shadow-[0_20px_70px_rgba(0,0,0,0.98)] text-[#F5EACB] space-y-4.5 relative overflow-hidden select-none">
        {/* Subtle Ambient Gold Glow Background */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#AA771C]/10 rounded-full blur-3xl pointer-events-none" />

        {/* 1. TOP HEADER & IMPERIAL EMBLEM */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/25 relative z-10">
          {/* Left: Versatility Gold Crest */}
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#AA771C] to-[#593F0F] p-[1.5px] shadow-[0_0_12px_rgba(212,175,55,0.4)]">
              <div className="w-full h-full rounded-full bg-[#110E07] flex items-center justify-center overflow-hidden">
                <img
                  src="/assets/aistudio/app-icon_c51e9ee0.jpg"
                  alt="Versatility Crest"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="font-cinzel text-sm sm:text-base font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CE] via-[#D4AF37] to-[#AA771C]">
                VERSATILITY
              </h1>
              <p className="text-[9px] tracking-widest text-[#AA9568] uppercase font-cinzel">
                ALL IN ONE
              </p>
            </div>
          </div>

          {/* Right: Panther & Wolf Royal Gold Crest Shortcuts from Reference Image */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQualitiesModalMode('panther')}
              className="w-10 h-10 rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              title="Open Panther Mode Qualities"
            >
              <img
                src="/assets/aistudio/ref-panther-card-badge.jpg"
                alt="Panther Royal Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </button>
            <button
              onClick={() => setQualitiesModalMode('wolf')}
              className="w-10 h-10 rounded-full overflow-hidden hover:scale-105 transition-transform cursor-pointer shadow-[0_0_12px_rgba(212,175,55,0.4)]"
              title="Open Wolf Mode Qualities"
            >
              <img
                src="/assets/aistudio/ref-wolf-card-badge.jpg"
                alt="Wolf Royal Logo"
                className="w-full h-full object-cover rounded-full"
              />
            </button>
          </div>
        </div>

        {/* 2. PRIVATE STATUS INDICATOR */}
        <div className="flex items-center justify-between text-[11px] px-1 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981] animate-pulse" />
            <span className="font-cinzel tracking-widest uppercase text-xs font-bold text-[#EAD8A7]">
              • PRIVATE VAULT
            </span>
          </div>
          <span className="text-[10px] text-[#A89878] font-mono">
            OFFLINE ENCRYPTED
          </span>
        </div>


          {/* 3. THE ONE AND ONLY VERSATILITY QUEEN - THE EMPIRE BUILDER CARD */}
          <div
            onClick={() => setShowQueenModal(true)}
            className="group relative rounded-2xl bg-gradient-to-br from-[#1E170A] via-[#140F06] to-[#0D0A05] border-2 border-[#D4AF37]/70 p-3.5 sm:p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:border-[#D4AF37] transition-all cursor-pointer overflow-hidden z-10"
          >
            <div className="flex items-center space-x-3.5">
              {/* Queen Real Portrait with Gold Foil Border */}
              <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-xl overflow-hidden flex-shrink-0 border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                <img
                  src="/assets/aistudio/queen-portrait.jpg"
                  alt="Versatility Queen"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-1 left-1 text-[9px] font-cinzel font-bold text-[#FFF2B2] bg-black/75 px-1.5 py-0.5 rounded border border-[#D4AF37]/40">
                  EMPRESS
                </span>
              </div>

              {/* Text Information & Quotes */}
              <div className="flex-1 space-y-1.5">
                <div>
                  <p className="text-[9px] font-cinzel tracking-widest text-[#D4AF37] uppercase font-bold">
                    THE ONE AND ONLY
                  </p>
                  <h2 className="font-cinzel text-base sm:text-lg font-extrabold text-[#FFF4D0] leading-tight">
                    VERSATILITY QUEEN
                  </h2>
                  <p className="text-[10px] font-semibold text-[#C7A351] tracking-wider uppercase">
                    THE EMPIRE BUILDER
                  </p>
                </div>

                <div className="space-y-1 pt-1 border-t border-[#D4AF37]/25 text-[11px] italic font-serif text-[#E8DAB2] leading-snug">
                  <p className="border-l border-[#D4AF37]/50 pl-1.5">
                    "She builds empires in silence and rules with grace."
                  </p>
                  <p className="border-l border-[#D4AF37]/50 pl-1.5">
                    "She remembered who she was and the game changed."
                  </p>
                </div>

                <div className="pt-1 flex items-center space-x-1 text-[10px] text-[#D4AF37] font-semibold">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Tap to open Empress Focus Codex</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. TWO TOP SOVEREIGN CARDS: MULTI-PDF LIBRARY & REVISION VAULT */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {/* Card 1: Multi-PDF Library */}
            <button
              onClick={onNavigateToLibrary}
              className="group p-4 rounded-2xl bg-gradient-to-br from-[#191308] via-[#120E05] to-[#0A0804] border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] text-left transition-all cursor-pointer shadow-[0_8px_25px_rgba(0,0,0,0.7)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] space-y-2.5 relative overflow-hidden"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden group-hover:scale-110 transition-transform shadow-md">
                <img
                  src="/assets/aistudio/ref-pdf-icon-badge.jpg"
                  alt="PDF Library Badge"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div>
                <h3 className="font-cinzel text-sm font-bold text-[#FFF2B2] leading-tight">
                  Multi-PDF Library
                </h3>
                <p className="text-[11px] text-[#AA9568] mt-0.5">
                  Open Many PDFs at Once
                </p>
              </div>

              <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[10px] text-[#D4AF37]">
                <span className="font-bold">500+ Capacity Vault</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            {/* Card 2: Revision Vault */}
            <button
              onClick={onNavigateToStudy}
              className="group p-4 rounded-2xl bg-gradient-to-br from-[#191308] via-[#120E05] to-[#0A0804] border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] text-left transition-all cursor-pointer shadow-[0_8px_25px_rgba(0,0,0,0.7)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] space-y-2.5 relative overflow-hidden"
            >
              <div className="w-11 h-11 rounded-full overflow-hidden group-hover:scale-110 transition-transform shadow-md">
                <img
                  src="/assets/aistudio/ref-revision-icon-badge.jpg"
                  alt="Revision Vault Badge"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>

              <div>
                <h3 className="font-cinzel text-sm font-bold text-[#FFF2B2] leading-tight">
                  Revision Vault
                </h3>
                <p className="text-[11px] text-[#AA9568] mt-0.5">
                  Smart Revision System
                </p>
              </div>

              <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[10px] text-[#D4AF37]">
                <span className="font-bold">6-Stage Spaced Engine</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>

          {/* 5. DECORATIVE QUALITIES DIVIDER */}
          <div className="flex items-center justify-center space-x-3 py-1 relative z-10">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
            <div className="flex items-center space-x-1.5">
              <span className="text-[9px] text-[#D4AF37]">✦</span>
              <span className="font-cinzel text-xs font-bold tracking-widest text-[#E8DAB2] uppercase">
                QUALITIES
              </span>
              <span className="text-[9px] text-[#D4AF37]">✦</span>
            </div>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#D4AF37]/50 to-[#D4AF37]" />
          </div>

          {/* 6. TWO BOTTOM APEX PREDATOR CARDS: PANTHER MODE & WOLF MODE */}
          <div className="grid grid-cols-2 gap-3 relative z-10">
            {/* Card 3: Panther Mode */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#171207] via-[#100D05] to-[#0A0703] border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all shadow-[0_8px_25px_rgba(0,0,0,0.7)] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-black flex items-center justify-center shadow-md">
                    <img
                      src="/assets/aistudio/ref-panther-card-badge.jpg"
                      alt="Panther Royal Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                <h3 className="font-cinzel text-sm font-bold text-[#FFF2B2] flex items-center space-x-1">
                  <span className="text-[#D4AF37]">👑</span>
                  <span>Panther Mode</span>
                </h3>
                <p className="text-[11px] text-[#AA9568] mt-0.5 leading-snug">
                  My Dangerous Efficient Qualities
                </p>
              </div>

              {/* Action Button: Open Qualities & Add Ideas */}
              <button
                onClick={() => setQualitiesModalMode('panther')}
                className="w-full py-2 px-2 rounded-xl bg-gradient-to-r from-[#2A1E0B] to-[#181206] border border-[#D4AF37]/70 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 text-[#FFF2B2] text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all shadow-sm"
              >
                <span>👑 + tap to add ideas</span>
              </button>
            </div>

            {/* Card 4: Wolf Mode */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-[#171207] via-[#100D05] to-[#0A0703] border-2 border-[#D4AF37]/60 hover:border-[#D4AF37] transition-all shadow-[0_8px_25px_rgba(0,0,0,0.7)] flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-black flex items-center justify-center shadow-md">
                    <img
                      src="/assets/aistudio/ref-wolf-card-badge.jpg"
                      alt="Wolf Royal Logo"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>

                <h3 className="font-cinzel text-sm font-bold text-[#FFF2B2] flex items-center space-x-1">
                  <span className="text-[#D4AF37]">👑</span>
                  <span>Wolf Mode</span>
                </h3>
                <p className="text-[11px] text-[#AA9568] mt-0.5 leading-snug">
                  My Leader Qualities
                </p>
              </div>

              {/* Action Button: Open Qualities & Add Ideas */}
              <button
                onClick={() => setQualitiesModalMode('wolf')}
                className="w-full py-2 px-2 rounded-xl bg-gradient-to-r from-[#2A1E0B] to-[#181206] border border-[#D4AF37]/70 hover:border-[#D4AF37] hover:bg-[#D4AF37]/20 text-[#FFF2B2] text-[11px] font-bold flex items-center justify-center space-x-1 cursor-pointer transition-all shadow-sm"
              >
                <span>👑 + tap to add ideas</span>
              </button>
            </div>
          </div>
        </div>

      {/* 3D GOLDEN TILT FLASHCARDS & MOTIVATION MODAL */}
      <div className={!qualitiesModalMode ? 'hidden' : ''}>
        <PredatorFlashcardsModal
          mode={qualitiesModalMode || 'panther'}
          onClose={() => setQualitiesModalMode(null)}
        />
      </div>

      {/* QUEEN EMPRESS MODAL */}
      {showQueenModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-[#141007] border-2 border-[#D4AF37] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.98)] text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#8C6D23] p-[2px] shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-[#0E0C08]">
                <img
                  src="/assets/aistudio/queen-portrait.jpg"
                  alt="Queen Crown"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <p className="text-[10px] tracking-widest text-[#D4AF37] uppercase font-cinzel font-bold">
                The One and Only
              </p>
              <h3 className="text-xl font-bold font-cinzel text-[#FFF3BE] mt-0.5">
                Versatility Queen
              </h3>
              <p className="text-xs text-[#AA771C] font-semibold mt-0.5">
                The Empire Builder
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#1B140A] border border-[#D4AF37]/30 text-left space-y-2">
              <p className="text-xs text-[#E5D7A3] italic font-serif leading-relaxed">
                "She builds empires in silence and rules with grace."
              </p>
              <p className="text-xs text-[#E5D7A3] italic font-serif leading-relaxed">
                "She remembered who she was and the game changed."
              </p>
            </div>

            <p className="text-xs text-[#A89878] leading-relaxed">
              Synchronize your mind with Panther stealth focus and Wolf alpha endurance to master all 5 subjects with zero backlog.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowQueenModal(false);
                  onNavigateToStudy();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg hover:opacity-95"
              >
                Launch Study Vault
              </button>
              <button
                onClick={() => setShowQueenModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#1E1910] border border-[#D4AF37]/30 text-[#C7B58B] hover:text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
