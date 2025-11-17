import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  LogoutIcon,
  BookOpenIcon,
  RobotHeadIcon,
  BeakerIcon,
  ChartPieIcon,
  CalendarIcon,
  CogIcon,
  SendIcon,
  UserIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  PlayIcon,
  LockClosedIcon,
  DocumentTextIcon,
  BellIcon,
  XIcon,
  UsersIcon,
  CollectionIcon,
  SparklesIcon,
  TrashIcon,
  QuestionMarkCircleIcon,
  ArrowRightIcon,
  LoadingSpinnerIcon,
  PencilIcon,
  GraduationCapIcon,
  PresentationChartBarIcon,
  SearchIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  ChartBarIcon,
  ClockIcon,
  ShieldCheckIcon,
  EnvelopeIcon,
  TrophyIcon,
  StarIcon,
  FireIcon,
} from './icons';
import { Subject, LearningStyle, ChatMessage, ContentStatus, Lesson, Exercise, Book, Activity, TodoItem, Quiz, QuestionType, AnswerOption, Comment, ManagedUser, SchoolClass, Homework, Announcement, LessonStep, LessonStepType, Student, Badge } from '../types';
import { askMadi, generateBookDescription, generateBookFirstPage } from '../services/geminiService';

// Mock Data
const subjectsData: Subject[] = [
  {
    id: 'math',
    name: 'الرياضيات',
    icon: <ChartPieIcon />,
    color: 'bg-blue-500',
    progress: 75,
    lessons: [
      { id: 'm1', title: 'الدرس 1: الأعداد الصحيحة', description: 'مقدمة إلى الأعداد الصحيحة والعمليات عليها.', status: ContentStatus.COMPLETED, comments: [
          { id: 'c1', authorName: 'فاطمة', text: 'شرح واضح جداً، شكراً أستاذ!', date: '2024-05-20T10:00:00.000Z' }
      ], steps: [
        { id: 'm1s1', type: LessonStepType.TEXT, title: 'ما هي الأعداد الصحيحة؟', content: 'الأعداد الصحيحة هي كل [الأعداد الكاملة](هي الأعداد التي لا تحتوي على كسور أو أجزاء عشرية.) الموجبة والسالبة، بالإضافة إلى الصفر. \nمثال: ... -3, -2, -1, 0, 1, 2, 3 ... \nنستخدمها في حياتنا اليومية لقياس [درجات الحرارة](مقياس لمدى سخونة أو برودة شيء ما.)، أو لتسجيل الأرباح والخسائر.' },
        { id: 'm1s2', type: LessonStepType.VIDEO, title: 'شرح بالفيديو', content: 'https://www.youtube.com/embed/5k93_42c5pM' },
        { id: 'm1s3', type: LessonStepType.QUIZ, title: 'اختبر فهمك', content: 'أي من الأعداد التالية ليس عدداً صحيحاً؟', quizQuestion: { id: 'm1q1', questionText: 'أي من الأعداد التالية ليس عدداً صحيحاً؟', type: QuestionType.MULTIPLE_CHOICE, options: [ { id: 'm1q1o1', text: '-5', isCorrect: false }, { id: 'm1q1o2', text: '3.5', isCorrect: true }, { id: 'm1q1o3', text: '0', isCorrect: false }, { id: 'm1q1o4', text: '120', isCorrect: false }, ] } },
        { id: 'm1s4', type: LessonStepType.TEXT, title: 'ممتاز!', content: 'لقد أكملت هذا الدرس بنجاح. الأعداد الصحيحة هي أساس العديد من المفاهيم في الرياضيات. استمر في الممارسة!' }
      ]},
      { id: 'm2', title: 'الدرس 2: المعادلات', description: 'حل المعادلات من الدرجة الأولى.', status: ContentStatus.IN_PROGRESS, comments: [], steps: [
        { id: 'm2s1', type: LessonStepType.TEXT, title: 'مقدمة في المعادلات', content: 'المعادلة هي عبارة رياضية تحتوي على علامة يساوي (=). هدفنا هو إيجاد قيمة [المتغير](رمز، عادة ما يكون حرفاً، يمثل قيمة يمكن أن تتغير.) (مثل x) التي تجعل العبارة صحيحة.'},
        { id: 'm2s2', type: LessonStepType.QUIZ, title: 'تمرين بسيط', content: 'حل المعادلة: x + 5 = 12', quizQuestion: { id: 'm2q1', questionText: 'ما هي قيمة x في المعادلة: x + 5 = 12؟', type: QuestionType.SHORT_ANSWER, correctAnswer: '7' }}
      ]},
      { id: 'm3', title: 'الدرس 3: الهندسة', description: 'الأشكال الهندسية الأساسية.', status: ContentStatus.IN_PROGRESS, comments: [], steps: [
        { id: 'm3s1', type: LessonStepType.TEXT, title: 'مقدمة في الأشكال الهندسية', content: 'الهندسة تدرس الأشكال والأحجام والمواضع للأجسام. الأشكال الأساسية مثل المربع، الدائرة، والمثلث هي لبنات البناء لكل شيء حولنا.' },
        { id: 'm3s2', type: LessonStepType.VIDEO, title: 'فيديو: تعلم الأشكال', content: 'https://www.youtube.com/embed/VOLp_Jg-aO8' },
        { id: 'm3s3', type: LessonStepType.SIMULATION, title: 'محاكاة: بناء المساحات', content: 'https://phet.colorado.edu/sims/html/area-builder/latest/area-builder_ar.html' },
        { id: 'm3s4', type: LessonStepType.QUIZ, title: 'اختبر فهمك', content: 'ما هي مساحة مستطيل طوله 5 وعرضه 3؟', quizQuestion: { id: 'm3q1', questionText: 'ما هي مساحة مستطيل طوله 5 وعرضه 3؟', type: QuestionType.SHORT_ANSWER, correctAnswer: '15' }}
      ]},
      { id: 'm4', title: 'مقدمة في الجبر', description: 'أساسيات التعابير والمعادلات الجبرية.', status: ContentStatus.LOCKED, comments: [] },
    ],
    exercises: [
        { id: 'me1', title: 'تمرين 1: جمع وطرح', description: 'تمارين على جمع وطرح الأعداد الصحيحة.', status: ContentStatus.COMPLETED, comments: [], score: 95 },
        { id: 'me2', title: 'تمرين 2: حل المعادلات', description: 'تمارين تطبيقية على المعادلات.', status: ContentStatus.IN_PROGRESS, comments: [] },
    ],
    quizzes: [
       {
        id: 'q-math-1',
        title: 'اختبار سريع في الجبر',
        questions: [
          {
            id: 'qq1-1',
            questionText: 'ما هو حاصل جمع 5 + 7؟',
            type: QuestionType.MULTIPLE_CHOICE,
            options: [
              { id: 'qo1-1-1', text: '10', isCorrect: false },
              { id: 'qo1-1-2', text: '12', isCorrect: true },
              { id: 'qo1-1-3', text: '15', isCorrect: false },
            ],
          },
          {
            id: 'qq1-2',
            questionText: 'إذا كانت x + 3 = 10، فما هي قيمة x؟',
            type: QuestionType.SHORT_ANSWER,
            correctAnswer: '7',
          },
          {
            id: 'qq1-3',
            questionText: 'العدد 0 هو عدد صحيح موجب.',
            type: QuestionType.TRUE_FALSE,
            options: [
              { id: 'tf-1', text: 'صحيح', isCorrect: false },
              { id: 'tf-2', text: 'خطأ', isCorrect: true },
            ],
          },
        ]
       }
    ]
  },
  {
    id: 'arabic',
    name: 'اللغة العربية',
    icon: <BookOpenIcon />,
    color: 'bg-teal-500',
    progress: 50,
    lessons: [
        { id: 'a1', title: 'الدرس 1: النحو', description: 'أساسيات الإعراب.', status: ContentStatus.COMPLETED, comments: [] },
        { id: 'a2', title: 'الدرس 2: البلاغة', description: 'مقدمة في علم البلاغة.', status: ContentStatus.IN_PROGRESS, comments: [] },
    ],
    exercises: [
        { id: 'ae1', title: 'تمرين 1: إعراب جمل', description: 'تطبيق على أساسيات الإعراب.', status: ContentStatus.LOCKED, comments: [] },
    ],
    quizzes: []
  },
  {
    id: 'french',
    name: 'اللغة الفرنسية',
    icon: <BookOpenIcon />,
    color: 'bg-green-500',
    progress: 40,
    lessons: [
        { id: 'f1', title: 'Leçon 1: Les salutations', description: 'Apprendre les salutations de base en français.', status: ContentStatus.COMPLETED, comments: [] },
        { id: 'f2', title: 'Leçon 2: Le verbe être et avoir', description: 'Conjugaison au présent.', status: ContentStatus.IN_PROGRESS, comments: [] },
    ],
    exercises: [
        { id: 'fe1', title: 'Exercice 1: Complétez les phrases', description: 'Utilisez être ou avoir.', status: ContentStatus.LOCKED, comments: [] },
    ],
    quizzes: []
  },
  {
    id: 'islamic',
    name: 'التربية الاسلامية',
    icon: <BookOpenIcon />,
    color: 'bg-emerald-500',
    progress: 80,
    lessons: [
        { id: 'i1', title: 'الدرس 1: أركان الإيمان', description: 'شرح أركان الإيمان الستة.', status: ContentStatus.COMPLETED, comments: [] },
        { id: 'i2', title: 'الدرس 2: سورة الفاتحة', description: 'تفسير وأحكام سورة الفاتحة.', status: ContentStatus.COMPLETED, comments: [] },
    ],
    exercises: [
        { id: 'ie1', title: 'تمرين 1: عدد أركان الإيمان', description: 'اختبار قصير حول أركان الإيمان.', status: ContentStatus.COMPLETED, comments: [], score: 100 },
    ],
    quizzes: []
  },
  {
    id: 'social',
    name: 'الاجتماعيات',
    icon: <UsersIcon />,
    color: 'bg-orange-500',
    progress: 55,
    lessons: [
        { id: 'ss1', title: 'الدرس 1: تاريخ المغرب', description: 'لمحة عن السلالات التي حكمت المغرب.', status: ContentStatus.IN_PROGRESS, comments: [] },
        { id: 'ss2', title: 'الدرس 2: جغرافية المغرب', description: 'التضاريس والمناخ في المغرب.', status: ContentStatus.LOCKED, comments: [] },
    ],
    exercises: [
        { id: 'sse1', title: 'تمرين 1: خريطة المغرب', description: 'حدد المدن الرئيسية على الخريطة.', status: ContentStatus.LOCKED, comments: [] },
    ],
    quizzes: []
  },
  {
    id: 'physics',
    name: 'الفيزياء',
    icon: <BeakerIcon />,
    color: 'bg-rose-500',
    progress: 30,
    lessons: [
        { id: 'p1', title: 'الدرس 1: الحركة والسكون', description: 'مفاهيم أساسية في الميكانيكا.', status: ContentStatus.IN_PROGRESS, comments: [] },
        { id: 'p2', title: 'الدرس 2: قوانين نيوتن', description: 'شرح قوانين الحركة الثلاثة.', status: ContentStatus.LOCKED, comments: [] },
    ],
    exercises: [
        { id: 'pe1', title: 'تمرين 1: حساب السرعة', description: 'مسائل تطبيقية على الحركة.', status: ContentStatus.LOCKED, comments: [] },
    ],
    quizzes: []
  },
  {
    id: 'science',
    name: 'علوم الحياة والأرض',
    icon: <BeakerIcon />,
    color: 'bg-violet-500',
    progress: 60,
    lessons: [
        { id: 's1', title: 'الدرس 1: الخلية', description: 'مكونات الخلية ووظائفها.', status: ContentStatus.COMPLETED, comments: [] },
        { id: 's2', title: 'الدرس 2: المجموعة الشمسية', description: 'الكواكب والنجوم.', status: ContentStatus.IN_PROGRESS, comments: [] },
    ],
    exercises: [
        { id: 'se1', title: 'تمرين 1: رسم الخلية', description: 'ارسم خلية حيوانية ووضح مكوناتها.', status: ContentStatus.LOCKED, comments: [] },
    ],
    quizzes: []
  },
  {
    id: 'cs',
    name: 'المعلوميات',
    icon: <RobotHeadIcon />,
    color: 'bg-purple-500',
    progress: 0,
    lessons: [],
    exercises: [],
    quizzes: []
  }
];

