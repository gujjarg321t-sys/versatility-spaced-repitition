/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { DashboardView } from './components/DashboardView';
import { StudyTasksView } from './components/StudyTasksView';
import { ProgressInsightsView } from './components/ProgressInsightsView';
import { BacklogView } from './components/BacklogView';
import { MultiPdfLibraryView } from './components/MultiPdfLibraryView';
import { ExtraWorksTracker } from './components/ExtraWorksTracker';
import { BiometricLockScreen } from './components/BiometricLockScreen';
import { FloatingActionButton } from './components/FloatingActionButton';
import { AddTaskModal } from './components/AddTaskModal';
import { XodoViewer } from './components/XodoViewer';
import {
  Moon,
  ShieldCheck,
  FolderPlus,
  FileText,
  X,
  FolderClock,
  Sparkles,
} from 'lucide-react';
import { SubjectId, ExtraTask } from './types';

function MainApp() {
  const {
    isBiometricLocked,
    unlockVault,
    lockVault,
    addFolder,
    addVaultFile,
    addExtraTask,
    subjects,
    stats,
  } = useStudy();

  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [profileSubTab, setProfileSubTab] = useState<'backlog' | 'rest_tasks'>('backlog');

  // Modals triggered by FAB or actions
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showAddPdfModal, setShowAddPdfModal] = useState(false);
  const [showAddExtraModal, setShowAddExtraModal] = useState(false);
  const [activeStudioFileId, setActiveStudioFileId] = useState<string | null>(null);

  // Form states
  const [folderName, setFolderName] = useState('');
  const [isSubfolderMode, setIsSubfolderMode] = useState(false);
  const [folderSubjectId, setFolderSubjectId] = useState<SubjectId>('bio');

  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfSubjectId, setPdfSubjectId] = useState<SubjectId>('bio');
  const [pdfPages, setPdfPages] = useState(3);

  const [extraTitle, setExtraTitle] = useState('');
  const [extraCategory, setExtraCategory] = useState<'rest' | 'health' | 'routine' | 'study_prep'>('rest');
  const [extraIcon, setExtraIcon] = useState('🌙');

  // Handlers for FAB creations
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;
    addFolder(folderName.trim(), null, 'pdf', folderSubjectId);
    setFolderName('');
    setShowAddFolderModal(false);
    setCurrentTab('library');
  };

  const handleCreatePdf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfTitle.trim()) return;

    const newFile = addVaultFile({
      folderId: 'root',
      category: 'pdf',
      title: pdfTitle.trim(),
      subjectId: pdfSubjectId,
      totalPages: Math.max(1, pdfPages),
      fileSizeKb: Math.round(pdfPages * 65),
      tags: ['Study Notes', 'Vault'],
      pages: Array.from({ length: Math.max(1, pdfPages) }, (_, idx) => ({
        id: `p_${Date.now()}_${idx + 1}`,
        pageNumber: idx + 1,
        type: 'text',
        title: `${pdfTitle.trim()} - Page ${idx + 1}`,
        blocks: [
          {
            id: `b_${Date.now()}_${idx + 1}_1`,
            type: 'heading',
            text: `Chapter Topic ${idx + 1}: Key Notes & Derivations`,
            highlightType: 'important',
          },
          {
            id: `b_${Date.now()}_${idx + 1}_2`,
            type: 'paragraph',
            text: 'Click here to write notes, formulas, or highlight with Ratta, Mistakes, Weak, Important, or Doubts.',
          },
        ],
      })),
    });

    setPdfTitle('');
    setShowAddPdfModal(false);
    setActiveStudioFileId(newFile.id);
  };

  const handleCreateExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraTitle.trim()) return;
    addExtraTask(extraTitle.trim(), extraCategory, extraIcon);
    setExtraTitle('');
    setShowAddExtraModal(false);
    setCurrentTab('backlog');
    setProfileSubTab('rest_tasks');
  };

  // If locked, render the Biometric Touch Screen
  if (isBiometricLocked) {
    return <BiometricLockScreen onUnlock={unlockVault} />;
  }

  return (
    <div className="min-h-screen bg-[#070604] text-[#E5D7A3] selection:bg-[#D4AF37]/30 selection:text-[#FFF] relative">
      {/* Top Luxury Header (Only on Home tab) */}
      {currentTab === 'home' && <Header onNavigateToStudy={() => setCurrentTab('study')} />}

      {/* Main Content View Container */}
      <main className="w-full">
        {currentTab === 'home' && (
          <DashboardView
            onNavigateToStudy={() => setCurrentTab('study')}
            onNavigateToLibrary={() => setCurrentTab('library')}
            onNavigateToBacklog={() => {
              setCurrentTab('backlog');
              setProfileSubTab('backlog');
            }}
            onNavigateToInsights={() => setCurrentTab('insights')}
          />
        )}

        {currentTab === 'study' && <StudyTasksView />}

        {currentTab === 'insights' && <ProgressInsightsView />}

        {currentTab === 'library' && (
          <MultiPdfLibraryView onNavigateToStudy={() => setCurrentTab('study')} />
        )}

        {currentTab === 'backlog' && (
          <div className="max-w-4xl mx-auto px-4 pt-4 space-y-4">
            {/* Sub-navigation bar inside Profile tab */}
            <div className="flex items-center justify-between p-1.5 rounded-2xl bg-[#14110A] border border-[#D4AF37]/30">
              <button
                onClick={() => setProfileSubTab('backlog')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  profileSubTab === 'backlog'
                    ? 'bg-[#261F13] text-[#FFF2B2] border border-[#D4AF37] shadow-sm'
                    : 'text-[#8C8069] hover:text-white'
                }`}
              >
                <FolderClock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Dedicated Backlog Folder ({stats.backlogCount})</span>
              </button>

              <button
                onClick={() => setProfileSubTab('rest_tasks')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  profileSubTab === 'rest_tasks'
                    ? 'bg-[#261F13] text-[#FFF2B2] border border-[#D4AF37] shadow-sm'
                    : 'text-[#8C8069] hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Extra Tools Vault & Life Habits</span>
              </button>
            </div>

            {profileSubTab === 'backlog' ? (
              <BacklogView onNavigateToStudy={() => setCurrentTab('study')} />
            ) : (
              <ExtraWorksTracker />
            )}
          </div>
        )}
      </main>

      {/* Floating Action Button (Yellow Plus Circle for Top-to-Bottom Creation) */}
      <FloatingActionButton
        onNewTask={() => setShowAddTaskModal(true)}
        onNewPdf={() => setShowAddPdfModal(true)}
        onNewSubfolder={() => {
          setIsSubfolderMode(true);
          setShowAddFolderModal(true);
        }}
        onNewFolder={() => {
          setIsSubfolderMode(false);
          setShowAddFolderModal(true);
        }}
        onNewExtraTask={() => setShowAddExtraModal(true)}
      />

      {/* Persistent Luxury Bottom Navigation */}
      <BottomNav currentTab={currentTab} onSelectTab={(tab) => setCurrentTab(tab)} />

      {/* MODAL: ADD STUDY TASK */}
      {showAddTaskModal && <AddTaskModal onClose={() => setShowAddTaskModal(false)} />}

      {/* MODAL: CREATE FOLDER / SUBFOLDER */}
      {showAddFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14110A] border border-[#D4AF37]/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <FolderPlus className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-cinzel text-base font-bold text-[#FFF3BE]">
                  {isSubfolderMode ? 'Create Nested Subfolder' : 'Create Main Folder'}
                </h4>
              </div>
              <button
                onClick={() => setShowAddFolderModal(false)}
                className="text-[#8C8069] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Folder Name</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder={
                    isSubfolderMode
                      ? 'e.g. Chapter 04 Subfolder - Diagrams & Reaction Maps'
                      : 'e.g. Biology - 20 Chapters Master Vault'
                  }
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Subject Category</label>
                <select
                  value={folderSubjectId}
                  onChange={(e) => setFolderSubjectId(e.target.value as SubjectId)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddFolderModal(false)}
                  className="px-3 py-1.5 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-md"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PDF */}
      {showAddPdfModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14110A] border border-[#D4AF37]/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#D4AF37]/20">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#D4AF37]" />
                <h4 className="font-cinzel text-base font-bold text-[#FFF3BE]">
                  Add PDF Document to Vault
                </h4>
              </div>
              <button
                onClick={() => setShowAddPdfModal(false)}
                className="text-[#8C8069] hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePdf} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Document Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. Physics Formula Vault & Derivations"
                  value={pdfTitle}
                  onChange={(e) => setPdfTitle(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C7B58B] mb-1 font-semibold">Subject Vault</label>
                  <select
                    value={pdfSubjectId}
                    onChange={(e) => setPdfSubjectId(e.target.value as SubjectId)}
                    className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-span-2">
                  <label className="block text-[#C7B58B] mb-1 font-semibold flex items-center justify-between">
                    <span>Initial Number of Pages</span>
                    <span className="text-[10px] text-[#D4AF37]">Unlimited (1 to 500+ Pages)</span>
                  </label>
                  <div className="flex items-center space-x-1 mb-2">
                    {[1, 5, 10, 20, 50].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPdfPages(num)}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer border ${
                          pdfPages === num
                            ? 'bg-[#D4AF37] text-black font-bold border-white'
                            : 'bg-[#1C1710] text-[#A89878] border-[#D4AF37]/30 hover:text-white'
                        }`}
                      >
                        {num}p
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={pdfPages}
                    onChange={(e) => setPdfPages(Math.max(1, Number(e.target.value)))}
                    className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none"
                  />
                  <p className="text-[10px] text-[#8C8069] mt-1">
                    ✨ No 3-page limitation! You can add up to 500+ pages and insert more anytime inside the studio.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPdfModal(false)}
                  className="px-3 py-1.5 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-md"
                >
                  Create & Launch Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DAILY REST / EXTRA WORK */}
      {showAddExtraModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#14110A] border border-[#D4AF37]/60 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.95)] space-y-4">
            <h4 className="font-cinzel text-base font-bold text-[#FFF3BE] pb-2 border-b border-[#D4AF37]/20">
              Add Rest Task / Extra Work
            </h4>

            <form onSubmit={handleCreateExtra} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#C7B58B] mb-1 font-semibold">Habit / Task Title</label>
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="e.g. 7-Hour Sleep Recharge or 3L Water"
                  value={extraTitle}
                  onChange={(e) => setExtraTitle(e.target.value)}
                  className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#C7B58B] mb-1 font-semibold">Category</label>
                  <select
                    value={extraCategory}
                    onChange={(e) => setExtraCategory(e.target.value as ExtraTask['category'])}
                    className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none"
                  >
                    <option value="rest">Rest & Recovery</option>
                    <option value="health">Health & Hydration</option>
                    <option value="routine">Routine & Environment</option>
                    <option value="study_prep">Study Prep</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C7B58B] mb-1 font-semibold">Emoji Icon</label>
                  <input
                    type="text"
                    value={extraIcon}
                    onChange={(e) => setExtraIcon(e.target.value)}
                    className="w-full bg-[#1A160E] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-[#FFF2B2] focus:outline-none text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExtraModal(false)}
                  className="px-3 py-1.5 rounded-xl text-[#8C8069] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-black font-semibold text-xs tracking-wider uppercase hover:opacity-95 cursor-pointer shadow-md"
                >
                  Save Rest Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCUMENT STUDIO MODAL */}
      {activeStudioFileId && (
        <XodoViewer
          fileId={activeStudioFileId}
          onClose={() => setActiveStudioFileId(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <MainApp />
    </StudyProvider>
  );
}
