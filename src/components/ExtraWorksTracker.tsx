import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Trash2,
  Calendar,
  Flame,
  Award,
  Sparkles,
  Check,
  RotateCcw,
  WifiOff,
  Bell,
  Fingerprint,
  FileText,
  Edit2,
  X,
  TrendingUp,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatDateWithDay, getDayOfWeek, toISODateString, addDays } from '../utils/dateUtils';
import { ExtraTask } from '../types';
import { PomodoroTimer } from './PomodoroTimer';

export const ExtraWorksTracker: React.FC = () => {
  const {
    extraTasks,
    toggleExtraTask,
    addExtraTask,
    deleteExtraTask,
    setExtraTaskDailyNote,
    currentDate,
    notificationsEnabled,
    setNotificationsEnabled,
    lockVault,
  } = useStudy();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ExtraTask['category']>('routine');
  const [newIcon, setNewIcon] = useState('✨');

  // Daily Accomplishment Note Editing State
  const [editingNoteTaskId, setEditingNoteTaskId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState<string>('');

  // Compute 7 days consistency strip
  const past7Days = Array.from({ length: 7 }, (_, i) => addDays(currentDate, -(6 - i)));

  // Calculate Daily Accomplishment Meter
  const completedTodayCount = extraTasks.filter((t) => t.completedDates.includes(currentDate)).length;
  const totalTasksCount = extraTasks.length;
  const dailyProgressPercent =
    totalTasksCount > 0 ? Math.round((completedTodayCount / totalTasksCount) * 100) : 0;

  // Calculate 7-Day overall consistency percentage
  const totalChecksExpected = extraTasks.length * 7;
  const totalChecksDone = extraTasks.reduce((acc, task) => {
    const doneInPast7 = past7Days.filter((d) => task.completedDates.includes(d)).length;
    return acc + doneInPast7;
  }, 0);
  const consistencyPercent =
    totalChecksExpected > 0 ? Math.round((totalChecksDone / totalChecksExpected) * 100) : 0;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addExtraTask(newTitle.trim(), newCategory, newIcon);
    setNewTitle('');
    setShowAddModal(false);
  };

  const handleOpenNoteModal = (task: ExtraTask) => {
    setEditingNoteTaskId(task.id);
    const existingNote = task.dailyNotes?.[currentDate] || '';
    setEditingNoteText(existingNote);
  };

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNoteTaskId) {
      setExtraTaskDailyNote(editingNoteTaskId, currentDate, editingNoteText);
      setEditingNoteTaskId(null);
      setEditingNoteText('');
    }
  };

  const currentEditingTask = extraTasks.find((t) => t.id === editingNoteTaskId);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-6 pb-28">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1E180D] via-[#14110A] to-[#0A0906] border border-[#D4AF37]/50 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.85)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
              <CheckSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>EXTRA TOOLS & HABITS VAULT</span>
            </div>
            <h2 className="text-xl md:text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C6] via-[#D4AF37] to-[#AA771C] mt-1">
              Extra Tools Vault & Daily Accomplishment
            </h2>
            <p className="text-xs text-[#9E927A] mt-0.5">
              Quran, Meditation, Exercise, Book Reading, Personality, Drawing, Self Care & Daily Work Notes
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all cursor-pointer shadow-md"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ Add Extra Tool Task</span>
            </button>
          </div>
        </div>

        {/* Consistency Overview & Offline Status Bar */}
        <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-[#FFF2B2]">
              <Flame className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span>
                7-Day Consistency Rate:{' '}
                <strong className="text-[#D4AF37] font-mono text-sm">{consistencyPercent}%</strong>
              </span>
            </div>

            <div className="flex items-center space-x-1 text-emerald-400 font-medium">
              <WifiOff className="w-3.5 h-3.5" />
              <span>100% Offline Vault Active</span>
            </div>
          </div>

          {/* Biometric & Notification Quick Toggles */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs cursor-pointer ${
                notificationsEnabled
                  ? 'bg-[#221B10] border-[#D4AF37] text-[#FFF2B2]'
                  : 'bg-[#14110A] border-[#D4AF37]/20 text-[#8C8069]'
              }`}
              title="Toggle system revision notifications"
            >
              <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{notificationsEnabled ? 'Alerts ON' : 'Alerts OFF'}</span>
            </button>

            <button
              onClick={lockVault}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#14110A] border border-[#D4AF37]/30 text-[#FFF2B2] hover:border-[#D4AF37] text-xs cursor-pointer"
              title="Lock vault with fingerprint biometric verification"
            >
              <Fingerprint className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Lock Vault</span>
            </button>
          </div>
        </div>
      </div>

      {/* PROMINENT POMODORO TIMER (50M WORK / 10M BREAK) */}
      <PomodoroTimer />

      {/* DAILY PROGRESS BAR / ACCOMPLISHMENT METER */}
      <div className="rounded-2xl bg-[#141008] border-2 border-[#D4AF37]/60 p-4 shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs font-cinzel font-bold">
          <div className="flex items-center space-x-2 text-[#FFF3BE]">
            <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
            <span>TODAY'S DAILY ACCOMPLISHMENT METER</span>
          </div>
          <div className="flex items-center space-x-2 font-mono">
            <span className="text-[#A89878]">Completed Today:</span>
            <span className="text-sm text-[#D4AF37] font-bold px-2 py-0.5 rounded-md bg-[#231A0D] border border-[#D4AF37]/40">
              {completedTodayCount} / {totalTasksCount} ({dailyProgressPercent}%)
            </span>
          </div>
        </div>

        {/* 24K Pure Gold Animated Progress Bar */}
        <div className="w-full h-3 rounded-full bg-[#201A0E] border border-[#D4AF37]/30 overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#AA771C] via-[#FFDF00] to-[#FFF5C6] transition-all duration-500 rounded-full shadow-[0_0_15px_rgba(252,211,77,0.7)]"
            style={{ width: `${dailyProgressPercent}%` }}
          />
        </div>

        <p className="text-[11px] text-[#A89878] text-right font-serif">
          {dailyProgressPercent === 100
            ? '🏆 Sovereign Perfection! All extra tools & life habits completed today.'
            : dailyProgressPercent > 50
            ? '⚡ Exceptional momentum! Keep checking off rest & life routines.'
            : '🎯 Complete your extra tasks and write daily work notes below.'}
        </p>
      </div>

      {/* 7-DAY CONSISTENCY MATRIX BAR */}
      <div className="rounded-2xl bg-[#120F0A] border border-[#D4AF37]/30 p-4 shadow-md space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-cinzel font-bold text-[#FFF3BE] uppercase tracking-wider">
            Day-to-Day Consistency Tracker
          </span>
          <span className="text-[#8C8069] text-[11px]">
            Today: {formatDateWithDay(currentDate)}
          </span>
        </div>

        {/* 7 Days Matrix Header */}
        <div className="grid grid-cols-7 gap-1.5 text-center font-mono text-[10px]">
          {past7Days.map((dateStr) => {
            const isToday = dateStr === currentDate;
            const completedCount = extraTasks.filter((t) =>
              t.completedDates.includes(dateStr)
            ).length;
            const allDone = extraTasks.length > 0 && completedCount === extraTasks.length;

            return (
              <div
                key={dateStr}
                className={`p-2 rounded-xl border flex flex-col items-center justify-between space-y-1 ${
                  isToday
                    ? 'bg-[#261F13] border-[#D4AF37] text-[#FFF4C2] font-bold shadow-sm'
                    : 'bg-[#15120B] border-[#D4AF37]/15 text-[#8C8069]'
                }`}
              >
                <span>{getDayOfWeek(dateStr).slice(0, 3)}</span>
                <span className="text-xs text-[#E5D7A3]">{dateStr.split('-')[2]}</span>
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold ${
                    allDone
                      ? 'bg-[#D4AF37] text-black'
                      : completedCount > 0
                      ? 'bg-[#2B2213] text-[#D4AF37] border border-[#D4AF37]/40'
                      : 'bg-black/60 text-[#5A5040]'
                  }`}
                >
                  {completedCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DAILY EXTRA WORKS & REST CHECKLIST WITH ACCOMPLISHMENT NOTES */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-cinzel font-bold text-[#D4AF37] uppercase tracking-wider">
          <span>Today's Extra Tools & Daily Work Notes</span>
          <span className="text-[11px] text-[#8C8069] font-normal font-sans">
            Tap circle to mark complete • Tap 📝 Note to record work
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {extraTasks.map((task) => {
            const isDoneToday = task.completedDates.includes(currentDate);
            const timesIn7Days = past7Days.filter((d) => task.completedDates.includes(d)).length;
            const loggedNote = task.dailyNotes?.[currentDate];

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between gap-3 shadow-md ${
                  isDoneToday
                    ? 'bg-gradient-to-r from-[#1C180F] to-[#120F0A] border-emerald-500/50 text-white'
                    : 'bg-[#14110A] border-[#D4AF37]/25 hover:border-[#D4AF37]/60 text-[#A89878]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div
                    onClick={() => toggleExtraTask(task.id, currentDate)}
                    className="flex items-center space-x-3 overflow-hidden cursor-pointer flex-1"
                  >
                    <div
                      className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        isDoneToday
                          ? 'bg-emerald-500 border-emerald-400 text-black shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                          : 'border-[#6B6150] bg-black/40 text-transparent'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center space-x-2">
                        <span className="text-base">{task.icon}</span>
                        <h4
                          className={`font-semibold text-xs truncate ${
                            isDoneToday ? 'text-[#FFF2B2] line-through opacity-80' : 'text-[#FFF3BE]'
                          }`}
                        >
                          {task.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#7A705E] mt-0.5 font-mono">
                        {timesIn7Days} of 7 days completed this week
                      </p>
                    </div>
                  </div>

                  {/* Actions: Add/Edit Note & Delete */}
                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => handleOpenNoteModal(task)}
                      className="px-2 py-1 rounded-lg bg-[#221B10] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all text-[10px] font-semibold flex items-center space-x-1 cursor-pointer"
                      title="Add or edit daily accomplishment note for this task"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>{loggedNote ? 'Edit Note' : '+ Note'}</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Delete "${task.title}"?`)) {
                          deleteExtraTask(task.id);
                        }
                      }}
                      className="text-[#5A5040] hover:text-red-400 p-1 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Display Logged Daily Work Note if Present */}
                {loggedNote ? (
                  <div
                    onClick={() => handleOpenNoteModal(task)}
                    className="p-2.5 rounded-xl bg-[#1C160C] border border-[#D4AF37]/30 text-xs text-[#FFF3BE] space-y-0.5 cursor-pointer hover:border-[#D4AF37] transition-colors"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#D4AF37] font-mono font-semibold">
                      <span>📝 DAILY WORK NOTE ({currentDate}):</span>
                      <span className="text-[9px] text-[#8C8069]">Tap to Edit</span>
                    </div>
                    <p className="font-serif leading-relaxed italic text-[#E5D8B2]">
                      "{loggedNote}"
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOpenNoteModal(task)}
                    className="text-left text-[11px] text-[#7A705E] italic hover:text-[#D4AF37] transition-colors"
                  >
                    + Click to record what you worked on today (e.g., "Read Surah Yaseen", "20 Pushups")...
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* EDIT DAILY NOTE MODAL */}
      {editingNoteTaskId && currentEditingTask && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14110A] border border-[#D4AF37]/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{currentEditingTask.icon}</span>
                <div>
                  <h4 className="font-cinzel text-sm font-bold text-[#FFF3BE]">
                    Daily Work Note: {currentEditingTask.title}
                  </h4>
                  <p className="text-[10px] text-[#8C8069] font-mono">Date: {currentDate}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingNoteTaskId(null)}
                className="text-[#8C8069] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNoteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">
                  What did you accomplish for this task on {currentDate}?
                </label>
                <textarea
                  rows={3}
                  required
                  autoFocus
                  placeholder="e.g. Read Surah Yaseen with tajweed / 30 mins drawing practice..."
                  value={editingNoteText}
                  onChange={(e) => setEditingNoteText(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl p-3 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingNoteTaskId(null)}
                  className="px-3 py-1.5 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-md"
                >
                  Save Daily Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD EXTRA TASK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14110A] border border-[#D4AF37]/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
            <h4 className="font-cinzel text-base font-bold text-[#FFF3BE] pb-2 border-b border-[#D4AF37]/20">
              Add Rest Task / Extra Work
            </h4>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Habit / Task Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. 30-Minute Quran / Book Reading"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C7B58B] mb-1 font-semibold">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ExtraTask['category'])}
                    className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none"
                  >
                    <option value="rest">Rest & Recovery</option>
                    <option value="health">Health & Hydration</option>
                    <option value="routine">Environment & Discipline</option>
                    <option value="study_prep">Study Setup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C7B58B] mb-1 font-semibold">Icon Emoji</label>
                  <input
                    type="text"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-md"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
