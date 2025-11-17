// FIX: Removed file content delimiters (e.g., --- START OF FILE ---) that were causing compilation errors.
import React, { useState, useEffect } from 'react';
import { ManagedUser, SchoolClass, UserRole, AttendanceStatus, ContentStatus, MaterialType, QuestionType, AuditLog, Announcement, HomeworkStatus } from './types';
import LandingPage from './components/LandingPage';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import AdminDashboard from './components/AdminDashboard';
import ParentDashboard from './components/ParentDashboard';
import { LoadingSpinnerIcon } from './components/icons';

// --- MOCK DATA CENTRALIZATION ---
// This data is now managed in the root App component to simulate a shared database.
// This allows different user dashboards to interact with and update the same data.

const getRelativeDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toISOString().split('T')[0];
};


const mockUsersData: ManagedUser[] = [
    { 
        id: '1', name: 'أحمد العلوي', email: 'ahmed.alaoui@email.com', role: UserRole.STUDENT, createdAt: '2023-09-01', 
        notifications: [
            { id: 'n1-s', message: 'تمت إضافة واجب جديد في مادة الرياضيات.', date: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), read: false },
            { id: 'n2-s', message: 'تم تصحيح اختبار اللغة العربية. درجتك: 18/20', date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), read: true },
        ] 
    },
    { id: '2', name: 'فاطمة الزهراء', email: 'fatima.zahra@email.com', role: UserRole.STUDENT, createdAt: '2023-09-01', notifications: [] },
    { 
        id: '3', name: 'الأستاذ خالد', email: 'khaled.prof@email.com', role: UserRole.TEACHER, createdAt: '2023-08-20',
        notifications: [
            { id: 'n1-t', message: 'قام أحمد العلوي بتسليم واجبه في الرياضيات.', date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), read: false },
            { id: 'n2-t', message: 'رسالة جديدة من ولي أمر التلميذة فاطمة الزهراء.', date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), read: false },
            { id: 'n3-t', message: 'تذكير: اجتماع قسم الأولى إعدادي غداً على الساعة 10 صباحاً.', date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), read: true },
        ],
        timetable: [
            { day: 'الاثنين', timeSlot: '08:00', subject: 'الرياضيات', className: 'الأولى إعدادي - 1' },
            { day: 'الاثنين', timeSlot: '14:00', subject: 'الفيزياء', className: 'الثانية إعدادي - 3' },
            { day: 'الاثنين', timeSlot: '15:00', subject: 'الفيزياء', className: 'الثانية إعدادي - 3' },
            { day: 'الثلاثاء', timeSlot: '10:00', subject: 'الرياضيات', className: 'الأولى إعدادي - 1' },
            { day: 'الثلاثاء', timeSlot: '11:00', subject: 'الرياضيات', className: 'الأولى إعدادي - 1' },
            { day: 'الأربعاء', timeSlot: '08:00', subject: 'الفيزياء', className: 'الأولى إعدادي - 1' },
            { day: 'الأربعاء', timeSlot: '09:00', subject: 'الفيزياء', className: 'الأولى إعدادي - 1' },
            { day: 'الأربعاء', timeSlot: '10:00', subject: 'الرياضيات', className: 'الثانية إعدادي - 3' },
            { day: 'الأربعاء', timeSlot: '11:00', subject: 'الرياضيات', className: 'الثانية إعدادي - 3' },
            { day: 'الخميس', timeSlot: '08:00', subject: 'الرياضيات', className: 'الأولى إعدادي - 1' },
            { day: 'الخميس', timeSlot: '09:00', subject: 'الرياضيات', className: 'الأولى إعدادي - 1' },
        ],
    },
    { 
        id: '4', name: 'السيدة أمينة', email: 'amina.parent@email.com', role: UserRole.PARENT, createdAt: '2023-09-05', childIds: ['s1-1'],
        notifications: [
            { id: 'n1-p', message: `تم تسجيل غياب ابنكم أحمد العلوي اليوم.`, date: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), read: false },
            { id: 'n2-p', message: 'تم نشر نتائج اختبار الرياضيات لابنكم أحمد.', date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), read: true },
        ]
    },
    { 
        id: '5', name: 'السيد المدير', email: 'admin@email.com', role: UserRole.ADMIN, createdAt: '2023-08-15',
        notifications: [
            { id: 'n1-a', message: 'تم تسجيل 5 مستخدمين جدد هذا الأسبوع.', date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), read: false },
            { id: 'n2-a', message: 'تنبيه: أداء الخادم 95%.', date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), read: true },
        ]
    },
];

