export type SubjectId = 'bio' | 'chem' | 'phys' | 'eng' | 'math' | string;

export interface Subject {
  id: SubjectId;
  name: string;
  code: string;
  category: string;
  color: string;
  accentColor: string;
  iconName: string;
}

export type RevisionInterval = '1d' | '3d' | '7d' | '15d' | '1m' | '2m';

export interface RevisionStage {
  interval: RevisionInterval;
  label: string;
  daysOffset: number;
  scheduledDate: string; // YYYY-MM-DD
  completed: boolean;
  completedAt?: string; // ISO string
  notes?: string;
}

export interface Task {
  id: string;
  subjectId: SubjectId;
  title: string;
  chapter?: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  initialDate: string; // YYYY-MM-DD
  stages: RevisionStage[];
  isCompleted: boolean; // true only when ALL 6 stages are completed
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  reminderCommitment?: {
    time: string; // e.g. "08:00 PM"
    committed: boolean;
    note?: string;
    setAt: string;
  };
}

export interface IdeaNote {
  id: string;
  mode: 'panther' | 'wolf';
  title: string;
  content: string;
  date: string;
  synchronized?: boolean;
}

export interface ExtraTask {
  id: string;
  title: string;
  category: 'rest' | 'health' | 'routine' | 'study_prep';
  completedDates: string[]; // list of YYYY-MM-DD dates
  targetPerWeek: number;
  icon: string;
  createdAt: string;
  dailyNotes?: Record<string, string>; // YYYY-MM-DD -> note string
}

export interface PredatorFeature {
  id: string;
  mode: 'panther' | 'wolf';
  animalTrait: string;
  studyEquivalent: string;
  scientificFact: string;
  actionGuideline: string;
  icon: string;
}

export interface ModeQuality {
  id: string;
  num: number;
  mode: 'panther' | 'wolf';
  title: string;
  urduSummary: string;
  easyRule: string;
  synchronized: boolean;
  category: string;
}

export interface PredatorFlashcard {
  id: string;
  cardNum: number;
  mode: 'panther' | 'wolf';
  question: string;
  answer: string;
  animalTrait: string;
  habitToAdopt: string;
  motivationQuote: string;
  icon: string;
  adopted?: boolean;
}

export interface MotivationPoint {
  id: string;
  mode: 'panther' | 'wolf';
  num: number;
  title: string;
  decree: string;
  urduExplanation: string;
  icon: string;
}

// Hierarchical File Manager Types (Folders -> Subfolders -> Multiple Subfolders)
export type VaultCategory = 'pdf' | 'images' | 'lectures';

export interface VaultFolder {
  id: string;
  name: string;
  parentId: string | null; // null for root folders
  category: VaultCategory;
  subjectId?: SubjectId;
  createdAt: string;
  color?: string;
}

export type HighlighterType = 'ratta' | 'mistake' | 'weak' | 'important' | 'doubt';

export interface HighlighterConfig {
  type: HighlighterType;
  label: string;
  urduName: string;
  colorHex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  badgeClass: string;
  icon: string;
}

export interface TextBlock {
  id: string;
  type: 'heading' | 'paragraph' | 'bullet' | 'formula' | 'callout';
  text: string;
  highlightType?: HighlighterType | null;
  highlightId?: string;
}

export interface DocumentPage {
  id: string;
  pageNumber: number;
  type: 'text' | 'image';
  title: string;
  blocks: TextBlock[];
  imageUrl?: string;
  blobKey?: string;
  notes?: string;
}

export interface VaultFile {
  id: string;
  folderId: string;
  category: VaultCategory;
  title: string;
  subjectId?: SubjectId;
  totalPages: number;
  fileSizeKb: number;
  lastOpened?: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  pages: DocumentPage[];
}
