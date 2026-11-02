import {
  Subject,
  Task,
  IdeaNote,
  ModeQuality,
  VaultFolder,
  VaultFile,
  DocumentPage,
  ExtraTask,
  PredatorFeature,
} from '../types';
import { addDays, toISODateString, generateRevisionStages, generateUniqueId } from '../utils/dateUtils';

// REAL BIOLOGICAL & PREDATORY FEATURES OF PANTHER & WOLF
export const REAL_PANTHER_FEATURES: PredatorFeature[] = [
  {
    id: 'panther_paws',
    mode: 'panther',
    animalTrait: 'Silent Velvet Padded Paws (Shock-Absorbing Footpads)',
    studyEquivalent: 'Stealth Study Protocol: 0 Noise, 0 Boasting',
    scientificFact: 'Panther paws have thick fibrous shock-absorbers that eliminate vibration so prey hears nothing until it is too late.',
    actionGuideline: 'Never announce your study hours on social media or to friends. Execute your study sessions in total stealth; let test scores speak.',
    icon: '🐾',
  },
  {
    id: 'panther_eyes',
    mode: 'panther',
    animalTrait: 'Tapetum Lucidum (Low-Light Night Eyes)',
    studyEquivalent: 'Night Prowl / Dark Focus Window',
    scientificFact: 'Panthers possess 6x more retinal rods than humans and a reflective retroreflector layer behind retina for acute night sight.',
    actionGuideline: 'Utilize 2 early-dawn or late-night quiet hours when ordinary students are sleeping to digest your hardest topics.',
    icon: '👁️',
  },
  {
    id: 'panther_ambush',
    mode: 'panther',
    animalTrait: '60 km/h Explosive Ambush Sprint',
    studyEquivalent: '50-Minute Hyper-Sprint (No Warm-Up Lag)',
    scientificFact: 'High percentage of Type IIx fast-twitch muscle fibers deliver maximum explosive force in rapid bursts.',
    actionGuideline: 'Count 5-4-3-2-1 and sprint straight into solving past papers with zero hesitation or mindless phone browsing.',
    icon: '⚡',
  },
  {
    id: 'panther_claws',
    mode: 'panther',
    animalTrait: 'Retractable Razor Claws',
    studyEquivalent: 'Surgical Error Elimination',
    scientificFact: 'Claws stay safely sheathed inside keratin sheaths while walking to preserve razor sharpness for the strike.',
    actionGuideline: 'Keep your mental energy sheathed away from arguments and trivia so your cognitive sharpness remains lethal for exam papers.',
    icon: '🗡️',
  },
  {
    id: 'panther_hoist',
    mode: 'panther',
    animalTrait: 'Vertical Tree Hoisting (50kg in Jaws)',
    studyEquivalent: 'Tackling the Heaviest Subject First',
    scientificFact: 'Extreme neck and scapular musculature enables climbing trees vertically while carrying prey heavier than its own body.',
    actionGuideline: 'Hoist the hardest conceptual chapter up first thing in the morning; once the beast is conquered, the rest of the day is light.',
    icon: '🌲',
  },
  {
    id: 'panther_solitary',
    mode: 'panther',
    animalTrait: 'Solitary Jungle Sovereign (No Pack Dependency)',
    studyEquivalent: 'Detachment from Peer Noise & Drama',
    scientificFact: 'Panthers thrive completely alone across vast territories, avoiding unnecessary pack friction.',
    actionGuideline: 'Do not wait for study groups or friend validation. You are sovereign over your own syllabus and destiny.',
    icon: '👑',
  },
  {
    id: 'panther_ears',
    mode: 'panther',
    animalTrait: '180° Independent Ear Swivel',
    studyEquivalent: 'Sensory Signal Filter',
    scientificFact: 'Ear pinnae rotate independently to filter out rustling wind and pinpoint the specific pulse of target prey.',
    actionGuideline: 'Block out casual opinions, gossip, and syllabus fearmongering. Lock your ears strictly onto high-yield syllabus facts.',
    icon: '🎯',
  },
];

export const REAL_WOLF_FEATURES: PredatorFeature[] = [
  {
    id: 'wolf_stamina',
    mode: 'wolf',
    animalTrait: 'Marathon Aerobic Trot (60km Non-Stop Pursuit)',
    studyEquivalent: 'Relentless Long-Haul Study Stamina',
    scientificFact: 'Wolves have large hearts, oversized lungs, and slow-twitch muscle density allowing continuous pursuit until prey tires.',
    actionGuideline: 'When study fatigue sets in at hour 4, maintain a calm rhythmic pace for 20 more minutes. The wolf conquers through endurance.',
    icon: '🐺',
  },
  {
    id: 'wolf_jaw',
    mode: 'wolf',
    animalTrait: '400 PSI Bone-Crushing Jaw Pressure',
    studyEquivalent: 'Cracking Difficult Derivations to the Core',
    scientificFact: 'Jaw morphology generates double the bite force of large domestic dogs, easily cracking open femur bones to reach marrow.',
    actionGuideline: 'Do not just memorize surface definitions. Crack open the toughest derivations and mechanisms until you understand the deep core.',
    icon: '🦴',
  },
  {
    id: 'wolf_territory',
    mode: 'wolf',
    animalTrait: 'Uncompromising Territory Defense & Patrol',
    studyEquivalent: 'Spaced Repetition Schedule Loyalty',
    scientificFact: 'Wolves patrol and mark hundreds of miles of territory boundaries, never allowing rival packs to breach their zone.',
    actionGuideline: 'Defend your 1d, 3d, 7d, 15d, 1m, 2m revision calendar like sacred territory. Never let a single revision date lapse.',
    icon: '🛡️',
  },
  {
    id: 'wolf_howl',
    mode: 'wolf',
    animalTrait: '10-Mile Low-Frequency Howl Communication',
    studyEquivalent: 'Feynman Active Recall & Verbal Articulation',
    scientificFact: 'Deep fundamental frequencies travel across mountains to synchronize the entire pack across immense distances.',
    actionGuideline: 'Explain complex concepts out loud in simple, authoritative terms. Speaking concepts aloud hardwires them into permanent memory.',
    icon: '🗣️',
  },
  {
    id: 'wolf_coat',
    mode: 'wolf',
    animalTrait: 'Dual-Layer Insulation Coat (-40°C Blizzard Survival)',
    studyEquivalent: 'Discomfort Immunity & Weather Resistance',
    scientificFact: 'Dense water-resistant underfur traps warm air pockets while coarse outer guard hairs repel snow and freezing wind.',
    actionGuideline: 'Study whether you feel warm, cold, cheerful, or stressed. The wolf thrives in harsh conditions; comfort is never required.',
    icon: '❄️',
  },
  {
    id: 'wolf_hierarchy',
    mode: 'wolf',
    animalTrait: 'Alpha Leadership & Self-Mastery Code',
    studyEquivalent: 'Duty Over Emotion (Zero Impulsivity)',
    scientificFact: 'The Alpha pair directs the pack with calm visual cues rather than chaotic barking, embodying steady emotional poise.',
    actionGuideline: 'Rule your impulses with absolute authority. Study because it is your royal duty, not because you feel like it.',
    icon: '⚔️',
  },
  {
    id: 'wolf_den',
    mode: 'wolf',
    animalTrait: 'Den Sanctuary Protection',
    studyEquivalent: 'Daily Rest & Routine Task Defense',
    scientificFact: 'The pack protects the den and ensures all basic sustenance and rest routines are met to sustain future generations.',
    actionGuideline: 'Never sacrifice fundamental rest, hydration, and review routines. Defend your health to sustain supreme cognitive dominance.',
    icon: '🏛️',
  },
];

