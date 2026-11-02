import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  AlertCircle,
  Sparkles,
  ChevronRight,
  MoreVertical,
  Trash2,
  RotateCcw,
  BookOpen,
  CalendarCheck2,
  Tag,
  Check,
  Bell,
  BellRing,
  Volume2,
  Crown,
  X,
  Flame,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { Task, RevisionStage, RevisionInterval, SubjectId } from '../types';
import {
  formatDateWithDay,
  formatShortDate,
  getDayOfWeek,
  isPastDate,
  isSameDay,
  daysDifference,
} from '../utils/dateUtils';
import {
  playRevisionChime,
  sendRevisionNotification,
  requestNotificationPermission,
} from '../utils/notifications';
import { AddTaskModal } from './AddTaskModal';
import { PomodoroTimer } from './PomodoroTimer';

export const StudyTasksView: React.FC = () => {
  const {
    tasks,
    subjects,
    currentDate,
    toggleStage,
    deleteTask,
    rescheduleStage,
    postponeStage,
    setTaskReminder,
    clearTaskReminder,
    stats,
  } = useStudy();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'due_today' | 'active' | 'completed'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Reminder & Commitment Modal State
  const [reminderModalTask, setReminderModalTask] = useState<Task | null>(null);
  const [reminderTime, setReminderTime] = useState<string>('08:00 PM');
  const [reminderNote, setReminderNote] = useState<string>(
    'Main aaj is task ki revision zaroor complete karoon gi'
  );
  const [reminderSuccessBanner, setReminderSuccessBanner] = useState<string | null>(null);

  // Today's formatted string
  const todayFormatted = formatDateWithDay(currentDate);
  const todayDay = getDayOfWeek(currentDate);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by subject
      if (selectedSubject !== 'all' && task.subjectId !== selectedSubject) {
        return false;
      }

      // Filter by status tab
      if (activeFilter === 'due_today') {
        const hasDueToday = task.stages.some(
          (st) => !st.completed && isSameDay(st.scheduledDate, currentDate)
        );
        if (!hasDueToday) return false;
      } else if (activeFilter === 'active') {
        if (task.isCompleted) return false;
      } else if (activeFilter === 'completed') {
        if (!task.isCompleted) return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesChapter = task.chapter?.toLowerCase().includes(query);
        const matchesTags = task.tags?.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesChapter && !matchesTags) return false;
      }

      return true;
    });
  }, [tasks, selectedSubject, activeFilter, searchQuery, currentDate]);

  // Subject helper
  const getSubject = (subId: string) => subjects.find((s) => s.id === subId);

  // Determine stage visual status
  const getStageStatus = (stage: RevisionStage) => {
    if (stage.completed) return 'completed';
    if (isSameDay(stage.scheduledDate, currentDate)) return 'due_today';
    if (isPastDate(stage.scheduledDate, currentDate)) return 'overdue';
    return 'upcoming';
  };

  // Open Reminder Commitment Modal
  const handleOpenReminderModal = (task: Task) => {
    setReminderModalTask(task);
    if (task.reminderCommitment?.time) {
      setReminderTime(task.reminderCommitment.time);
      setReminderNote(task.reminderCommitment.note || 'Main aaj is task ki revision zaroor complete karoon gi');
    } else {
      setReminderTime('08:00 PM');
      setReminderNote('Main aaj is task ki revision zaroor complete karoon gi');
    }
  };

  // Save Reminder Commitment
  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderModalTask) return;

    setTaskReminder(reminderModalTask.id, reminderTime, reminderNote);
    playRevisionChime(); // Play imperial audio chime
    await requestNotificationPermission();
    sendRevisionNotification(
      `Reminder Set for ${reminderModalTask.title}`,
      `Committed to revise by ${reminderTime}. Task is saved in 24K Gold!`
    );

    setReminderSuccessBanner(`Reminder Active: Committed to revise "${reminderModalTask.title}" by ${reminderTime}! 🔔`);
    setTimeout(() => setReminderSuccessBanner(null), 5000);
    setReminderModalTask(null);
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-6 pb-28">
      {/* Top Banner: Today's Date & Day Prominently Mentioned */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1E1910] via-[#14110A] to-[#0D0B07] border border-[#D4AF37]/50 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>TODAY'S STUDY SCHEDULE & REVISION VAULT</span>
            </div>
            <h2 className="text-xl md:text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C6] via-[#D4AF37] to-[#AA771C] mt-1">
              {todayFormatted}
            </h2>
            <p className="text-xs text-[#9E927A] mt-0.5">
              Day: <span className="text-[#FFF2B2] font-semibold">{todayDay}</span> • 5 Core
              Subjects active in Spaced Repetition Pipeline
            </p>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={() => {
                playRevisionChime();
                sendRevisionNotification('Revision Chime Test', "Royal bell reminder is working loud and clear!");
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#221B10] border border-[#D4AF37]/50 text-[#FFF2B2] font-semibold text-xs hover:border-[#D4AF37] transition-all cursor-pointer"
              title="Test audio reminder bell chime"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="hidden sm:inline">Test Bell Chime</span>
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 transition-all shadow-[0_4px_15px_rgba(212,175,55,0.4)] cursor-pointer"
            >
              <Plus className="w-4 h-4 text-black stroke-[3]" />
              <span>Add Subject Task</span>
            </button>
          </div>
        </div>

        {/* Reminders summary bar */}
        <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5 text-[#FFF2B2]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-ping"></span>
              <span>
                <strong className="text-[#FFD700] text-sm">{stats.dueTodayCount}</strong> Revisions Due Today (Turned 24K Pure Gold!)
              </span>
            </div>
            <div className="flex items-center space-x-1.5 text-[#9E927A]">
              <span>
                <strong>{stats.activeTasks}</strong> Active Tasks Saved
              </span>
            </div>
          </div>
          <div className="text-[11px] text-[#C7B58B] italic">
            "Task stays permanently saved until all 6 revisions (1d, 3d, 7d, 15d, 1m, 2m) are done."
          </div>
        </div>
      </div>

      {/* PROMINENT POMODORO TIMER (50M WORK / 10M BREAK) */}
      <PomodoroTimer />

      {/* Floating Success Banner */}
      {reminderSuccessBanner && (
        <div className="rounded-xl bg-gradient-to-r from-[#2A200B] to-[#171308] border border-[#D4AF37] p-3 shadow-lg flex items-center justify-between text-xs text-[#FFF3BE] animate-fade-in">
          <div className="flex items-center space-x-2">
            <BellRing className="w-4 h-4 text-[#D4AF37] animate-bounce" />
            <span>{reminderSuccessBanner}</span>
          </div>
          <button
            onClick={() => setReminderSuccessBanner(null)}
            className="text-[#8C8069] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5 Subjects Filter Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-cinzel font-bold tracking-widest text-[#D4AF37] uppercase">
            Select Subject
          </span>
          <span className="text-[11px] text-[#8C8069]">
            Showing {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
          {/* All Subjects Pill */}
          <button
            onClick={() => setSelectedSubject('all')}
            className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer border ${
              selectedSubject === 'all'
                ? 'bg-[#261F13] border-[#D4AF37] text-[#FFF2B2] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                : 'bg-[#12100B] border-[#D4AF37]/20 text-[#8C8069] hover:border-[#D4AF37]/40 hover:text-[#C7B58B]'
            }`}
          >
            All Subjects ({tasks.length})
          </button>

          {/* 5 Specific Subjects */}
          {subjects.map((sub) => {
            const count = tasks.filter((t) => t.subjectId === sub.id).length;
            const isSelected = selectedSubject === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubject(sub.id)}
                className={`py-2 px-2.5 rounded-xl text-xs font-medium tracking-wide transition-all cursor-pointer border flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#261F13] border-[#D4AF37] text-[#FFF2B2] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                    : 'bg-[#12100B] border-[#D4AF37]/20 text-[#8C8069] hover:border-[#D4AF37]/40 hover:text-[#C7B58B]'
                }`}
              >
                <span className="truncate">{sub.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-[#C7B58B] ml-1">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#D4AF37]/20 text-[#FFF2B2] border border-[#D4AF37]'
                : 'bg-[#14120C] text-[#8C8069] border border-[#D4AF37]/15 hover:text-[#FFF2B2]'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setActiveFilter('due_today')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeFilter === 'due_today'
                ? 'bg-[#D4AF37] text-black font-semibold'
                : 'bg-[#14120C] text-[#8C8069] border border-[#D4AF37]/15 hover:text-[#FFF2B2]'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Due Today ({stats.dueTodayCount})</span>
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-[#D4AF37]/20 text-[#FFF2B2] border border-[#D4AF37]'
                : 'bg-[#14120C] text-[#8C8069] border border-[#D4AF37]/15 hover:text-[#FFF2B2]'
            }`}
          >
            In-Progress ({stats.activeTasks})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer flex items-center space-x-1 ${
              activeFilter === 'completed'
                ? 'bg-[#D4AF37]/20 text-[#FFF2B2] border border-[#D4AF37]'
                : 'bg-[#14120C] text-[#8C8069] border border-[#D4AF37]/15 hover:text-[#FFF2B2]'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Mastered ({stats.completedTasks})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#8C8069] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search topic or chapter..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12100B] border border-[#D4AF37]/25 rounded-xl pl-8 pr-3 py-1.5 text-xs text-[#FFF2B2] placeholder-[#6B6150] focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* TASKS LIST */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl bg-[#12100B] border border-[#D4AF37]/20 p-12 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-[#D4AF37]/40 mx-auto" />
            <h4 className="font-cinzel text-lg font-bold text-[#E5D7A3]">No Tasks Found</h4>
            <p className="text-xs text-[#8C8069] max-w-sm mx-auto">
              {activeFilter === 'due_today'
                ? "No revisions scheduled for today. You're completely caught up!"
                : 'Create a new task with today date and start your spaced repetition streak.'}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#221C11] border border-[#D4AF37] text-xs font-semibold text-[#FFF2B2] hover:bg-[#2B2316] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Add Task Now</span>
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const subject = getSubject(task.subjectId);
            const completedCount = task.stages.filter((s) => s.completed).length;
            const progressPercent = Math.round((completedCount / task.stages.length) * 100);

            // Check if any stage is due today
            const dueTodayStage = task.stages.find(
              (st) => !st.completed && isSameDay(st.scheduledDate, currentDate)
            );
            const isDueToday = Boolean(dueTodayStage);

            return (
              <div
                key={task.id}
                className={`rounded-2xl transition-all duration-300 ${
                  isDueToday
                    ? /* FULL 24K PURE GOLD CARD AS REQUESTED BY USER */
                      'bg-gradient-to-br from-[#FFE680] via-[#F4BE1A] to-[#B38006] text-black border-2 border-white shadow-[0_0_45px_rgba(244,190,26,0.95)] ring-2 ring-[#FFDF00]'
                    : task.isCompleted
                    ? 'bg-[#10100C]/90 border border-emerald-500/30'
                    : 'bg-[#13100A] border border-[#D4AF37]/25 hover:border-[#D4AF37]/50 shadow-[0_6px_20px_rgba(0,0,0,0.6)]'
                } p-4 md:p-5`}
              >
                {/* 24K GOLD REVISION DAY BANNER (IF DUE TODAY) */}
                {isDueToday && (
                  <div className="mb-3 px-3 py-1.5 rounded-xl bg-black text-[#FFD700] border border-black flex items-center justify-between text-xs font-black tracking-wider uppercase shadow-md">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
                      <span>24K GOLD REVISION DAY • REVISION DUE TODAY ({dueTodayStage?.interval.toUpperCase()})</span>
                    </div>
                    <span className="animate-pulse bg-[#FFD700] text-black px-2 py-0.5 rounded text-[10px] font-black">
                      REVISE TODAY
                    </span>
                  </div>
                )}

                {/* Header: Subject Badge, Creation Date & Day, Options */}
                <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Subject badge */}
                    <span
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold font-mono tracking-wider uppercase ${
                        isDueToday
                          ? 'bg-black text-[#FFD700] border border-black shadow-sm'
                          : 'bg-[#201A10] border border-[#D4AF37]/50 text-[#FFF2B2]'
                      }`}
                    >
                      {subject?.name || task.subjectId}
                    </span>

                    {/* Assigned Date & Day Mention */}
                    <span
                      className={`flex items-center space-x-1 text-xs ${
                        isDueToday ? 'text-black/85 font-semibold' : 'text-[#C7B58B]'
                      }`}
                    >
                      <Calendar className={`w-3 h-3 ${isDueToday ? 'text-black' : 'text-[#D4AF37]'}`} />
                      <span>
                        Assigned on:{' '}
                        <strong className={isDueToday ? 'text-black' : 'text-[#FFF2B2]'}>
                          {formatDateWithDay(task.initialDate)}
                        </strong>
                      </span>
                    </span>

                    {/* Priority badge */}
                    {task.priority === 'high' && (
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          isDueToday
                            ? 'bg-black/90 text-red-200'
                            : 'bg-red-950/60 border border-red-500/40 text-red-300'
                        }`}
                      >
                        High Yield
                      </span>
                    )}
                  </div>

                  {/* Actions & Delete */}
                  <div className="flex items-center space-x-2">
                    {/* Reminder & Commitment Button */}
                    <button
                      onClick={() => handleOpenReminderModal(task)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer shadow-sm ${
                        task.reminderCommitment?.committed
                          ? isDueToday
                            ? 'bg-black text-[#FFF099] border border-black'
                            : 'bg-[#251E12] border border-[#D4AF37] text-[#FFF2B2]'
                          : isDueToday
                          ? 'bg-black text-[#FFD700] hover:bg-black/85'
                          : 'bg-[#1C1710] border border-[#D4AF37]/40 text-[#C7B58B] hover:text-[#FFF2B2]'
                      }`}
                      title="Set revision reminder alarm & commitment"
                    >
                      <BellRing className="w-3.5 h-3.5" />
                      <span>
                        {task.reminderCommitment?.committed
                          ? `Revise by ${task.reminderCommitment.time}`
                          : 'Set Reminder'}
                      </span>
                    </button>

                    {task.isCompleted && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-950 border border-emerald-500/50 text-emerald-300 flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>All 6 Stages Mastered</span>
                      </span>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className={`p-1 rounded-lg transition-colors cursor-pointer ${
                        isDueToday
                          ? 'text-black/60 hover:text-black hover:bg-black/10'
                          : 'text-[#6B6150] hover:text-red-400 hover:bg-red-950/30'
                      }`}
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Task Title & Chapter */}
                <div className="mb-4">
                  <h3
                    className={`text-base md:text-lg font-cinzel font-bold leading-snug ${
                      isDueToday ? 'text-black font-extrabold' : 'text-[#FFF3BE]'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.chapter && (
                    <p
                      className={`text-xs mt-0.5 font-medium ${
                        isDueToday ? 'text-black/80 font-semibold' : 'text-[#9E927A]'
                      }`}
                    >
                      {task.chapter}
                    </p>
                  )}

                  {/* Commitment Banner on Card if Active */}
                  {task.reminderCommitment?.committed && (
                    <div
                      className={`mt-2 p-2 rounded-xl text-xs flex items-center justify-between border ${
                        isDueToday
                          ? 'bg-black/10 border-black/30 text-black font-medium'
                          : 'bg-[#1A160E] border-[#D4AF37]/30 text-[#FFF2B2]'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <Bell className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>
                          <strong>Commitment:</strong> "{task.reminderCommitment.note}" by{' '}
                          <strong className="underline">{task.reminderCommitment.time}</strong>
                        </span>
                      </div>
                      <button
                        onClick={() => clearTaskReminder(task.id)}
                        className="text-[10px] opacity-60 hover:opacity-100 cursor-pointer underline ml-2"
                      >
                        Clear
                      </button>
                    </div>
                  )}

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {task.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className={`text-[10px] px-2 py-0.5 rounded-full border ${
                            isDueToday
                              ? 'bg-black/15 text-black border-black/25 font-medium'
                              : 'bg-[#1A160E] border-[#D4AF37]/20 text-[#A89878]'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* SPACED REPETITION 6-STAGE TIMELINE */}
                <div
                  className={`space-y-2 pt-2 border-t ${
                    isDueToday ? 'border-black/20' : 'border-[#D4AF37]/15'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span
                      className={`font-semibold tracking-wider uppercase text-[11px] ${
                        isDueToday ? 'text-black font-bold' : 'text-[#D4AF37]'
                      }`}
                    >
                      Spaced Repetition Schedule (6 Intervals)
                    </span>
                    <span
                      className={`font-mono text-[11px] ${
                        isDueToday ? 'text-black font-extrabold' : 'text-[#FFF2B2]'
                      }`}
                    >
                      {completedCount}/6 Stages Done ({progressPercent}%)
                    </span>
                  </div>

                  {/* 6 Interval Stages Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                    {task.stages.map((stage) => {
                      const status = getStageStatus(stage);
                      const isDue = status === 'due_today';
                      const isOverdue = status === 'overdue';
                      const isDone = stage.completed;

                      return (
                        <div
                          key={stage.interval}
                          onClick={() => {
                            toggleStage(task.id, stage.interval);
                            if (!isDone) {
                              playRevisionChime();
                            }
                          }}
                          className={`group relative rounded-xl p-2.5 transition-all cursor-pointer border flex flex-col justify-between ${
                            isDone
                              ? isDueToday
                                ? 'bg-black/80 border-black text-emerald-300 shadow-md'
                                : 'bg-[#181E15] border-emerald-500/50 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.15)]'
                              : isDue
                              ? isDueToday
                                ? 'bg-black text-[#FFD700] border-2 border-black shadow-2xl scale-105 animate-pulse'
                                : 'bg-gradient-to-b from-[#2B2211] to-[#1C150A] border-[#D4AF37] text-[#FFF4C2] shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-pulse'
                              : isOverdue
                              ? isDueToday
                                ? 'bg-red-950/80 border-red-900 text-red-200'
                                : 'bg-red-950/30 border-red-500/50 text-red-200'
                              : isDueToday
                              ? 'bg-black/10 border-black/20 text-black/80 hover:bg-black/20'
                              : 'bg-[#15120B] border-[#D4AF37]/20 text-[#8C8069] hover:border-[#D4AF37]/50 hover:bg-[#1B170F]'
                          }`}
                        >
                          {/* Stage Header */}
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[11px] font-mono tracking-tight">
                              {stage.label}
                            </span>
                            <div
                              className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                                isDone
                                  ? 'bg-emerald-500 border-emerald-400 text-black'
                                  : isDue
                                  ? 'border-[#FFD700] bg-[#FFD700]/30 text-[#FFD700]'
                                  : isDueToday
                                  ? 'border-black/50 group-hover:border-black'
                                  : 'border-[#6B6150] group-hover:border-[#D4AF37]'
                              }`}
                            >
                              {isDone && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                          </div>

                          {/* Target Date & Day */}
                          <div className="text-[10px] space-y-0.5">
                            <div
                              className={`font-medium ${
                                isDueToday && !isDue && !isDone ? 'text-black' : 'text-[#E5D298]'
                              }`}
                            >
                              {formatShortDate(stage.scheduledDate)}
                            </div>
                            <div
                              className={
                                isDueToday && !isDue && !isDone ? 'text-black/70' : 'text-[#7A705E]'
                              }
                            >
                              {getDayOfWeek(stage.scheduledDate)}
                            </div>
                          </div>

                          {/* Status Pill */}
                          <div className="mt-2 pt-1 border-t border-black/20 text-[9px] font-semibold tracking-wider uppercase">
                            {isDone && (
                              <span className="text-emerald-400 flex items-center space-x-0.5 font-bold">
                                <span>Mastered</span>
                              </span>
                            )}
                            {isDue && (
                              <span className="text-[#FFD700] font-black">
                                ● REVISE TODAY
                              </span>
                            )}
                            {isOverdue && (
                              <span className="text-red-400 font-bold">
                                Overdue ({Math.abs(daysDifference(stage.scheduledDate, currentDate))}d)
                              </span>
                            )}
                            {status === 'upcoming' && (
                              <span className={isDueToday ? 'text-black/70' : 'text-[#6B6150]'}>
                                In {daysDifference(stage.scheduledDate, currentDate)} days
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Task Persistence Guarantee Bar */}
                  <div
                    className={`mt-3 pt-2 border-t flex flex-wrap items-center justify-between text-[11px] ${
                      isDueToday ? 'border-black/20 text-black/90' : 'border-[#D4AF37]/10 text-[#8C8069]'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <Clock className={`w-3.5 h-3.5 ${isDueToday ? 'text-black' : 'text-[#D4AF37]'}`} />
                      <span>
                        Status:{' '}
                        {task.isCompleted ? (
                          <span className="text-emerald-400 font-semibold">
                            Full 2-Month Retention Mastered!
                          </span>
                        ) : isDueToday ? (
                          <span className="text-black font-extrabold">
                            ⭐ Revision Due Today ({dueTodayStage?.interval.toUpperCase()}) — Tap stage to mark revised!
                          </span>
                        ) : (
                          <span className="text-[#C7B58B]">
                            Saved in Vault. Next milestone:{' '}
                            <strong className="text-[#FFF2B2]">
                              {task.stages.find((s) => !s.completed)?.label || 'Complete'}
                            </strong>
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Quick Delay / Reschedule Option */}
                    {!task.isCompleted && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            const nextStage = task.stages.find((s) => !s.completed);
                            if (nextStage) {
                              postponeStage(task.id, nextStage.interval, 1);
                            }
                          }}
                          className={`transition-colors cursor-pointer text-[10px] px-2 py-0.5 rounded border ${
                            isDueToday
                              ? 'bg-black text-[#FFD700] border-black hover:bg-black/80'
                              : 'bg-black/40 border-[#D4AF37]/20 hover:text-[#D4AF37]'
                          }`}
                        >
                          +1 Day Delay
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* REVISION COMMITMENT & REMINDER MODAL */}
      {reminderModalTask && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14110A] border border-[#D4AF37]/80 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <BellRing className="w-5 h-5 text-[#D4AF37] animate-pulse" />
                <h4 className="font-cinzel text-base font-bold text-[#FFF3BE]">
                  Set Revision Commitment & Reminder
                </h4>
              </div>
              <button
                onClick={() => setReminderModalTask(null)}
                className="text-[#8C8069] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl bg-[#1D170E] border border-[#D4AF37]/30 p-3 space-y-1">
              <span className="text-[10px] uppercase font-mono text-[#D4AF37] tracking-wider">
                Target Task
              </span>
              <h5 className="font-cinzel font-bold text-sm text-[#FFF4C2]">
                {reminderModalTask.title}
              </h5>
              <p className="text-[11px] text-[#A89878]">
                {reminderModalTask.chapter || 'Core Spaced Repetition Task'}
              </p>
            </div>

            <form onSubmit={handleSaveReminder} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">
                  I will revise this task by:
                </label>
                {/* Quick Time Options */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {['10:00 AM', '02:00 PM', '05:00 PM', '08:00 PM'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setReminderTime(t)}
                      className={`py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                        reminderTime === t
                          ? 'bg-[#D4AF37] text-black font-bold border-white'
                          : 'bg-[#1A160E] text-[#A89878] border-[#D4AF37]/30 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  required
                  placeholder="e.g. 09:30 PM or Night Review"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">
                  My Revision Commitment Pledge (Qaul):
                </label>
                <textarea
                  rows={2}
                  required
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Audio Chime Test */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#18140D] border border-[#D4AF37]/20">
                <span className="text-[11px] text-[#A89878] flex items-center space-x-1">
                  <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Audio Chime Reminder Sound</span>
                </span>
                <button
                  type="button"
                  onClick={() => playRevisionChime()}
                  className="px-2.5 py-1 rounded bg-[#251E12] border border-[#D4AF37]/40 text-[#D4AF37] text-xs hover:border-[#D4AF37] cursor-pointer"
                >
                  Play Bell Chime 🔔
                </button>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReminderModalTask(null)}
                  className="px-3 py-1.5 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#FFF0B3] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-lg flex items-center space-x-1.5"
                >
                  <BellRing className="w-4 h-4 text-black" />
                  <span>Set Revision Reminder</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && <AddTaskModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
};