const booksData: Book[] = [
  { id: 'b1', title: 'كليلة ودمنة', author: 'عبد الله بن المقفع', category: 'قصص', coverImage: 'https://picsum.photos/seed/kalila/300/400', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'b2', title: 'ألف ليلة وليلة', author: 'مؤلفون', category: 'مغامرات', coverImage: 'https://picsum.photos/seed/leila/300/400' },
  { id: 'b3', title: 'رحلة إلى مركز الأرض', author: 'جول فيرن', category: 'علوم', coverImage: 'https://picsum.photos/seed/earth/300/400', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
  { id: 'b4', title: 'تاريخ المغرب', author: 'مؤرخون', category: 'تاريخ', coverImage: 'https://picsum.photos/seed/maghreb/300/400' },
  { id: 'b5', title: 'الأسد والفأر', author: 'إيسوب', category: 'قصص', coverImage: 'https://picsum.photos/seed/lion/300/400' },
  { id: 'b6', title: 'حول العالم في 80 يوما', author: 'جول فيرن', category: 'مغامرات', coverImage: 'https://picsum.photos/seed/world80/300/400', pdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
];

const activitiesData: Activity[] = [
  { id: 'ac1', title: 'أولمبياد الرياضيات', description: 'مسابقة وطنية لتشجيع المهارات في الرياضيات.', date: '2024-09-15', image: `https://picsum.photos/seed/math-olympiad/600/400`, icon: <ChartPieIcon /> },
  { id: 'ac2', title: 'اليوم الوطني للبيئة', description: 'حملة تشجير وتنظيف في محيط المدرسة.', date: '2024-10-22', image: `https://picsum.photos/seed/env-day/600/400`, icon: <SparklesIcon /> },
  { id: 'ac3', title: 'المسابقة الثقافية', description: 'مسابقة بين الأقسام في المعلومات العامة.', date: '2024-11-05', image: `https://picsum.photos/seed/culture-comp/600/400`, icon: <BookOpenIcon /> },
];

const getRelativeDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};

const initialTodos: TodoItem[] = [
  { id: 'todo-1', text: 'إنهاء واجب الرياضيات', completed: false, dueDate: getRelativeDate(2) },
  { id: 'todo-2', text: 'مراجعة درس العلوم', completed: true, dueDate: getRelativeDate(-5) },
  { id: 'todo-3', text: 'التحضير لامتحان اللغة الفرنسية', completed: false },
  { id: 'todo-4', text: 'قراءة الفصل الأول من كتاب التاريخ', completed: false, dueDate: getRelativeDate(0) },
  { id: 'todo-5', text: 'حل تمرين الفيزياء', completed: false, dueDate: getRelativeDate(-2) },
];

interface DashboardProps {
  onLogout: () => void;
  currentUser: ManagedUser;
  setUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
  classes: SchoolClass[];
  announcements: Announcement[];
}

const timeSince = (date: string) => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `منذ ${Math.floor(interval)} سنوات`;
    interval = seconds / 2592000;
    if (interval > 1) return `منذ ${Math.floor(interval)} أشهر`;
    interval = seconds / 86400;
    if (interval > 1) return `منذ ${Math.floor(interval)} أيام`;
    interval = seconds / 3600;
    if (interval > 1) return `منذ ${Math.floor(interval)} ساعات`;
    interval = seconds / 60;
    if (interval > 1) return `منذ ${Math.floor(interval)} دقائق`;
    return 'الآن';
}

type ActiveView = 'subjects' | 'library' | 'activities' | 'todos' | 'homework' | 'announcements';

// Combine Lesson and Exercise for the learning path
type LearningItem = (Lesson | Exercise) & { itemType: 'lesson' | 'exercise' };

// --- GAMIFICATION DATA ---
const allBadges: Badge[] = [
    { id: 'perseverance-1', name: 'المثابر', description: 'أكمل تمرينك الأول.', icon: <StarIcon /> },
    { id: 'math-scholar-1', name: 'عالم الرياضيات', description: 'أكمل 3 دروس في الرياضيات.', icon: <ChartPieIcon /> },
    { id: 'bookworm-1', name: 'دودة كتب', description: 'اقرأ كتابين.', icon: <BookOpenIcon /> },
    { id: 'curious-1', name: 'الفضولي', description: 'اسأل "مدي" سؤالك الأول.', icon: <RobotHeadIcon /> },
    { id: 'examiner-1', name: 'الممتحن', description: 'أكمل اختبارك الأول.', icon: <PencilIcon /> },
    { id: 'top-scorer-1', name: 'المتفوق', description: 'احصل على درجة 90+ في تمرين.', icon: <TrophyIcon /> },
];

const levelData = [
    { level: 1, name: 'مستكشف المعرفة', xpRequired: 0 },
    { level: 2, name: 'متعلم مثابر', xpRequired: 250 },
    { level: 3, name: 'باحث مجتهد', xpRequired: 600 },
    { level: 4, name: 'نجم صاعد', xpRequired: 1200 },
    { level: 5, name: 'خبير المادة', xpRequired: 2500 },
];


