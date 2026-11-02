import React, { useMemo } from 'react';
import {
  FolderClock,
  Calendar,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  ShieldAlert,
  Flame,
  AlertTriangle,
  FolderCheck,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import {
  formatDateWithDay,
  formatShortDate,
  getDayOfWeek,
  isPastDate,
  daysDifference,
} from '../utils/dateUtils';
import { RevisionInterval } from '../types';

export const BacklogView: React.FC<{ onNavigateToStudy: () => void }> = ({ onNavigateToStudy }) => {
  const { tasks, subjects, currentDate, toggleStage, rescheduleStage, postponeStage } = useStudy();

  const getSubject = (subId: string) => subjects.find((s) => s.id === subId);

  // Filter tasks that have overdue uncompleted stages
  const backlogTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        if (task.isCompleted) return false;
        return task.stages.some((st) => !st.completed && isPastDate(st.scheduledDate, currentDate));
      })
      .map((task) => {
        const overdueStages = task.stages.filter(
          (st) => !st.completed && isPastDate(st.scheduledDate, currentDate)
        );
        return {
          task,
          overdueStages,
        };
      });
  }, [tasks, currentDate]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 space-y-6 pb-28">
      {/* Folder Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#20120E] via-[#160E0A] to-[#0D0806] border border-red-500/40 p-5 shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-semibold tracking-widest text-red-400 uppercase">
              <FolderClock className="w-4 h-4 text-red-400" />
              <span>DEDICATED BACKLOG FOLDER</span>
            </div>
            <h2 className="text-xl md:text-2xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFD2C9] via-[#E87A64] to-[#AA4330]">
              Incomplete & Overdue Tasks Vault
            </h2>
            <p className="text-xs text-[#B89F98]">
              Separate folder for revisions that missed their target date. Catch up to protect your memory retention.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-4 py-2 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs font-mono font-bold">
              {backlogTasks.length} Task{backlogTasks.length === 1 ? '' : 's'} in Backlog
            </div>
          </div>
        </div>

        {/* Advisory message */}
        <div className="mt-4 pt-3 border-t border-red-500/20 flex items-center space-x-2 text-xs text-[#E5B5AA]">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span>
            Tasks in the backlog remain securely preserved until all 6 spaced repetition revisions are fulfilled.
          </span>
        </div>
      </div>

      {/* Backlog Items List */}
      {backlogTasks.length === 0 ? (
        <div className="rounded-2xl bg-[#12100B] border border-[#D4AF37]/30 p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#1F190F] border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37]">
            <FolderCheck className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <div>
            <h3 className="font-cinzel text-lg font-bold text-[#FFF3BE]">
              Glorious! Backlog is Completely Clear
            </h3>
            <p className="text-xs text-[#9E927A] max-w-md mx-auto mt-1">
              You have no overdue revisions across all 5 subjects. Your spaced repetition discipline
              is operating with supreme efficiency.
            </p>
          </div>
          <button
            onClick={onNavigateToStudy}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#201A10] border border-[#D4AF37] text-xs font-semibold text-[#FFF2B2] hover:bg-[#2B2316] transition-colors cursor-pointer"
          >
            <span>Go to Active Revision Vault</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {backlogTasks.map(({ task, overdueStages }) => {
            const subject = getSubject(task.subjectId);

            return (
              <div
                key={task.id}
                className="rounded-2xl bg-gradient-to-b from-[#18110D] to-[#0E0A08] border border-red-500/35 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] space-y-4 hover:border-red-500/60 transition-colors"
              >
                {/* Header: Subject & Assigned Date */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold font-mono tracking-wider uppercase bg-black/60 border border-red-500/40 text-red-200">
                      {subject?.name || task.subjectId}
                    </span>
                    <span className="text-xs text-[#C7A39B]">
                      Assigned:{' '}
                      <strong className="text-[#FFD2C9]">
                        {formatDateWithDay(task.initialDate)}
                      </strong>
                    </span>
                  </div>

                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950 border border-red-500/60 text-red-300">
                    {overdueStages.length} MISSED REVISION{overdueStages.length === 1 ? '' : 'S'}
                  </span>
                </div>

                {/* Task Details */}
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-[#FFF3BE]">{task.title}</h3>
                  {task.chapter && (
                    <p className="text-xs text-[#9E927A] mt-0.5">{task.chapter}</p>
                  )}
                </div>

                {/* Missed Stages Resolution Cards */}
                <div className="space-y-2 pt-2 border-t border-red-500/20">
                  <span className="text-[11px] font-semibold text-red-300 tracking-wider uppercase">
                    Overdue Revision Milestones:
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {overdueStages.map((stage) => {
                      const daysLate = Math.abs(daysDifference(stage.scheduledDate, currentDate));

                      return (
                        <div
                          key={stage.interval}
                          className="p-3 rounded-xl bg-[#22130F] border border-red-500/40 flex flex-col justify-between space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#FFD2C9] font-mono">
                              {stage.label}
                            </span>
                            <span className="text-[10px] text-red-400 font-bold bg-black/40 px-2 py-0.5 rounded">
                              {daysLate} day{daysLate === 1 ? '' : 's'} late
                            </span>
                          </div>

                          <div className="text-[11px] text-[#A88880]">
                            Was scheduled for:{' '}
                            <span className="text-white font-medium">
                              {formatShortDate(stage.scheduledDate)} (
                              {getDayOfWeek(stage.scheduledDate)})
                            </span>
                          </div>

                          {/* Quick Resolution Actions */}
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            <button
                              onClick={() => toggleStage(task.id, stage.interval)}
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-semibold hover:bg-emerald-900 transition-colors flex items-center justify-center space-x-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Complete Now</span>
                            </button>

                            <button
                              onClick={() => rescheduleStage(task.id, stage.interval, currentDate)}
                              className="py-1.5 px-2.5 rounded-lg bg-[#2A1E14] border border-[#D4AF37]/50 text-[#FFF2B2] text-xs font-medium hover:border-[#D4AF37] transition-colors cursor-pointer"
                              title="Reschedule to Today"
                            >
                              Move to Today
                            </button>

                            <button
                              onClick={() => postponeStage(task.id, stage.interval, 3)}
                              className="py-1.5 px-2 rounded-lg bg-black/50 border border-red-500/30 text-[#C7B58B] text-xs hover:text-white transition-colors cursor-pointer"
                              title="Postpone 3 days"
                            >
                              +3d
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Return to Study link */}
                <div className="pt-2 text-right">
                  <button
                    onClick={onNavigateToStudy}
                    className="text-xs text-[#D4AF37] hover:underline cursor-pointer inline-flex items-center space-x-1"
                  >
                    <span>View full 6-stage timeline</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
