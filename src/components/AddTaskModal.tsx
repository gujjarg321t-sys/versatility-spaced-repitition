import React, { useState } from 'react';
import { X, Plus, Calendar, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatDateWithDay, getDayOfWeek, addDays, toISODateString } from '../utils/dateUtils';
import { SubjectId } from '../types';

interface AddTaskModalProps {
  onClose: () => void;
  defaultSubjectId?: SubjectId;
}

export const AddTaskModal: React.FC<AddTaskModalProps> = ({ onClose, defaultSubjectId }) => {
  const { subjects, addTask, currentDate } = useStudy();

  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubjectId || 'bio');
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [initialDate, setInitialDate] = useState<string>(currentDate);
  const [tagInput, setTagInput] = useState('');

  // Calculate live preview of the 6 revision dates
  const previewStages = [
    { label: '1 Day (24h)', offset: 1, date: addDays(initialDate, 1) },
    { label: '3rd Day', offset: 3, date: addDays(initialDate, 3) },
    { label: '1 Week (7d)', offset: 7, date: addDays(initialDate, 7) },
    { label: '15 Days', offset: 15, date: addDays(initialDate, 15) },
    { label: '1 Month (30d)', offset: 30, date: addDays(initialDate, 30) },
    { label: '2 Months (60d)', offset: 60, date: addDays(initialDate, 60) },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const tags = tagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addTask({
      subjectId,
      title: title.trim(),
      chapter: chapter.trim() || undefined,
      priority,
      initialDate,
      tags: tags.length > 0 ? tags : ['Study Task'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-2xl bg-[#14110A] border border-[#D4AF37]/60 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4 max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
          <div>
            <h3 className="font-cinzel text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5C6] via-[#D4AF37] to-[#AA771C]">
              Add Today's Study Task
            </h3>
            <p className="text-xs text-[#9E927A] mt-0.5">
              Assigned for {formatDateWithDay(initialDate)} ({getDayOfWeek(initialDate)})
            </p>
          </div>
          <button onClick={onClose} className="text-[#8C8069] hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* 5 Subjects Picker */}
          <div>
            <label className="block text-[#C7B58B] mb-1 font-semibold uppercase tracking-wider text-[11px]">
              Select Subject (5 Subjects)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {subjects.map((sub) => {
                const isSelected = subjectId === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSubjectId(sub.id)}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2B2111] border-[#D4AF37] text-[#FFF4C2] shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                        : 'bg-[#18140D] border-[#D4AF37]/20 text-[#8C8069] hover:border-[#D4AF37]/50 hover:text-[#C7B58B]'
                    }`}
                  >
                    <span className="block font-bold text-xs">{sub.name}</span>
                    <span className="text-[10px] font-mono text-[#D4AF37]">{sub.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-[#C7B58B] mb-1 font-semibold">
              Topic / Task Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Krebs Cycle & Oxidative Phosphorylation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-xs text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Chapter / Syllabus Reference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#C7B58B] mb-1 font-semibold">Chapter / Unit</label>
              <input
                type="text"
                placeholder="e.g. Unit 4 - Cell Energetics"
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-xs text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-[#C7B58B] mb-1 font-semibold">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-xs text-[#FFF2B2] focus:outline-none"
              >
                <option value="high">High Yield (Exam Core)</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Standard Review</option>
              </select>
            </div>
          </div>

          {/* Assigned Date & Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[#C7B58B] mb-1 font-semibold">Assigned Date</label>
              <input
                type="date"
                value={initialDate}
                onChange={(e) => setInitialDate(e.target.value)}
                className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-xs text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
            <div>
              <label className="block text-[#C7B58B] mb-1 font-semibold">Tags (comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Important, Formulas, Diagrams"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-xs text-[#FFF2B2] focus:outline-none"
              />
            </div>
          </div>

          {/* AUTOMATIC 6-STAGE REVISION TIMELINE PREVIEW */}
          <div className="p-3.5 rounded-xl bg-[#0E0C08] border border-[#D4AF37]/25 space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-[#D4AF37] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Automated 6-Stage Spaced Repetition Schedule:</span>
            </div>
            <p className="text-[11px] text-[#8C8069]">
              Revisions are auto-scheduled. This task stays saved in your vault until all 6 stages are marked complete!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[10px]">
              {previewStages.map((st) => (
                <div key={st.label} className="p-2 rounded-lg bg-[#18140D] border border-[#D4AF37]/20">
                  <span className="font-bold text-[#FFF2B2] block">{st.label}</span>
                  <span className="text-[#D4AF37]">{formatDateWithDay(st.date)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#D4AF37]/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.4)] flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Save & Activate Revisions</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