// INITIAL REST TASKS & EXTRA WORKS (DAY-TO-DAY CONSISTENCY CHECK)
export const INITIAL_EXTRA_TASKS: ExtraTask[] = [
  {
    id: 'extra_quran',
    title: 'Quran Recitation & Daily Reflection',
    category: 'routine',
    completedDates: [toISODateString(new Date()), addDays(toISODateString(new Date()), -1), addDays(toISODateString(new Date()), -2)],
    targetPerWeek: 7,
    icon: '📖',
    createdAt: '2026-10-01',
    dailyNotes: { [toISODateString(new Date())]: 'Recited Surah Yaseen & Surah Mulk with tajweed' },
  },
  {
    id: 'extra_meditation',
    title: 'Mindfulness & Deep Meditation',
    category: 'rest',
    completedDates: [toISODateString(new Date()), addDays(toISODateString(new Date()), -1)],
    targetPerWeek: 7,
    icon: '🧘',
    createdAt: '2026-10-01',
    dailyNotes: { [toISODateString(new Date())]: '15 minutes deep breathing & mental clarity reset' },
  },
  {
    id: 'extra_exercise',
    title: 'Physical Workout & Cardio Exercise',
    category: 'health',
    completedDates: [toISODateString(new Date())],
    targetPerWeek: 6,
    icon: '🏋️',
    createdAt: '2026-10-01',
    dailyNotes: { [toISODateString(new Date())]: '30 min HIIT cardio & 25 pushups' },
  },
  {
    id: 'extra_reading',
    title: 'Book Reading & Wisdom Notes',
    category: 'study_prep',
    completedDates: [toISODateString(new Date()), addDays(toISODateString(new Date()), -1)],
    targetPerWeek: 7,
    icon: '📚',
    createdAt: '2026-10-01',
    dailyNotes: { [toISODateString(new Date())]: 'Read 15 pages of Atomic Habits Chapter 4' },
  },
  {
    id: 'extra_personality',
    title: 'Personality Development & Posture Mastery',
    category: 'routine',
    completedDates: [toISODateString(new Date())],
    targetPerWeek: 7,
    icon: '👑',
    createdAt: '2026-10-01',
    dailyNotes: { [toISODateString(new Date())]: 'Spoken English clarity & royal posture practice' },
  },
  {
    id: 'extra_drawing',
    title: 'Creative Drawing & Anatomical Art',
    category: 'study_prep',
    completedDates: [toISODateString(new Date()), addDays(toISODateString(new Date()), -2)],
    targetPerWeek: 5,
    icon: '🎨',
    createdAt: '2026-10-01',
    dailyNotes: { [toISODateString(new Date())]: 'Sketched human heart anatomical cross-section' },
  },
  {
    id: 'extra_selfcare',
    title: 'Self Care & Skincare Grooming Ritual',
    category: 'health',
    completedDates: [toISODateString(new Date()), addDays(toISODateString(new Date()), -1)],
    targetPerWeek: 7,
    icon: '🧴',
    createdAt: '2026-10-01',
  },
  {
    id: 'extra_sleep',
    title: '7-Hour Deep Memory Lock Sleep',
    category: 'rest',
    completedDates: [toISODateString(new Date()), addDays(toISODateString(new Date()), -1), addDays(toISODateString(new Date()), -2)],
    targetPerWeek: 7,
    icon: '🌙',
    createdAt: '2026-10-01',
  },
  {
    id: 'extra_hydration',
    title: '3 Litres Water & Electrolytes',
    category: 'health',
    completedDates: [toISODateString(new Date()), addDays(toISODateString(new Date()), -1)],
    targetPerWeek: 7,
    icon: '💧',
    createdAt: '2026-10-01',
  },
];

export const DEFAULT_SUBJECTS: Subject[] = [
  {
    id: 'bio',
    name: 'Biology',
    code: 'BIO',
    category: 'Medical & Life Sciences',
    color: '#D4AF37',
    accentColor: '#38bdf8',
    iconName: 'Dna',
  },
  {
    id: 'chem',
    name: 'Chemistry',
    code: 'CHEM',
    category: 'Organic & Inorganic',
    color: '#F59E0B',
    accentColor: '#ec4899',
    iconName: 'FlaskConical',
  },
  {
    id: 'phys',
    name: 'Physics',
    code: 'PHYS',
    category: 'Mechanics & Modern',
    color: '#EAB308',
    accentColor: '#8b5cf6',
    iconName: 'Atom',
  },
  {
    id: 'eng',
    name: 'English',
    code: 'ENG',
    category: 'Literature & Linguistics',
    color: '#C084FC',
    accentColor: '#06b6d4',
    iconName: 'BookOpen',
  },
  {
    id: 'math',
    name: 'Mathematics',
    code: 'MATH',
    category: 'Calculus & Applied',
    color: '#34D399',
    accentColor: '#f97316',
    iconName: 'Calculator',
  },
];

