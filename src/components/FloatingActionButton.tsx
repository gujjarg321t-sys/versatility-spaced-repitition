import React, { useState } from 'react';
import {
  Plus,
  X,
  Folder,
  FolderPlus,
  FileText,
  CalendarPlus,
  CheckSquare,
} from 'lucide-react';

interface FloatingActionButtonProps {
  onNewFolder: () => void;
  onNewSubfolder: () => void;
  onNewPdf: () => void;
  onNewTask: () => void;
  onNewExtraTask: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onNewFolder,
  onNewSubfolder,
  onNewPdf,
  onNewTask,
  onNewExtraTask,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-20 right-4 sm:right-8 z-40 flex flex-col items-end">
      {/* Top-to-Bottom Expanded Action Stack */}
      {isOpen && (
        <div className="mb-3 flex flex-col space-y-2 items-end animate-fade-in select-none">
          {/* Option 1: Add Today Study Task */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNewTask();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1C1710] border border-[#D4AF37]/60 text-xs font-semibold text-[#FFF3BE] shadow-[0_4px_15px_rgba(0,0,0,0.8)] hover:bg-[#2A2113] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <span>+ Add Today Study Task</span>
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center font-bold">
              <CalendarPlus className="w-4 h-4" />
            </div>
          </button>

          {/* Option 2: Add PDF Document */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNewPdf();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1C1710] border border-[#D4AF37]/60 text-xs font-semibold text-[#FFF3BE] shadow-[0_4px_15px_rgba(0,0,0,0.8)] hover:bg-[#2A2113] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <span>+ Add PDF Document</span>
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
          </button>

          {/* Option 3: New Nested Subfolder */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNewSubfolder();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1C1710] border border-[#D4AF37]/60 text-xs font-semibold text-[#FFF3BE] shadow-[0_4px_15px_rgba(0,0,0,0.8)] hover:bg-[#2A2113] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <span>+ New Subfolder</span>
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center font-bold">
              <FolderPlus className="w-4 h-4" />
            </div>
          </button>

          {/* Option 4: New Main Folder */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNewFolder();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1C1710] border border-[#D4AF37]/60 text-xs font-semibold text-[#FFF3BE] shadow-[0_4px_15px_rgba(0,0,0,0.8)] hover:bg-[#2A2113] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <span>+ New Main Folder</span>
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center font-bold">
              <Folder className="w-4 h-4" />
            </div>
          </button>

          {/* Option 5: Add Daily Rest / Extra Work */}
          <button
            onClick={() => {
              setIsOpen(false);
              onNewExtraTask();
            }}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#1C1710] border border-[#D4AF37]/60 text-xs font-semibold text-[#FFF3BE] shadow-[0_4px_15px_rgba(0,0,0,0.8)] hover:bg-[#2A2113] hover:border-[#D4AF37] transition-all cursor-pointer group"
          >
            <span>+ Add Daily Rest & Extra Work</span>
            <div className="w-7 h-7 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center font-bold">
              <CheckSquare className="w-4 h-4" />
            </div>
          </button>
        </div>
      )}

      {/* Main Yellow Plus Circular Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#B38728] via-[#FBF5B7] to-[#DAA520] text-black font-extrabold shadow-[0_0_25px_rgba(212,175,55,0.7)] flex items-center justify-center hover:scale-108 transition-all cursor-pointer active:scale-95"
        title="Add Folder, Subfolder, PDF, Task or Habit"
      >
        {isOpen ? (
          <X className="w-6 h-6 stroke-[3]" />
        ) : (
          <Plus className="w-7 h-7 stroke-[3]" />
        )}
      </button>
    </div>
  );
};
