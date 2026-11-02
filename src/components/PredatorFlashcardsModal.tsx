import React, { useState } from 'react';
import {
  X,
  RotateCw,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Flame,
  Shield,
  Plus,
  Trash2,
  Layers,
  Award,
  Zap,
  Eye,
  Crown,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import {
  PANTHER_FLASHCARDS,
  WOLF_FLASHCARDS,
  PANTHER_MOTIVATION_POINTS,
  WOLF_MOTIVATION_POINTS,
} from '../data/flashcardsData';
import { playRevisionChime } from '../utils/notifications';
import { PredatorFlashcard } from '../types';

interface PredatorFlashcardsModalProps {
  mode: 'panther' | 'wolf';
  onClose: () => void;
}

export const PredatorFlashcardsModal: React.FC<PredatorFlashcardsModalProps> = ({
  mode,
  onClose,
}) => {
  const { ideas, addIdea, deleteIdea } = useStudy();

  const isPanther = mode === 'panther';
  const rawCards = isPanther ? PANTHER_FLASHCARDS : WOLF_FLASHCARDS;
  const motivationPoints = isPanther ? PANTHER_MOTIVATION_POINTS : WOLF_MOTIVATION_POINTS;

  // Local state for adopted habits
  const [adoptedHabitIds, setAdoptedHabitIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(`versatility_adopted_${mode}`);
      if (stored) return JSON.parse(stored);
    } catch {}
    return isPanther ? ['panther_fc_1', 'panther_fc_2', 'panther_fc_6', 'panther_fc_10'] : ['wolf_fc_1', 'wolf_fc_2', 'wolf_fc_3', 'wolf_fc_6', 'wolf_fc_10'];
  });

  const toggleAdoptHabit = (id: string) => {
    setAdoptedHabitIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(`versatility_adopted_${mode}`, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const [activeTab, setActiveTab] = useState<'flashcards' | 'motivation' | 'ideas'>('flashcards');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Card View Modes: 'still' (flat), 'halfTilt' (45° angle peeking mode), '3dTilt' (mouse tracking)
  const [viewMode, setViewMode] = useState<'still' | 'halfTilt' | '3dTilt'>('still');
  const [mouseTilt, setMouseTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Custom Idea Form state
  const [newIdeaTitle, setNewIdeaTitle] = useState('');
  const [newIdeaContent, setNewIdeaContent] = useState('');

  const currentCard: PredatorFlashcard = rawCards[currentCardIndex] || rawCards[0];
  const isCurrentAdopted = adoptedHabitIds.includes(currentCard.id);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev + 1) % rawCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentCardIndex((prev) => (prev - 1 + rawCards.length) % rawCards.length);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (viewMode !== '3dTilt' || isFlipped) {
      if (mouseTilt.rotateX !== 0 || mouseTilt.rotateY !== 0) {
        setMouseTilt({ rotateX: 0, rotateY: 0 });
      }
      return;
    }
    const card = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - card.left;
    const y = e.clientY - card.top;
    const centerX = card.width / 2;
    const centerY = card.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setMouseTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setMouseTilt({ rotateX: 0, rotateY: 0 });
  };

  const handleAddCustomIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdeaTitle.trim() || !newIdeaContent.trim()) return;
    addIdea(mode, newIdeaTitle.trim(), newIdeaContent.trim());
    setNewIdeaTitle('');
    setNewIdeaContent('');
  };

  const modeIdeas = ideas.filter((i) => i.mode === mode);

  // Compute transform style based on viewMode & flip state
  const getCardTransform = () => {
    if (viewMode === 'halfTilt') {
      return `rotateY(${isFlipped ? 225 : 45}deg) rotateX(12deg) scale(0.96)`;
    }
    if (viewMode === '3dTilt') {
      return `rotateY(${isFlipped ? 180 : 0}deg) rotateX(${mouseTilt.rotateX}deg) rotateY(${mouseTilt.rotateY + (isFlipped ? 180 : 0)}deg)`;
    }
    return `rotateY(${isFlipped ? 180 : 0}deg)`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0C0A06] border-2 border-[#D4AF37]/70 rounded-3xl p-5 sm:p-7 shadow-[0_25px_80px_rgba(0,0,0,0.98)] text-[#F5EACB] relative my-auto transform-gpu transition-all">
        {/* Top Executive Header Bar with Royal Imperial Artwork */}
        <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/30">
          <div className="flex items-center space-x-3">
            {/* Imperial Royal Crest & Badge Framework */}
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FFF5C6] via-[#D4AF37] to-[#8C5D0D] p-[2px] shadow-[0_0_20px_rgba(212,175,55,0.6)] group">
              <div className="w-full h-full bg-black rounded-2xl flex items-center justify-center overflow-hidden relative">
                <img
                  src={isPanther ? '/assets/aistudio/panther-logo.jpg' : '/assets/aistudio/wolf-logo.jpg'}
                  alt={isPanther ? 'Panther Logo' : 'Wolf Logo'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-bold font-cinzel text-[#FFF3BE] tracking-wide flex items-center space-x-1.5">
                  <span>{isPanther ? 'ROYAL PANTHER APEX' : 'ALPHA WOLF SOVEREIGN'}</span>
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37]">
                  {isPanther ? 'Dangerous Efficiency' : 'Alpha Leadership'}
                </span>
              </div>
              <p className="text-xs text-[#AA9568]">
                {isPanther
                  ? 'Stealth Focus • 60 km/h Explosive Ambush • Zero Noise'
                  : 'Marathon Endurance • 400 PSI Drive • Territory Sovereignty'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#1F190E] border border-[#D4AF37]/30 flex items-center justify-center text-[#C7B58B] hover:text-white hover:border-[#D4AF37] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between mt-4 p-1.5 rounded-2xl bg-[#141007] border border-[#D4AF37]/25 gap-1">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold shadow-md'
                : 'text-[#A89878] hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Golden Flashcards ({rawCards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('motivation')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'motivation'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold shadow-md'
                : 'text-[#A89878] hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>10 Motivation Decrees</span>
          </button>

          <button
            onClick={() => setActiveTab('ideas')}
            className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
              activeTab === 'ideas'
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold shadow-md'
                : 'text-[#A89878] hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>My Ideas ({modeIdeas.length})</span>
          </button>
        </div>

        {/* TAB 1: 3D GOLDEN TILT FLASHCARDS */}
        {activeTab === 'flashcards' && (
          <div className="mt-5 space-y-4">
            {/* Progress & View Mode Selectors */}
            <div className="flex flex-wrap items-center justify-between text-xs px-1 text-[#C7B58B] gap-2">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#FFF3BE]">
                  Card {currentCardIndex + 1} of {rawCards.length}
                </span>
                <span className="text-[#8C7A52]">•</span>
                <span className="text-[#D4AF37]">{currentCard.animalTrait}</span>
              </div>

              {/* View Mode Mode Toggles: Still Mode, Half Tilt (45° Isometric), 3D Mouse Tilt */}
              <div className="flex items-center space-x-1 bg-[#1A140A] p-1 rounded-xl border border-[#D4AF37]/30 text-[10px]">
                <button
                  type="button"
                  onClick={() => setViewMode('still')}
                  className={`px-2 py-0.5 rounded-lg font-semibold cursor-pointer transition-all ${
                    viewMode === 'still'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-[#8C8069] hover:text-white'
                  }`}
                  title="Flat 2D View: Best for crystal clear reading"
                >
                  🔒 Still
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('halfTilt')}
                  className={`px-2 py-0.5 rounded-lg font-semibold cursor-pointer transition-all flex items-center space-x-1 ${
                    viewMode === 'halfTilt'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-[#8C8069] hover:text-white'
                  }`}
                  title="Half Tilt 📐: 45° Angle Peeking Mode to inspect question & answer simultaneously!"
                >
                  <Eye className="w-3 h-3" />
                  <span>📐 Half Tilt (45°)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('3dTilt')}
                  className={`px-2 py-0.5 rounded-lg font-semibold cursor-pointer transition-all ${
                    viewMode === '3dTilt'
                      ? 'bg-[#D4AF37] text-black font-bold'
                      : 'text-[#8C8069] hover:text-white'
                  }`}
                  title="3D Mouse Tilt: Dynamic perspective as mouse moves"
                >
                  ✨ 3D Tilt
                </button>
              </div>
            </div>

            {/* 3D TILT & FLIP CARD CONTAINER */}
            <div
              className="perspective-[1400px] w-full min-h-[380px] sm:min-h-[410px] cursor-pointer"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onClick={handleCardClick}
            >
              <div
                className="relative w-full h-full min-h-[380px] sm:min-h-[410px] transition-transform duration-700 rounded-3xl"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: getCardTransform(),
                }}
              >
                {/* FRONT OF CARD (Question & Royal Imperial Emblem) */}
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1C160B] via-[#120E06] to-[#0A0804] border-2 border-[#D4AF37] p-6 sm:p-8 flex flex-col justify-between shadow-[0_15px_40px_rgba(212,175,55,0.25)] select-none backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Top card watermark & number */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-cinzel font-bold tracking-widest text-[#D4AF37] uppercase flex items-center space-x-1.5">
                      <Crown className="w-4 h-4 text-[#FFD700]" />
                      <span>{isPanther ? 'ROYAL PANTHER INQUIRY' : 'ROYAL ALPHA WOLF INQUIRY'}</span>
                    </span>
                    <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#2A200F] border border-[#D4AF37]/50 text-[#FFF2B2]">
                      #{currentCard.cardNum} / 10
                    </span>
                  </div>

                  {/* Center Question with Royal Emblem Framing */}
                  <div className="my-auto py-2 text-center space-y-3">
                    <div className="relative inline-block mx-auto">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#8C5D0D] to-black p-[2px] mx-auto shadow-[0_0_20px_rgba(212,175,55,0.5)]">
                        <div className="w-full h-full bg-[#1A140B] rounded-2xl flex items-center justify-center text-3xl">
                          {currentCard.icon}
                        </div>
                      </div>
                    </div>

                    <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-xs font-semibold text-[#E6CD85]">
                      {currentCard.animalTrait}
                    </div>

                    <h4 className="font-cinzel text-lg sm:text-xl font-bold text-[#FFF6CF] leading-relaxed px-2">
                      "{currentCard.question}"
                    </h4>
                  </div>

                  {/* Bottom hint to tilt/flip */}
                  <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between text-xs text-[#AA9568]">
                    <span className="flex items-center space-x-1.5 text-[#D4AF37]">
                      <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
                      <span>Tap Card to Reveal Apex Secret & Habit</span>
                    </span>
                    <span className="text-[10px] text-[#8C7A52] uppercase font-bold tracking-wider">
                      Tap Anywhere ↺
                    </span>
                  </div>
                </div>

                {/* BACK OF CARD (Answer + Habit to Adopt + Motivation Quote) */}
                <div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#1E170A] via-[#140F06] to-[#0D0A05] border-2 border-[#D4AF37] p-5 sm:p-7 flex flex-col justify-between shadow-[0_15px_40px_rgba(212,175,55,0.35)] select-none backface-hidden overflow-y-auto"
                  style={{
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                  }}
                  onClick={(e) => e.stopPropagation()} // allow clicking checkbox without flipping
                >
                  {/* Top info */}
                  <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/25">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{currentCard.icon}</span>
                      <span className="text-xs font-bold text-[#D4AF37] font-cinzel uppercase">
                        Apex Breakdown & Habit
                      </span>
                    </div>
                    <button
                      onClick={handleCardClick}
                      className="px-2.5 py-1 rounded-lg bg-[#2B210F] border border-[#D4AF37]/40 text-[10px] text-[#FFF0B3] flex items-center space-x-1 cursor-pointer hover:bg-[#D4AF37]/20"
                    >
                      <RotateCw className="w-3 h-3" />
                      <span>Back to Question</span>
                    </button>
                  </div>

                  {/* Apex Psychological / Biological Explanation */}
                  <div className="space-y-3 py-2 text-xs">
                    <div>
                      <p className="text-[11px] font-bold text-[#C7B58B] uppercase tracking-wider mb-1 flex items-center space-x-1">
                        <Flame className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>The Predator's Secret:</span>
                      </p>
                      <p className="text-[#E8DCB8] leading-relaxed bg-[#191309] p-3 rounded-xl border border-[#D4AF37]/20">
                        {currentCard.answer}
                      </p>
                    </div>

                    {/* HABIT TO ADAPT */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#2B210F] to-[#1E170B] border-2 border-[#D4AF37] shadow-md space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#FFF2B2] uppercase tracking-wider flex items-center space-x-1.5">
                          <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>Habit to Choose for Studying:</span>
                        </span>

                        <button
                          type="button"
                          onClick={() => toggleAdoptHabit(currentCard.id)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                            isCurrentAdopted
                              ? 'bg-emerald-600/90 text-white border border-emerald-400'
                              : 'bg-[#18130A] text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/20'
                          }`}
                        >
                          {isCurrentAdopted ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-white" />
                              <span>Habit Adopted ✓</span>
                            </>
                          ) : (
                            <>
                              <Circle className="w-3 h-3" />
                              <span>Adopt This Habit</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs font-semibold text-[#FFF7D4] leading-relaxed">
                        {currentCard.habitToAdopt}
                      </p>
                    </div>

                    {/* Motivation Decree */}
                    <p className="text-[11px] italic text-[#C4B287] font-serif bg-[#120E06] p-2.5 rounded-lg border-l-2 border-[#D4AF37]">
                      "{currentCard.motivationQuote}"
                    </p>
                  </div>

                  {/* Flip back footer */}
                  <div className="pt-2 border-t border-[#D4AF37]/20 flex items-center justify-between text-[11px] text-[#A89878]">
                    <span>Card #{currentCard.cardNum} of 10</span>
                    <button
                      onClick={handleCardClick}
                      className="text-[#D4AF37] hover:underline cursor-pointer font-semibold flex items-center space-x-1"
                    >
                      <span>Flip Back</span>
                      <RotateCw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls: Prev, Next, Thumbnails */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handlePrev}
                className="px-4 py-2.5 rounded-xl bg-[#1F180C] border border-[#D4AF37]/40 text-xs font-bold text-[#FFF0B3] flex items-center space-x-1 hover:bg-[#D4AF37]/20 cursor-pointer transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Card</span>
              </button>

              {/* Dot Indicators */}
              <div className="flex items-center space-x-1">
                {rawCards.map((c, idx) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setIsFlipped(false);
                      setCurrentCardIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                      currentCardIndex === idx
                        ? 'w-5 bg-[#D4AF37]'
                        : adoptedHabitIds.includes(c.id)
                        ? 'bg-emerald-500/80'
                        : 'bg-[#3A2E17]'
                    }`}
                    title={`Card ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold text-xs flex items-center space-x-1 hover:opacity-95 cursor-pointer shadow-md transition-all"
              >
                <span>Next Card</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: 10 EXECUTIVE MOTIVATION DECREES */}
        {activeTab === 'motivation' && (
          <div className="mt-4 space-y-3 max-h-[480px] overflow-y-auto pr-1">
            <div className="p-3 rounded-xl bg-[#1C150A] border border-[#D4AF37]/30 flex items-center justify-between">
              <div>
                <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE]">
                  10 Imperial Motivation Decrees
                </h4>
                <p className="text-[11px] text-[#A89878]">
                  Read these daily to calibrate your mindset into sovereign academic dominance.
                </p>
              </div>
              <span className="text-2xl">{isPanther ? '🐆' : '🐺'}</span>
            </div>

            <div className="space-y-2.5">
              {motivationPoints.map((point) => (
                <div
                  key={point.id}
                  className="p-3.5 rounded-2xl bg-[#141007] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-full bg-[#2B200F] border border-[#D4AF37] flex items-center justify-center text-xs font-bold font-mono text-[#FFF2B2]">
                        {point.num}
                      </span>
                      <h5 className="font-cinzel text-xs font-bold text-[#FFF2B2] tracking-wide">
                        {point.title}
                      </h5>
                    </div>
                    <span className="text-base">{point.icon}</span>
                  </div>

                  <p className="text-xs text-[#EADBB5] font-serif leading-relaxed italic bg-[#1A1409] p-2.5 rounded-xl border-l-2 border-[#D4AF37]">
                    "{point.decree}"
                  </p>

                  <div className="p-2 rounded-lg bg-[#0F0C06] border border-[#D4AF37]/15">
                    <p className="text-[11px] text-[#AA9568] leading-relaxed">
                      <span className="text-[#D4AF37] font-semibold">Urdu Guide: </span>
                      {point.urduExplanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOM IDEAS & NOTES */}
        {activeTab === 'ideas' && (
          <div className="mt-4 space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {/* Add Idea Form */}
            <form onSubmit={handleAddCustomIdea} className="p-4 rounded-2xl bg-[#171208] border border-[#D4AF37]/40 space-y-3">
              <h4 className="font-cinzel text-xs font-bold text-[#FFF2B2] flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-[#D4AF37]" />
                <span>Record New Personal Strategy or Idea</span>
              </h4>

              <div>
                <label className="block text-[11px] text-[#C7B58B] mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5:00 AM Physics Ambush Rule"
                  value={newIdeaTitle}
                  onChange={(e) => setNewIdeaTitle(e.target.value)}
                  className="w-full bg-[#0E0B05] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[11px] text-[#C7B58B] mb-1">Habit / Rule Detail</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Explain how you will execute this to stay consistent..."
                  value={newIdeaContent}
                  onChange={(e) => setNewIdeaContent(e.target.value)}
                  className="w-full bg-[#0E0B05] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 cursor-pointer shadow-md"
              >
                + Save Custom Idea
              </button>
            </form>

            {/* List of Custom Ideas */}
            <div className="space-y-2">
              <h5 className="text-xs font-semibold text-[#AA9568] uppercase tracking-wider">
                Saved Ideas & Habits ({modeIdeas.length})
              </h5>

              {modeIdeas.length === 0 ? (
                <p className="text-xs text-[#8C8069] text-center py-6">
                  No custom ideas added yet. Use the form above to record your personal study rules!
                </p>
              ) : (
                modeIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3 rounded-xl bg-[#141007] border border-[#D4AF37]/30 flex items-start justify-between space-x-2"
                  >
                    <div className="space-y-1">
                      <h6 className="font-cinzel text-xs font-bold text-[#FFF2B2]">{idea.title}</h6>
                      <p className="text-xs text-[#E0D1AA]">{idea.content}</p>
                      <span className="text-[10px] text-[#8C7A52]">{idea.date}</span>
                    </div>
                    <button
                      onClick={() => deleteIdea(idea.id)}
                      className="text-[#8C8069] hover:text-red-400 p-1 cursor-pointer"
                      title="Delete idea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