// 20 PANTHER MODE QUALITIES (Stealth, High Focus, Speed, Zero Distraction)
export const PANTHER_QUALITIES: ModeQuality[] = [
  {
    id: 'pq_1',
    num: 1,
    mode: 'panther',
    title: 'Silent Stride (Khamosh Mehnat)',
    urduSummary: 'kisi ko mat batao kitna parha hai',
    easyRule: 'Never announce your target chapter. Study in silence; let your top test score do the roaring.',
    synchronized: true,
    category: 'Stealth',
  },
  {
    id: 'pq_2',
    num: 2,
    mode: 'panther',
    title: 'Zero Distraction Trap (Phone Away)',
    urduSummary: 'parhai k doran mobile door rkhna',
    easyRule: 'Put your phone in another room on airplane mode. The panther never lets its prey slip away.',
    synchronized: true,
    category: 'Focus',
  },
  {
    id: 'pq_3',
    num: 3,
    mode: 'panther',
    title: '50-Minute Sprint (Hyper Focus)',
    urduSummary: '50 minute continuous focus',
    easyRule: 'Set a 50-minute timer. During this window, look at nothing except your textbook and notes.',
    synchronized: true,
    category: 'Speed',
  },
  {
    id: 'pq_4',
    num: 4,
    mode: 'panther',
    title: 'One Prey at a Time (No Multitasking)',
    urduSummary: 'aik waqt m aik topic finish krna',
    easyRule: 'Do not juggle 3 subjects together. Master one chapter completely before opening the next.',
    synchronized: false,
    category: 'Precision',
  },
  {
    id: 'pq_5',
    num: 5,
    mode: 'panther',
    title: '5-Second Rule (No Laziness)',
    urduSummary: '5 seconds m parhnay baith jana',
    easyRule: 'Count 5-4-3-2-1 and sit at your desk immediately. Never negotiate with excuses.',
    synchronized: true,
    category: 'Execution',
  },
  {
    id: 'pq_6',
    num: 6,
    mode: 'panther',
    title: 'High-Yield Hunter (80/20 Rule)',
    urduSummary: 'sub sy ahem topics pehle krna',
    easyRule: 'Find the 20% core topics that guarantee 80% exam marks and conquer them first.',
    synchronized: false,
    category: 'Strategy',
  },
  {
    id: 'pq_7',
    num: 7,
    mode: 'panther',
    title: 'Active Recall Strike (Close-Book Test)',
    urduSummary: 'parh k kitab bnd kr k sunana',
    easyRule: 'Read a paragraph once, close the book, and speak the whole concept out loud from memory.',
    synchronized: true,
    category: 'Retention',
  },
  {
    id: 'pq_8',
    num: 8,
    mode: 'panther',
    title: 'Clean Territory (Minimalist Desk)',
    urduSummary: 'desk pr koi faltu cheez na ho',
    easyRule: 'Only one pen, one notebook, and water bottle on desk. Clutter creates confusion.',
    synchronized: false,
    category: 'Environment',
  },
  {
    id: 'pq_9',
    num: 9,
    mode: 'panther',
    title: 'Fast MCQs Blitz (Speed Reflexes)',
    urduSummary: 'ghari lga k sawal hal krna',
    easyRule: 'Practice 30 MCQs in 30 minutes with a stopwatch. Train your brain to be fast and lethal.',
    synchronized: true,
    category: 'Speed',
  },
  {
    id: 'pq_10',
    num: 10,
    mode: 'panther',
    title: 'Weak Chapter Attack (Strike the Weakness)',
    urduSummary: 'sub sy mushkil topic subah pehle krna',
    easyRule: 'Study your most feared subject first thing in the morning when your mental energy is at 100%.',
    synchronized: false,
    category: 'Bravery',
  },
  {
    id: 'pq_11',
    num: 11,
    mode: 'panther',
    title: 'Night Prowl / Early Dawn Peak',
    urduSummary: 'jis time shor na ho us waqt parhna',
    easyRule: 'Pick 2 golden quiet hours early morning or late night when the world is completely silent.',
    synchronized: true,
    category: 'Timing',
  },
  {
    id: 'pq_12',
    num: 12,
    mode: 'panther',
    title: 'Instant Error Surgery',
    urduSummary: 'ghalat sawal ko foran theek krna',
    easyRule: 'When you get an MCQ wrong, find the exact line in book immediately so you never repeat it.',
    synchronized: false,
    category: 'Precision',
  },
  {
    id: 'pq_13',
    num: 13,
    mode: 'panther',
    title: '3-Second Formula Recall',
    urduSummary: 'formula 3 second m yaad aana chahye',
    easyRule: 'Formulas and chemical reactions must be memorized until your hand writes them without pause.',
    synchronized: true,
    category: 'Retention',
  },
  {
    id: 'pq_14',
    num: 14,
    mode: 'panther',
    title: 'Quiet Energy (Light Meals)',
    urduSummary: 'parhai k time halka khana khana',
    easyRule: 'Avoid heavy oily meals before studying so your blood feeds your brain, not sleepy stomach.',
    synchronized: false,
    category: 'Energy',
  },
  {
    id: 'pq_15',
    num: 15,
    mode: 'panther',
    title: 'Feynman Simplification',
    urduSummary: 'itna asan smjhein jesy bachy ko parhana ho',
    easyRule: 'Explain complex chapters in simple mother-tongue words. If you can explain it easily, you know it.',
    synchronized: true,
    category: 'Mastery',
  },
  {
    id: 'pq_16',
    num: 16,
    mode: 'panther',
    title: 'Stealth Recovery (10-Min Power Rest)',
    urduSummary: 'thak jao to 10 min aankhein bnd krna',
    easyRule: 'When brain is saturated, close your eyes for 10 minutes in silence. Do not scroll reels.',
    synchronized: false,
    category: 'Recovery',
  },
  {
    id: 'pq_17',
    num: 17,
    mode: 'panther',
    title: 'No Gossip / No Comparison',
    urduSummary: 'doosro sy muqabla kr k waqt barbad na krna',
    easyRule: 'Do not ask other students how much they studied. You are on your own royal path.',
    synchronized: true,
    category: 'Discipline',
  },
  {
    id: 'pq_18',
    num: 18,
    mode: 'panther',
    title: 'Daily Secret Scorecard',
    urduSummary: 'raat ko private record dekhna',
    easyRule: 'Count your solved questions and hours in your private vault every night before sleep.',
    synchronized: false,
    category: 'Measurement',
  },
  {
    id: 'pq_19',
    num: 19,
    mode: 'panther',
    title: 'Adaptable to Any Noise',
    urduSummary: 'mahol jesa bi ho parhai jari rkhna',
    easyRule: 'Train your brain to study even with background chatter. The panther rules in every jungle.',
    synchronized: true,
    category: 'Resilience',
  },
  {
    id: 'pq_20',
    num: 20,
    mode: 'panther',
    title: 'Exam Day Ice Poise',
    urduSummary: 'paper waly din bilkul pur-sukoon rehna',
    easyRule: 'Take 3 deep slow breaths before opening exam paper. Confidence is born from disciplined prep.',
    synchronized: true,
    category: 'Mastery',
  },
];