const AnnouncementsComponent: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
    if (!announcements || announcements.length === 0) {
        return null;
    }

    const latestAnnouncements = [...announcements]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);

    return (
        <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg animate-fade-in">
            <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                <InformationCircleIcon className="h-6 w-6 ml-3 text-blue-500" />
                أحدث الإعلانات
            </h3>
            <div className="space-y-4">
                {latestAnnouncements.map(ann => (
                    <div key={ann.id} className="border-b border-blue-200 pb-3 last:border-b-0 last:pb-0">
                        <h4 className="font-semibold text-gray-800">{ann.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const StudentDashboard: React.FC<DashboardProps> = ({ onLogout, currentUser, setUsers, classes, announcements }) => {
  const [subjects, setSubjects] = useState<Subject[]>(subjectsData);
  const [activeView, setActiveView] = useState<ActiveView>('subjects');
  const [expandedSubjectId, setExpandedSubjectId] = useState<string | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(LearningStyle.GENERAL);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { sender: 'bot', text: 'مرحباً! أنا "مدي"، مساعدك الذكي. كيف يمكنني مساعدتك في دروسك اليوم؟' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [position, setPosition] = useState({ x: 30, y: window.innerHeight - 100 });
  const dragRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const dragStartOffsetRef = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);

  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [currentItemForReminder, setCurrentItemForReminder] = useState<(Lesson | Exercise) | null>(null);
  const [reminderTime, setReminderTime] = useState('');
  const [activeNotification, setActiveNotification] = useState<{ title: string } | null>(null);
  
  const [books, setBooks] = useState<Book[]>(booksData);
  const [bookFilter, setBookFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isBookDetailsLoading, setIsBookDetailsLoading] = useState(false);
  const [viewingPdfUrl, setViewingPdfUrl] = useState<string | null>(null);

  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizForSummary, setQuizForSummary] = useState<Quiz | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);
  
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [subjectToEditId, setSubjectToEditId] = useState<string | null>(null);
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = currentUser.notifications?.filter(n => !n.read).length || 0;
  
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);
  
  const [activities, setActivities] = useState<Activity[]>(activitiesData);
  const [isActivityIconPickerOpen, setIsActivityIconPickerOpen] = useState(false);
  const [activityToEditIcon, setActivityToEditIcon] = useState<string | null>(null);

  const [selectedLearningItem, setSelectedLearningItem] = useState<LearningItem | null>(null);
  
  const initialStudentData = useMemo(() => classes.flatMap(c => c.students).find(s => s.name === currentUser.name), [classes, currentUser.name]);
  const [studentProfile, setStudentProfile] = useState<Student | null>(initialStudentData || null);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [levelUpNotification, setLevelUpNotification] = useState<string | null>(null);


  const studentHomeworks = useMemo(() => {
    // This is a mock student ID. In a real app, this would come from the current user session.
    const mockStudentId = 's1-1'; 
    const studentClass = classes.find(c => c.students.some(s => s.id === mockStudentId));
    if (!studentClass) return [];
    
    // Associate each homework with its class name
    return studentClass.homeworks.map(hw => ({ ...hw, className: studentClass.name }));
  }, [classes]);
  
  const handleAwardXp = (xpGained: number, actionType: string) => {
    if (!studentProfile) return;

    let updatedProfile = { ...studentProfile, xp: studentProfile.xp + xpGained };

    // Check for level up
    const currentLevelInfo = levelData.find(l => l.name === updatedProfile.levelName) || levelData[0];
    const nextLevelInfo = levelData.find(l => l.level === currentLevelInfo.level + 1);

    if (nextLevelInfo && updatedProfile.xp >= nextLevelInfo.xpRequired) {
        updatedProfile.levelName = nextLevelInfo.name;
        setLevelUpNotification(`تهانينا! لقد وصلت إلى المستوى: ${nextLevelInfo.name}`);
        setTimeout(() => setLevelUpNotification(null), 5000);
    }

    // Check for badges
    let newBadgesEarned = false;
    const completedExercisesCount = subjects.flatMap(s => s.exercises).filter(e => e.status === ContentStatus.COMPLETED).length;
    const completedMathLessonsCount = subjects.find(s => s.id === 'math')?.lessons.filter(l => l.status === ContentStatus.COMPLETED).length || 0;

    if (actionType === 'exercise' && completedExercisesCount === 1 && !updatedProfile.earnedBadgeIds.includes('perseverance-1')) {
        updatedProfile.earnedBadgeIds.push('perseverance-1');
        newBadgesEarned = true;
    }
    if (actionType === 'lesson-math' && completedMathLessonsCount >= 3 && !updatedProfile.earnedBadgeIds.includes('math-scholar-1')) {
        updatedProfile.earnedBadgeIds.push('math-scholar-1');
        newBadgesEarned = true;
    }
    // Add other badge checks here...

    setStudentProfile(updatedProfile);
  };


  const getActivityDetails = (title: string) => {
    if (title.includes('رياضيات')) {
        return { category: 'مسابقة علمية', color: 'bg-blue-500' };
    }
    if (title.includes('بيئة')) {
        return { category: 'حملة توعوية', color: 'bg-green-500' };
    }
    if (title.includes('ثقافية')) {
        return { category: 'حدث ثقافي', color: 'bg-amber-500' };
    }
    return { category: 'نشاط عام', color: 'bg-gray-500' };
  };

  const handleToggleNotifications = () => {
    setNotificationsOpen(prev => !prev);
    if (!notificationsOpen && unreadCount > 0) {
      setUsers(prevUsers => 
        prevUsers.map(u => 
          u.id === currentUser.id 
            ? { ...u, notifications: u.notifications?.map(n => ({...n, read: true})) || [] }
            : u
        )
      );
    }
  };

  const categoryColors: { [key: string]: string } = {
      'قصص': 'bg-blue-500',
      'مغامرات': 'bg-teal-500',
      'علوم': 'bg-purple-500',
      'تاريخ': 'bg-amber-500',
  };

  useEffect(() => {
    // Simulate fetching dashboard content
    setIsContentLoading(true);
    const timer = setTimeout(() => {
        setIsContentLoading(false);
    }, 700);
    return () => clearTimeout(timer);
  }, [activeView]);


  const handleSubjectClick = (subjectId: string) => {
    const newId = expandedSubjectId === subjectId ? null : subjectId;
    setExpandedSubjectId(newId);
    if (newId !== expandedSubjectId) {
      setSelectedLearningItem(null); // Close details panel when switching subjects
    }
  };

  const handleMarkAsComplete = (subjectId: string, itemId: string, itemType: 'lesson' | 'exercise') => {
    let xpGained = 0;
    let actionType = '';

    setSubjects(prevSubjects => {
        return prevSubjects.map(subject => {
            if (subject.id === subjectId) {
                const updatedSubject = { ...subject };
                const allContent: LearningItem[] = [
                    ...updatedSubject.lessons.map(l => ({ ...l, itemType: 'lesson' as const })),
                    ...updatedSubject.exercises.map(e => ({ ...e, itemType: 'exercise' as const }))
                ];
                let completedItemIndex = -1;

                if (itemType === 'lesson') {
                    updatedSubject.lessons = updatedSubject.lessons.map(l => {
                        if (l.id === itemId) {
                            completedItemIndex = allContent.findIndex(item => item.id === itemId);
                            xpGained = 50;
                            actionType = `lesson-${subject.id}`;
                            return { ...l, status: ContentStatus.COMPLETED };
                        }
                        return l;
                    });
                } else { // exercise
                    updatedSubject.exercises = updatedSubject.exercises.map(e => {
                        if (e.id === itemId) {
                            completedItemIndex = allContent.findIndex(item => item.id === itemId);
                             xpGained = 75;
                             if (e.score && e.score >= 90) xpGained += 25;
                             actionType = 'exercise';
                            return { ...e, status: ContentStatus.COMPLETED };
                        }
                        return e;
                    });
                }
                
                if (xpGained > 0) {
                    handleAwardXp(xpGained, actionType);
                }
                
                // If the completed item was selected, update its state in the details view
                if(selectedLearningItem && selectedLearningItem.id === itemId) {
                    setSelectedLearningItem(prev => prev ? {...prev, status: ContentStatus.COMPLETED} : null);
                }

                if (completedItemIndex > -1 && completedItemIndex < allContent.length - 1) {
                    const nextItem = allContent[completedItemIndex + 1];
                    if (nextItem && nextItem.status === ContentStatus.LOCKED) {
                        if (nextItem.itemType === 'lesson') {
                            updatedSubject.lessons = updatedSubject.lessons.map(l => l.id === nextItem.id ? { ...l, status: ContentStatus.IN_PROGRESS } : l);
                        } else {
                            updatedSubject.exercises = updatedSubject.exercises.map(e => e.id === nextItem.id ? { ...e, status: ContentStatus.IN_PROGRESS } : e);
                        }
                    }
                }

                const completedCount = updatedSubject.lessons.filter(l => l.status === ContentStatus.COMPLETED).length +
                                     updatedSubject.exercises.filter(e => e.status === ContentStatus.COMPLETED).length;
                const totalCount = updatedSubject.lessons.length + updatedSubject.exercises.length;
                updatedSubject.progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
                
                return updatedSubject;
            }
            return subject;
        });
    });
  };


  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    if (dragRef.current) {
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragStartOffsetRef.current = {
            x: clientX - position.x,
            y: clientY - position.y,
        };
    }
  };

  const handleDragMove = (e: MouseEvent | TouchEvent) => {
    if (isDraggingRef.current) {
      hasMovedRef.current = true;
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      let newX = clientX - dragStartOffsetRef.current.x;
      let newY = clientY - dragStartOffsetRef.current.y;
      
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const iconSize = 64; 
      if (newX < 10) newX = 10;
      if (newY < 10) newY = 10;
      if (newX > screenWidth - iconSize - 10) newX = screenWidth - iconSize - 10;
      if (newY > screenHeight - iconSize - 10) newY = screenHeight - iconSize - 10;

      setPosition({ x: newX, y: newY });
    }
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
  };

  const handleIconClick = () => {
    if (!hasMovedRef.current) {
        setIsChatOpen(prev => !prev);
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('touchmove', handleDragMove, { passive: false });
    window.addEventListener('touchend', handleDragEnd);

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleDragMove);
      // FIX: Corrected typo from handleMove to handleDragEnd to match the event listener.
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '' || isLoading) return;

    if (studentProfile && !studentProfile.earnedBadgeIds.includes('curious-1')) {
        handleAwardXp(20, 'ask-madi');
        setStudentProfile(prev => prev ? { ...prev, earnedBadgeIds: [...prev.earnedBadgeIds, 'curious-1']} : null);
    }

    const newMessages: ChatMessage[] = [...chatMessages, { sender: 'user', text: userInput }];
    setChatMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      const botResponse = await askMadi(userInput, learningStyle);
      setChatMessages([...newMessages, { sender: 'bot', text: botResponse }]);
    } catch (error) {
      setChatMessages([...newMessages, { sender: 'bot', text: 'عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const openReminderModal = (item: Lesson | Exercise) => {
    setCurrentItemForReminder(item);
    const now = new Date();
    now.setMinutes(now.getMinutes() + 60); // Default to 1 hour from now
    setReminderTime(now.toISOString().slice(0, 16));
    setIsReminderModalOpen(true);
  };

  const handleSetReminder = () => {
    if (!currentItemForReminder || !reminderTime) return;

    const newSubjects = subjects.map(subject => ({
      ...subject,
      lessons: subject.lessons.map(lesson =>
        lesson.id === currentItemForReminder.id ? { ...lesson, reminder: new Date(reminderTime) } : lesson
      ),
      exercises: subject.exercises.map(exercise =>
        exercise.id === currentItemForReminder.id ? { ...exercise, reminder: new Date(reminderTime) } : exercise
      ),
    }));

    setSubjects(newSubjects);
    setIsReminderModalOpen(false);
    setCurrentItemForReminder(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let notificationShown = false;
      subjects.forEach(subject => {
        [...subject.lessons, ...subject.exercises].forEach(item => {
          if (!notificationShown && item.reminder && new Date(item.reminder) <= now) {
            setActiveNotification({ title: item.title });
            notificationShown = true;

            const newSubjects = subjects.map(s => ({
              ...s,
              lessons: s.lessons.map(l => l.id === item.id ? { ...l, reminder: undefined } : l),
              exercises: s.exercises.map(e => e.id === item.id ? { ...e, reminder: undefined } : e),
            }));
            setSubjects(newSubjects);

            setTimeout(() => setActiveNotification(null), 5000);
          }
        });
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [subjects]);

    const handleBookClick = async (book: Book) => {
      setSelectedBook(book);
      if (book.description && book.firstPage) {
        return;
      }
      
      setIsBookDetailsLoading(true);
      try {
        const [description, firstPage] = await Promise.all([
          generateBookDescription(book.title, book.author),
          generateBookFirstPage(book.title, book.author)
        ]);
        
        const updatedBook = { ...book, description, firstPage };
        setBooks(prevBooks => 
          prevBooks.map(b => b.id === book.id ? updatedBook : b)
        );
        setSelectedBook(updatedBook);
      } catch (error) {
        console.error("Failed to generate book content", error);
        const errorBook = { ...book, description: "خطأ في تحميل الوصف.", firstPage: "خطأ في تحميل المحتوى." };
        setSelectedBook(errorBook);
      } finally {
        setIsBookDetailsLoading(false);
      }
    };

  const filteredBooks = books
    .filter(book => bookFilter === 'الكل' || book.category === bookFilter)
    .filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim() === '') return;
    const newTodo: TodoItem = {
      id: `todo-${Date.now()}`,
      text: newTodoText,
      completed: false,
      dueDate: newTodoDueDate || undefined,
    };
    setTodos([newTodo, ...todos]);
    setNewTodoText('');
    setNewTodoDueDate('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleAddComment = (e: React.FormEvent, subjectId: string, itemId: string, itemType: 'lesson' | 'exercise') => {
      e.preventDefault();
      const commentText = newCommentText[itemId];
      if (!commentText || commentText.trim() === '') return;

      const newComment: Comment = {
          id: `c-${Date.now()}`,
          authorName: currentUser.name,
          text: commentText,
          date: new Date().toISOString(),
      };
      
      setSubjects(prevSubjects => {
          return prevSubjects.map(subject => {
              if (subject.id === subjectId) {
                  const updatedSubject = { ...subject };
                  if (itemType === 'lesson') {
                      updatedSubject.lessons = updatedSubject.lessons.map(l => 
                          l.id === itemId ? { ...l, comments: [...l.comments, newComment] } : l
                      );
                  } else {
                       updatedSubject.exercises = updatedSubject.exercises.map(e => 
                          e.id === itemId ? { ...e, comments: [...e.comments, newComment] } : e
                      );
                  }
                  
                  // Update the selected item if it's the one being commented on
                  if (selectedLearningItem?.id === itemId) {
                    setSelectedLearningItem(prev => prev ? {
                        ...prev,
                        comments: [...prev.comments, newComment]
                    } : null);
                  }
                  
                  return updatedSubject;
              }
              return subject;
          })
      });

      setNewCommentText(prev => ({ ...prev, [itemId]: '' }));
  };

  const handleSelectIcon = (iconComponent: React.ReactElement) => {
    if (!subjectToEditId) return;
    setSubjects(prevSubjects =>
        prevSubjects.map(subject =>
            subject.id === subjectToEditId
                ? { ...subject, icon: iconComponent }
                : subject
        )
    );
  };

  const handleSelectColor = (colorClass: string) => {
    if (!subjectToEditId) return;
    setSubjects(prevSubjects =>
        prevSubjects.map(subject =>
            subject.id === subjectToEditId
                ? { ...subject, color: colorClass }
                : subject
        )
    );
  };
  
  const handleSelectActivityIcon = (iconComponent: React.ReactElement) => {
    if (!activityToEditIcon) return;
    setActivities(prevActivities =>
        prevActivities.map(activity =>
            activity.id === activityToEditIcon
                ? { ...activity, icon: iconComponent }
                : activity
        )
    );
    setIsActivityIconPickerOpen(false);
    setActivityToEditIcon(null);
  };

  const CustomizationModal: React.FC<{
    onClose: () => void;
    onSelectIcon: (icon: React.ReactElement) => void;
    onSelectColor: (colorClass: string) => void;
    currentColor: string;
  }> = ({ onClose, onSelectIcon, onSelectColor, currentColor }) => {
    const iconCategories = [
        {
            title: 'مواد دراسية',
            icons: [
                { component: <ChartPieIcon />, name: 'Math' },
                { component: <BookOpenIcon />, name: 'Literature' },
                { component: <BeakerIcon />, name: 'Science' },
                { component: <UsersIcon />, name: 'Social Studies' },
                { component: <GraduationCapIcon />, name: 'Academic' },
                { component: <PresentationChartBarIcon />, name: 'Presentation' },
                { component: <ChartBarIcon />, name: 'Statistics' },
                { component: <DocumentTextIcon />, name: 'Documents' },
                { component: <RobotHeadIcon />, name: 'Technology' },
                { component: <EnvelopeIcon />, name: 'Languages' },
            ]
        },
        {
            title: 'أنشطة وهوايات',
            icons: [
                { component: <SparklesIcon />, name: 'Creativity' },
                { component: <PlayIcon />, name: 'Media' },
                { component: <CollectionIcon />, name: 'Collections' },
                { component: <BriefcaseIcon />, name: 'Projects' },
            ]
        },
        {
            title: 'أيقونات عامة',
            icons: [
                { component: <CalendarIcon />, name: 'Calendar' },
                { component: <CogIcon />, name: 'Settings' },
                { component: <ClockIcon />, name: 'Time' },
                { component: <ClipboardListIcon />, name: 'Tasks' },
                { component: <QuestionMarkCircleIcon />, name: 'Help' },
                { component: <CheckCircleIcon />, name: 'Completed' },
                { component: <InformationCircleIcon />, name: 'Info' },
                { component: <ShieldCheckIcon />, name: 'Safety' },
                { component: <UserIcon />, name: 'Profile' },
                { component: <SendIcon />, name: 'Communication' },
            ]
        }
    ];

    const colors = [
        'bg-slate-500', 'bg-gray-500', 'bg-zinc-500', 'bg-neutral-500', 'bg-stone-500',
        'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 'bg-lime-500',
        'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-sky-500',
        'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500',
        'bg-pink-500', 'bg-rose-500'
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002] animate-fade-in p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">تخصيص المادة</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>
                <div className="overflow-y-auto pr-2">
                    {/* Color Palette */}
                    <div className="mb-8">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">اختر لوناً جديداً</h4>
                        <div className="grid grid-cols-8 sm:grid-cols-11 gap-3">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => onSelectColor(color)}
                                    className={`w-10 h-10 rounded-full ${color} transform hover:scale-110 transition-transform focus:outline-none ${currentColor === color ? 'ring-4 ring-offset-2 ring-blue-500' : ''}`}
                                    aria-label={`Select color ${color}`}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Icon Picker */}
                    {iconCategories.map(category => (
                        <div key={category.title} className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-700 mb-3">{category.title}</h4>
                            <div className="grid grid-cols-5 sm:grid-cols-8 gap-4">
                                {category.icons.map((iconInfo, index) => (
                                    <button
                                        key={index}
                                        onClick={() => onSelectIcon(iconInfo.component)}
                                        className="p-4 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 text-gray-600 transition-colors transform hover:scale-110"
                                        aria-label={`Select ${iconInfo.name} icon`}
                                    >
                                        {React.cloneElement(iconInfo.component, { className: 'h-8 w-8' })}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  };

    const getDueDateInfo = (dueDate?: string) => {
        if (!dueDate) {
            return { text: '', color: '' };
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const due = new Date(dueDate);
        due.setHours(0,0,0,0);

        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const formattedDate = new Date(due.getTime() + (due.getTimezoneOffset() * 60000)).toLocaleDateString('ar-MA', {
            month: 'long',
            day: 'numeric',
        });
        
        let text = `الموعد: ${formattedDate}`;
        let color = 'text-gray-500';

        if (diffDays < 0) {
            text = `فات موعده منذ ${Math.abs(diffDays)} يوم`;
            color = 'text-red-600';
        } else if (diffDays === 0) {
            text = 'مستحق اليوم';
            color = 'text-amber-600';
        } else if (diffDays === 1) {
            text = 'مستحق غداً';
            color = 'text-blue-600';
        }
        
        return { text, color };
    };

    const subjectToEdit = subjects.find(s => s.id === subjectToEditId);
    
    const GamificationWidget = () => {
        if (!studentProfile) return null;

        const currentLevel = levelData.find(l => l.name === studentProfile.levelName) || levelData[0];
        const nextLevel = levelData.find(l => l.level === currentLevel.level + 1);

        const xpForCurrentLevel = currentLevel.xpRequired;
        const xpForNextLevel = nextLevel ? nextLevel.xpRequired : studentProfile.xp;
        
        const levelProgress = nextLevel 
            ? Math.round(((studentProfile.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100)
            : 100;
            
        const earnedBadges = allBadges.filter(b => studentProfile.earnedBadgeIds.includes(b.id));

        return (
            <div className="mb-8 p-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl shadow-lg text-white animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <div className="text-center sm:text-right">
                        <p className="text-sm opacity-80">المستوى الحالي</p>
                        <h3 className="text-3xl font-black tracking-wide">{studentProfile.levelName}</h3>
                    </div>
                    <div className="flex-grow w-full sm:w-auto">
                        <div className="flex justify-between text-sm font-bold mb-1">
                            <span>{studentProfile.xp} XP</span>
                            <span>{nextLevel ? `${nextLevel.xpRequired} XP للوصول إلى: ${nextLevel.name}` : 'أعلى مستوى!'}</span>
                        </div>
                        <div className="w-full bg-black/30 rounded-full h-4">
                            <div className="bg-gradient-to-r from-yellow-300 to-amber-400 h-4 rounded-full transition-all duration-500" style={{ width: `${levelProgress}%` }}></div>
                        </div>
                    </div>
                    <div className="text-center sm:text-left">
                        <p className="text-sm opacity-80 mb-2">أحدث الأوسمة</p>
                        <div className="flex justify-center items-center gap-2">
                             {earnedBadges.slice(-3).map(badge => (
                                <div key={badge.id} className="group relative">
                                    <div className="w-12 h-12 bg-white/30 rounded-full flex items-center justify-center p-2 cursor-pointer" onClick={() => setIsBadgesModalOpen(true)}>
                                        {React.cloneElement(badge.icon, { className: 'h-8 w-8 text-yellow-300' })}
                                    </div>
                                    <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        {badge.name}
                                    </div>
                                </div>
                             ))}
                             <button onClick={() => setIsBadgesModalOpen(true)} className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold hover:bg-white/30 transition-colors">
                                +{Math.max(0, earnedBadges.length - 3)}
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

  const renderMainContent = () => {
    if (isContentLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinnerIcon className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }
    switch (activeView) {
      case 'announcements':
        const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return (
            <div className="animate-fade-in">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">أخبار و إعلانات المؤسسة</h1>
                        <p className="text-gray-500">ابق على اطلاع بآخر المستجدات.</p>
                    </div>
                </header>
                <div className="space-y-6">
                    {sortedAnnouncements.map(ann => (
                        <div key={ann.id} className="bg-white p-6 rounded-xl shadow-md border-r-4 border-blue-500">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{ann.title}</h2>
                            <p className="text-sm text-gray-500 mb-4">
                                {new Date(ann.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{ann.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
      case 'homework':
        const groupedHomeworks = studentHomeworks.reduce<Record<string, (Homework & { className: string })[]>>((acc, hw) => {
            const subject = subjects.find(s => s.id === hw.subjectId);
            if(subject) {
                if (!acc[subject.name]) {
                    acc[subject.name] = [];
                }
                acc[subject.name].push(hw);
            }
            return acc;
        }, {});

        const subjectOrder = subjects.map(s => s.name);
        const sortedSubjectNames = Object.keys(groupedHomeworks).sort((a, b) => {
            return subjectOrder.indexOf(a) - subjectOrder.indexOf(b);
        });

        return (
          <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">الواجبات المنزلية</h1>
                <p className="text-gray-500">تابع واجباتك ولا تفوت أي موعد تسليم.</p>
              </div>
            </header>
            <div className="space-y-8">
              {studentHomeworks.length > 0 ? (
                sortedSubjectNames.map(subjectName => {
                    const subject = subjects.find(s => s.name === subjectName);
                    if (!subject) return null;

                    const homeworksForSubject = groupedHomeworks[subjectName].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
                    const borderColorClass = subject.color.replace('bg-', 'border-');

                    return (
                        <div key={subject.id}>
                            <div className="flex items-center mb-4">
                                <div className={`p-2 rounded-lg ${subject.color} ml-3`}>
                                    {React.cloneElement(subject.icon, { className: 'h-6 w-6 text-white' })}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-700">{subject.name}</h2>
                            </div>
                            <div className="space-y-4">
                                {homeworksForSubject.map(hw => {
                                    const dueDateInfo = getDueDateInfo(hw.dueDate);
                                    return (
                                        <div key={hw.id} className={`bg-white p-5 rounded-xl shadow-md border-l-4 ${borderColorClass}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-semibold text-blue-600">{hw.className}</p>
                                                    <h2 className="text-xl font-bold text-gray-800 mt-1">{hw.title}</h2>
                                                </div>
                                                <div className={`text-sm font-bold text-right ${dueDateInfo.color}`}>
                                                    <CalendarIcon className="h-4 w-4 inline-block ml-1"/>
                                                    {dueDateInfo.text}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mt-3">{hw.description}</p>
                                            {hw.attachments.length > 0 && (
                                                <div className="mt-4">
                                                    <h4 className="font-semibold text-sm text-gray-700">المرفقات:</h4>
                                                    <ul className="list-disc list-inside mt-2 space-y-1">
                                                        {hw.attachments.map(att => (
                                                            <li key={att.id}>
                                                                <a href={att.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                                    {att.name} ({att.type === 'link' ? 'رابط' : 'ملف'})
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                                                <button className="px-5 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                                                    تسليم الواجب
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })
              ) : (
                <div className="text-center text-gray-500 py-16">
                  <ClipboardListIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg">لا توجد واجبات منزلية حالياً. عمل رائع!</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'todos':
        const sortedTodos = [...todos].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            if (a.dueDate && !b.dueDate) {
                return -1;
            }
            if (!a.dueDate && b.dueDate) {
                return 1;
            }
            if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
            return 0;
        });
        return (
          <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">قائمة المهام</h1>
                <p className="text-gray-500">نظم وقتك وتابع مهامك الدراسية.</p>
              </div>
            </header>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <form onSubmit={handleAddTodo} className="flex flex-wrap gap-3 mb-6 items-center">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="أضف مهمة جديدة..."
                  className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition min-w-[200px]"
                />
                 <input
                  type="date"
                  value={newTodoDueDate}
                  onChange={(e) => setNewTodoDueDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                />
                <button type="submit" className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                  إضافة
                </button>
              </form>
              <ul className="space-y-3">
                {sortedTodos.length > 0 ? (
                  sortedTodos.map(todo => {
                    const dueDateInfo = getDueDateInfo(todo.dueDate);
                    return (
                        <li
                          key={todo.id}
                          className={`flex items-center justify-between p-4 rounded-lg transition-colors ${todo.completed ? 'bg-gray-100' : 'bg-blue-50'}`}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={todo.completed}
                              onChange={() => handleToggleTodo(todo.id)}
                              className="w-5 h-5 ml-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <span className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                  {todo.text}
                                </span>
                                {todo.dueDate && !todo.completed && (
                                    <p className={`text-sm font-semibold mt-1 ${dueDateInfo.color}`}>
                                        <CalendarIcon className="h-4 w-4 inline-block ml-1"/>
                                        {dueDateInfo.text}
                                    </p>
                                )}
                            </div>
                          </div>
                          <button onClick={() => handleDeleteTodo(todo.id)} className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </li>
                    )
                  })
                ) : (
                  <p className="text-center text-gray-500 py-8">لا توجد مهام حالياً. أضف مهمتك الأولى!</p>
                )}
              </ul>
            </div>
          </div>
        );
      case 'library':
        return (
          <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">المكتبة الرقمية</h1>
                <p className="text-gray-500">تصفح وقراءة الكتب لإثراء معرفتك.</p>
              </div>
            </header>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex space-x-2 flex-wrap justify-center" dir="ltr">
                  {['الكل', 'قصص', 'علوم', 'تاريخ', 'مغامرات'].map(category => (
                    <button
                      key={category}
                      onClick={() => setBookFilter(category)}
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${bookFilter === category ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="relative w-full sm:w-auto">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="ابحث بالاسم أو المؤلف..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-72 pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                    <div key={book.id} className="group cursor-pointer" onClick={() => handleBookClick(book)}>
                      <div className="relative">
                          <img src={book.coverImage} alt={book.title} className="w-full h-64 object-cover rounded-lg shadow-md group-hover:shadow-xl transform group-hover:-translate-y-1 transition-all" />
                          <span className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded ${categoryColors[book.category] || 'bg-gray-500'}`}>
                              {book.category}
                          </span>
                      </div>
                      <h3 className="mt-3 font-bold text-gray-800">{book.title}</h3>
                      <p className="text-sm text-gray-500">{book.author}</p>
                    </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                    <p className="text-gray-500 text-lg">لم يتم العثور على كتب تطابق بحثك.</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'activities':
        return (
          <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">أنشطة المؤسسة</h1>
                <p className="text-gray-500">شارك في الأنشطة والمسابقات لتنمية مواهبك.</p>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map(activity => {
                const { category, color } = getActivityDetails(activity.title);
                return (
                    <div key={activity.id} className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col">
                      <div className="relative">
                          <img src={activity.image} alt={activity.title} className="w-full h-48 object-cover" />
                          <div className={`absolute top-0 right-0 m-4 px-3 py-1 text-sm font-bold text-white rounded-full ${color}`}>
                              {category}
                          </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-2">
                              <div>
                                  <div className="flex items-center text-sm text-gray-500 mb-2">
                                      <CalendarIcon className="h-4 w-4 ml-2" />
                                      <span>{new Date(activity.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                  </div>
                                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{activity.title}</h3>
                              </div>
                              <div className="flex items-start gap-2 flex-shrink-0">
                                  <div className={`p-3 rounded-lg ${color}`}>
                                      {React.cloneElement(activity.icon, { className: 'h-6 w-6 text-white' })}
                                  </div>
                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          setActivityToEditIcon(activity.id);
                                          setIsActivityIconPickerOpen(true);
                                      }}
                                      className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                                      aria-label="تغيير الأيقونة"
                                  >
                                      <PencilIcon className="h-5 w-5" />
                                  </button>
                              </div>
                          </div>
                          <p className="text-gray-600 mb-4 flex-grow">{activity.description}</p>
                          <button className={`w-full mt-auto flex items-center justify-center px-5 py-3 ${color} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
                            <span>تسجيل</span>
                          </button>
                      </div>
                    </div>
                )
              })}
            </div>
          </div>
        );
      case 'subjects':
      default:
        const attendanceData = { present: 180, absent: 5 }; // Mock data from App.tsx for "أحمد العلوي"
        const totalDays = attendanceData.present + attendanceData.absent;
        const attendancePercentage = totalDays > 0 ? Math.round((attendanceData.present / totalDays) * 100) : 100;

        return (
          <div className="animate-fade-in">
             <GamificationWidget />
             <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">المواد الدراسية</h1>
                    <p className="text-gray-500">هنا يمكنك متابعة دروسك وإنجاز تمارينك.</p>
                </div>
             </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                    <div className="relative h-20 w-20 flex-shrink-0">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                className="text-gray-200"
                                strokeWidth="3.6"
                                fill="none"
                                stroke="currentColor"
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                                className="text-green-500"
                                strokeWidth="3.6"
                                fill="none"
                                stroke="currentColor"
                                strokeDasharray={`${attendancePercentage}, 100`}
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-green-600">{attendancePercentage}%</span>
                        </div>
                    </div>
                    <div className="mr-4">
                        <h3 className="text-xl font-bold text-gray-800">نسبة الحضور</h3>
                        <p className="text-gray-500">إجمالي الحضور هذا العام</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
                    <div className="p-4 bg-red-100 rounded-full ml-4">
                        <CalendarIcon className="h-8 w-8 text-red-500" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">أيام الغياب</h3>
                        <p className="text-4xl font-bold text-red-600">{attendanceData.absent}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => {
                    const isExpanded = expandedSubjectId === subject.id;
                    const learningItems: LearningItem[] = [
                        ...subject.lessons.map(l => ({ ...l, itemType: 'lesson' as const })),
                        ...subject.exercises.map(e => ({ ...e, itemType: 'exercise' as const })),
                        // A real implementation would sort these by a predefined order
                    ];

                    return (
                        <div key={subject.id} className="bg-white rounded-xl shadow-md transition-all duration-300">
                            <div onClick={() => handleSubjectClick(subject.id)} className={`p-6 cursor-pointer transition-shadow ${isExpanded ? '' : 'hover:shadow-lg'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className={`p-3 rounded-lg ${subject.color} ml-4`}>
                                            {React.cloneElement(subject.icon, { className: 'h-8 w-8 text-white' })}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-800">{subject.name}</h2>
                                            <p className="text-sm text-gray-500">التقدم: {subject.progress}%</p>
                                        </div>
                                    </div>
                                    <div className="relative group">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSubjectToEditId(subject.id);
                                                setIsCustomizationModalOpen(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-all transform hover:scale-110"
                                            aria-label="تخصيص المادة"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <span className="absolute bottom-full right-0 mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                            تخصيص
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className={`${subject.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${subject.progress}%` }}></div>
                                </div>
                            </div>
                            
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px] p-6 pt-4' : 'max-h-0'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                                    {/* Learning Path */}
                                    <div className="relative">
                                        <h3 className="text-xl font-semibold text-gray-700 mb-6">المسار التعليمي</h3>
                                        {/* Dotted line background */}
                                        <div className="absolute top-12 bottom-4 right-6 w-0.5 bg-repeat-y bg-[length:8px_8px]" style={{backgroundImage: 'radial-gradient(circle, #cbd5e1 1.5px, transparent 1.5px)'}}></div>
                                        {learningItems.map((item, index) => {
                                            const isSelected = selectedLearningItem?.id === item.id;
                                            const statusStyles = {
                                                [ContentStatus.COMPLETED]: {
                                                    ring: 'ring-green-500',
                                                    bg: 'bg-green-500',
                                                    text: 'text-green-600',
                                                    icon: <CheckCircleIcon className="h-5 w-5 text-white" />
                                                },
                                                [ContentStatus.IN_PROGRESS]: {
                                                    ring: 'ring-blue-500',
                                                    bg: 'bg-blue-500',
                                                    text: 'text-blue-600',
                                                    icon: item.itemType === 'lesson' ? <DocumentTextIcon className="h-5 w-5 text-white" /> : <ClipboardListIcon className="h-5 w-5 text-white" />
                                                },
                                                [ContentStatus.LOCKED]: {
                                                    ring: 'ring-gray-300',
                                                    bg: 'bg-gray-300',
                                                    text: 'text-gray-400',
                                                    icon: <LockClosedIcon className="h-5 w-5 text-white" />
                                                }
                                            };
                                            const styles = statusStyles[item.status];
                                            const isLocked = item.status === ContentStatus.LOCKED;
                                            
                                            return (
                                                <div key={item.id} className="flex items-center mb-6">
                                                    <button
                                                        onClick={() => !isLocked && setSelectedLearningItem(item)}
                                                        disabled={isLocked}
                                                        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${styles.bg} ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'} ring-4 ring-white ${isSelected ? styles.ring : 'ring-transparent'}`}
                                                    >
                                                        {item.status === ContentStatus.IN_PROGRESS && <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping"></div>}
                                                        <div className="relative z-10">{styles.icon}</div>
                                                    </button>
                                                    <div className="mr-4 flex-grow">
                                                        <p className={`font-semibold ${isLocked ? styles.text : 'text-gray-800'}`}>{item.title}</p>
                                                        <p className={`text-sm ${isLocked ? styles.text : 'text-gray-500'}`}>{item.itemType === 'lesson' ? 'درس' : 'تمرين'}</p>
                                                    </div>
                                                    {item.itemType === 'exercise' && item.status === ContentStatus.COMPLETED && 'score' in item && item.score !== undefined && (
                                                        <div className="text-center bg-green-100 rounded-lg px-2 py-1">
                                                            <p className="text-sm font-bold text-green-700">{item.score}</p>
                                                            <p className="text-xs text-green-600">/100</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    {/* Details Panel */}
                                    <div className="md:mt-16">
                                        {selectedLearningItem && (
                                            <div className="bg-gray-50 rounded-lg p-4 animate-fade-in sticky top-24">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-800">{selectedLearningItem.title}</h4>
                                                        <p className="text-sm text-gray-500">{selectedLearningItem.description}</p>
                                                    </div>
                                                    <button onClick={() => setSelectedLearningItem(null)}><XIcon className="h-5 w-5 text-gray-400 hover:text-gray-600"/></button>
                                                </div>
                                                
                                                {selectedLearningItem.itemType === 'exercise' && selectedLearningItem.status === ContentStatus.COMPLETED && 'score' in selectedLearningItem && selectedLearningItem.score !== undefined && (
                                                    <div className="mt-4 py-3 text-center bg-white rounded-lg border">
                                                        <p className="text-sm font-semibold text-gray-500">الدرجة المحصل عليها</p>
                                                        <p className="text-4xl font-extrabold text-green-600">{selectedLearningItem.score}<span className="text-2xl text-gray-400">/100</span></p>
                                                    </div>
                                                )}

                                                <div className="mt-4 pt-4 border-t space-y-3">
                                                    { selectedLearningItem.itemType === 'lesson' && 'steps' in selectedLearningItem && selectedLearningItem.steps && selectedLearningItem.steps.length > 0 && (
                                                        <button onClick={() => setViewingLesson(selectedLearningItem as Lesson)} className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                                                            <PlayIcon className="h-5 w-5 ml-2" /> بدء الدرس التفاعلي
                                                        </button>
                                                    )}
                                                    {selectedLearningItem.status === ContentStatus.IN_PROGRESS && (
                                                        <button
                                                            onClick={() => handleMarkAsComplete(subject.id, selectedLearningItem.id, selectedLearningItem.itemType)}
                                                            className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                                                        >
                                                            <CheckCircleIcon className="h-5 w-5 ml-2" /> إتمام {selectedLearningItem.itemType === 'lesson' ? 'الدرس' : 'التمرين'}
                                                        </button>
                                                    )}
                                                </div>
                                                <div className="mt-4 pt-2">
                                                    <h5 className="font-semibold text-sm mb-2">التعليقات</h5>
                                                     <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                                                        {selectedLearningItem.comments.length > 0 ? selectedLearningItem.comments.map(comment => (
                                                            <div key={comment.id} className="flex items-start space-x-2 space-x-reverse py-2">
                                                                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center text-sm font-bold text-blue-800">{comment.authorName.charAt(0).toUpperCase()}</div>
                                                                <div className="flex-1 bg-white p-2 rounded-lg border">
                                                                    <p className="font-semibold text-blue-800 text-xs">{comment.authorName}</p>
                                                                    <p className="text-gray-700 text-sm">{comment.text}</p>
                                                                </div>
                                                            </div>
                                                        )) : <p className="text-xs text-gray-500 text-center py-2">لا توجد تعليقات.</p>}
                                                    </div>
                                                    <form onSubmit={(e) => handleAddComment(e, subject.id, selectedLearningItem.id, selectedLearningItem.itemType)} className="flex items-start gap-2 mt-3">
                                                        <textarea
                                                            value={newCommentText[selectedLearningItem.id] || ''}
                                                            onChange={(e) => setNewCommentText(prev => ({...prev, [selectedLearningItem.id]: e.target.value}))}
                                                            placeholder="أضف تعليقاً..."
                                                            className="flex-grow p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
                                                            rows={1}
                                                        />
                                                        <button type="submit" className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300" disabled={!newCommentText[selectedLearningItem.id] || newCommentText[selectedLearningItem.id].trim() === ''}>
                                                            <SendIcon className="h-5 w-5" />
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-6 border-t pt-4">
                                     <h3 className="text-xl font-semibold text-gray-700 mb-4">الاختبارات</h3>
                                     {subject.quizzes.length > 0 ? (
                                        <ul className="space-y-3">
                                            {subject.quizzes.map((quiz: Quiz) => (
                                                <li key={quiz.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div className="flex items-center">
                                                        <QuestionMarkCircleIcon className="h-6 w-6 text-gray-400 ml-3 flex-shrink-0" />
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{quiz.title}</p>
                                                            <p className="text-sm text-gray-500">{quiz.questions.length} أسئلة</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => setQuizForSummary(quiz)}
                                                        className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                                    >
                                                        بدء
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-gray-500">لا توجد اختبارات متاحة حالياً.</p>}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
          </div>
        );
    }
  };

  const NavLink: React.FC<{
    view: ActiveView;
    Icon: React.FC<React.SVGProps<SVGSVGElement>>;
    text: string;
  }> = ({ view, Icon, text }) => (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        setActiveView(view);
      }}
      className={`flex items-center p-3 rounded-lg transition-colors ${
        activeView === view
          ? 'bg-blue-100 text-blue-700 font-bold'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      <Icon className={`h-6 w-6 ml-4 ${activeView === view ? 'text-blue-600' : ''}`} />
      <span>{text}</span>
    </a>
  );

  return (
    <>
      <div className="flex min-h-screen bg-gray-100" dir="rtl">
        {/* Sidebar */}
        <div className="relative w-64 bg-white shadow-md flex flex-col z-10">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
                <UserIcon className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2 ml-3" />
                <div>
                  <h2 className="text-lg font-bold text-blue-700">{currentUser.name}</h2>
                  <p className="text-sm text-gray-500">مرحباً بعودتك!</p>
                </div>
            </div>
            <div>
                <button onClick={handleToggleNotifications} className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
                {notificationsOpen && (
                    <div className="absolute top-20 right-4 left-4 w-auto max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border z-20 animate-fade-in">
                       <div className="p-3 font-bold text-gray-700 border-b">الإشعارات</div>
                        {currentUser.notifications && currentUser.notifications.length > 0 ? (
                            <ul>
                                {currentUser.notifications.map(notif => (
                                    <li key={notif.id} className="border-b p-3 hover:bg-gray-50">
                                        <p className={`text-sm ${!notif.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>{notif.message}</p>
                                        <p className="text-xs text-gray-400 mt-1">{timeSince(notif.date)}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-center text-gray-500 p-4">لا توجد إشعارات جديدة.</p>
                        )}
                    </div>
                )}
            </div>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <NavLink view="subjects" Icon={BookOpenIcon} text="المواد الدراسية" />
            <NavLink view="homework" Icon={ClipboardListIcon} text="الواجبات المنزلية" />
            <NavLink view="todos" Icon={ClipboardListIcon} text="قائمة المهام" />
            <NavLink view="library" Icon={CollectionIcon} text="المكتبة الرقمية" />
            <NavLink view="activities" Icon={SparklesIcon} text="أنشطة المؤسسة" />
            <NavLink view="announcements" Icon={InformationCircleIcon} text="أخبار المؤسسة" />
          </nav>
          <div className="p-4 border-t">
            <button onClick={onLogout} className="flex items-center w-full p-3 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
              <LogoutIcon className="h-6 w-6 ml-4" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {renderMainContent()}
        </main>
      </div>

      {quizForSummary && (
        <QuizSummaryModal
            quiz={quizForSummary}
            onClose={() => setQuizForSummary(null)}
            onStart={() => {
                setActiveQuiz(quizForSummary);
                setQuizForSummary(null);
            }}
        />
      )}

      {activeQuiz && (
          <QuizPlayerModal quiz={activeQuiz} onClose={(completed) => {
            if (completed) {
                handleAwardXp(100, 'quiz');
            }
            setActiveQuiz(null)
          }} />
      )}

       {/* Draggable Madi Icon */}
       <div
            ref={dragRef}
            style={{ position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 1000, touchAction: 'none' }}
            className="cursor-grab active:cursor-grabbing"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onClick={handleIconClick}
        >
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transform transition-transform hover:scale-110">
                <RobotHeadIcon className="w-9 h-9 text-white" />
            </div>
        </div>


      {/* Madi Chat Window */}
      {isChatOpen && (
         <div className="fixed bottom-24 right-5 w-96 max-w-[90vw] h-[60vh] bg-white rounded-xl shadow-2xl flex flex-col z-50 animate-fade-in" dir="rtl">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                    <RobotHeadIcon className="h-8 w-8 text-blue-600 ml-3"/>
                    <h2 className="text-xl font-bold">المساعد الذكي "مدي"</h2>
                </div>
                <div className="relative group">
                    <CogIcon className="h-6 w-6 text-gray-500 cursor-pointer"/>
                    <div className="absolute top-8 left-0 w-48 bg-white border rounded-lg shadow-xl hidden group-hover:block z-10 p-2 space-y-1">
                        <p className="text-sm font-semibold px-2 py-1 text-gray-600">أسلوب التعلم</p>
                        {Object.values(LearningStyle).map(style => (
                            <button 
                                key={style} 
                                onClick={() => setLearningStyle(style)}
                                className={`w-full text-right px-2 py-1 rounded text-sm ${learningStyle === style ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                            >
                                {style}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-blue-50/50">
                <div className="space-y-4">
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
                        <p className="text-sm">{msg.text}</p>
                    </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-xs lg:max-w-md px-4 py-2 rounded-2xl bg-white text-gray-800 rounded-bl-none shadow-sm">
                            <div className="flex items-center space-x-2">
                                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
                </div>
            </div>
            <div className="p-4 border-t bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center">
                <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="اسأل عن أي شيء..."
                    className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isLoading}
                />
                <button type="submit" className="mr-3 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-blue-300" disabled={isLoading || !userInput.trim()}>
                    <SendIcon className="h-5 w-5" />
                </button>
                </form>
            </div>
         </div>
      )}
      
      {/* Reminder Modal */}
        {isReminderModalOpen && currentItemForReminder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold">تعيين تذكير</h3>
                        <button onClick={() => setIsReminderModalOpen(false)}><XIcon className="h-6 w-6 text-gray-500" /></button>
                    </div>
                    <p className="mb-4 text-gray-600">سيتم تذكيرك بمراجعة: <strong>{currentItemForReminder.title}</strong></p>
                    <input
                        type="datetime-local"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full p-2 border rounded-md mb-4"
                    />
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsReminderModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                        <button onClick={handleSetReminder} className="px-4 py-2 bg-blue-500 text-white rounded-md">حفظ التذكير</button>
                    </div>
                </div>
            </div>
        )}

      {/* Notification Toast */}
        {activeNotification && (
            <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded-lg shadow-lg z-[1001] animate-fade-in">
                <p><strong>🔔 تذكير!</strong></p>
                <p>حان وقت مراجعة: {activeNotification.title}</p>
            </div>
        )}
      {isCustomizationModalOpen && subjectToEdit && (
          <CustomizationModal
              onClose={() => {
                setIsCustomizationModalOpen(false);
                setSubjectToEditId(null);
              }}
              onSelectIcon={handleSelectIcon}
              onSelectColor={handleSelectColor}
              currentColor={subjectToEdit.color}
          />
      )}
      {isActivityIconPickerOpen && (
        <CustomizationModal
            onClose={() => setIsActivityIconPickerOpen(false)}
            onSelectIcon={handleSelectActivityIcon}
            onSelectColor={() => {}} // No color for activities yet
            currentColor=""
        />
       )}
      {viewingLesson && (
          <InteractiveLessonPlayer
            lesson={viewingLesson}
            onClose={() => setViewingLesson(null)}
            onComplete={(lessonId) => {
                const subjectId = subjects.find(s => s.lessons.some(l => l.id === lessonId))?.id;
                if(subjectId) {
                    handleMarkAsComplete(subjectId, lessonId, 'lesson');
                }
                setViewingLesson(null);
            }}
          />
      )}
      {selectedBook && (
          <BookDetailsModal 
            book={selectedBook}
            isLoading={isBookDetailsLoading}
            onClose={() => setSelectedBook(null)}
            onOpenPdf={(url) => {
                setSelectedBook(null);
                setViewingPdfUrl(url);
                handleAwardXp(150, 'read-book');
            }}
          />
      )}
      {viewingPdfUrl && (
        <PdfViewerModal pdfUrl={viewingPdfUrl} onClose={() => setViewingPdfUrl(null)} />
      )}
      {isBadgesModalOpen && studentProfile && (
        <BadgesModal
            earnedBadgeIds={studentProfile.earnedBadgeIds}
            onClose={() => setIsBadgesModalOpen(false)}
        />
      )}
      {levelUpNotification && (
          <div className="fixed top-5 right-5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4 rounded-lg shadow-lg z-[1001] animate-fade-in flex items-center">
              <TrophyIcon className="h-8 w-8 text-yellow-300 ml-3"/>
              <div>
                  <p className="font-bold text-lg">!ترقية المستوى</p>
                  <p>{levelUpNotification}</p>
              </div>
          </div>
      )}
    </>
  );
};

const BadgesModal: React.FC<{
    earnedBadgeIds: string[];
    onClose: () => void;
}> = ({ earnedBadgeIds, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[1002] animate-fade-in p-4">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-6 pb-4 border-b">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                        <TrophyIcon className="h-7 w-7 ml-3 text-amber-500" />
                        مجموعة الأوسمة
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                        <XIcon className="h-6 w-6 text-gray-500" />
                    </button>
                </div>
                <div className="overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                    {allBadges.map(badge => {
                        const isEarned = earnedBadgeIds.includes(badge.id);
                        return (
                            <div key={badge.id} className={`p-4 rounded-xl text-center transition-all duration-300 ${isEarned ? 'bg-amber-50 border-2 border-amber-200' : 'bg-gray-100'}`}>
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-3 transition-all ${isEarned ? 'bg-amber-400' : 'bg-gray-300'}`}>
                                    {React.cloneElement(badge.icon, { className: `h-12 w-12 transition-colors ${isEarned ? 'text-white' : 'text-gray-500'}` })}
                                </div>
                                <h4 className={`font-bold transition-colors ${isEarned ? 'text-amber-800' : 'text-gray-700'}`}>{badge.name}</h4>
                                <p className={`text-xs mt-1 transition-colors ${isEarned ? 'text-amber-600' : 'text-gray-500'}`}>{badge.description}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};

const InteractiveTextRenderer: React.FC<{ content: string }> = ({ content }) => {
    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = content.split(regex);

    const toggleTooltip = (id: string) => {
        setActiveTooltip(prev => (prev === id ? null : id));
    };

    const renderedContent: React.ReactNode[] = [];
    let i = 0;
    while (i < parts.length) {
        if (parts[i]) {
            renderedContent.push(<React.Fragment key={`text-${i}`}>{parts[i]}</React.Fragment>);
        }
        
        const word = parts[i + 1];
        const definition = parts[i + 2];
        
        if (word && definition) {
            const tooltipId = `tooltip-${i}`;
            renderedContent.push(
                <span key={tooltipId} className="relative inline-block">
                    <button
                        onClick={() => toggleTooltip(tooltipId)}
                        className="text-blue-600 font-bold border-b-2 border-blue-400 border-dotted cursor-pointer focus:outline-none"
                        aria-expanded={activeTooltip === tooltipId}
                    >
                        {word}
                    </button>
                    {activeTooltip === tooltipId && (
                        <span role="tooltip" className="absolute bottom-full mb-2 w-48 p-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg z-10 transform -translate-x-1/2 left-1/2">
                            {definition}
                             <svg className="absolute text-gray-900 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
                                <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
                            </svg>
                        </span>
                    )}
                </span>
            );
        }
        
        i += 3;
    }

    return <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">{renderedContent}</p>;
};

const InteractiveLessonPlayer: React.FC<{
    lesson: Lesson;
    onClose: () => void;
    onComplete: (lessonId: string) => void;
}> = ({ lesson, onClose, onComplete }) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect' | null>>({});
    
    const steps = lesson.steps || [];
    if (steps.length === 0) {
        onClose();
        return null;
    }
    const currentStep = steps[currentStepIndex];
    const totalSteps = steps.length;
    const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentStep.type === LessonStepType.QUIZ) {
            const isCorrect = feedback[currentStep.quizQuestion!.id] === 'correct';
            if (!isCorrect) return; // Don't advance if quiz is not answered correctly
        }
        
        if (currentStepIndex < totalSteps - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            onComplete(lesson.id);
        }
    };
    
    const handleAnswerSelect = (questionId: string, selectedOptionId: string) => {
        if (feedback[questionId]) return; // Already answered

        setAnswers(prev => ({ ...prev, [questionId]: selectedOptionId }));
        const question = currentStep.quizQuestion;
        const correctOption = question?.options?.find(o => o.isCorrect);

        if (correctOption?.id === selectedOptionId) {
            setFeedback(prev => ({ ...prev, [questionId]: 'correct' }));
        } else {
            setFeedback(prev => ({ ...prev, [questionId]: 'incorrect' }));
        }
    };
    
    const handleShortAnswerSubmit = (e: React.FormEvent, questionId: string) => {
        e.preventDefault();
        const question = currentStep.quizQuestion;
        const userAnswer = answers[questionId];
        if (!question || !userAnswer || feedback[questionId]) return;
        
        if (userAnswer.trim() === question.correctAnswer) {
             setFeedback(prev => ({ ...prev, [questionId]: 'correct' }));
        } else {
            setFeedback(prev => ({ ...prev, [questionId]: 'incorrect' }));
        }
    };

    const renderStepContent = () => {
        switch (currentStep.type) {
            case LessonStepType.TEXT:
                return (
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">{currentStep.title}</h2>
                        <InteractiveTextRenderer content={currentStep.content} />
                    </div>
                );
            case LessonStepType.VIDEO:
                return (
                    <div>
                         <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">{currentStep.title}</h2>
                         <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
                            <iframe src={currentStep.content} title={currentStep.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute top-0 left-0 w-full h-full"></iframe>
                        </div>
                    </div>
                );
            case LessonStepType.SIMULATION:
                return (
                    <div className="flex flex-col h-full">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">{currentStep.title}</h2>
                        <p className="text-gray-500 text-center mb-4">تفاعل مع المحاكاة أدناه لفهم المفهوم بشكل أفضل.</p>
                         <div className="flex-grow w-full bg-gray-200 rounded-lg overflow-hidden border">
                            <iframe src={currentStep.content} title={currentStep.title} frameBorder="0" className="w-full h-full"></iframe>
                        </div>
                    </div>
                );
            case LessonStepType.QUIZ:
                 const question = currentStep.quizQuestion!;
                 const userAnswer = answers[question.id];
                 const currentFeedback = feedback[question.id];
                return (
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">{currentStep.title}</h2>
                        <p className="text-xl font-bold text-gray-800 mb-8">{question.questionText}</p>

                        {question.type === QuestionType.MULTIPLE_CHOICE && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                                {question.options?.map(option => {
                                    const isSelected = userAnswer === option.id;
                                    let buttonClass = 'bg-white hover:bg-blue-50 border-gray-300';
                                    if (isSelected) {
                                        if (currentFeedback === 'correct') {
                                            buttonClass = 'bg-green-100 border-green-500 ring-2 ring-green-300';
                                        } else if (currentFeedback === 'incorrect') {
                                            buttonClass = 'bg-red-100 border-red-500 ring-2 ring-red-300';
                                        } else {
                                            buttonClass = 'bg-blue-100 border-blue-500 ring-2 ring-blue-300';
                                        }
                                    } else if (currentFeedback && option.isCorrect) {
                                        buttonClass = 'bg-green-100 border-green-500';
                                    }
                                    
                                    return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleAnswerSelect(question.id, option.id)}
                                        disabled={!!currentFeedback}
                                        className={`p-4 rounded-lg border-2 text-lg font-semibold transition-all duration-200 w-full ${buttonClass}`}
                                    >
                                        {option.text}
                                    </button>
                                    );
                                })}
                            </div>
                        )}
                        
                        {question.type === QuestionType.SHORT_ANSWER && (
                            <form onSubmit={(e) => handleShortAnswerSubmit(e, question.id)} className="max-w-sm mx-auto flex items-center gap-2">
                                <input
                                    type="text"
                                    value={userAnswer || ''}
                                    onChange={(e) => setAnswers(prev => ({...prev, [question.id]: e.target.value}))}
                                    disabled={!!currentFeedback}
                                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-center text-lg"
                                    placeholder="اكتب إجابتك"
                                />
                                <button type="submit" disabled={!!currentFeedback || !userAnswer} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors">
                                    تأكيد
                                </button>
                            </form>
                        )}
                        
                        {currentFeedback === 'correct' && <p className="mt-4 text-green-600 font-semibold text-lg">إجابة صحيحة! أحسنت.</p>}
                        {currentFeedback === 'incorrect' && <p className="mt-4 text-red-600 font-semibold text-lg">إجابة خاطئة. الإجابة الصحيحة هي: {question.type === QuestionType.MULTIPLE_CHOICE ? question.options?.find(o => o.isCorrect)?.text : question.correctAnswer}</p>}
                    </div>
                );
            default: return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-white z-[1002] flex flex-col animate-fade-in" dir="rtl">
            <header className="flex-shrink-0 p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">{lesson.title}</h3>
                <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800" /></button>
            </header>
            <main className="flex-grow p-8 overflow-y-auto flex items-center justify-center">
                <div className="w-full max-w-4xl h-full">
                   {renderStepContent()}
                </div>
            </main>
            <footer className="flex-shrink-0 p-4 border-t bg-gray-50">
                 <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                    <button onClick={handlePrevious} disabled={currentStepIndex === 0} className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed">السابق</button>
                    <span className="text-sm font-semibold text-gray-600">الخطوة {currentStepIndex + 1} / {totalSteps}</span>
                    <button onClick={handleNext} disabled={currentStep.type === LessonStepType.QUIZ && feedback[currentStep.quizQuestion!.id] !== 'correct'} className="px-8 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                        {currentStepIndex === totalSteps - 1 ? 'إنهاء الدرس' : 'التالي'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

const BookDetailsModal: React.FC<{ 
    book: Book; 
    isLoading: boolean; 
    onClose: () => void;
    onOpenPdf: (url: string) => void; 
}> = ({ book, isLoading, onClose, onOpenPdf }) => {
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        // Reset to summary view when book changes
        setIsReading(false);
    }, [book]);

    const categoryColors: { [key: string]: string } = {
      'قصص': 'bg-blue-500',
      'مغامرات': 'bg-teal-500',
      'علوم': 'bg-purple-500',
      'تاريخ': 'bg-amber-500',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1002] animate-fade-in p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 flex-shrink-0 relative">
                     <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover rounded-t-xl md:rounded-r-xl md:rounded-l-none" />
                     <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full text-white hover:bg-black/75 transition-colors">
                        <XIcon className="h-6 w-6" />
                     </button>
                </div>
                <div className="w-full md:w-2/3 p-8 flex flex-col overflow-y-auto">
                    {isReading ? (
                        // Reading View (Text Sample)
                        <div>
                             <h3 className="text-2xl font-bold text-gray-800 mb-4">{book.title} - الصفحة الأولى</h3>
                             {isLoading ? (
                                <div className="space-y-3 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                </div>
                             ) : (
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{book.firstPage}</p>
                             )}
                              <div className="mt-auto pt-6 text-center">
                                <button onClick={() => setIsReading(false)} className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                                    العودة إلى الوصف
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Summary View
                        <>
                            <div>
                                <span className={`px-3 py-1 text-sm font-semibold text-white rounded-full ${categoryColors[book.category] || 'bg-gray-500'}`}>
                                  {book.category}
                                </span>
                                <h2 className="text-4xl font-extrabold text-gray-900 mt-3">{book.title}</h2>
                                <p className="text-lg text-gray-500 mt-1">للمؤلف: {book.author}</p>
                                <div className="w-16 h-1 bg-blue-500 rounded-full my-6"></div>

                                {isLoading ? (
                                    <div className="flex items-center justify-center h-24">
                                        <LoadingSpinnerIcon className="w-8 h-8 text-blue-500 animate-spin" />
                                    </div>
                                ) : (
                                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                                )}
                            </div>
                            <div className="mt-auto pt-8 text-center space-y-3">
                                {book.pdfUrl && (
                                     <button
                                        onClick={() => onOpenPdf(book.pdfUrl!)}
                                        className="w-full px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-lg flex items-center justify-center"
                                    >
                                        <DocumentTextIcon className="h-6 w-6 ml-3" />
                                        اقرأ الكتاب (PDF)
                                    </button>
                                )}
                                <button 
                                    onClick={() => setIsReading(true)}
                                    className={`w-full px-6 py-3 font-bold rounded-lg transition-colors text-lg flex items-center justify-center ${book.pdfUrl ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
                                >
                                    <BookOpenIcon className="h-6 w-6 ml-3" />
                                    اقرأ عينة من الكتاب
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const PdfViewerModal: React.FC<{ pdfUrl: string; onClose: () => void; }> = ({ pdfUrl, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black z-[1003] flex flex-col animate-fade-in" dir="rtl">
            <header className="flex-shrink-0 p-4 bg-gray-800 text-white flex justify-between items-center">
                <h3 className="text-lg font-bold">قارئ الكتب</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
                    <XIcon className="h-6 w-6" />
                </button>
            </header>
            <main className="flex-grow">
                <iframe src={pdfUrl} title="PDF Reader" className="w-full h-full border-0"></iframe>
            </main>
        </div>
    );
};

const QuizSummaryModal: React.FC<{ quiz: Quiz; onClose: () => void; onStart: () => void; }> = ({ quiz, onClose, onStart }) => {
    const calculateEstimatedTime = () => {
        const timePerQuestion = {
            [QuestionType.MULTIPLE_CHOICE]: 45, // seconds
            [QuestionType.TRUE_FALSE]: 30, // seconds
            [QuestionType.SHORT_ANSWER]: 90, // seconds
        };
        const totalSeconds = quiz.questions.reduce((total, q) => {
            return total + (timePerQuestion[q.type] || 60);
        }, 0);

        const minutes = Math.ceil(totalSeconds / 60);
        return minutes < 1 ? 1 : minutes; // Minimum 1 minute
    };

    const estimatedTime = calculateEstimatedTime();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg text-center p-8">
                <div className="flex justify-center mb-4">
                    <QuestionMarkCircleIcon className="h-16 w-16 text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">الاستعداد للاختبار</h2>
                <p className="text-gray-600 mt-2 text-xl font-semibold">"{quiz.title}"</p>

                <div className="my-8 text-right bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                        <span className="font-semibold">عدد الأسئلة:</span>
                        <span className="text-gray-700">{quiz.questions.length} أسئلة</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="font-semibold">الوقت التقديري:</span>
                        <span className="text-gray-700">حوالي {estimatedTime} دقائق</span>
                    </div>
                </div>

                <p className="text-sm text-gray-500 mb-6">
                    بمجرد أن تبدأ، حاول إكمال الاختبار في جلسة واحدة. بالتوفيق!
                </p>

                <div className="flex justify-center gap-4">
                    <button onClick={onClose} className="px-8 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">
                        إلغاء
                    </button>
                     <button onClick={onStart} className="w-48 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                        <PlayIcon className="h-5 w-5 ml-2" />
                        ابدأ الاختبار
                    </button>
                </div>
            </div>
        </div>
    );
};

const QuizPlayerModal: React.FC<{ quiz: Quiz; onClose: (completed: boolean) => void }> = ({ quiz, onClose }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
    const [submittedAnswers, setSubmittedAnswers] = useState<Record<string, boolean>>({});
    const [isFinished, setIsFinished] = useState(false);

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const isSubmitted = submittedAnswers[currentQuestion.id];
    const userAnswer = userAnswers[currentQuestion.id];

    const handleAnswerChange = (answer: string) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    };

    const handleSubmit = () => {
        if (!userAnswer) return;
        setSubmittedAnswers(prev => ({ ...prev, [currentQuestion.id]: true }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsFinished(true);
        }
    };
    
    const calculateScore = () => {
        return quiz.questions.reduce((score, question) => {
            const answer = userAnswers[question.id];
            if (!answer) return score;
            let isCorrect = false;
            if (question.type === QuestionType.SHORT_ANSWER) {
                isCorrect = answer.trim().toLowerCase() === question.correctAnswer?.trim().toLowerCase();
            } else {
                const selectedOption = question.options?.find(o => o.id === answer);
                isCorrect = selectedOption?.isCorrect ?? false;
            }
            return score + (isCorrect ? 1 : 0);
        }, 0);
    };

    const getOptionStyle = (option: AnswerOption) => {
        if (!isSubmitted) return 'bg-white hover:bg-blue-50';
        if (option.isCorrect) return 'bg-green-100 border-green-400';
        if (userAnswer === option.id && !option.isCorrect) return 'bg-red-100 border-red-400';
        return 'bg-gray-100';
    };

    if (isFinished) {
        const score = calculateScore();
        return (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-lg text-center p-8">
                    <h2 className="text-3xl font-bold text-gray-800">اكتمل الاختبار!</h2>
                    <p className="text-gray-600 mt-2">لقد أكملت "{quiz.title}".</p>
                    <div className="my-8">
                        <p className="text-lg">نتيجتك النهائية:</p>
                        <p className="text-6xl font-extrabold text-blue-600">{score} / {quiz.questions.length}</p>
                    </div>
                    <button onClick={() => onClose(true)} className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                        إغلاق
                    </button>
                </div>
            </div>
        );
    }

    return (
         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-fade-in">
                <div className="flex justify-between items-center p-4 border-b">
                    <div>
                        <h3 className="text-xl font-bold">{quiz.title}</h3>
                        <p className="text-sm text-gray-500">السؤال {currentQuestionIndex + 1} من {quiz.questions.length}</p>
                    </div>
                    <button onClick={() => onClose(false)}><XIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" /></button>
                </div>
                <div className="p-6 overflow-y-auto flex-grow">
                    <h4 className="text-2xl font-semibold mb-6 text-gray-800">{currentQuestion.questionText}</h4>
                    <div className="space-y-4">
                        {currentQuestion.type === QuestionType.SHORT_ANSWER ? (
                            <div>
                                <input 
                                    type="text"
                                    value={userAnswer || ''}
                                    onChange={e => handleAnswerChange(e.target.value)}
                                    disabled={isSubmitted}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    placeholder="اكتب إجابتك هنا..."
                                />
                                {isSubmitted && (
                                    <div className={`mt-2 text-sm p-2 rounded-lg ${userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer?.trim().toLowerCase() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {userAnswer.trim().toLowerCase() === currentQuestion.correctAnswer?.trim().toLowerCase() ? 'إجابة صحيحة!' : `إجابة خاطئة. الصحيحة هي: ${currentQuestion.correctAnswer}`}
                                    </div>
                                )}
                            </div>
                        ) : (
                            currentQuestion.options?.map(option => (
                                <button
                                    key={option.id}
                                    onClick={() => handleAnswerChange(option.id)}
                                    disabled={isSubmitted}
                                    className={`w-full text-right p-4 rounded-lg border-2 transition-all ${userAnswer === option.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'} ${getOptionStyle(option)}`}
                                >
                                    {option.text}
                                </button>
                            ))
                        )}
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    {isSubmitted ? (
                        <button onClick={handleNext} className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex items-center">
                            {currentQuestionIndex < quiz.questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                            <ArrowRightIcon className="h-5 w-5 mr-2" />
                        </button>
                    ) : (
                        <button onClick={handleSubmit} disabled={!userAnswer} className="px-8 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 disabled:bg-gray-300">
                            تأكيد الإجابة
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};


export default StudentDashboard;