const mockClassesData: SchoolClass[] = [
  {
    id: 'class-1',
    name: 'الأولى إعدادي - 1',
    students: [
      {
        id: 's1-1', name: 'أحمد العلوي', parentId: '4',
        grades: [ { subject: 'الرياضيات', grade: 17 }, { subject: 'العربية', grade: 18 }, { subject: 'العلوم', grade: 16 }, { subject: 'الفرنسية', grade: 18 } ],
        attendance: { present: 180, absent: 5 },
        attendanceRecords: [
            { date: '2024-05-20', status: AttendanceStatus.PRESENT },
            { date: '2024-05-21', status: AttendanceStatus.ABSENT },
        ],
        activities: ['نادي الشطرنج', 'المسابقة الثقافية'],
        notes: [
            { id: 'n1', text: 'تلميذ مجتهد ومشارك.', date: '2024-04-15T09:00:00.000Z' },
            { id: 'n2', text: 'يحتاج إلى تحسين خطه.', date: '2024-03-10T11:00:00.000Z' }
        ],
        observations: [
            { id: 'obs1', text: 'أظهر تحسناً في المشاركة اليوم.', date: '2024-05-22T10:00:00.000Z' },
            { id: 'obs2', text: 'بدا مشتتاً خلال حصة الرياضيات.', date: '2024-05-20T14:30:00.000Z' },
        ],
        progress: [ { subjectName: 'الرياضيات', progress: 85 }, { subjectName: 'العربية', progress: 90 }, { subjectName: 'العلوم', progress: 80 }, { subjectName: 'الفرنسية', progress: 90 } ],
        customFields: [
            { id: 'cf1', label: 'أسلوب التعلم', value: 'بصري' },
            { id: 'cf2', label: 'ملاحظات طبية', value: 'حساسية من الفول السوداني' },
        ],
        xp: 125,
        levelName: 'مستكشف المعرفة',
        earnedBadgeIds: ['perseverance-1'],
      },
      {
        id: 's1-2', name: 'فاطمة الزهراء',
        grades: [ { subject: 'الرياضيات', grade: 19 }, { subject: 'العربية', grade: 18 }, { subject: 'العلوم', grade: 18 }, { subject: 'الفرنسية', grade: 19 } ],
        attendance: { present: 184, absent: 1 },
        attendanceRecords: [
             { date: '2024-05-20', status: AttendanceStatus.PRESENT },
             { date: '2024-05-21', status: AttendanceStatus.PRESENT },
        ],
        activities: ['أولمبياد الرياضيات', 'نادي البيئة'],
        notes: [
            { id: 'n3', text: 'تلميذة ممتازة وذات أخلاق عالية.', date: '2024-05-02T10:00:00.000Z' }
        ],
        observations: [],
        progress: [ { subjectName: 'الرياضيات', progress: 95 }, { subjectName: 'العربية', progress: 90 }, { subjectName: 'العلوم', progress: 90 }, { subjectName: 'الفرنسية', progress: 95 } ],
        customFields: [],
        xp: 0,
        levelName: 'مستكشف المعرفة',
        earnedBadgeIds: [],
      },
    ],
    materials: [
      { id: 'm1-1', name: 'ملخص درس الجبر', type: MaterialType.PDF, url: '#' },
      { id: 'm1-2', name: 'عرض تقديمي للهندسة', type: MaterialType.PRESENTATION, url: '#' },
    ],
    quizzes: [
      {
        id: 'q1-1',
        title: 'اختبار الفصل الأول في الرياضيات',
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
            questionText: 'ما هي عاصمة المغرب؟',
            type: QuestionType.MULTIPLE_CHOICE,
            options: [
              { id: 'qo1-2-1', text: 'الدار البيضاء', isCorrect: false },
              { id: 'qo1-2-2', text: 'فاس', isCorrect: false },
              { id: 'qo1-2-3', text: 'الرباط', isCorrect: true },
            ],
          },
           {
            id: 'qq1-3',
            questionText: 'الأرض مسطحة.',
            type: QuestionType.TRUE_FALSE,
            options: [
              { id: 'tf-1', text: 'صحيح', isCorrect: false },
              { id: 'tf-2', text: 'خطأ', isCorrect: true },
            ],
          },
          {
            id: 'qq1-4',
            questionText: 'اذكر اسم أكبر كوكب في المجموعة الشمسية.',
            type: QuestionType.SHORT_ANSWER,
            correctAnswer: 'المشتري',
          },
        ],
      },
    ],
    lessons: [
      { id: 'l1-1', title: 'مقدمة في الجبر', description: 'أساسيات الجبر والمتغيرات.', status: ContentStatus.COMPLETED, comments: [] },
      { id: 'l1-2', title: 'الأشكال الهندسية', description: 'التعرف على المثلثات والمربعات.', status: ContentStatus.IN_PROGRESS, comments: [] },
    ],
    exercises: [
      { id: 'e1-1', title: 'تمارين على المعادلات', description: 'حل 10 معادلات بسيطة.', status: ContentStatus.COMPLETED, comments: [], score: 88 },
      { id: 'e1-2', title: 'حساب مساحة الأشكال', description: 'تمارين على حساب المساحات.', status: ContentStatus.LOCKED, comments: [] },
    ],
    timetable: [
        { day: 'الاثنين', timeSlot: '08:00', subject: 'الرياضيات', teacherName: 'الأستاذ خالد' },
        { day: 'الاثنين', timeSlot: '09:00', subject: 'اللغة العربية', teacherName: 'الأستاذة مريم' },
        { day: 'الاثنين', timeSlot: '10:00', subject: 'اللغة العربية', teacherName: 'الأستاذة مريم' },
        { day: 'الاثنين', timeSlot: '14:00', subject: 'اللغة الفرنسية', teacherName: 'الأستاذة فاطمة' },
        { day: 'الاثنين', timeSlot: '15:00', subject: 'اللغة الفرنسية', teacherName: 'الأستاذة فاطمة' },

        { day: 'الثلاثاء', timeSlot: '08:00', subject: 'الاجتماعيات', teacherName: 'الأستاذ يوسف' },
        { day: 'الثلاثاء', timeSlot: '09:00', subject: 'الاجتماعيات', teacherName: 'الأستاذ يوسف' },
        { day: 'الثلاثاء', timeSlot: '10:00', subject: 'الرياضيات', teacherName: 'الأستاذ خالد' },
        { day: 'الثلاثاء', timeSlot: '11:00', subject: 'الرياضيات', teacherName: 'الأستاذ خالد' },
        { day: 'الثلاثاء', timeSlot: '14:00', subject: 'التربية الاسلامية', teacherName: 'الأستاذ علي' },
        { day: 'الثلاثاء', timeSlot: '15:00', subject: 'التربية الاسلامية', teacherName: 'الأستاذ علي' },

        { day: 'الأربعاء', timeSlot: '08:00', subject: 'الفيزياء', teacherName: 'الأستاذ خالد' },
        { day: 'الأربعاء', timeSlot: '09:00', subject: 'الفيزياء', teacherName: 'الأستاذ خالد' },
        { day: 'الأربعاء', timeSlot: '10:00', subject: 'اللغة العربية', teacherName: 'الأستاذة مريم' },
        { day: 'الأربعاء', timeSlot: '11:00', subject: 'اللغة العربية', teacherName: 'الأستاذة مريم' },

        { day: 'الخميس', timeSlot: '08:00', subject: 'الرياضيات', teacherName: 'الأستاذ خالد' },
        { day: 'الخميس', timeSlot: '09:00', subject: 'الرياضيات', teacherName: 'الأستاذ خالد' },
        { day: 'الخميس', timeSlot: '14:00', subject: 'علوم الحياة والأرض', teacherName: 'الأستاذة نادية' },
        { day: 'الخميس', timeSlot: '15:00', subject: 'علوم الحياة والأرض', teacherName: 'الأستاذة نادية' },

        { day: 'الجمعة', timeSlot: '08:00', subject: 'الاجتماعيات', teacherName: 'الأستاذ يوسف' },
        { day: 'الجمعة', timeSlot: '09:00', subject: 'الرياضيات', teacherName: 'الأستاذ خالد' },
        { day: 'الجمعة', timeSlot: '10:00', subject: 'اللغة الفرنسية', teacherName: 'الأستاذة فاطمة' },
        { day: 'الجمعة', timeSlot: '11:00', subject: 'اللغة الفرنسية', teacherName: 'الأستاذة فاطمة' },
    ],
    homeworks: [
      {
        id: 'hw-math-1',
        title: 'واجب الرياضيات: حل مسائل الجبر',
        description: 'الرجاء حل جميع المسائل في الفصل 3 من الكتاب وتقديمها قبل الموعد النهائي.',
        dueDate: getRelativeDate(3),
        attachments: [
          { id: 'att-1', name: 'ورقة العمل.pdf', type: 'file', url: '#' },
        ],
        classId: 'class-1',
        subjectId: 'math',
        createdAt: getRelativeDate(-2),
        status: HomeworkStatus.PENDING,
      },
      {
        id: 'hw-arabic-1',
        title: 'واجب اللغة العربية: تحليل قصيدة',
        description: 'اقرأ القصيدة المرفقة واكتب تحليلاً لا يقل عن 200 كلمة.',
        dueDate: getRelativeDate(-2), // Overdue
        attachments: [
          { id: 'att-2', name: 'قصيدة "الكوليرا" لنازك الملائكة', type: 'link', url: '#' },
        ],
        classId: 'class-1',
        subjectId: 'arabic',
        createdAt: getRelativeDate(-4),
        status: HomeworkStatus.SUBMITTED,
      },
      {
        id: 'hw-science-1',
        title: 'واجب العلوم: تقرير عن الخلية',
        description: 'إعداد تقرير مفصل عن مكونات الخلية الحيوانية ووظائفها.',
        dueDate: getRelativeDate(-10),
        attachments: [],
        classId: 'class-1',
        subjectId: 'science',
        createdAt: getRelativeDate(-15),
        status: HomeworkStatus.GRADED,
        grade: 18,
      }
    ],
  },
  {
    id: 'class-2',
    name: 'الثانية إعدادي - 3',
    students: [
      {
        id: 's2-1', name: 'يوسف بوعزة',
        grades: [ { subject: 'الرياضيات', grade: 14 }, { subject: 'العربية', grade: 14 }, { subject: 'العلوم', grade: 15 }, { subject: 'الفرنسية', grade: 13 } ],
        attendance: { present: 175, absent: 10 },
        attendanceRecords: [],
        activities: ['فريق كرة القدم'],
        notes: [
            { id: 'n4', text: 'يحتاج إلى المزيد من التركيز والمثابرة.', date: '2024-04-20T15:00:00.000Z' }
        ],
        observations: [],
        progress: [ { subjectName: 'الرياضيات', progress: 70 }, { subjectName: 'العربية', progress: 70 }, { subjectName: 'العلوم', progress: 75 }, { subjectName: 'الفرنسية', progress: 65 } ],
        customFields: [],
        xp: 50,
        levelName: 'مستكشف المعرفة',
        earnedBadgeIds: [],
      },
    ],
    materials: [],
    quizzes: [],
    lessons: [],
    exercises: [],
    timetable: [
        { day: 'الاثنين', timeSlot: '14:00', subject: 'الفيزياء', teacherName: 'الأستاذ خالد' },
        { day: 'الاثنين', timeSlot: '15:00', subject: 'الفيزياء', teacherName: 'الأستاذ خالد' },
        { day: 'الأربعاء', timeSlot: '08:00', subject: 'الرياضيات', teacherName: 'الأستاذ خالد' },
        { day: 'الأربعاء', timeSlot: '09:00', subject: 'الرياضيات', teacherName: 'الأستاذ خالد' },
    ],
    homeworks: [],
  },
];