// 20 WOLF MODE QUALITIES (Discipline, Leadership, Relentless Stamina, Mental Toughness)
export const WOLF_QUALITIES: ModeQuality[] = [
  {
    id: 'wq_1',
    num: 1,
    mode: 'wolf',
    title: 'Alpha Fixed Routine',
    urduSummary: 'roz aik hi waqt pr uthna aur sonaa',
    easyRule: 'Wake up at the exact same hour every morning. The leader sets the rhythm of the empire.',
    synchronized: true,
    category: 'Routine',
  },
  {
    id: 'wq_2',
    num: 2,
    mode: 'wolf',
    title: 'The Unbroken Chain (Spaced Repetition)',
    urduSummary: '1d, 3d, 7d revision kbi miss na krna',
    easyRule: 'Stick to the 1d, 3d, 7d, 15d, 1m, 2m revision calendar without fail. The pack leaves no gap.',
    synchronized: true,
    category: 'Loyalty',
  },
  {
    id: 'wq_3',
    num: 3,
    mode: 'wolf',
    title: 'Endurance Beyond Fatigue',
    urduSummary: 'thakawat k bad 20 minute mazeed khinchna',
    easyRule: 'When you want to quit, study for just 20 more minutes. That extra mile is where toppers are made.',
    synchronized: true,
    category: 'Stamina',
  },
  {
    id: 'wq_4',
    num: 4,
    mode: 'wolf',
    title: 'No Mood Dependence',
    urduSummary: 'dil chahy ya na chahy kam krna',
    easyRule: 'Amateurs wait for motivation; wolves work out of ruthless duty. Study regardless of your feelings.',
    synchronized: true,
    category: 'Mental Toughness',
  },
  {
    id: 'wq_5',
    num: 5,
    mode: 'wolf',
    title: 'Embrace Tough Past Papers',
    urduSummary: 'mushkil sawalat sy darna nahi',
    easyRule: 'Tough past papers are not obstacles; they are the weights that build intellectual muscle.',
    synchronized: false,
    category: 'Courage',
  },
  {
    id: 'wq_6',
    num: 6,
    mode: 'wolf',
    title: 'The Mistake Vault (Red Book)',
    urduSummary: 'har ghalti ko notebook m likh kr yaad krna',
    easyRule: 'Keep a red notebook for every concept you got wrong in mocks and revise it every Sunday.',
    synchronized: true,
    category: 'Discipline',
  },
  {
    id: 'wq_7',
    num: 7,
    mode: 'wolf',
    title: 'Unshakable Daily Standards',
    urduSummary: 'apna standard hamesha ooncha rkhna',
    easyRule: 'Never be satisfied with average marks. Your standard is 100% conceptual mastery.',
    synchronized: false,
    category: 'Standards',
  },
  {
    id: 'wq_8',
    num: 8,
    mode: 'wolf',
    title: 'Say No to Distractions',
    urduSummary: 'fazool doston aur gathering ko inkaar krna',
    easyRule: 'Politely decline time-wasting plans. Your empire goals demand strict self-protection.',
    synchronized: true,
    category: 'Boundaries',
  },
  {
    id: 'wq_9',
    num: 9,
    mode: 'wolf',
    title: '7-Hour Memory Lock Sleep',
    urduSummary: '7 ghanty pur-sukoon neend',
    easyRule: 'Sleep is when the brain permanently locks in spaced memories. Never sacrifice deep sleep.',
    synchronized: true,
    category: 'Health',
  },
  {
    id: 'wq_10',
    num: 10,
    mode: 'wolf',
    title: 'Posture of Dominance',
    urduSummary: 'seena tana aur reedh ki hadi seedhi',
    easyRule: 'Sit straight with your shoulders back and head held high. Royal posture commands sharp focus.',
    synchronized: false,
    category: 'Presence',
  },
  {
    id: 'wq_11',
    num: 11,
    mode: 'wolf',
    title: 'Night Audit of Conscience',
    urduSummary: 'raat ko khud sy hisab lena',
    easyRule: 'Before closing your eyes, ask yourself: "Did I give today my true 100%?" Stand tall in your answer.',
    synchronized: true,
    category: 'Accountability',
  },
  {
    id: 'wq_12',
    num: 12,
    mode: 'wolf',
    title: 'Tomorrow’s Blueprint Tonight',
    urduSummary: 'kal k 5 targets aaj raat hi likh lena',
    easyRule: 'Write down tomorrow’s 5 subject tasks before going to bed so your morning starts with zero confusion.',
    synchronized: true,
    category: 'Planning',
  },
  {
    id: 'wq_13',
    num: 13,
    mode: 'wolf',
    title: 'Consistency Beats Raw Genius',
    urduSummary: 'rozana 6 ghanty haftay m 1 din 14 ghanty sy behtar hai',
    easyRule: 'A steady 6 hours every single day will demolish a genius who studies in sudden bursts.',
    synchronized: true,
    category: 'Consistency',
  },
  {
    id: 'wq_14',
    num: 14,
    mode: 'wolf',
    title: 'Calm in the Storm (Exam Pressure)',
    urduSummary: 'jab sab ghabra rahy hon to cool rehna',
    easyRule: 'When others panic about exams, slow down your breathing and follow your revision vault step by step.',
    synchronized: false,
    category: 'Poise',
  },
  {
    id: 'wq_15',
    num: 15,
    mode: 'wolf',
    title: 'Distance From Complainers',
    urduSummary: 'rone dhone walo sy door rehna',
    easyRule: 'Never sit with people who complain that syllabus is too hard. Associate only with victory.',
    synchronized: true,
    category: 'Environment',
  },
  {
    id: 'wq_16',
    num: 16,
    mode: 'wolf',
    title: 'Relentless Hunger (Never Relax Early)',
    urduSummary: 'aik test jeet kr sukoon sy na baithna',
    easyRule: 'Even when you get top rank in a mock test, analyze what you missed. The wolf stays hungry.',
    synchronized: false,
    category: 'Drive',
  },
  {
    id: 'wq_17',
    num: 17,
    mode: 'wolf',
    title: 'Lead by Action, Not Speech',
    urduSummary: 'baatein kam aur kaam ziyada',
    easyRule: 'Do not tell people what you will achieve. Show them when the results are stamped on paper.',
    synchronized: true,
    category: 'Action',
  },
  {
    id: 'wq_18',
    num: 18,
    mode: 'wolf',
    title: 'Spaced Repetition Mastery',
    urduSummary: 'for-getting curve ko harana',
    easyRule: 'Defeat the forgetting curve by revising on Day 1, Day 3, Week 1, Day 15, Month 1, and Month 2.',
    synchronized: true,
    category: 'Retention',
  },
  {
    id: 'wq_19',
    num: 19,
    mode: 'wolf',
    title: 'Teach What You Learn',
    urduSummary: 'khud ko ya kisi ko samjhany sy paka hota hai',
    easyRule: 'Explain the hardest reaction or derivation to an imaginary student. Teaching seals permanent memory.',
    synchronized: false,
    category: 'Mastery',
  },
  {
    id: 'wq_20',
    num: 20,
    mode: 'wolf',
    title: 'Empire Builder Mindset',
    urduSummary: 'yad rkho k tum aik empire bana rahy ho',
    easyRule: 'You are not just passing a test. You are forging the character and intellect of a true leader.',
    synchronized: true,
    category: 'Vision',
  },
];

