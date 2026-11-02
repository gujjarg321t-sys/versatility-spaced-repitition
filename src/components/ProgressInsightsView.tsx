import React, { useState } from 'react';
import {
  TrendingUp,
  BarChart3,
  Award,
  RotateCcw,
  Download,
  Upload,
  Database,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { REVISION_INTERVALS_CONFIG } from '../utils/dateUtils';

export const ProgressInsightsView: React.FC = () => {
  const { subjects, tasks, stats, resetToDemoData, clearAllTasks, exportJSON, importJSON } =
    useStudy();
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importJSON(content);
        if (success) {
          setImportStatus('Data successfully restored!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid JSON backup file.');
        }
      }
    };
    reader.readAsText(file);
  };

  // Calculate stage breakdown
  const stageCounts = REVISION_INTERVALS_CONFIG.map((conf) => {
    const completedCount = tasks.reduce((acc, t) => {
      const st = t.stages.find((s) => s.interval === conf.interval);
      return acc + (st?.completed ? 1 : 0);
    }, 0);

    const dueTodayCount = tasks.reduce((acc, t) => {
      const st = t.stages.find((s) => s.interval === conf.interval);
      return acc + (st && !st.completed && st.scheduledDate === t.initialDate ? 1 : 0);
    }, 0);

    return {
      ...conf,
      completedCount,
      dueTodayCount,
    };
  });

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 space-y-6 pb-28">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#1B1710] via-[#14110A] to-[#0D0B08] border border-[#D4AF37]/40 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-[#D4AF37] uppercase">
              <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>ACADEMIC ANALYTICS & MASTERY</span>
            </div>
            <h2 className="text-xl md:text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C6] via-[#D4AF37] to-[#AA771C] mt-1">
              Subject Completion & Progress Bars
            </h2>
            <p className="text-xs text-[#9E927A] mt-0.5">
              Live tracking across all 5 subjects with 6-stage spaced repetition retention.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={exportJSON}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#1F190F] border border-[#D4AF37]/30 text-xs font-medium text-[#FFF2B2] hover:border-[#D4AF37] cursor-pointer"
              title="Download backup"
            >
              <Download className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Export Vault</span>
            </button>
            <button
              onClick={resetToDemoData}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#2A1F10] border border-[#D4AF37]/60 text-xs font-medium text-[#FFF4C2] hover:bg-[#352714] cursor-pointer"
              title="Reset 1-month checkup test tasks"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Reset Demo Tasks</span>
            </button>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 p-4 rounded-xl bg-[#110E09] border border-[#D4AF37]/30">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-cinzel text-sm font-bold text-[#FFF2B2]">
                Overall System Revision Mastery
              </span>
            </div>
            <span className="font-mono text-base font-bold text-[#D4AF37]">
              {stats.overallProgressPercent}%
            </span>
          </div>

          {/* Large Gold Progress Bar */}
          <div className="w-full bg-black/70 h-4 rounded-full overflow-hidden p-0.5 border border-[#D4AF37]/30 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-[#AA771C] via-[#E5C365] to-[#FFF0B3] rounded-full transition-all duration-700 shadow-[0_0_15px_rgba(212,175,55,0.5)]"
              style={{ width: `${stats.overallProgressPercent}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-xs text-[#8C8069] mt-2 font-mono">
            <span>
              {stats.totalRevisionsDone} of {stats.totalRevisionsScheduled} Revisions Mastered
            </span>
            <span>{stats.completedTasks} Tasks 100% Finished</span>
          </div>
        </div>
      </div>

      {/* 5 SUBJECT INDIVIDUAL PROGRESS BARS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-cinzel text-base font-bold text-[#E5D7A3]">
            Individual Subject Progress Bars (Tracked Real-Time)
          </h3>
          <span className="text-xs text-[#8C8069]">5 Subjects Configured</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject) => {
            const subData = stats.subjectProgress[subject.id] || {
              total: 0,
              completedStages: 0,
              totalStages: 0,
              percent: 0,
            };

            const subTasks = tasks.filter((t) => t.subjectId === subject.id);
            const subMasteredTasks = subTasks.filter((t) => t.isCompleted).length;

            return (
              <div
                key={subject.id}
                className="rounded-2xl bg-[#13100B] border border-[#D4AF37]/30 p-5 shadow-[0_6px_25px_rgba(0,0,0,0.6)] space-y-3"
              >
                {/* Subject Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#221B10] border border-[#D4AF37]/40 flex items-center justify-center font-bold font-mono text-xs text-[#FFF2B2]">
                      {subject.code}
                    </div>
                    <div>
                      <h4 className="font-cinzel font-bold text-[#FFF3BE] text-base">
                        {subject.name}
                      </h4>
                      <p className="text-[11px] text-[#8C8069]">{subject.category}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono text-lg font-bold text-[#D4AF37]">
                      {subData.percent}%
                    </span>
                    <p className="text-[10px] text-[#8C8069]">Mastery</p>
                  </div>
                </div>

                {/* Progress Bar for this subject */}
                <div className="space-y-1">
                  <div className="w-full bg-black/60 h-2.5 rounded-full overflow-hidden border border-[#D4AF37]/20">
                    <div
                      className="h-full bg-gradient-to-r from-[#996515] via-[#D4AF37] to-[#FFF2B2] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                      style={{ width: `${subData.percent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Subject Metrics Details */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#D4AF37]/15 text-center text-xs">
                  <div className="bg-[#1A160E] p-2 rounded-lg border border-[#D4AF37]/15">
                    <span className="text-[10px] text-[#8C8069] block">Total Tasks</span>
                    <span className="font-mono font-bold text-[#FFF2B2]">{subData.total}</span>
                  </div>
                  <div className="bg-[#1A160E] p-2 rounded-lg border border-[#D4AF37]/15">
                    <span className="text-[10px] text-[#8C8069] block">Stages Done</span>
                    <span className="font-mono font-bold text-[#D4AF37]">
                      {subData.completedStages}/{subData.totalStages}
                    </span>
                  </div>
                  <div className="bg-[#1A160E] p-2 rounded-lg border border-[#D4AF37]/15">
                    <span className="text-[10px] text-[#8C8069] block">Fully Mastered</span>
                    <span className="font-mono font-bold text-emerald-400">{subMasteredTasks}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-MONTH HIGH CAPACITY STORAGE & ID ASSURANCE */}
      <div className="rounded-2xl bg-[#14110A] border border-[#D4AF37]/35 p-5 shadow-[0_6px_25px_rgba(0,0,0,0.6)] space-y-4">
        <div className="flex items-center space-x-2.5">
          <Database className="w-5 h-5 text-[#D4AF37]" />
          <div>
            <h3 className="font-cinzel text-base font-bold text-[#FFF3BE]">
              High-Capacity Memory Engine (No ID Limits)
            </h3>
            <p className="text-xs text-[#8C8069]">
              Engineered to store 2+ months of study tasks simultaneously without lag or stuck states.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#1A160E] border border-[#D4AF37]/20">
            <span className="text-[11px] text-[#8C8069]">Active Task Capacity</span>
            <div className="font-mono font-bold text-base text-[#FFF2B2] mt-0.5">
              {tasks.length} Saved Tasks
            </div>
            <p className="text-[10px] text-[#C7B58B] mt-1">
              Supports 500+ simultaneous tasks with UUID microsecond timestamps.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#1A160E] border border-[#D4AF37]/20">
            <span className="text-[11px] text-[#8C8069]">Revision Horizons</span>
            <div className="font-mono font-bold text-base text-[#D4AF37] mt-0.5">
              60 Days (2 Months)
            </div>
            <p className="text-[10px] text-[#C7B58B] mt-1">
              Tasks remain active until Day 1, Day 3, Week 1, Day 15, Month 1, and Month 2 are all cleared.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-[#1A160E] border border-[#D4AF37]/20">
            <span className="text-[11px] text-[#8C8069]">Persistence & Safety</span>
            <div className="font-mono font-bold text-base text-emerald-400 mt-0.5">
              Always Preserved
            </div>
            <p className="text-[10px] text-[#C7B58B] mt-1">
              Auto-persists to LocalStorage and supports full JSON import/export.
            </p>
          </div>
        </div>

        {/* Spaced Interval Stages Status */}
        <div className="pt-2">
          <span className="text-xs font-cinzel font-bold text-[#D4AF37] tracking-wider uppercase block mb-2">
            Distribution by Revision Interval:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {stageCounts.map((sc) => (
              <div
                key={sc.interval}
                className="p-2.5 rounded-xl bg-[#18140D] border border-[#D4AF37]/20 text-center"
              >
                <span className="text-xs font-mono font-bold text-[#FFF2B2] block">
                  {sc.label}
                </span>
                <span className="text-base font-mono font-bold text-[#D4AF37]">
                  {sc.completedCount}
                </span>
                <span className="text-[10px] text-[#8C8069] block">completed</span>
              </div>
            ))}
          </div>
        </div>

        {/* Import Backup / Danger Zone */}
        <div className="pt-3 border-t border-[#D4AF37]/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <label className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#1D1810] border border-[#D4AF37]/30 text-[#FFF2B2] hover:border-[#D4AF37] cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Import JSON Backup</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
            {importStatus && <span className="text-xs text-emerald-400">{importStatus}</span>}
          </div>

          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all tasks?')) {
                clearAllTasks();
              }
            }}
            className="text-red-400/80 hover:text-red-300 transition-colors cursor-pointer text-xs"
          >
            Clear All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};