const mockAnnouncementsData: Announcement[] = [
    {
        id: 'anno-1',
        title: 'مسابقة القراءة السنوية',
        content: 'تنطلق المسابقة الثقافية للقراءة يوم الاثنين القادم. ندعو جميع التلاميذ المهتمين بالتسجيل لدى إدارة النادي الثقافي. سيحصل الفائزون على جوائز قيمة. لا تفوتوا الفرصة لإبراز مواهبكم الأدبية!',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'anno-2',
        title: 'ورشة التكنولوجيا والابتكار',
        content: 'ندعو جميع التلاميذ للمشاركة في ورشة الروبوتات التي ستقام يوم الأربعاء في قاعة الأنشطة. الأماكن محدودة، فسارعوا بالتسجيل. ستتعلمون أساسيات البرمجة وبناء الروبوتات.',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'anno-3',
        title: 'اجتماع أولياء الأمور',
        content: 'نعلمكم بأن اجتماع أولياء الأمور سيُعقد يوم السبت المقبل لمناقشة تقدم التلاميذ والأنشطة المستقبلية. حضوركم ضروري ومهم.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
];


const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);
  const [users, setUsers] = useState<ManagedUser[]>(mockUsersData);
  const [classes, setClasses] = useState<SchoolClass[]>(mockClassesData);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncementsData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetching
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(UserRole.NONE);
  };

  const renderDashboard = () => {
    switch (userRole) {
      case UserRole.STUDENT:
        const studentUser = users.find(u => u.id === '1'); // Mock: log in as Ahmed Alaoui
        if (!studentUser) return <LandingPage onSelectRole={handleRoleSelect} />;
        return <StudentDashboard onLogout={handleLogout} currentUser={studentUser} setUsers={setUsers} classes={classes} announcements={announcements} />;
      case UserRole.TEACHER:
        const teacherUser = users.find(u => u.role === UserRole.TEACHER);
        if (!teacherUser) return <LandingPage onSelectRole={handleRoleSelect} />;
        return <TeacherDashboard 
                  onLogout={handleLogout} 
                  initialClasses={classes}
                  allUsers={users}
                  setAllUsers={setUsers}
                  setClasses={setClasses}
                  currentUser={teacherUser}
                  announcements={announcements}
                />;
      case UserRole.ADMIN:
        const adminUser = users.find(u => u.role === UserRole.ADMIN);
        if (!adminUser) return <LandingPage onSelectRole={handleRoleSelect} />;
        return <AdminDashboard 
                    onLogout={handleLogout} 
                    initialUsers={users} 
                    setUsers={setUsers} 
                    currentUser={adminUser} 
                    initialClasses={classes} 
                    setClasses={setClasses}
                    auditLogs={auditLogs}
                    setAuditLogs={setAuditLogs}
                    announcements={announcements}
                    setAnnouncements={setAnnouncements}
                />;
      case UserRole.PARENT:
        const parentUser = users.find(u => u.role === UserRole.PARENT);
        if (!parentUser) return <LandingPage onSelectRole={handleRoleSelect} />; // Fallback
        return <ParentDashboard onLogout={handleLogout} parentUser={parentUser} allUsers={users} setUsers={setUsers} classes={classes} announcements={announcements} />;
      default:
        return <LandingPage onSelectRole={handleRoleSelect} />;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <LoadingSpinnerIcon className="w-16 h-16 text-blue-500 animate-spin" />
        <p className="mt-4 text-lg text-gray-600">...جاري التحميل</p>
      </div>
    );
  }

  return (
    <div className="App">
      {renderDashboard()}
    </div>
  );
};

export default App;