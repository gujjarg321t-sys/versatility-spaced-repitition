import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Subject,
  Task,
  RevisionInterval,
  IdeaNote,
  ModeQuality,
  VaultFolder,
  VaultFile,
  VaultCategory,
  HighlighterType,
  TextBlock,
  DocumentPage,
  ExtraTask,
  PredatorFeature,
} from '../types';
import {
  DEFAULT_SUBJECTS,
  generateInitialTasks,
  INITIAL_IDEAS,
  PANTHER_QUALITIES,
  WOLF_QUALITIES,
  INITIAL_FOLDERS,
  INITIAL_FILES,
  INITIAL_EXTRA_TASKS,
  REAL_PANTHER_FEATURES,
  REAL_WOLF_FEATURES,
} from '../data/initialData';
import { requestNotificationPermission, sendRevisionNotification } from '../utils/notifications';
import {
  toISODateString,
  generateRevisionStages,
  generateUniqueId,
  isPastDate,
  isSameDay,
  addDays,
} from '../utils/dateUtils';
import {
  setIndexedDBItem,
  getIndexedDBItem,
  safeLocalStorageSet,
} from '../utils/indexedDBStorage';

interface StudyContextType {
  subjects: Subject[];
  tasks: Task[];
  ideas: IdeaNote[];
  qualities: ModeQuality[];
  toggleQualitySync: (qualityId: string) => void;
  currentDate: string; // YYYY-MM-DD
  setCurrentDate: (date: string) => void;

