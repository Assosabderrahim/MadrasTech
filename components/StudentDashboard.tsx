

import React, { useState, useRef, useEffect } from 'react';
import {
  LogoutIcon,
  BookOpenIcon,
  RobotIcon,
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
} from './icons';
import { Subject, LearningStyle, ChatMessage, ContentStatus, Lesson, Exercise, Book, Activity, TodoItem, Quiz, QuestionType, AnswerOption, Comment, ManagedUser, LessonContentType } from '../types';
import { askMadi } from '../services/geminiService';

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
      ], content: { type: LessonContentType.VIDEO, url: 'https://www.youtube.com/embed/5k93_42c5pM' } },
      { id: 'm2', title: 'الدرس 2: المعادلات', description: 'حل المعادلات من الدرجة الأولى.', status: ContentStatus.IN_PROGRESS, comments: [], content: { type: LessonContentType.PDF, url: '#' } },
      { id: 'm3', title: 'الدرس 3: الهندسة', description: 'الأشكال الهندسية الأساسية.', status: ContentStatus.LOCKED, comments: [] },
    ],
    exercises: [
        { id: 'me1', title: 'تمرين 1: جمع وطرح', description: 'تمارين على جمع وطرح الأعداد الصحيحة.', status: ContentStatus.COMPLETED, comments: [] },
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
            questionText: 'إذا كانت س + 3 = 10، فما هي قيمة س؟',
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
        { id: 'a1', title: 'الدرس 1: النحو', description: 'أساسيات الإعراب.', status: ContentStatus.COMPLETED, comments: [], content: { type: LessonContentType.PDF, url: '#' } },
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
        { id: 'f1', title: 'Leçon 1: Les salutations', description: 'Apprendre les salutations de base en français.', status: ContentStatus.COMPLETED, comments: [], content: { type: LessonContentType.PRESENTATION, url: 'https://picsum.photos/seed/presentation/800/450' } },
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
        { id: 'ie1', title: 'تمرين 1: عدد أركان الإيمان', description: 'اختبار قصير حول أركان الإيمان.', status: ContentStatus.COMPLETED, comments: [] },
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
    color: 'bg-purple-500',
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
];

const booksData: Book[] = [
  { id: 'b1', title: 'كليلة ودمنة', author: 'عبد الله بن المقفع', category: 'قصص', coverImage: 'https://picsum.photos/seed/kalila/300/400' },
  { id: 'b2', title: 'ألف ليلة وليلة', author: 'مؤلفون', category: 'مغامرات', coverImage: 'https://picsum.photos/seed/leila/300/400' },
  { id: 'b3', title: 'رحلة إلى مركز الأرض', author: 'جول فيرن', category: 'علوم', coverImage: 'https://picsum.photos/seed/earth/300/400' },
  { id: 'b4', title: 'تاريخ المغرب', author: 'مؤرخون', category: 'تاريخ', coverImage: 'https://picsum.photos/seed/maghreb/300/400' },
  { id: 'b5', title: 'الأسد والفأر', author: 'إيسوب', category: 'قصص', coverImage: 'https://picsum.photos/seed/lion/300/400' },
  { id: 'b6', title: 'حول العالم في 80 يوما', author: 'جول فيرن', category: 'مغامرات', coverImage: 'https://picsum.photos/seed/world80/300/400' },
];

