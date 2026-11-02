import React, { useState } from 'react';
import { Home, FileText, BookOpen, BarChart3, User, ChevronUp, ChevronDown } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export type NavTab = 'home' | 'library' | 'study' | 'insights' | 'backlog';

interface BottomNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const { stats } = useStudy();
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const navItems = [
    {
      id: 'home' as NavTab,
      label: '👑 Home',
      icon: Home,
    },
    {
      id: 'library' as NavTab,
      label: '⚜️ Library',
      icon: FileText,
    },
    {
      id: 'study' as NavTab,
      label: '⚡ Study',
      icon: BookOpen,
      badge: stats.dueTodayCount > 0 ? stats.dueTodayCount : null,
      badgeColor: 'bg-[#D4AF37] text-black font-bold animate-pulse',
    },
    {
      id: 'insights' as NavTab,
      label: '✨ Insights',
      icon: BarChart3,
      badge: `${stats.overallProgressPercent}%`,
      badgeColor: 'bg-[#221B10] text-[#D4AF37] border border-[#D4AF37]/30 text-[9px]',
    },
    {
      id: 'backlog' as NavTab,
      label: '🪙 Profile',
      icon: User,
      badge: stats.backlogCount > 0 ? stats.backlogCount : null,
      badgeColor: 'bg-red-500 text-white font-bold',
    },
  ];

  return (
    <nav
      className={`fixed left-0 right-0 z-40 bg-[#0A0805]/95 backdrop-blur-lg border-t border-[#D4AF37]/25 mx-auto max-w-lg md:max-w-2xl md:rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.9)] transition-all duration-300 ${
        isMinimized ? '-bottom-10' : 'bottom-0'
      } px-1.5 py-1`}
    >
      {/* Toggle button on top edge of nav: 1 click to slide down / slide up */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="w-7 h-5 rounded-t-xl bg-[#141007] border-t border-x border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] hover:bg-[#20190D] cursor-pointer shadow-md transition-transform"
          title={isMinimized ? 'Tap to slide up bottom menu' : 'Tap to hide/minimize bottom menu'}
        >
          {isMinimized ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const IconComponent = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center py-0.5 px-2 rounded-lg transition-all cursor-pointer ${
                isActive ? 'text-[#FFF2B2]' : 'text-[#7A705E] hover:text-[#C7B58B]'
              }`}
            >
              <div className="relative">
                <IconComponent
                  className={`w-4.5 h-4.5 transition-transform duration-300 ${
                    isActive ? 'scale-110 text-[#D4AF37]' : 'text-[#7A705E]'
                  }`}
                />
                {item.badge !== null && item.badge !== undefined && (
                  <span
                    className={`absolute -top-1 -right-2 px-1 py-0.1 min-w-3.5 text-center rounded-full text-[9px] leading-tight ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[8.5px] mt-0.5 tracking-wider uppercase transition-colors ${
                  isActive ? 'font-bold text-[#D4AF37]' : 'font-normal'
                }`}
              >
                {item.label}
              </span>

              {isActive && (
                <div className="absolute -bottom-1 w-5 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-full"></div>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