  // Task actions
  addTask: (data: {
    subjectId: string;
    title: string;
    chapter?: string;
    priority?: 'high' | 'medium' | 'low';
    initialDate?: string;
    tags?: string[];
  }) => Task;
  toggleStage: (taskId: string, interval: RevisionInterval, notes?: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (task: Task) => void;
  rescheduleStage: (taskId: string, interval: RevisionInterval, newDate: string) => void;
  postponeStage: (taskId: string, interval: RevisionInterval, days: number) => void;
  setTaskReminder: (taskId: string, time: string, note?: string) => void;
  clearTaskReminder: (taskId: string) => void;

  // Idea actions
  addIdea: (mode: 'panther' | 'wolf', title: string, content: string) => void;
  deleteIdea: (id: string) => void;

  // Hierarchical Vault (Folders -> Subfolders -> Multiple Subfolders)
  folders: VaultFolder[];
  vaultFiles: VaultFile[];
  addFolder: (name: string, parentId: string | null, category: VaultCategory, subjectId?: string) => VaultFolder;
  deleteFolder: (folderId: string) => void;
  renameFolder: (folderId: string, newName: string) => void;

  // Vault File & Document Studio Actions
  addVaultFile: (file: Omit<VaultFile, 'id' | 'createdAt' | 'updatedAt'>) => VaultFile;
  updateVaultFile: (file: VaultFile) => void;
  deleteVaultFile: (fileId: string) => void;
  addBlankPageToFile: (fileId: string, title?: string) => void;
  addMultipleBlankPagesToFile: (fileId: string, count: number) => void;
  attachImagePageToFile: (fileId: string, title: string, imageUrl: string, notes?: string) => void;
  updatePageBlock: (fileId: string, pageId: string, blockId: string, newText: string, highlightType?: HighlighterType | null) => void;
  deleteBlockHighlight: (fileId: string, pageId: string, blockId: string) => void;
  addBlockToPage: (fileId: string, pageId: string, text: string, type?: TextBlock['type'], highlightType?: HighlighterType | null) => void;
  deletePageBlock: (fileId: string, pageId: string, blockId: string) => void;
  deletePage: (fileId: string, pageId: string) => void;

  // Extra Works & Rest Tasks
  extraTasks: ExtraTask[];
  addExtraTask: (title: string, category?: ExtraTask['category'], icon?: string) => void;
  toggleExtraTask: (taskId: string, date: string) => void;
  deleteExtraTask: (taskId: string) => void;
  setExtraTaskDailyNote: (taskId: string, date: string, note: string) => void;

  // Real Predator Features
  realPantherFeatures: PredatorFeature[];
  realWolfFeatures: PredatorFeature[];

  // Biometrics & Notifications
  isBiometricLocked: boolean;
  unlockVault: () => void;
  lockVault: () => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;

  // Backup / Reset
  resetToDemoData: () => void;
  clearAllTasks: () => void;
  exportJSON: () => void;
  importJSON: (jsonStr: string) => boolean;

  // Computed stats
  stats: {
    totalTasks: number;
    activeTasks: number;
    completedTasks: number;
    dueTodayCount: number;
    backlogCount: number;
    totalRevisionsDone: number;
    totalRevisionsScheduled: number;
    overallProgressPercent: number;
    subjectProgress: Record<string, { total: number; completedStages: number; totalStages: number; percent: number }>;
    totalVaultFiles: number;
    totalVaultFolders: number;
    pantherSyncCount: number;
    wolfSyncCount: number;
  };
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const TASKS_STORAGE_KEY = 'versatility_tasks_v3';
const IDEAS_STORAGE_KEY = 'versatility_ideas_v3';
const QUALITIES_STORAGE_KEY = 'versatility_qualities_v3';
const FOLDERS_STORAGE_KEY = 'versatility_folders_v3';
const FILES_STORAGE_KEY = 'versatility_files_v3';
const EXTRA_TASKS_STORAGE_KEY = 'versatility_extra_tasks_v3';
const NOTIFS_STORAGE_KEY = 'versatility_notifs_v3';
const BIOMETRIC_STORAGE_KEY = 'versatility_biometric_v3';

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<string>(() => toISODateString(new Date()));
  const [subjects] = useState<Subject[]>(DEFAULT_SUBJECTS);

  // Biometric lock state (locked when opened for real fingerprint verification)
  const [isBiometricLocked, setIsBiometricLocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(BIOMETRIC_STORAGE_KEY);
      return stored === 'false' ? false : true; // Default to true so finger verification runs!
    } catch {
      return true;
    }
  });

  // Notification state
  const [notificationsEnabled, setNotificationsEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(NOTIFS_STORAGE_KEY);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  // Extra Works / Rest Tasks
  const [extraTasks, setExtraTasks] = useState<ExtraTask[]>(() => {
    try {
      const stored = localStorage.getItem(EXTRA_TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_EXTRA_TASKS;
  });

  // Initialize tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(TASKS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return generateInitialTasks(toISODateString(new Date()));
  });

  // Initialize ideas
  const [ideas, setIdeas] = useState<IdeaNote[]>(() => {
    try {
      const stored = localStorage.getItem(IDEAS_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_IDEAS;
  });

  // Initialize 20 Panther & 20 Wolf Qualities
  const [qualities, setQualities] = useState<ModeQuality[]>(() => {
    try {
      const stored = localStorage.getItem(QUALITIES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 40) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [...PANTHER_QUALITIES, ...WOLF_QUALITIES];
  });

  // Initialize Hierarchical Folders
  const [folders, setFolders] = useState<VaultFolder[]>(() => {
    try {
      const stored = localStorage.getItem(FOLDERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FOLDERS;
  });

  // Initialize Vault Files
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>(() => {
    try {
      const stored = localStorage.getItem(FILES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FILES;
  });

  // Async hydration from IndexedDB on mount
  useEffect(() => {
    let isMounted = true;
    const hydrateFromIndexedDB = async () => {
      try {
        const idbFiles = await getIndexedDBItem<VaultFile[]>(FILES_STORAGE_KEY);
        if (isMounted && Array.isArray(idbFiles) && idbFiles.length > 0) {
          setVaultFiles(idbFiles);
        }
        const idbTasks = await getIndexedDBItem<Task[]>(TASKS_STORAGE_KEY);
        if (isMounted && Array.isArray(idbTasks) && idbTasks.length > 0) {
          setTasks(idbTasks);
        }
        const idbExtraTasks = await getIndexedDBItem<ExtraTask[]>(EXTRA_TASKS_STORAGE_KEY);
        if (isMounted && Array.isArray(idbExtraTasks) && idbExtraTasks.length > 0) {
          setExtraTasks(idbExtraTasks);
        }
        const idbFolders = await getIndexedDBItem<VaultFolder[]>(FOLDERS_STORAGE_KEY);
        if (isMounted && Array.isArray(idbFolders) && idbFolders.length > 0) {
          setFolders(idbFolders);
        }
      } catch (e) {
        console.warn('Error loading from IndexedDB', e);
      }
    };
    hydrateFromIndexedDB();
    return () => {
      isMounted = false;
    };
  }, []);

  // Persist states to LocalStorage (Safe) and IndexedDB (Unlimited Capacity)
  useEffect(() => {
    safeLocalStorageSet(EXTRA_TASKS_STORAGE_KEY, JSON.stringify(extraTasks));
    setIndexedDBItem(EXTRA_TASKS_STORAGE_KEY, extraTasks);
  }, [extraTasks]);

  useEffect(() => {
    safeLocalStorageSet(NOTIFS_STORAGE_KEY, String(notificationsEnabled));
  }, [notificationsEnabled]);

  useEffect(() => {
    safeLocalStorageSet(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    setIndexedDBItem(TASKS_STORAGE_KEY, tasks);
  }, [tasks]);

  useEffect(() => {
    safeLocalStorageSet(IDEAS_STORAGE_KEY, JSON.stringify(ideas));
    setIndexedDBItem(IDEAS_STORAGE_KEY, ideas);
  }, [ideas]);

  useEffect(() => {
    safeLocalStorageSet(QUALITIES_STORAGE_KEY, JSON.stringify(qualities));
    setIndexedDBItem(QUALITIES_STORAGE_KEY, qualities);
  }, [qualities]);

  useEffect(() => {
    safeLocalStorageSet(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
    setIndexedDBItem(FOLDERS_STORAGE_KEY, folders);
  }, [folders]);

  useEffect(() => {
    safeLocalStorageSet(FILES_STORAGE_KEY, JSON.stringify(vaultFiles));
    setIndexedDBItem(FILES_STORAGE_KEY, vaultFiles);
  }, [vaultFiles]);

  const toggleQualitySync = useCallback((qualityId: string) => {
    setQualities((prev) =>
      prev.map((q) => {
        if (q.id !== qualityId) return q;
        const newSync = !q.synchronized;
        if (newSync) {
          confetti({
            particleCount: 20,
            spread: 40,
            origin: { y: 0.8 },
            colors: ['#D4AF37', '#FFF0B3'],
          });
        }
        return { ...q, synchronized: newSync };
      })
    );
  }, []);

  const addTask = useCallback(
    ({
      subjectId,
      title,
      chapter,
      priority = 'high',
      initialDate,
      tags = [],
    }: {
      subjectId: string;
      title: string;
      chapter?: string;
      priority?: 'high' | 'medium' | 'low';
      initialDate?: string;
      tags?: string[];
    }): Task => {
      const dateToUse = initialDate || currentDate;
      const stages = generateRevisionStages(dateToUse);

      const newTask: Task = {
        id: generateUniqueId(`task_${subjectId}`),
        subjectId,
        title: title.trim(),
        chapter: chapter?.trim(),
        priority,
        initialDate: dateToUse,
        stages,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags,
      };

      setTasks((prev) => [newTask, ...prev]);

      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#D4AF37', '#FFF0B3', '#AA771C'],
      });

      return newTask;
    },
    [currentDate]
  );

  const toggleStage = useCallback(
    (taskId: string, interval: RevisionInterval, notes?: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;

          const updatedStages = t.stages.map((st) => {
            if (st.interval !== interval) return st;
            const newCompleted = !st.completed;
            return {
              ...st,
              completed: newCompleted,
              completedAt: newCompleted ? new Date().toISOString() : undefined,
              notes: notes !== undefined ? notes : st.notes,
            };
          });

          const isAllCompleted = updatedStages.every((s) => s.completed);

          if (isAllCompleted) {
            confetti({
              particleCount: 100,
              spread: 80,
              origin: { y: 0.6 },
              colors: ['#D4AF37', '#FFF0B3', '#AA771C', '#FFFFFF'],
            });
          } else {
            confetti({
              particleCount: 30,
              spread: 50,
              origin: { y: 0.7 },
              colors: ['#D4AF37', '#AA771C'],
            });
          }

          return {
            ...t,
            stages: updatedStages,
            isCompleted: isAllCompleted,
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const updateTask = useCallback((updated: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }, []);

  const rescheduleStage = useCallback(
    (taskId: string, interval: RevisionInterval, newDate: string) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            stages: t.stages.map((st) =>
              st.interval === interval ? { ...st, scheduledDate: newDate, completed: false } : st
            ),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const postponeStage = useCallback(
    (taskId: string, interval: RevisionInterval, days: number) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            stages: t.stages.map((st) =>
              st.interval === interval
                ? { ...st, scheduledDate: addDays(st.scheduledDate, days), completed: false }
                : st
            ),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const setTaskReminder = useCallback((taskId: string, time: string, note?: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        return {
          ...t,
          reminderCommitment: {
            time,
            committed: true,
            note: note || 'Committed to revise on schedule',
            setAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const clearTaskReminder = useCallback((taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const { reminderCommitment, ...rest } = t;
        return {
          ...rest,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const addIdea = useCallback((mode: 'panther' | 'wolf', title: string, content: string) => {
    const newIdea: IdeaNote = {
      id: generateUniqueId(`idea_${mode}`),
      mode,
      title: title.trim(),
      content: content.trim(),
      date: toISODateString(new Date()),
      synchronized: true,
    };
    setIdeas((prev) => [newIdea, ...prev]);
  }, []);

  const deleteIdea = useCallback((id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }, []);

  // FOLDER ACTIONS
  const addFolder = useCallback(
    (name: string, parentId: string | null, category: VaultCategory, subjectId?: string): VaultFolder => {
      const newF: VaultFolder = {
        id: generateUniqueId(`folder_${category}`),
        name: name.trim(),
        parentId,
        category,
        subjectId,
        createdAt: toISODateString(new Date()),
      };
      setFolders((prev) => [...prev, newF]);
      return newF;
    },
    []
  );

  const deleteFolder = useCallback((folderId: string) => {
    // Delete folder and all its child folders/files recursively
    setFolders((prev) => {
      const getChildFolderIds = (id: string): string[] => {
        const children = prev.filter((f) => f.parentId === id);
        return [id, ...children.flatMap((c) => getChildFolderIds(c.id))];
      };
      const idsToDelete = new Set(getChildFolderIds(folderId));
      return prev.filter((f) => !idsToDelete.has(f.id));
    });

    setVaultFiles((prev) => prev.filter((file) => file.folderId !== folderId));
  }, []);

  const renameFolder = useCallback((folderId: string, newName: string) => {
    setFolders((prev) =>
      prev.map((f) => (f.id === folderId ? { ...f, name: newName.trim() } : f))
    );
  }, []);

  // VAULT FILE ACTIONS
  const addVaultFile = useCallback(
    (fileData: Omit<VaultFile, 'id' | 'createdAt' | 'updatedAt'>): VaultFile => {
      const newFile: VaultFile = {
        ...fileData,
        id: generateUniqueId(`file_${fileData.category}`),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setVaultFiles((prev) => [newFile, ...prev]);
      return newFile;
    },
    []
  );

  const updateVaultFile = useCallback((file: VaultFile) => {
    setVaultFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...file, updatedAt: new Date().toISOString() } : f))
    );
  }, []);

  const deleteVaultFile = useCallback((fileId: string) => {
    setVaultFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  // DOCUMENT STUDIO EDITING: BLANK PAGES, IMAGES, TEXT, AND HIGHLIGHTERS
  const addBlankPageToFile = useCallback((fileId: string, title?: string) => {
    setVaultFiles((prev) =>
      prev.map((file) => {
        if (file.id !== fileId) return file;
        const newPageNum = file.pages.length + 1;
        const newPage: DocumentPage = {
          id: generateUniqueId('page'),
          pageNumber: newPageNum,
          type: 'text',
          title: title || `Page ${newPageNum} (Notes & Synthesis)`,
          blocks: [
            {
              id: generateUniqueId('block'),
              type: 'heading',
              text: `Section ${newPageNum}: Topic Key Notes`,
            },
            {
              id: generateUniqueId('block'),
              type: 'paragraph',
              text: 'Click this text to write notes, formulas, or highlight key memorization items.',
            },
          ],
        };
        return {
          ...file,
          totalPages: file.pages.length + 1,
          pages: [...file.pages, newPage],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const addMultipleBlankPagesToFile = useCallback((fileId: string, count: number) => {
    setVaultFiles((prev) =>
      prev.map((file) => {
        if (file.id !== fileId) return file;
        const currentCount = file.pages.length;
        const pagesToAdd = Math.max(1, count);
        const newPages: DocumentPage[] = Array.from({ length: pagesToAdd }, (_, idx) => {
          const num = currentCount + idx + 1;
          return {
            id: generateUniqueId('page'),
            pageNumber: num,
            type: 'text',
            title: `Page ${num} (Study Concept)`,
            blocks: [
              {
                id: generateUniqueId('block'),
                type: 'heading',
                text: `Topic ${num}: Core Notes & Formulas`,
              },
              {
                id: generateUniqueId('block'),
                type: 'paragraph',
                text: 'Click here to write notes, formulas, or highlight key memorization items.',
              },
            ],
          };
        });

        return {
          ...file,
          totalPages: file.pages.length + pagesToAdd,
          pages: [...file.pages, ...newPages],
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const attachImagePageToFile = useCallback(
    (fileId: string, title: string, imageUrl: string, notes?: string) => {
      setVaultFiles((prev) =>
        prev.map((file) => {
          if (file.id !== fileId) return file;
          const newPageNum = file.pages.length + 1;
          const detectedNotes =
            notes ||
            (imageUrl.startsWith('data:application/pdf') || imageUrl.includes('application/pdf')
              ? 'pdf_file'
              : imageUrl.startsWith('data:video')
              ? 'video_file'
              : undefined);

          const newPage: DocumentPage = {
            id: generateUniqueId('page'),
            pageNumber: newPageNum,
            type: 'image',
            title: title || `Attached Asset (Page ${newPageNum})`,
            imageUrl,
            notes: detectedNotes,
            blocks: [
              {
                id: generateUniqueId('block'),
                type: 'paragraph',
                text: 'Attached Document / Diagram. Click text to edit notes or use highlighters.',
              },
            ],
          };
          return {
            ...file,
            totalPages: file.pages.length + 1,
            pages: [...file.pages, newPage],
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const updatePageBlock = useCallback(
    (
      fileId: string,
      pageId: string,
      blockId: string,
      newText: string,
      highlightType?: HighlighterType | null
    ) => {
      setVaultFiles((prev) =>
        prev.map((file) => {
          if (file.id !== fileId) return file;
          return {
            ...file,
            pages: file.pages.map((page) => {
              if (page.id !== pageId) return page;
              return {
                ...page,
                blocks: page.blocks.map((block) => {
                  if (block.id !== blockId) return block;
                  return {
                    ...block,
                    text: newText,
                    highlightType:
                      highlightType !== undefined ? highlightType : block.highlightType,
                  };
                }),
              };
            }),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const deleteBlockHighlight = useCallback(
    (fileId: string, pageId: string, blockId: string) => {
      setVaultFiles((prev) =>
        prev.map((file) => {
          if (file.id !== fileId) return file;
          return {
            ...file,
            pages: file.pages.map((page) => {
              if (page.id !== pageId) return page;
              return {
                ...page,
                blocks: page.blocks.map((block) => {
                  if (block.id !== blockId) return block;
                  return {
                    ...block,
                    highlightType: null,
                    highlightId: undefined,
                  };
                }),
              };
            }),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const addBlockToPage = useCallback(
    (
      fileId: string,
      pageId: string,
      text: string,
      type: TextBlock['type'] = 'paragraph',
      highlightType: HighlighterType | null = null
    ) => {
      setVaultFiles((prev) =>
        prev.map((file) => {
          if (file.id !== fileId) return file;
          return {
            ...file,
            pages: file.pages.map((page) => {
              if (page.id !== pageId) return page;
              const newBlock: TextBlock = {
                id: generateUniqueId('block'),
                type,
                text,
                highlightType,
              };
              return {
                ...page,
                blocks: [...page.blocks, newBlock],
              };
            }),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const deletePageBlock = useCallback(
    (fileId: string, pageId: string, blockId: string) => {
      setVaultFiles((prev) =>
        prev.map((file) => {
          if (file.id !== fileId) return file;
          return {
            ...file,
            pages: file.pages.map((page) => {
              if (page.id !== pageId) return page;
              return {
                ...page,
                blocks: page.blocks.filter((b) => b.id !== blockId),
              };
            }),
            updatedAt: new Date().toISOString(),
          };
        })
      );
    },
    []
  );

  const deletePage = useCallback((fileId: string, pageId: string) => {
    setVaultFiles((prev) =>
      prev.map((file) => {
        if (file.id !== fileId) return file;
        const filteredPages = file.pages.filter((p) => p.id !== pageId);
        // renumber
        const renumbered = filteredPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
        return {
          ...file,
          totalPages: renumbered.length,
          pages: renumbered,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  }, []);

  const resetToDemoData = useCallback(() => {
    const newTasks = generateInitialTasks(currentDate);
    setTasks(newTasks);
    setIdeas(INITIAL_IDEAS);
    setQualities([...PANTHER_QUALITIES, ...WOLF_QUALITIES]);
    setFolders(INITIAL_FOLDERS);
    setVaultFiles(INITIAL_FILES);
    localStorage.removeItem(TASKS_STORAGE_KEY);
    localStorage.removeItem(IDEAS_STORAGE_KEY);
    localStorage.removeItem(QUALITIES_STORAGE_KEY);
    localStorage.removeItem(FOLDERS_STORAGE_KEY);
    localStorage.removeItem(FILES_STORAGE_KEY);
  }, [currentDate]);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const exportJSON = useCallback(() => {
    const data = {
      app: 'VERSATILITY',
      version: '3.0',
      exportedAt: new Date().toISOString(),
      tasks,
      ideas,
      qualities,
      folders,
      vaultFiles,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `versatility_vault_backup_${currentDate}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [tasks, ideas, qualities, folders, vaultFiles, currentDate]);

  const importJSON = useCallback((jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed) {
        if (Array.isArray(parsed.tasks)) setTasks(parsed.tasks);
        if (Array.isArray(parsed.ideas)) setIdeas(parsed.ideas);
        if (Array.isArray(parsed.qualities)) setQualities(parsed.qualities);
        if (Array.isArray(parsed.folders)) setFolders(parsed.folders);
        if (Array.isArray(parsed.vaultFiles)) setVaultFiles(parsed.vaultFiles);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }, []);

  const stats = useMemo(() => {
    let dueTodayCount = 0;
    let backlogCount = 0;
    let totalRevisionsDone = 0;
    let totalRevisionsScheduled = 0;

    const subjectProgress: Record<
      string,
      { total: number; completedStages: number; totalStages: number; percent: number }
    > = {};

    subjects.forEach((s) => {
      subjectProgress[s.id] = { total: 0, completedStages: 0, totalStages: 0, percent: 0 };
    });

    tasks.forEach((t) => {
      let isTaskInBacklog = false;

      if (!subjectProgress[t.subjectId]) {
        subjectProgress[t.subjectId] = { total: 0, completedStages: 0, totalStages: 0, percent: 0 };
      }
      subjectProgress[t.subjectId].total += 1;

      t.stages.forEach((st) => {
        totalRevisionsScheduled += 1;
        subjectProgress[t.subjectId].totalStages += 1;

        if (st.completed) {
          totalRevisionsDone += 1;
          subjectProgress[t.subjectId].completedStages += 1;
        } else {
          if (isSameDay(st.scheduledDate, currentDate)) {
            dueTodayCount += 1;
          } else if (isPastDate(st.scheduledDate, currentDate)) {
            isTaskInBacklog = true;
          }
        }
      });

      if (!t.isCompleted && isTaskInBacklog) {
        backlogCount += 1;
      }
    });

    Object.keys(subjectProgress).forEach((sId) => {
      const s = subjectProgress[sId];
      s.percent = s.totalStages > 0 ? Math.round((s.completedStages / s.totalStages) * 100) : 0;
    });

    const overallProgressPercent =
      totalRevisionsScheduled > 0
        ? Math.round((totalRevisionsDone / totalRevisionsScheduled) * 100)
        : 0;

    const completedTasks = tasks.filter((t) => t.isCompleted).length;
    const activeTasks = tasks.length - completedTasks;

    const pantherSyncCount = qualities.filter((q) => q.mode === 'panther' && q.synchronized).length;
    const wolfSyncCount = qualities.filter((q) => q.mode === 'wolf' && q.synchronized).length;

    return {
      totalTasks: tasks.length,
      activeTasks,
      completedTasks,
      dueTodayCount,
      backlogCount,
      totalRevisionsDone,
      totalRevisionsScheduled,
      overallProgressPercent,
      subjectProgress,
      totalVaultFiles: vaultFiles.length,
      totalVaultFolders: folders.length,
      pantherSyncCount,
      wolfSyncCount,
    };
  }, [tasks, currentDate, subjects, vaultFiles, folders, qualities]);

  // Extra Works & Rest Actions
  const addExtraTask = useCallback((title: string, category: ExtraTask['category'] = 'routine', icon = '✨') => {
    const newTask: ExtraTask = {
      id: generateUniqueId('extra'),
      title: title.trim(),
      category,
      completedDates: [],
      targetPerWeek: 7,
      icon,
      createdAt: new Date().toISOString(),
    };
    setExtraTasks((prev) => [newTask, ...prev]);
  }, []);

  const toggleExtraTask = useCallback((taskId: string, date: string) => {
    setExtraTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const exists = t.completedDates.includes(date);
        const updatedDates = exists
          ? t.completedDates.filter((d) => d !== date)
          : [...t.completedDates, date];

        if (!exists) {
          confetti({
            particleCount: 20,
            spread: 40,
            origin: { y: 0.8 },
            colors: ['#D4AF37', '#FFF0B3'],
          });
        }

        return { ...t, completedDates: updatedDates };
      })
    );
  }, []);

  const deleteExtraTask = useCallback((taskId: string) => {
    setExtraTasks((prev) => prev.filter((t) => t.id !== taskId));
  }, []);

  const setExtraTaskDailyNote = useCallback((taskId: string, date: string, note: string) => {
    setExtraTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const currentNotes = t.dailyNotes || {};
        return {
          ...t,
          dailyNotes: {
            ...currentNotes,
            [date]: note.trim(),
          },
        };
      })
    );
  }, []);

  // Biometric & Notification Actions
  const unlockVault = useCallback(() => {
    setIsBiometricLocked(false);
    try {
      localStorage.setItem(BIOMETRIC_STORAGE_KEY, 'false');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const lockVault = useCallback(() => {
    setIsBiometricLocked(true);
    try {
      localStorage.setItem(BIOMETRIC_STORAGE_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const setNotificationsEnabled = useCallback(async (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    if (enabled) {
      const granted = await requestNotificationPermission();
      if (granted) {
        sendRevisionNotification(
          'Notifications Enabled',
          'Spaced repetition reminders will alert you when revisions are due.'
        );
      }
    }
  }, []);

  return (
    <StudyContext.Provider
      value={{
        subjects,
        tasks,
        ideas,
        qualities,
        toggleQualitySync,
        currentDate,
        setCurrentDate,
        addTask,
        toggleStage,
        deleteTask,
        updateTask,
        rescheduleStage,
        postponeStage,
        setTaskReminder,
        clearTaskReminder,
        addIdea,
        deleteIdea,
        folders,
        vaultFiles,
        addFolder,
        deleteFolder,
        renameFolder,
        addVaultFile,
        updateVaultFile,
        deleteVaultFile,
        addBlankPageToFile,
        addMultipleBlankPagesToFile,
        attachImagePageToFile,
        updatePageBlock,
        deleteBlockHighlight,
        addBlockToPage,
        deletePageBlock,
        deletePage,
        extraTasks,
        addExtraTask,
        toggleExtraTask,
        deleteExtraTask,
        setExtraTaskDailyNote,
        realPantherFeatures: REAL_PANTHER_FEATURES,
        realWolfFeatures: REAL_WOLF_FEATURES,
        isBiometricLocked,
        unlockVault,
        lockVault,
        notificationsEnabled,
        setNotificationsEnabled,
        resetToDemoData,
        clearAllTasks,
        exportJSON,
        importJSON,
        stats,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export function useStudy() {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
}