const activitiesData: Activity[] = [
  { id: 'ac1', title: 'أولمبياد الرياضيات', description: 'مسابقة وطنية لتشجيع المهارات في الرياضيات.', date: '2024-09-15', image: `https://picsum.photos/seed/math-olympiad/600/400` },
  { id: 'ac2', title: 'اليوم الوطني للبيئة', description: 'حملة تشجير وتنظيف في محيط المدرسة.', date: '2024-10-22', image: `https://picsum.photos/seed/env-day/600/400` },
  { id: 'ac3', title: 'المسابقة الثقافية', description: 'مسابقة بين الأقسام في المعلومات العامة.', date: '2024-11-05', image: `https://picsum.photos/seed/culture-comp/600/400` },
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


const renderStatusIcon = (status: ContentStatus) => {
    switch (status) {
        case ContentStatus.COMPLETED:
        return <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />;
        case ContentStatus.IN_PROGRESS:
        return <PlayIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />;
        case ContentStatus.LOCKED:
        return <LockClosedIcon className="h-6 w-6 text-gray-400 flex-shrink-0" />;
        default:
        return null;
    }
};

interface DashboardProps {
  onLogout: () => void;
  currentUser: ManagedUser;
  setUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
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

type ActiveView = 'subjects' | 'library' | 'activities' | 'todos';

const StudentDashboard: React.FC<DashboardProps> = ({ onLogout, currentUser, setUsers }) => {
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
  
  const [bookFilter, setBookFilter] = useState('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizForSummary, setQuizForSummary] = useState<Quiz | null>(null);
  const [isContentLoading, setIsContentLoading] = useState(true);
  
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

  const [isIconPickerOpen, setIsIconPickerOpen] = useState(false);
  const [subjectToEditIcon, setSubjectToEditIcon] = useState<string | null>(null);
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = currentUser.notifications?.filter(n => !n.read).length || 0;
  
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null);

  const getActivityDetails = (title: string) => {
    if (title.includes('رياضيات')) {
        return { category: 'مسابقة علمية', color: 'bg-blue-500', Icon: ChartPieIcon };
    }
    if (title.includes('بيئة')) {
        return { category: 'حملة توعوية', color: 'bg-green-500', Icon: SparklesIcon };
    }
    if (title.includes('ثقافية')) {
        return { category: 'حدث ثقافي', color: 'bg-amber-500', Icon: BookOpenIcon };
    }
    return { category: 'نشاط عام', color: 'bg-gray-500', Icon: SparklesIcon };
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
    setExpandedSubjectId(prevId => (prevId === subjectId ? null : subjectId));
  };

  const handleMarkAsComplete = (subjectId: string, itemId: string, itemType: 'lesson' | 'exercise') => {
    setSubjects(prevSubjects => {
        return prevSubjects.map(subject => {
            if (subject.id === subjectId) {
                const updatedSubject = { ...subject };
                const allContent = [...updatedSubject.lessons, ...updatedSubject.exercises];
                let completedItemIndex = -1;

                if (itemType === 'lesson') {
                    updatedSubject.lessons = updatedSubject.lessons.map(l => {
                        if (l.id === itemId) {
                            completedItemIndex = allContent.findIndex(item => item.id === itemId);
                            return { ...l, status: ContentStatus.COMPLETED };
                        }
                        return l;
                    });
                } else { // exercise
                    updatedSubject.exercises = updatedSubject.exercises.map(e => {
                        if (e.id === itemId) {
                            completedItemIndex = allContent.findIndex(item => item.id === itemId);
                            return { ...e, status: ContentStatus.COMPLETED };
                        }
                        return e;
                    });
                }

                if (completedItemIndex > -1 && completedItemIndex < allContent.length - 1) {
                    const nextItem = allContent[completedItemIndex + 1];
                    if (nextItem && nextItem.status === ContentStatus.LOCKED) {
                        const isNextItemLesson = updatedSubject.lessons.some(l => l.id === nextItem.id);
                        if (isNextItemLesson) {
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
      window.removeEventListener('touchend', handleDragMove);
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '' || isLoading) return;

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

  const filteredBooks = booksData
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
                  return updatedSubject;
              }
              return subject;
          })
      });

      setNewCommentText(prev => ({ ...prev, [itemId]: '' }));
  };

  const handleSelectIcon = (iconComponent: React.ReactElement) => {
    if (!subjectToEditIcon) return;
    setSubjects(prevSubjects =>
        prevSubjects.map(subject =>
            subject.id === subjectToEditIcon
                ? { ...subject, icon: iconComponent }
                : subject
        )
    );
    setIsIconPickerOpen(false);
    setSubjectToEditIcon(null);
  };

  const IconPickerModal: React.FC<{
    onClose: () => void;
    onSelectIcon: (icon: React.ReactElement) => void;
  }> = ({ onClose, onSelectIcon }) => {
    const availableIcons = [
        { component: <ChartPieIcon /> },
        { component: <BookOpenIcon /> },
        { component: <BeakerIcon /> },
        { component: <UsersIcon /> },
        { component: <CalendarIcon /> },
        { component: <DocumentTextIcon /> },
        { component: <CollectionIcon /> },
        { component: <SparklesIcon /> },
        { component: <GraduationCapIcon /> },
        { component: <PresentationChartBarIcon /> },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1002] animate-fade-in">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">اختر أيقونة جديدة</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500" /></button>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
                    {availableIcons.map((iconInfo, index) => (
                        <button
                            key={index}
                            onClick={() => onSelectIcon(iconInfo.component)}
                            className="p-4 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 text-gray-600 transition-colors"
                            aria-label={`Select ${iconInfo.component.type.name} icon`}
                        >
                            {React.cloneElement(iconInfo.component, { className: 'h-8 w-8' })}
                        </button>
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

  const renderMainContent = () => {
    if (isContentLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinnerIcon className="w-10 h-10 text-blue-500 animate-spin" />
            </div>
        );
    }
    switch (activeView) {
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
                    <div key={book.id} className="group cursor-pointer">
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
              {activitiesData.map(activity => {
                const { category, color, Icon } = getActivityDetails(activity.title);
                return (
                    <div key={activity.id} className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-2 flex flex-col">
                      <div className="relative">
                          <img src={activity.image} alt={activity.title} className="w-full h-48 object-cover" />
                          <div className={`absolute top-0 right-0 m-4 px-3 py-1 text-sm font-bold text-white rounded-full ${color}`}>
                              {category}
                          </div>
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                              <CalendarIcon className="h-4 w-4 ml-2" />
                              <span>{new Date(activity.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{activity.title}</h3>
                          <p className="text-gray-600 mb-4">{activity.description}</p>
                          <button className={`w-full mt-auto flex items-center justify-center px-5 py-3 ${color} text-white font-semibold rounded-lg hover:opacity-90 transition-opacity`}>
                            <Icon className="h-5 w-5 ml-2" />
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
        return (
          <div className="animate-fade-in">
             <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">المواد الدراسية</h1>
                    <p className="text-gray-500">هنا يمكنك متابعة دروسك وإنجاز تمارينك.</p>
                </div>
             </header>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => {
                    const isExpanded = expandedSubjectId === subject.id;
                    return (
                        <div key={subject.id} className="bg-white rounded-xl shadow-md transition-all duration-300">
                            <div onClick={() => handleSubjectClick(subject.id)} className={`p-6 cursor-pointer transition-shadow ${isExpanded ? '' : 'hover:shadow-lg'}`}>
                                <div className="flex items-center mb-4">
                                    <div className={`p-3 rounded-lg ${subject.color} ml-4 relative group`}>
                                        {React.cloneElement(subject.icon, { className: 'h-8 w-8 text-white' })}
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSubjectToEditIcon(subject.id);
                                                setIsIconPickerOpen(true);
                                            }}
                                            className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer"
                                            aria-label="تغيير الأيقونة"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{subject.name}</h2>
                                        <p className="text-sm text-gray-500">التقدم: {subject.progress}%</p>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className={`${subject.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${subject.progress}%` }}></div>
                                </div>
                            </div>
                            
                            <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[1000px]' : 'max-h-0'}`}>
                                <div className="p-6 pt-4 border-t border-gray-100">
                                    <div className="grid grid-cols-1 gap-8">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-700 mb-4">الدروس</h3>
                                            {subject.lessons.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {subject.lessons.map((lesson: Lesson) => (
                                                        <li key={lesson.id} className="bg-gray-50 rounded-lg">
                                                            <div 
                                                                onClick={() => lesson.content && lesson.status !== ContentStatus.LOCKED && setViewingLesson(lesson)}
                                                                className={`flex items-start justify-between p-3 ${lesson.content && lesson.status !== ContentStatus.LOCKED ? 'cursor-pointer hover:bg-blue-50' : ''}`}
                                                            >
                                                                <div className="flex items-start">
                                                                    <DocumentTextIcon className="h-7 w-7 text-gray-400 ml-3 mt-1 flex-shrink-0" />
                                                                    <div>
                                                                        <p className="font-semibold text-gray-800 flex items-center">
                                                                            {lesson.title}
                                                                            {lesson.content && lesson.status !== ContentStatus.LOCKED && <PlayIcon className="h-5 w-5 text-blue-500 mr-2" />}
                                                                        </p>
                                                                        <p className="text-sm text-gray-500">{lesson.description}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    {lesson.status === ContentStatus.IN_PROGRESS && (
                                                                        <button
                                                                        onClick={(e) => { e.stopPropagation(); handleMarkAsComplete(subject.id, lesson.id, 'lesson')}}
                                                                        className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                                                                        >
                                                                        إنهاء الدرس
                                                                        </button>
                                                                    )}
                                                                    {lesson.status !== ContentStatus.LOCKED && (
                                                                        <button onClick={(e) => { e.stopPropagation(); openReminderModal(lesson)}} className="text-gray-400 hover:text-blue-500">
                                                                            <BellIcon className={`h-5 w-5 ${lesson.reminder ? 'text-blue-500 fill-current' : ''}`} />
                                                                        </button>
                                                                    )}
                                                                    {renderStatusIcon(lesson.status)}
                                                                </div>
                                                            </div>
                                                            {lesson.status !== ContentStatus.LOCKED && (
                                                                <div className="px-3 pb-3">
                                                                    <div className="border-t mt-2 pt-2 space-y-2">
                                                                        {lesson.comments.length > 0 ? lesson.comments.map(comment => (
                                                                            <div key={comment.id} className="flex items-start space-x-3 space-x-reverse py-2">
                                                                                <div className="flex-shrink-0">
                                                                                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                                                                                        <span className="text-sm font-bold text-blue-800">{comment.authorName.charAt(0).toUpperCase()}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <div className="bg-white p-3 rounded-lg rounded-tr-none border">
                                                                                        <p className="font-semibold text-blue-800 text-sm">{comment.authorName}</p>
                                                                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.text}</p>
                                                                                    </div>
                                                                                    <p className="text-xs text-gray-400 mt-1">{timeSince(comment.date)}</p>
                                                                                </div>
                                                                            </div>
                                                                        )) : <p className="text-xs text-gray-500 text-center py-2">لا توجد تعليقات. كن أول من يضيف تعليقاً!</p>}
                                                                    </div>
                                                                    <form onSubmit={(e) => handleAddComment(e, subject.id, lesson.id, 'lesson')} className="flex items-start gap-2 mt-3">
                                                                        <textarea
                                                                            value={newCommentText[lesson.id] || ''}
                                                                            onChange={(e) => setNewCommentText(prev => ({...prev, [lesson.id]: e.target.value}))}
                                                                            placeholder="أضف تعليقاً..."
                                                                            className="flex-grow p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none transition resize-none"
                                                                            rows={1}
                                                                            onInput={(e) => {
                                                                                const target = e.target as HTMLTextAreaElement;
                                                                                target.style.height = 'auto';
                                                                                target.style.height = `${target.scrollHeight}px`;
                                                                            }}
                                                                        />
                                                                        <button type="submit" className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300" disabled={!newCommentText[lesson.id] || newCommentText[lesson.id].trim() === ''}>
                                                                            <SendIcon className="h-5 w-5" />
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-gray-500">لا توجد دروس متاحة حالياً.</p>}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-700 mb-4">التمارين</h3>
                                            {subject.exercises.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {subject.exercises.map((exercise: Exercise) => (
                                                        <li key={exercise.id} className="bg-gray-50 rounded-lg">
                                                            <div className="flex items-start justify-between p-3">
                                                                <div className="flex items-start">
                                                                    <ClipboardListIcon className="h-7 w-7 text-gray-400 ml-3 mt-1 flex-shrink-0" />
                                                                    <div>
                                                                        <p className="font-semibold text-gray-800">{exercise.title}</p>
                                                                        <p className="text-sm text-gray-500">{exercise.description}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    {exercise.status === ContentStatus.IN_PROGRESS && (
                                                                        <button
                                                                        onClick={() => handleMarkAsComplete(subject.id, exercise.id, 'exercise')}
                                                                        className="px-3 py-1 text-xs font-semibold text-green-700 bg-green-100 rounded-full hover:bg-green-200 transition-colors"
                                                                        >
                                                                        إنهاء التمرين
                                                                        </button>
                                                                    )}
                                                                    {exercise.status !== ContentStatus.LOCKED && (
                                                                        <button onClick={() => openReminderModal(exercise)} className="text-gray-400 hover:text-blue-500">
                                                                            <BellIcon className={`h-5 w-5 ${exercise.reminder ? 'text-blue-500 fill-current' : ''}`} />
                                                                        </button>
                                                                    )}
                                                                    {renderStatusIcon(exercise.status)}
                                                                </div>
                                                            </div>
                                                            {exercise.status !== ContentStatus.LOCKED && (
                                                                <div className="px-3 pb-3">
                                                                    <div className="border-t mt-2 pt-2 space-y-2">
                                                                        {exercise.comments.length > 0 ? exercise.comments.map(comment => (
                                                                            <div key={comment.id} className="flex items-start space-x-3 space-x-reverse py-2">
                                                                                <div className="flex-shrink-0">
                                                                                    <div className="h-8 w-8 rounded-full bg-blue-200 flex items-center justify-center">
                                                                                        <span className="text-sm font-bold text-blue-800">{comment.authorName.charAt(0).toUpperCase()}</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="flex-1">
                                                                                    <div className="bg-white p-3 rounded-lg rounded-tr-none border">
                                                                                        <p className="font-semibold text-blue-800 text-sm">{comment.authorName}</p>
                                                                                        <p className="text-gray-700 text-sm whitespace-pre-wrap">{comment.text}</p>
                                                                                    </div>
                                                                                    <p className="text-xs text-gray-400 mt-1">{timeSince(comment.date)}</p>
                                                                                </div>
                                                                            </div>
                                                                        )) : <p className="text-xs text-gray-500 text-center py-2">لا توجد تعليقات. كن أول من يضيف تعليقاً!</p>}
                                                                    </div>
                                                                    <form onSubmit={(e) => handleAddComment(e, subject.id, exercise.id, 'exercise')} className="flex items-start gap-2 mt-3">
                                                                        <textarea
                                                                            value={newCommentText[exercise.id] || ''}
                                                                            onChange={(e) => setNewCommentText(prev => ({...prev, [exercise.id]: e.target.value}))}
                                                                            placeholder="أضف تعليقاً..."
                                                                            className="flex-grow p-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:outline-none transition resize-none"
                                                                            rows={1}
                                                                             onInput={(e) => {
                                                                                const target = e.target as HTMLTextAreaElement;
                                                                                target.style.height = 'auto';
                                                                                target.style.height = `${target.scrollHeight}px`;
                                                                            }}
                                                                        />
                                                                        <button type="submit" className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:bg-blue-300" disabled={!newCommentText[exercise.id] || newCommentText[exercise.id].trim() === ''}>
                                                                            <SendIcon className="h-5 w-5" />
                                                                        </button>
                                                                    </form>
                                                                </div>
                                                            )}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-gray-500">لا توجد تمارين متاحة حالياً.</p>}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-700 mb-4">الاختبارات</h3>
                                            {subject.quizzes.length > 0 ? (
                                                <ul className="space-y-3">
                                                    {subject.quizzes.map((quiz: Quiz) => (
                                                        <li key={quiz.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                                                             <div className="flex items-start">
                                                                <QuestionMarkCircleIcon className="h-7 w-7 text-gray-400 ml-3 mt-1 flex-shrink-0" />
                                                                <div>
                                                                    <p className="font-semibold text-gray-800">{quiz.title}</p>
                                                                    <p className="text-sm text-gray-500">{quiz.questions.length} أسئلة</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <button
                                                                    onClick={() => setQuizForSummary(quiz)}
                                                                    className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                                                                >
                                                                    بدء الاختبار
                                                                </button>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-gray-500">لا توجد اختبارات متاحة حالياً.</p>}
                                        </div>
                                    </div>
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
      <div className="flex h-screen bg-gray-100" dir="rtl">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
                <UserIcon className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2 ml-3" />
                <div>
                  <h2 className="text-lg font-bold text-blue-700">{currentUser.name}</h2>
                  <p className="text-sm text-gray-500">مرحباً بعودتك!</p>
                </div>
            </div>
            <div className="relative">
                <button onClick={handleToggleNotifications} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
                    <BellIcon className="h-6 w-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            {unreadCount}
                        </span>
                    )}
                </button>
                {notificationsOpen && (
                    <div className="absolute top-full mt-2 left-0 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border z-20 animate-fade-in">
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
            <NavLink view="todos" Icon={ClipboardListIcon} text="قائمة المهام" />
            <NavLink view="library" Icon={CollectionIcon} text="المكتبة الرقمية" />
            <NavLink view="activities" Icon={SparklesIcon} text="أنشطة المؤسسة" />
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
          <QuizPlayerModal quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />
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
                <RobotIcon className="w-9 h-9 text-white" />
            </div>
        </div>


      {/* Madi Chat Window */}
      {isChatOpen && (
         <div className="fixed bottom-24 right-5 w-96 max-w-[90vw] h-[60vh] bg-white rounded-xl shadow-2xl flex flex-col z-50 animate-fade-in" dir="rtl">
            <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center">
                    <RobotIcon className="h-8 w-8 text-blue-600 ml-3"/>
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
      {isIconPickerOpen && (
          <IconPickerModal
              onClose={() => setIsIconPickerOpen(false)}
              onSelectIcon={handleSelectIcon}
          />
      )}
      {viewingLesson && (
          <LessonContentModal lesson={viewingLesson} onClose={() => setViewingLesson(null)} />
      )}
    </>
  );
};

const LessonContentModal: React.FC<{ lesson: Lesson; onClose: () => void; }> = ({ lesson, onClose }) => {
    if (!lesson.content) return null;

    const renderContent = () => {
        switch (lesson.content?.type) {
            case LessonContentType.VIDEO:
                return (
                    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
                        <iframe
                            src={lesson.content.url}
                            title={lesson.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                        ></iframe>
                    </div>
                );
            case LessonContentType.PDF:
                return (
                    <div className="w-full h-full bg-gray-200 rounded-lg flex flex-col items-center justify-center p-8 text-center">
                        <DocumentTextIcon className="h-24 w-24 text-gray-400 mb-4" />
                        <h3 className="text-xl font-bold text-gray-700">عرض ملف PDF</h3>
                        <p className="text-gray-500 mt-2">
                            في تطبيق حقيقي، سيتم عرض محتوى ملف PDF هنا مباشرة.
                        </p>
                        <a href={lesson.content.url} target="_blank" rel="noopener noreferrer" className="mt-6 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
                            فتح PDF في نافذة جديدة
                        </a>
                    </div>
                );
            case LessonContentType.PRESENTATION:
                 return (
                    <div className="w-full h-full bg-black rounded-lg overflow-hidden flex items-center justify-center">
                        <img src={lesson.content.url} alt={lesson.title} className="max-w-full max-h-full object-contain" />
                    </div>
                );
            default:
                return <p>نوع المحتوى غير مدعوم.</p>;
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1002] animate-fade-in p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold text-gray-800">{lesson.title}</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800" /></button>
                </div>
                <div className="p-4 flex-grow h-0">
                    {renderContent()}
                </div>
            </div>
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

const QuizPlayerModal: React.FC<{ quiz: Quiz; onClose: () => void }> = ({ quiz, onClose }) => {
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
                    <button onClick={onClose} className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors">
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
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-400 hover:text-gray-600" /></button>
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