// PRE-SEEDED HIERARCHICAL FOLDERS & SUBFOLDERS
export const INITIAL_FOLDERS: VaultFolder[] = [
  // Root Subject Folders for PDFs
  { id: 'f_bio', name: 'Biology Vault', parentId: null, category: 'pdf', subjectId: 'bio', createdAt: '2026-10-01' },
  { id: 'f_chem', name: 'Chemistry Vault', parentId: null, category: 'pdf', subjectId: 'chem', createdAt: '2026-10-01' },
  { id: 'f_phys', name: 'Physics Vault', parentId: null, category: 'pdf', subjectId: 'phys', createdAt: '2026-10-01' },
  { id: 'f_eng', name: 'English Vault', parentId: null, category: 'pdf', subjectId: 'eng', createdAt: '2026-10-01' },
  { id: 'f_math', name: 'Mathematics Vault', parentId: null, category: 'pdf', subjectId: 'math', createdAt: '2026-10-01' },

  // Root Folders for Images Vault
  { id: 'f_img_bio', name: 'Anatomical Diagrams & Cell Structures', parentId: null, category: 'images', subjectId: 'bio', createdAt: '2026-10-01' },
  { id: 'f_img_chem', name: 'Organic Reaction Mechanism Flowcharts', parentId: null, category: 'images', subjectId: 'chem', createdAt: '2026-10-01' },
  { id: 'f_img_phys', name: 'Circuit & Optical Ray Diagrams', parentId: null, category: 'images', subjectId: 'phys', createdAt: '2026-10-01' },

  // Root Folders for Lectures Vault
  { id: 'f_lec_bio', name: 'Human Physiology Voice Breakdowns', parentId: null, category: 'lectures', subjectId: 'bio', createdAt: '2026-10-01' },
  { id: 'f_lec_chem', name: 'Reaction Kinetics Audio Walkthroughs', parentId: null, category: 'lectures', subjectId: 'chem', createdAt: '2026-10-01' },
  { id: 'f_lec_phys', name: 'Quantum & Electromagnetism Masterclasses', parentId: null, category: 'lectures', subjectId: 'phys', createdAt: '2026-10-01' },

  // 20 Chapter Folders inside Biology (f_bio)
  { id: 'f_bio_ch1', name: 'Chapter 01 - Cell Structure & Ultrastructure', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch2', name: 'Chapter 02 - Biological Molecules & Proteins', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch3', name: 'Chapter 03 - Enzymes & Chemical Kinetics', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch4', name: 'Chapter 04 - Bioenergetics & Cellular Respiration', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch5', name: 'Chapter 05 - Acellular Life & Viral Replication', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch6', name: 'Chapter 06 - Prokaryotes & Bacterial Genetics', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch7', name: 'Chapter 07 - Diversity of Plants & Bryophytes', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch8', name: 'Chapter 08 - Kingdom Animalia & Invertebrates', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch9', name: 'Chapter 09 - Digestion & Nutrient Absorption', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch10', name: 'Chapter 10 - Circulation & Heart Cardiac Cycle', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch11', name: 'Chapter 11 - Immunity & Antibody Classification', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch12', name: 'Chapter 12 - Respiration & Gas Exchange', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch13', name: 'Chapter 13 - Homeostasis & Nephron Excretion', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch14', name: 'Chapter 14 - Support, Bones & Muscle Contraction', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch15', name: 'Chapter 15 - Nervous System & Synapse Action Potential', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch16', name: 'Chapter 16 - Chemical Coordination & Endocrine Hormones', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch17', name: 'Chapter 17 - Reproduction & Embryonic Development', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch18', name: 'Chapter 18 - Chromosomes & DNA Replication', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch19', name: 'Chapter 19 - Mendelian Genetics & Linkage', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },
  { id: 'f_bio_ch20', name: 'Chapter 20 - Biotechnology & Recombinant DNA', parentId: 'f_bio', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-02' },

  // Subfolders inside Chapter 04 (Deep Nested Hierarchy)
  { id: 'f_bio_ch4_notes', name: 'High-Yield Theory & Notes', parentId: 'f_bio_ch4', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-05' },
  { id: 'f_bio_ch4_pastpapers', name: 'Top 50 Past Exam Questions', parentId: 'f_bio_ch4', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-05' },
  { id: 'f_bio_ch4_diagrams', name: 'Mitochondria & Krebs Cycle Maps', parentId: 'f_bio_ch4', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-05' },
  { id: 'f_bio_ch4_mistakes', name: 'Common Student Traps & Mistakes', parentId: 'f_bio_ch4', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-05' },

  // Subfolders inside Chapter 10 (Circulation)
  { id: 'f_bio_ch10_ecg', name: 'ECG Waves & Pressure Curves', parentId: 'f_bio_ch10', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-06' },
  { id: 'f_bio_ch10_mcqs', name: 'Cardiovascular MCQs Vault', parentId: 'f_bio_ch10', category: 'pdf', subjectId: 'bio', createdAt: '2026-10-06' },

  // Chapters inside Chemistry (f_chem)
  { id: 'f_chem_ch1', name: 'Chapter 01 - Stoichiometry & Limiting Reactant', parentId: 'f_chem', category: 'pdf', subjectId: 'chem', createdAt: '2026-10-02' },
  { id: 'f_chem_ch2', name: 'Chapter 02 - Atomic Structure & Quantum Numbers', parentId: 'f_chem', category: 'pdf', subjectId: 'chem', createdAt: '2026-10-02' },
  { id: 'f_chem_ch7', name: 'Chapter 07 - Chemical Equilibrium & Kc/Kp', parentId: 'f_chem', category: 'pdf', subjectId: 'chem', createdAt: '2026-10-02' },
  { id: 'f_chem_ch12', name: 'Chapter 12 - Aldehydes & Ketones Nucleophilic Addition', parentId: 'f_chem', category: 'pdf', subjectId: 'chem', createdAt: '2026-10-02' },

  // Chapters inside Physics (f_phys)
  { id: 'f_phys_ch5', name: 'Chapter 05 - Rotational Dynamics & Moment of Inertia', parentId: 'f_phys', category: 'pdf', subjectId: 'phys', createdAt: '2026-10-02' },
  { id: 'f_phys_ch14', name: 'Chapter 14 - Electromagnetic Induction & Faraday', parentId: 'f_phys', category: 'pdf', subjectId: 'phys', createdAt: '2026-10-02' },
];

// INITIAL SAMPLE FILES WITH EDITABLE PAGES & 5-COLOR HIGHLIGHTERS
export const INITIAL_FILES: VaultFile[] = [
  {
    id: 'doc_krebs_notes',
    folderId: 'f_bio_ch4_notes',
    category: 'pdf',
    title: 'Krebs Cycle & Oxidative Phosphorylation Master Vault',
    subjectId: 'bio',
    totalPages: 6,
    fileSizeKb: 490,
    lastOpened: 'Today',
    createdAt: '2026-10-25',
    updatedAt: '2026-10-31',
    tags: ['Exam Core', 'Mitochondria', 'ATP Yield'],
    pages: [
      {
        id: 'p1',
        pageNumber: 1,
        type: 'text',
        title: 'Overview of Cellular Respiration & Link Reaction',
        blocks: [
          {
            id: 'b1_1',
            type: 'heading',
            text: 'I. The Link Reaction (Transition Step in Mitochondrial Matrix)',
            highlightType: 'important',
          },
          {
            id: 'b1_2',
            type: 'paragraph',
            text: 'Pyruvate (3C) enters the mitochondrial matrix via active transport with H+ symport. It undergoes oxidative decarboxylation catalyzed by the multi-enzyme Pyruvate Dehydrogenase complex.',
          },
          {
            id: 'b1_3',
            type: 'callout',
            text: 'Pyruvate + NAD+ + CoA-SH  --->  Acetyl-CoA (2C) + NADH + H+ + CO2',
            highlightType: 'ratta',
          },
          {
            id: 'b1_4',
            type: 'paragraph',
            text: 'Frequent Exam Trap: Per glucose molecule, two pyruvates are formed, so the link reaction produces 2 Acetyl-CoA, 2 CO2, and 2 NADH.',
            highlightType: 'mistake',
          },
        ],
      },
      {
        id: 'p2',
        pageNumber: 2,
        type: 'text',
        title: 'Tricarboxylic Acid (TCA) Cycle Intermediate Steps',
        blocks: [
          {
            id: 'b2_1',
            type: 'heading',
            text: 'II. The 8 Critical Steps of Citric Acid Cycle',
            highlightType: null,
          },
          {
            id: 'b2_2',
            type: 'bullet',
            text: '1. Citrate Synthase: Oxaloacetate (4C) + Acetyl-CoA (2C) yields Citrate (6C). Highly exergonic step.',
            highlightType: 'important',
          },
          {
            id: 'b2_3',
            type: 'bullet',
            text: '2. Isocitrate to Alpha-Ketoglutarate (5C): First oxidative decarboxylation; produces 1st NADH and releases CO2.',
            highlightType: 'weak',
          },
          {
            id: 'b2_4',
            type: 'bullet',
            text: '3. Alpha-Ketoglutarate to Succinyl-CoA (4C): Second oxidative decarboxylation; produces 2nd NADH.',
            highlightType: 'ratta',
          },
          {
            id: 'b2_5',
            type: 'bullet',
            text: '4. Succinyl-CoA to Succinate: Substrate-level phosphorylation yields 1 GTP (equivalent to 1 ATP).',
            highlightType: 'important',
          },
          {
            id: 'b2_6',
            type: 'bullet',
            text: '5. Succinate to Fumarate: Oxidation by Succinate Dehydrogenase produces 1 FADH2 (not NADH!).',
            highlightType: 'mistake',
          },
        ],
      },
      {
        id: 'p3',
        pageNumber: 3,
        type: 'text',
        title: 'Net Energy Yield & High-Yield Exam Formulas',
        blocks: [
          {
            id: 'b3_1',
            type: 'heading',
            text: 'III. Total ATP Calculation Per Glucose Molecule',
            highlightType: 'important',
          },
          {
            id: 'b3_2',
            type: 'paragraph',
            text: 'Glycolysis: 2 Net ATP + 2 NADH (yielding 3 or 5 ATP depending on glycerol-phosphate or malate-aspartate shuttle).',
          },
          {
            id: 'b3_3',
            type: 'paragraph',
            text: 'Link Reaction: 2 NADH = 5 ATP.',
            highlightType: 'ratta',
          },
          {
            id: 'b3_4',
            type: 'paragraph',
            text: 'Krebs Cycle: 2 GTP (ATP) + 6 NADH (15 ATP) + 2 FADH2 (3 ATP) = 20 ATP.',
            highlightType: 'ratta',
          },
          {
            id: 'b3_5',
            type: 'callout',
            text: 'Doubt to clarify with instructor: Why do some textbooks cite 36 ATP while modern biochemistry calculates 30-32 ATP?',
            highlightType: 'doubt',
          },
        ],
      },
      {
        id: 'p4',
        pageNumber: 4,
        type: 'text',
        title: 'Electron Transport Chain (ETC) Complexes & Chemiosmosis',
        blocks: [
          {
            id: 'b4_1',
            type: 'heading',
            text: 'IV. Complexes I through IV & The Proton Gradient',
            highlightType: 'important',
          },
          {
            id: 'b4_2',
            type: 'paragraph',
            text: 'Complex I (NADH-Q oxidoreductase), Complex II (Succinate-Q reductase), Complex III (Q-cytochrome c oxidoreductase), and Complex IV (Cytochrome c oxidase). Protons are pumped from the matrix to intermembrane space.',
          },
          {
            id: 'b4_3',
            type: 'callout',
            text: 'Complex II does NOT pump protons across the inner membrane. This is why 1 FADH2 yields only ~1.5 ATP while 1 NADH yields ~2.5 ATP.',
            highlightType: 'mistake',
          },
        ],
      },
      {
        id: 'p5',
        pageNumber: 5,
        type: 'text',
        title: 'Inhibitors & Uncouplers (Cyanide, CO, Oligomycin, DNP)',
        blocks: [
          {
            id: 'b5_1',
            type: 'heading',
            text: 'V. High-Yield Poison & Inhibitor Mechanisms',
            highlightType: 'ratta',
          },
          {
            id: 'b5_2',
            type: 'bullet',
            text: 'Rotenone & Amytal: Inhibit Complex I electron transfer.',
            highlightType: 'weak',
          },
          {
            id: 'b5_3',
            type: 'bullet',
            text: 'Cyanide (CN-) & Carbon Monoxide (CO): Inhibit Complex IV (cytochrome a3) - halts all respiration instantly.',
            highlightType: 'ratta',
          },
          {
            id: 'b5_4',
            type: 'bullet',
            text: 'Oligomycin: Blocks Fo subunit of ATP synthase, arresting proton return.',
            highlightType: 'important',
          },
          {
            id: 'b5_5',
            type: 'bullet',
            text: '2,4-Dinitrophenol (DNP): Uncouples ETC from ATP synthesis by carrying protons directly across membrane, releasing energy as heat.',
            highlightType: 'important',
          },
        ],
      },
      {
        id: 'p6',
        pageNumber: 6,
        type: 'text',
        title: 'Past Exam Traps & Rapid High-Yield Revision Sheet',
        blocks: [
          {
            id: 'b6_1',
            type: 'heading',
            text: 'VI. Top 5 Repeating Past Paper Traps',
            highlightType: 'important',
          },
          {
            id: 'b6_2',
            type: 'paragraph',
            text: 'Trap 1: Substrate-level vs Oxidative phosphorylation. Krebs produces GTP by substrate-level phosphorylation only!',
            highlightType: 'mistake',
          },
          {
            id: 'b6_3',
            type: 'paragraph',
            text: 'Trap 2: Carbon counting: Citrate (6C) -> Alpha-KG (5C) -> Succinyl-CoA (4C). Exactly 2 CO2 released per turn.',
            highlightType: 'ratta',
          },
        ],
      },
    ],
  },
  {
    id: 'doc_cardiac_cycle',
    folderId: 'f_bio_ch10_ecg',
    category: 'pdf',
    title: 'Cardiac Cycle & Wiggers Pressure Diagram',
    subjectId: 'bio',
    totalPages: 2,
    fileSizeKb: 180,
    lastOpened: 'Yesterday',
    createdAt: '2026-10-26',
    updatedAt: '2026-10-30',
    tags: ['Circulation', 'Heart Valves', 'ECG'],
    pages: [
      {
        id: 'p_cc_1',
        pageNumber: 1,
        type: 'text',
        title: 'Atrial & Ventricular Systole Timing',
        blocks: [
          {
            id: 'b_cc_1',
            type: 'heading',
            text: 'Cardiac Cycle Duration: 0.8 Seconds Total',
            highlightType: 'important',
          },
          {
            id: 'b_cc_2',
            type: 'paragraph',
            text: 'Atrial Systole: 0.1s | Ventricular Systole: 0.3s | Complete Cardiac Diastole: 0.4s.',
            highlightType: 'ratta',
          },
          {
            id: 'b_cc_3',
            type: 'paragraph',
            text: 'Common Mistake: First heart sound (LUB) is caused by closure of AV valves (Tricuspid/Bicuspid), NOT the semilunar valves!',
            highlightType: 'mistake',
          },
        ],
      },
      {
        id: 'p_cc_2',
        pageNumber: 2,
        type: 'text',
        title: 'Heart Sounds & Isovolumetric Contraction',
        blocks: [
          {
            id: 'b_cc_4',
            type: 'callout',
            text: 'Isovolumetric Contraction: All 4 heart valves closed; ventricular pressure skyrockets while volume stays constant.',
            highlightType: 'weak',
          },
        ],
      },
    ],
  },
  {
    id: 'doc_chem_carbonyl',
    folderId: 'f_chem_ch12',
    category: 'pdf',
    title: 'Aldehydes & Ketones Reaction Mechanisms',
    subjectId: 'chem',
    totalPages: 2,
    fileSizeKb: 310,
    lastOpened: '3 days ago',
    createdAt: '2026-10-27',
    updatedAt: '2026-10-29',
    tags: ['Organic', 'Nucleophilic Addition', 'Fehlings'],
    pages: [
      {
        id: 'p_ch_1',
        pageNumber: 1,
        type: 'text',
        title: 'Nucleophilic Addition Mechanisms',
        blocks: [
          {
            id: 'b_ch_1',
            type: 'heading',
            text: 'Reactivity Order: Formaldehyde > Aldehydes > Ketones',
            highlightType: 'important',
          },
          {
            id: 'b_ch_2',
            type: 'paragraph',
            text: 'Ketones are less reactive due to steric hindrance and +I inductive electron-donation of two alkyl groups reducing delta positive charge on carbonyl carbon.',
            highlightType: 'weak',
          },
          {
            id: 'b_ch_3',
            type: 'callout',
            text: 'Tollens Reagent Test: Aldehydes give Silver Mirror. Ketones do NOT react. Used for qualitative distinction.',
            highlightType: 'ratta',
          },
        ],
      },
    ],
  },
  // Sample Diagram image file in Images Vault
  {
    id: 'img_krebs_diagram',
    folderId: 'f_img_bio',
    category: 'images',
    title: 'Krebs Cycle Detailed High-Res Diagram',
    subjectId: 'bio',
    totalPages: 1,
    fileSizeKb: 450,
    lastOpened: 'Today',
    createdAt: '2026-10-20',
    updatedAt: '2026-10-28',
    tags: ['Diagram', 'High Yield'],
    pages: [
      {
        id: 'p_img_1',
        pageNumber: 1,
        type: 'text',
        title: 'Mitochondrial Inner Matrix Pathway Map',
        blocks: [
          {
            id: 'b_im_1',
            type: 'heading',
            text: 'Visual Blueprint: 8 Reactions of Krebs Cycle',
            highlightType: 'important',
          },
          {
            id: 'b_im_2',
            type: 'paragraph',
            text: 'Examine each enzyme site: Citrate Synthase -> Aconitase -> Isocitrate Dehydrogenase -> Alpha-Ketoglutarate Dehydrogenase.',
          },
        ],
      },
    ],
  },
  // Sample Lecture in Lectures Vault
  {
    id: 'lec_action_potential',
    folderId: 'f_lec_bio',
    category: 'lectures',
    title: 'Axon Action Potential & Voltage-Gated Na+/K+ Channels (Audio Lecture)',
    subjectId: 'bio',
    totalPages: 1,
    fileSizeKb: 1200,
    lastOpened: 'Yesterday',
    createdAt: '2026-10-22',
    updatedAt: '2026-10-29',
    tags: ['Lecture', 'Audio', 'Physiology'],
    pages: [
      {
        id: 'p_lec_1',
        pageNumber: 1,
        type: 'text',
        title: 'Lecture Outline & Key Audio Timestamp Milestones',
        blocks: [
          {
            id: 'b_lec_1',
            type: 'heading',
            text: '00:00 - 05:00: Resting Membrane Potential (-70mV)',
            highlightType: 'important',
          },
          {
            id: 'b_lec_2',
            type: 'paragraph',
            text: 'Maintained by Sodium-Potassium ATPase pump: 3 Na+ pumped OUT, 2 K+ pumped IN. Consumes 1 ATP.',
            highlightType: 'ratta',
          },
          {
            id: 'b_lec_3',
            type: 'paragraph',
            text: '05:01 - 12:00: Depolarization Threshold (-55mV) causes rapid opening of voltage-gated Na+ channels.',
            highlightType: 'weak',
          },
        ],
      },
    ],
  },
  // Support & Movement PDF File
  {
    id: 'doc_support_bone_pdf',
    folderId: 'f_bio_ch14',
    category: 'pdf',
    title: 'Support and Movement: Bone Matrix, Cartilage & Skeletal Joints',
    subjectId: 'bio',
    totalPages: 3,
    fileSizeKb: 340,
    lastOpened: 'Today',
    createdAt: '2026-10-28',
    updatedAt: '2026-10-31',
    tags: ['Bone', 'Support and Movement', 'Skeletal System', 'Cartilage'],
    pages: [
      {
        id: 'p_sm_1',
        pageNumber: 1,
        type: 'text',
        title: 'Bone Composition & Osteoblast/Osteoclast Remodeling',
        blocks: [
          {
            id: 'b_sm_1',
            type: 'heading',
            text: 'I. Bone Matrix Architecture (Collagen & Hydroxyapatite Crystals)',
            highlightType: 'important',
          },
          {
            id: 'b_sm_2',
            type: 'paragraph',
            text: 'Bone is a specialized rigid connective tissue. Organic matrix (30%) consists of Type I collagen fibers providing tensile strength, while inorganic matrix (70%) contains calcium phosphate hydroxyapatite crystals giving compressive hardness.',
          },
          {
            id: 'b_sm_3',
            type: 'callout',
            text: 'Osteoblasts: Bone-forming cells secreting osteoid matrix. Osteocytes: Mature bone cells in lacunae. Osteoclasts: Multinucleated bone-resorbing giant cells.',
            highlightType: 'ratta',
          },
        ],
      },
    ],
  },
  // Support & Movement Image File
  {
    id: 'img_bone_histology',
    folderId: 'f_img_bio',
    category: 'images',
    title: 'Bone Histology Diagram: Compact Bone Haversian Osteon System',
    subjectId: 'bio',
    totalPages: 1,
    fileSizeKb: 520,
    lastOpened: 'Today',
    createdAt: '2026-10-29',
    updatedAt: '2026-10-31',
    tags: ['Bone', 'Diagram', 'Support and Movement', 'Histology'],
    pages: [
      {
        id: 'p_bh_1',
        pageNumber: 1,
        type: 'text',
        title: 'Compact Bone Micrograph & Osteon Haversian Canal Flowchart',
        blocks: [
          {
            id: 'b_bh_1',
            type: 'heading',
            text: 'Haversian System (Osteon) Structure',
            highlightType: 'important',
          },
          {
            id: 'b_bh_2',
            type: 'paragraph',
            text: 'Central Haversian Canal contains blood vessels and nerves. Concentric lamellae surround canal. Volkmann canals connect adjacent osteons transversely.',
          },
        ],
      },
    ],
  },
  // Support & Movement Revision Lecture File
  {
    id: 'lec_bone_movement',
    folderId: 'f_lec_bio',
    category: 'lectures',
    title: 'Support and Movement: Bone Ossification & Sliding Filament Revision Lecture',
    subjectId: 'bio',
    totalPages: 1,
    fileSizeKb: 1450,
    lastOpened: 'Today',
    createdAt: '2026-10-30',
    updatedAt: '2026-10-31',
    tags: ['Bone', 'Support and Movement', 'Lecture', 'Revision Audio'],
    pages: [
      {
        id: 'p_bm_1',
        pageNumber: 1,
        type: 'text',
        title: 'Support and Movement Chapter Lecture Walkthrough & Timestamps',
        blocks: [
          {
            id: 'b_bm_1',
            type: 'heading',
            text: '00:00 - 10:00: Bone Remodeling, Calcium Homeostasis & Parathyroid Hormone',
            highlightType: 'important',
          },
          {
            id: 'b_bm_2',
            type: 'paragraph',
            text: 'Parathyroid Hormone (PTH) stimulates osteoclasts to raise blood calcium level. Calcitonin inhibits osteoclasts to lower blood calcium.',
            highlightType: 'ratta',
          },
        ],
      },
    ],
  },
];

export const INITIAL_IDEAS: IdeaNote[] = [
  {
    id: 'panther_1',
    mode: 'panther',
    title: 'Silent Execution Protocol',
    content: 'Do not announce the target chapter. Study in high-focus 50-minute blocks without notifications. Silence produces undeniable results.',
    date: '2026-10-28',
    synchronized: true,
  },
  {
    id: 'wolf_1',
    mode: 'wolf',
    title: 'Relentless Discipline',
    content: 'The empire is built on days when motivation is absent. Keep the spaced repetition chain intact at all costs.',
    date: '2026-10-25',
    synchronized: true,
  },
];

// Seed sample tasks across 5 subjects
export function generateInitialTasks(baseDateStr?: string): Task[] {
  const today = baseDateStr || toISODateString(new Date());
  const tasks: Task[] = [];

  const createTaskWithProgress = (
    subjectId: string,
    title: string,
    chapter: string,
    daysAgo: number,
    completedStagesCount: number,
    priority: 'high' | 'medium' | 'low' = 'high',
    tags: string[] = []
  ): Task => {
    const initialDate = addDays(today, -daysAgo);
    const stages = generateRevisionStages(initialDate);

    for (let i = 0; i < completedStagesCount && i < stages.length; i++) {
      stages[i].completed = true;
      stages[i].completedAt = new Date(Date.now() - (stages.length - i) * 86400000).toISOString();
      stages[i].notes = `Revised key concepts and highlighters.`;
    }

    const allCompleted = stages.every((s) => s.completed);

    return {
      id: generateUniqueId(`task_${subjectId}`),
      subjectId,
      title,
      chapter,
      priority,
      initialDate,
      stages,
      isCompleted: allCompleted,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags,
    };
  };

  tasks.push(createTaskWithProgress('bio', 'Cellular Respiration & Krebs Cycle', 'Unit 4 - Cell Energetics', 0, 0, 'high', ['Important', 'Exam Core']));
  tasks.push(createTaskWithProgress('bio', 'Human Circulatory & Cardiac Cycle', 'Unit 7 - Physiology', 1, 0, 'high', ['Diagrams', 'High Yield']));
  tasks.push(createTaskWithProgress('bio', 'DNA Replication & Polymerase Enzymes', 'Unit 12 - Molecular Genetics', 3, 1, 'high', ['Genetics']));
  tasks.push(createTaskWithProgress('bio', 'Endocrine Glands & Hormone Feedback', 'Unit 9 - Chemical Control', 7, 2, 'medium', ['Hormones']));
  tasks.push(createTaskWithProgress('bio', 'Plant Water Potential & Transpiration', 'Unit 5 - Plant Physiology', 15, 3, 'medium'));
  tasks.push(createTaskWithProgress('bio', 'Immune System & Antibody Classification', 'Unit 11 - Immunology', 30, 4, 'high', ['Mastery']));
  tasks.push(createTaskWithProgress('bio', 'Neural Synapse & Action Potential', 'Unit 8 - Nervous System', 10, 1, 'high', ['Backlog Focus']));

  tasks.push(createTaskWithProgress('chem', 'Aldehydes & Ketones Nucleophilic Addition', 'Organic Chapter 12', 0, 0, 'high', ['Organic']));
  tasks.push(createTaskWithProgress('chem', 'Chemical Equilibrium & Le Chatelier Principle', 'Physical Chem Chapter 7', 1, 0, 'medium', ['Equilibrium']));
  tasks.push(createTaskWithProgress('chem', 'Transition Elements & Coordination Complexes', 'Inorganic Chapter 6', 3, 1, 'high', ['Inorganic']));
  tasks.push(createTaskWithProgress('chem', 'Electrochemistry: Nernst Equation & Gibbs Free Energy', 'Physical Chem Chapter 8', 7, 2, 'high', ['Formulas']));
  tasks.push(createTaskWithProgress('chem', 'Benzene Electrophilic Substitution Mechanisms', 'Organic Chapter 9', 20, 2, 'high', ['Overdue']));
  tasks.push(createTaskWithProgress('chem', 'Thermodynamics: Hess Law & Entropy', 'Physical Chem Chapter 5', 45, 5, 'medium', ['Near Mastered']));

  tasks.push(createTaskWithProgress('phys', 'Electromagnetic Induction & Faradays Law', 'Electromagnetism Chapter 14', 0, 0, 'high', ['Formula Sheet']));
  tasks.push(createTaskWithProgress('phys', 'Simple Harmonic Motion & Damped Oscillations', 'Mechanics Chapter 7', 1, 0, 'medium'));
  tasks.push(createTaskWithProgress('phys', 'Photoelectric Effect & Quantum Photons', 'Modern Physics Chapter 19', 7, 2, 'high', ['Modern Physics']));
  tasks.push(createTaskWithProgress('phys', 'Rotational Dynamics & Moment of Inertia', 'Mechanics Chapter 5', 15, 3, 'high', ['Derivations']));
  tasks.push(createTaskWithProgress('phys', 'Wave Optics: Youngs Double Slit & Diffraction', 'Optics Chapter 9', 18, 3, 'medium', ['Backlog']));
  tasks.push(createTaskWithProgress('phys', 'Electric Fields & Gauss Law Calculations', 'Electrostatics Chapter 12', 65, 6, 'high', ['100% Mastered']));

  tasks.push(createTaskWithProgress('eng', 'Critical Analysis: Shakespeare Hamlet Themes', 'Drama & Rhetoric', 0, 0, 'high', ['Essay Core']));
  tasks.push(createTaskWithProgress('eng', 'Advanced Vocabulary & Sentence Synthesis', 'Lexicon Vault Vol. 3', 1, 0, 'medium', ['Vocabulary']));
  tasks.push(createTaskWithProgress('eng', 'Persuasive Speech Techniques & Fallacies', 'Rhetorical Analysis', 3, 1, 'high', ['Speech']));
  tasks.push(createTaskWithProgress('eng', 'Poetry Tone & Metric Analysis (Romantic Era)', 'Literature Chapter 4', 12, 2, 'medium', ['Backlog']));
  tasks.push(createTaskWithProgress('eng', 'Formal Argumentative Thesis Writing', 'Writing Workshop 2', 62, 6, 'high', ['Mastered']));

  tasks.push(createTaskWithProgress('math', 'Integration by Parts & Partial Fractions', 'Calculus Chapter 6', 0, 0, 'high', ['Calculus']));
  tasks.push(createTaskWithProgress('math', 'Matrices: Eigenvalues & Determinant Properties', 'Linear Algebra Chapter 3', 1, 0, 'high', ['Algebra']));
  tasks.push(createTaskWithProgress('math', 'Differential Equations: First Order Homogeneous', 'Calculus Chapter 8', 7, 2, 'high', ['Calculus']));
  tasks.push(createTaskWithProgress('math', 'Probability Distributions & Normal Approximation', 'Statistics Chapter 4', 15, 3, 'medium', ['Stats']));
  tasks.push(createTaskWithProgress('math', 'Trigonometric Identities & Complex Numbers', 'Trigonometry Chapter 10', 14, 2, 'high', ['Backlog']));
  tasks.push(createTaskWithProgress('math', 'Vector Geometry in 3D Space', 'Vectors Chapter 7', 70, 6, 'high', ['Mastered']));

  return tasks;
}
