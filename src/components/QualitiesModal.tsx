import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Shield,
  Check,
  CheckCircle2,
  Search,
  Zap,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { ModeQuality } from '../types';

interface QualitiesModalProps {
  mode: 'panther' | 'wolf';
  onClose: () => void;
}

export const QualitiesModal: React.FC<QualitiesModalProps> = ({ mode, onClose }) => {
  const { qualities, toggleQualitySync, ideas, addIdea, deleteIdea } = useStudy();
  const [activeTab, setActiveTab] = useState<'qualities' | 'custom'>('qualities');
  const [searchQuery, setSearchQuery] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [customContent, setCustomContent] = useState('');

  const isPanther = mode === 'panther';
  const modeTitle = isPanther ? 'Panther Mode' : 'Wolf Mode';
  const modeSubtitle = isPanther
    ? 'My Dangerous Efficient Qualities (20 Actionable Rules)'
    : 'My Leader Qualities (20 Actionable Rules)';
  const modeIcon = isPanther ? '🐆' : '🐺';

  // Filter 20 qualities for this mode
  const modeQualities = qualities.filter((q) => q.mode === mode);
  const syncCount = modeQualities.filter((q) => q.synchronized).length;

  const filteredQualities = modeQualities.filter((q) => {
    if (!searchQuery.trim()) return true;
    const qStr = searchQuery.toLowerCase();
    return (
      q.title.toLowerCase().includes(qStr) ||
      q.easyRule.toLowerCase().includes(qStr) ||
      q.urduSummary.toLowerCase().includes(qStr) ||
      q.category.toLowerCase().includes(qStr)
    );
  });

  const modeIdeas = ideas.filter((i) => i.mode === mode);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customContent.trim()) return;
    addIdea(mode, customTitle.trim(), customContent.trim());
    setCustomTitle('');
    setCustomContent('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-2xl h-[92vh] rounded-2xl bg-[#120F0A] border border-[#D4AF37]/50 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/25 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{modeIcon}</span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C6] via-[#D4AF37] to-[#AA771C]">
                  {modeTitle}
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#261F13] border border-[#D4AF37]/40 text-[#D4AF37]">
                  20 Core Rules
                </span>
              </div>
              <p className="text-xs text-[#9E927A] mt-0.5">{modeSubtitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#8C8069] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Synchronization Status Bar */}
        <div className="my-3 p-3 rounded-xl bg-gradient-to-r from-[#1E180D] to-[#14110A] border border-[#D4AF37]/30 flex flex-wrap items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
            <span className="text-[#FFF2B2] font-semibold">
              Synchronized With Me Today:{' '}
              <strong className="text-[#D4AF37] font-mono text-sm">
                {syncCount} / 20 Qualities
              </strong>
            </span>
          </div>

          {/* Mini progress bar */}
          <div className="w-32 bg-black/60 h-2 rounded-full overflow-hidden border border-[#D4AF37]/20">
            <div
              className="h-full bg-gradient-to-r from-[#AA771C] to-[#D4AF37] rounded-full transition-all duration-300"
              style={{ width: `${(syncCount / 20) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs & Search */}
        <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/15 shrink-0 gap-2">
          <div className="flex items-center space-x-2 text-xs">
            <button
              onClick={() => setActiveTab('qualities')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                activeTab === 'qualities'
                  ? 'bg-[#2A2112] border border-[#D4AF37] text-[#FFF4C2] font-bold shadow-sm'
                  : 'text-[#8C8069] hover:text-white'
              }`}
            >
              20 Study Qualities ({modeQualities.length})
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                activeTab === 'custom'
                  ? 'bg-[#2A2112] border border-[#D4AF37] text-[#FFF4C2] font-bold shadow-sm'
                  : 'text-[#8C8069] hover:text-white'
              }`}
            >
              My Custom Tactics ({modeIdeas.length})
            </button>
          </div>

          {activeTab === 'qualities' && (
            <div className="relative w-44 sm:w-56">
              <Search className="w-3 h-3 text-[#7A705E] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search quality..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#18140D] border border-[#D4AF37]/25 rounded-lg pl-7 pr-2 py-1 text-xs text-[#FFF2B2] placeholder-[#6B6150] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          )}
        </div>

        {/* Main Content List */}
        <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1">
          {activeTab === 'qualities' ? (
            filteredQualities.map((q) => {
              const isSync = q.synchronized;

              return (
                <div
                  key={q.id}
                  onClick={() => toggleQualitySync(q.id)}
                  className={`group relative rounded-xl p-3.5 transition-all duration-200 border cursor-pointer flex items-start justify-between gap-3 ${
                    isSync
                      ? 'bg-gradient-to-r from-[#20190E] to-[#15120B] border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.25)]'
                      : 'bg-[#15120B] border-[#D4AF37]/20 hover:border-[#D4AF37]/50 text-[#8C8069]'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-black/60 border border-[#D4AF37]/30 flex items-center justify-center font-mono text-[10px] font-bold text-[#D4AF37]">
                        {q.num}
                      </span>
                      <h4
                        className={`font-cinzel text-sm font-bold ${
                          isSync ? 'text-[#FFF3BE]' : 'text-[#C7B58B]'
                        }`}
                      >
                        {q.title}
                      </h4>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-[#A89878]">
                        {q.category}
                      </span>
                    </div>

                    <p className="text-xs text-[#E5D7A3] font-serif leading-relaxed pl-7">
                      {q.easyRule}
                    </p>

                    <p className="text-[11px] text-[#A89878] italic pl-7">
                      Urdu: "{q.urduSummary}"
                    </p>
                  </div>

                  {/* Synchronize Checkbox Button */}
                  <div className="shrink-0 mt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleQualitySync(q.id);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center space-x-1 transition-all cursor-pointer border ${
                        isSync
                          ? 'bg-[#D4AF37] text-black font-bold border-[#D4AF37] shadow-sm'
                          : 'bg-[#1B1710] border-[#D4AF37]/30 text-[#8C8069] group-hover:text-white group-hover:border-[#D4AF37]'
                      }`}
                    >
                      <Check className={`w-3 h-3 stroke-[3] ${isSync ? 'text-black' : ''}`} />
                      <span>{isSync ? 'Synchronized' : 'Sync'}</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            /* Custom Tactics Tab */
            <div className="space-y-4">
              <form onSubmit={handleCustomSubmit} className="p-4 rounded-xl bg-[#16120B] border border-[#D4AF37]/35 space-y-3 text-xs">
                <span className="font-cinzel font-bold text-[#FFF3BE] block">
                  Add Personal Study Principle
                </span>
                <div>
                  <label className="block text-[#C7B58B] mb-1 font-semibold">Tactic Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100 MCQs Daily Non-Negotiable"
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    className="w-full bg-[#1C1710] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-[#C7B58B] mb-1 font-semibold">Action Rule</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Write the specific rule in easy words..."
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                    className="w-full bg-[#1C1710] border border-[#D4AF37]/30 rounded-xl p-2.5 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-sm flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Save Tactic</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2">
                {modeIdeas.map((idea) => (
                  <div
                    key={idea.id}
                    className="p-3.5 rounded-xl bg-[#18140D] border border-[#D4AF37]/25 space-y-1"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-cinzel font-bold text-[#FFF3BE]">{idea.title}</h4>
                      <button
                        onClick={() => deleteIdea(idea.id)}
                        className="text-[#6B6150] hover:text-red-400 p-0.5 cursor-pointer"
                        title="Delete tactic"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-[#DDD0B3] font-serif">{idea.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between shrink-0 text-xs">
          <span className="text-[#8C8069]">
            {syncCount} of 20 qualities active in your mind
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#221B10] border border-[#D4AF37] text-xs font-semibold text-[#FFF2B2] hover:bg-[#2B2316] transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
