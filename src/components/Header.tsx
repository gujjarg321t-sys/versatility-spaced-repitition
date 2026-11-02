import React, { useState } from 'react';
import { Shield, Bell, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatDateWithDay, getDayOfWeek, toISODateString } from '../utils/dateUtils';

export const Header: React.FC<{ onNavigateToStudy: () => void }> = ({ onNavigateToStudy }) => {
  const { currentDate, setCurrentDate, stats } = useStudy();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formattedDate = formatDateWithDay(currentDate);
  const dayName = getDayOfWeek(currentDate);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setCurrentDate(e.target.value);
      setShowDatePicker(false);
    }
  };

  const setTodayDate = () => {
    setCurrentDate(toISODateString(new Date()));
    setShowDatePicker(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-[#D4AF37]/20 px-4 py-2.5 transition-all">

      {/* Main Luxury Brand Bar */}
      <div className="flex items-center justify-between">
        {/* Brand Crest & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative group cursor-pointer">
            <div className="w-10 h-10 rounded-full border border-[#D4AF37] p-0.5 shadow-[0_0_12px_rgba(212,175,55,0.4)] overflow-hidden bg-black flex items-center justify-center">
              <img
                src="/assets/aistudio/app-icon_c51e9ee0.jpg"
                alt="Versatility Logo"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // Fallback to stylized gold V if image fails
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = '<span class="text-lg font-bold text-[#D4AF37]">V</span>';
                  }
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#0A0A0A] border border-[#D4AF37] rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-pulse"></span>
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg md:text-xl font-cinzel font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FFF2B2] via-[#D4AF37] to-[#996515]">
                VERSATILITY
              </h1>
            </div>
            <p className="text-[10px] tracking-[0.25em] text-[#C7A75C] uppercase font-light -mt-0.5">
              all in one
            </p>
          </div>
        </div>

        {/* Right Badges: Crest Icons & Due Today Alert */}
        <div className="flex items-center space-x-2">
          {/* Due Today Button */}
          {stats.dueTodayCount > 0 ? (
            <button
              onClick={onNavigateToStudy}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF37]/20 to-[#AA771C]/20 border border-[#D4AF37]/60 text-[#FFF2B2] text-xs font-medium hover:border-[#D4AF37] transition-all animate-pulse shadow-[0_0_10px_rgba(212,175,55,0.3)] cursor-pointer"
              title="Click to view revisions due today"
            >
              <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="font-semibold">{stats.dueTodayCount} Due Today</span>
            </button>
          ) : (
            <div className="hidden sm:flex items-center space-x-1 text-xs text-[#8A7E68]">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>All Revisions Done</span>
            </div>
          )}

          {/* Panther & Wolf Mini Logos */}
          <div className="flex items-center space-x-1 px-1.5 py-1 rounded-lg bg-[#14120D] border border-[#D4AF37]/30">
            <img src="/assets/aistudio/panther-logo.jpg" alt="Panther" className="w-5 h-5 rounded-full object-cover" />
            <span className="text-[#D4AF37]/40 text-xs">•</span>
            <img src="/assets/aistudio/wolf-logo.jpg" alt="Wolf" className="w-5 h-5 rounded-full object-cover" />
          </div>
        </div>
      </div>

      {/* Subheader: Private status & Date Simulation Bar */}
      <div className="mt-2.5 pt-2 border-t border-[#D4AF37]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#1A160F] text-[#D4AF37] border border-[#D4AF37]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] mr-1.5 animate-ping"></span>
            • PRIVATE
          </span>
          <span className="text-[#8E8470] text-[11px] hidden md:inline">
            Active Spaced Repetition Engine
          </span>
        </div>

        {/* Date Selector & Day display */}
        <div className="relative flex items-center space-x-2">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-[#16140E] border border-[#D4AF37]/30 text-[#E5D7A3] hover:border-[#D4AF37] transition-colors cursor-pointer text-xs"
            title="Click to change date for testing reminders"
          >
            <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="font-medium text-[#FFF4C2]">{formattedDate}</span>
            <ChevronDown className="w-3 h-3 text-[#A39882]" />
          </button>

          {showDatePicker && (
            <div className="absolute right-0 top-full mt-1.5 w-64 bg-[#12100B] border border-[#D4AF37]/40 rounded-xl p-3 shadow-[0_10px_30px_rgba(0,0,0,0.9)] z-50">
              <p className="text-[11px] text-[#A39882] mb-2 font-medium">
                Simulate Date to Test 1d, 3d, 7d, 15d, 1m, 2m Reminders:
              </p>
              <input
                type="date"
                value={currentDate}
                onChange={handleDateChange}
                className="w-full bg-[#1A1711] border border-[#D4AF37]/40 rounded-md px-2 py-1.5 text-xs text-[#FFF2B2] mb-2 focus:outline-none focus:border-[#D4AF37]"
              />
              <div className="flex items-center justify-between text-[11px] pt-1">
                <button
                  onClick={setTodayDate}
                  className="text-[#D4AF37] hover:underline cursor-pointer font-medium"
                >
                  Reset to Live Today
                </button>
                <button
                  onClick={() => setShowDatePicker(false)}
                  className="text-[#8A7E68] hover:text-white cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
