// FIX: Removed file content delimiters (e.g., --- START OF FILE ---) that were causing compilation errors.
import React, { useState, useEffect, useMemo } from 'react';
import {
  LogoutIcon,
  PresentationChartBarIcon,
  UserIcon,
  XIcon,
  PencilIcon,
  PlusCircleIcon,
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  CloudArrowUpIcon,
  DocumentTextIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
  CheckBadgeIcon,
  EnvelopeIcon,
  SearchIcon,
  LoadingSpinnerIcon,
  BellIcon
} from './icons';
import { 
    SchoolClass, 
    Student, 
    ManagedUser, 
    Grade, 
    Observation, 
    CourseMaterial, 
    Quiz, 
    MaterialType, 
    StudentNote,
    AttendanceStatus,
    Lesson,
    Exercise,
    QuizQuestion,
    AnswerOption,
    Notification,
    QuestionType,
    CustomField,
    ContentStatus
} from '../types';

type ClassView = 'students' | 'content' | 'grades' | 'attendance' | 'progress';

interface TeacherDashboardProps {
  onLogout: () => void;
  initialClasses: SchoolClass[];
  allUsers: ManagedUser[];
  setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
  setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
  currentUser: ManagedUser;
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

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout, initialClasses, allUsers, setAllUsers, setClasses, currentUser }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(initialClasses[0]?.id || null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const selectedClass = initialClasses.find(c => c.id === selectedClassId);
  const unreadCount = currentUser.notifications?.filter(n => !n.read).length || 0;

  const handleToggleNotifications = () => {
    setNotificationsOpen(prev => !prev);
    if (!notificationsOpen && unreadCount > 0) {
        setAllUsers(prevUsers => 
            prevUsers.map(u => 
                u.id === currentUser.id 
                    ? { ...u, notifications: u.notifications?.map(n => ({...n, read: true})) || [] }
                    : u
            )
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100" dir="rtl">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center">
            <PresentationChartBarIcon className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2 ml-3" />
            <div>
              <h2 className="text-lg font-bold text-teal-700">{currentUser.name}</h2>
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
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">الأقسام</h3>
          {initialClasses.map(c => (
            <a
              key={c.id}
              href="#"
              onClick={(e) => { e.preventDefault(); setSelectedClassId(c.id); }}
              className={`flex items-center p-3 rounded-lg transition-colors ${
                selectedClassId === c.id
                  ? 'bg-teal-100 text-teal-700 font-bold'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UsersIcon className={`h-5 w-5 ml-3 ${selectedClassId === c.id ? 'text-teal-600' : ''}`} />
              <span>{c.name}</span>
            </a>
          ))}
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
          {selectedClass ? (
               <ClassDashboard 
                key={selectedClass.id} 
                selectedClass={selectedClass} 
                allUsers={allUsers}
                setAllUsers={setAllUsers}
                setClasses={setClasses}
                initialClasses={initialClasses}
               />
          ) : (
              <div className="flex items-center justify-center h-full">
                  <p className="text-xl text-gray-500">الرجاء اختيار قسم لعرض بياناته.</p>
              </div>
          )}
      </main>
    </div>
  );
};


const ClassDashboard: React.FC<{
    selectedClass: SchoolClass, 
    allUsers: ManagedUser[], 
    setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>,
    initialClasses: SchoolClass[],
    setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>
}> = ({ selectedClass, allUsers, setAllUsers, initialClasses, setClasses }) => {
    const [activeView, setActiveView] = useState<ClassView>('students');

    const renderView = () => {
        switch(activeView) {
            case 'attendance':
                return <AttendanceView selectedClass={selectedClass} setClasses={setClasses} initialClasses={initialClasses} allUsers={allUsers} setAllUsers={setAllUsers}/>
            case 'content':
                return <ContentManagementView selectedClass={selectedClass} setClasses={setClasses} initialClasses={initialClasses} />
            case 'grades':
                return <GradeSummaryView selectedClass={selectedClass} />
            case 'progress':
                return <ProgressSummaryView selectedClass={selectedClass} />
            case 'students':
            default:
                return <StudentsListView selectedClass={selectedClass} allUsers={allUsers} setAllUsers={setAllUsers} setClasses={setClasses} initialClasses={initialClasses} />
        }
    }

    const NavTab: React.FC<{view: ClassView, label: string, Icon: React.FC<any>}> = ({view, label, Icon}) => (
        <button
            onClick={() => setActiveView(view)}
            className={`flex items-center px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-colors ${
                activeView === view
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            <Icon className="h-5 w-5 ml-2" />
            {label}
        </button>
    )

    return (
        <div className="animate-fade-in">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{selectedClass.name}</h1>
                    <p className="text-gray-500">{selectedClass.students.length} تلميذ</p>
                </div>
            </header>
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-2" dir="ltr">
                    <NavTab view="students" label="التلاميذ" Icon={UsersIcon} />
                    <NavTab view="content" label="المحتوى" Icon={BookOpenIcon} />
                    <NavTab view="attendance" label="الحضور" Icon={CheckBadgeIcon} />
                    <NavTab view="grades" label="ملخص النقط" Icon={ChartBarIcon} />
                    <NavTab view="progress" label="ملخص التقدم" Icon={PresentationChartBarIcon} />
                </nav>
            </div>
            {renderView()}
        </div>
    );
};

const StudentsListView: React.FC<{
    selectedClass: SchoolClass,
    allUsers: ManagedUser[],
    setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>,
    initialClasses: SchoolClass[],
    setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>
}> = ({ selectedClass, allUsers, setAllUsers, initialClasses, setClasses }) => {
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedStudent(null);
    };

    const calculateAverage = (grades: Grade[]) => {
      if (grades.length === 0) return 0;
      const total = grades.reduce((sum, g) => sum + g.grade, 0);
      return (total / grades.length).toFixed(2);
    }
    
    const filteredStudents = selectedClass.students.filter(student =>
        student.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="mb-4">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="ابحث عن تلميذ بالاسم..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم التلميذ</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المعدل العام</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحضور</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map(student => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{calculateAverage(student.grades)}/20</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{student.attendance.present} حاضر / {student.attendance.absent} غائب</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                        <button onClick={() => handleSelectStudent(student)} className="text-teal-600 hover:text-teal-900">
                                            عرض التفاصيل
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">
                                    لا يوجد تلاميذ يطابقون بحثك.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        {isModalOpen && selectedStudent && (
            <StudentProfileModal 
                student={selectedStudent} 
                onClose={handleCloseModal} 
                allUsers={allUsers}
                setAllUsers={setAllUsers}
                onSave={(updatedStudent) => {
                    const updatedClasses = initialClasses.map(c => 
                        c.id === selectedClass.id 
                            ? { ...c, students: c.students.map(s => s.id === updatedStudent.id ? updatedStudent : s) }
                            : c
                    );
                    setClasses(updatedClasses);
                }}
            />
        )}
        </>
    );
}

const StudentProfileModal: React.FC<{
    student: Student;
    onClose: () => void;
    onSave: (student: Student) => void;
    allUsers: ManagedUser[];
    setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
}> = ({ student, onClose, onSave, allUsers, setAllUsers }) => {
    const [localStudent, setLocalStudent] = useState(student);
    const [newObservationText, setNewObservationText] = useState('');
    const [newNoteText, setNewNoteText] = useState('');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [newFieldLabel, setNewFieldLabel] = useState('');
    const [newFieldValue, setNewFieldValue] = useState('');

    const parent = allUsers.find(u => u.id === localStudent.parentId);

    const handleSaveChanges = () => {
        onSave(localStudent);
        onClose();
    };
    
    const handleGradeChange = (subject: string, newGrade: string) => {
      const gradeValue = Math.max(0, Math.min(20, Number(newGrade)));
      setLocalStudent(prev => ({
        ...prev!,
        grades: prev!.grades.map(g => g.subject === subject ? { ...g, grade: gradeValue } : g),
      }));
    };

    const handleAddNote = (type: 'observation' | 'note') => {
        const text = type === 'observation' ? newObservationText : newNoteText;
        if (text.trim() === '') return;

        if (type === 'observation') {
            const newObservation: Observation = { id: `obs-${Date.now()}`, text, date: new Date().toISOString() };
            setLocalStudent(prev => ({ ...prev!, observations: [newObservation, ...prev!.observations] }));
            setNewObservationText('');
        } else {
            const newNote: StudentNote = { id: `note-${Date.now()}`, text, date: new Date().toISOString() };
            setLocalStudent(prev => ({ ...prev!, notes: [newNote, ...prev!.notes] }));
            setNewNoteText('');
        }
    };
    
    const handleSendMessage = () => {
        if (!parent || messageText.trim() === '') return;
        const newNotification: Notification = {
            id: `notif-${Date.now()}`,
            message: `رسالة من الأستاذ بخصوص ${student.name}: ${messageText}`,
            date: new Date().toISOString(),
            read: false,
        };
        setAllUsers(prevUsers => prevUsers.map(u => 
            u.id === parent.id 
                ? { ...u, notifications: [newNotification, ...(u.notifications || [])] }
                : u
        ));
        setMessageText('');
        setIsMessageModalOpen(false);
    };

    const handleCustomFieldChange = (id: string, value: string) => {
        setLocalStudent(prev => ({
            ...prev!,
            customFields: prev!.customFields.map(f => f.id === id ? { ...f, value } : f)
        }));
    };

    const handleAddCustomField = () => {
        if (newFieldLabel.trim() === '' || newFieldValue.trim() === '') return;
        const newField: CustomField = {
            id: `cf-${Date.now()}`,
            label: newFieldLabel,
            value: newFieldValue
        };
        setLocalStudent(prev => ({
            ...prev!,
            customFields: [...prev!.customFields, newField]
        }));
        setNewFieldLabel('');
        setNewFieldValue('');
    };
    
    const handleDeleteCustomField = (id: string) => {
        setLocalStudent(prev => ({
            ...prev!,
            customFields: prev!.customFields.filter(f => f.id !== id)
        }));
    };

    return (
        <>
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800">ملف التلميذ: {localStudent.name}</h3>
                        <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500 hover:text-gray-800" /></button>
                    </div>
                    <div className="overflow-y-auto pr-2 flex-grow space-y-6">
                        {/* Grades & Parent Message */}
                        <div className="flex justify-between items-start">
                            <h4 className="text-lg font-semibold text-gray-700 flex items-center"><ChartBarIcon className="h-5 w-5 ml-2 text-teal-500" />النقط</h4>
                            {parent && (
                                <button onClick={() => setIsMessageModalOpen(true)} className="flex items-center text-sm px-3 py-1.5 bg-teal-50 text-teal-600 rounded-md hover:bg-teal-100">
                                    <EnvelopeIcon className="h-4 w-4 ml-2"/>
                                    مراسلة ولي الأمر ({parent.name})
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                            {localStudent.grades.map(grade => (
                                <div key={grade.subject}>
                                    <label className="text-gray-600 text-sm font-medium">{grade.subject}</label>
                                    <div className="flex items-center">
                                        <input
                                            type="number"
                                            value={grade.grade}
                                            onChange={(e) => handleGradeChange(grade.subject, e.target.value)}
                                            className="w-full p-1 border rounded-md text-center"
                                            max="20" min="0"
                                        />
                                        <span className="mr-2 text-gray-500">/ 20</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Attendance History */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2 flex items-center"><CheckBadgeIcon className="h-5 w-5 ml-2 text-teal-500" />سجل الحضور</h4>
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex justify-around mb-4 text-center border-b pb-4">
                                    <div>
                                        <p className="text-2xl font-bold text-green-600">{localStudent.attendance.present}</p>
                                        <p className="text-sm text-gray-500">أيام حضور</p>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-red-600">{localStudent.attendance.absent}</p>
                                        <p className="text-sm text-gray-500">أيام غياب</p>
                                    </div>
                                </div>
                                <div className="max-h-40 overflow-y-auto pt-2">
                                    <ul className="space-y-2">
                                        {localStudent.attendanceRecords.length > 0 ? (
                                            [...localStudent.attendanceRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(record => (
                                                <li key={record.date} className="flex justify-between items-center text-sm p-2 bg-white rounded">
                                                    <span>{new Date(record.date).toLocaleDateString('ar-MA', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                                    <span className={`font-semibold px-2 py-0.5 rounded-full text-xs ${record.status === AttendanceStatus.PRESENT ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                        {record.status === AttendanceStatus.PRESENT ? 'حاضر' : 'غائب'}
                                                    </span>
                                                </li>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500 py-4">لا يوجد سجل حضور مسجل.</p>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Custom Fields */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2"><PencilIcon className="h-5 w-5 inline ml-2 text-teal-500" />الحقول المخصصة</h4>
                            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                {localStudent.customFields.map(field => (
                                    <div key={field.id} className="flex items-center gap-3">
                                        <label className="text-gray-600 text-sm font-medium w-1/3 truncate">{field.label}</label>
                                        <input
                                            type="text"
                                            value={field.value}
                                            onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                                            className="flex-grow p-1 border rounded-md"
                                        />
                                        <button onClick={() => handleDeleteCustomField(field.id)} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0">
                                            <TrashIcon className="h-5 w-5"/>
                                        </button>
                                    </div>
                                ))}
                                <div className="pt-2 border-t mt-3 flex gap-2">
                                    <input value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)} placeholder="اسم الحقل الجديد" className="flex-grow p-2 border rounded-md text-sm"/>
                                    <input value={newFieldValue} onChange={e => setNewFieldValue(e.target.value)} placeholder="قيمة الحقل" className="flex-grow p-2 border rounded-md text-sm"/>
                                    <button onClick={handleAddCustomField} className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"><PlusCircleIcon className="h-6 w-6" /></button>
                                </div>
                            </div>
                        </div>

                        {/* Notes and Observations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Notes */}
                             <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-2"><PencilIcon className="h-5 w-5 inline ml-2 text-teal-500" />الملاحظات الرسمية</h4>
                                <div className="space-y-2 mb-2 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded-md border">
                                    {localStudent.notes.map(note => (
                                        <div key={note.id} className="text-sm bg-white p-2 rounded border-r-2 border-teal-200">
                                            <p className="text-gray-700">{note.text}</p>
                                            <p className="text-xs text-gray-400 text-left">{new Date(note.date).toLocaleString('ar-MA')}</p>
                                        </div>
                                    )).reverse()}
                                </div>
                                <div className="flex gap-2">
                                    <input value={newNoteText} onChange={e => setNewNoteText(e.target.value)} placeholder="إضافة ملاحظة رسمية..." className="flex-grow p-2 border rounded-md"/>
                                    <button onClick={() => handleAddNote('note')} className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"><PlusCircleIcon className="h-6 w-6" /></button>
                                </div>
                            </div>
                            {/* Observations */}
                            <div>
                                <h4 className="text-lg font-semibold text-gray-700 mb-2"><PencilIcon className="h-5 w-5 inline ml-2 text-teal-500" />الملاحظات السريعة</h4>
                                <div className="space-y-2 mb-2 max-h-40 overflow-y-auto bg-gray-50 p-2 rounded-md border">
                                    {localStudent.observations.map(obs => (
                                        <div key={obs.id} className="text-sm bg-white p-2 rounded border-r-2 border-teal-200">
                                            <p className="text-gray-700">{obs.text}</p>
                                            <p className="text-xs text-gray-400 text-left">{new Date(obs.date).toLocaleString('ar-MA')}</p>
                                        </div>
                                    )).reverse()}
                                </div>
                                <div className="flex gap-2">
                                    <input value={newObservationText} onChange={e => setNewObservationText(e.target.value)} placeholder="إضافة ملاحظة سريعة..." className="flex-grow p-2 border rounded-md"/>
                                    <button onClick={() => handleAddNote('observation')} className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"><PlusCircleIcon className="h-6 w-6" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-8 border-t pt-4">
                        <button onClick={onClose} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">إلغاء</button>
                        <button onClick={handleSaveChanges} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">حفظ التغييرات</button>
                    </div>
                </div>
            </div>
            {isMessageModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                        <h3 className="text-xl font-bold mb-4">إرسال رسالة إلى ولي الأمر</h3>
                        <textarea value={messageText} onChange={e => setMessageText(e.target.value)} className="w-full h-32 p-2 border rounded-md mb-4" placeholder="اكتب رسالتك هنا..."></textarea>
                        <div className="flex justify-end space-x-2">
                            <button onClick={() => setIsMessageModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                            <button onClick={handleSendMessage} className="px-4 py-2 bg-teal-500 text-white rounded-md">إرسال</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

const AttendanceView: React.FC<{
    selectedClass: SchoolClass,
    initialClasses: SchoolClass[],
    setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>,
    allUsers: ManagedUser[],
    setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>
}> = ({ selectedClass, initialClasses, setClasses, allUsers, setAllUsers }) => {
    const today = new Date().toISOString().split('T')[0];
    
    const getInitialAttendance = () => {
        const statuses: Record<string, AttendanceStatus> = {};
        selectedClass.students.forEach(student => {
            const todayRecord = student.attendanceRecords.find(r => r.date === today);
            statuses[student.id] = todayRecord ? todayRecord.status : AttendanceStatus.PRESENT;
        });
        return statuses;
    };
    
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(getInitialAttendance);
    const [isSaving, setIsSaving] = useState(false);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({...prev, [studentId]: status}));
    };

    const handleSaveAttendance = () => {
        setIsSaving(true);
        setTimeout(() => {
            let wasChanged = false;
            const updatedClasses = initialClasses.map(c => {
                if (c.id === selectedClass.id) {
                    const updatedStudents = c.students.map(student => {
                        const newStatus = attendance[student.id];
                        const todayRecordIndex = student.attendanceRecords.findIndex(r => r.date === today);
                        const oldStatus = todayRecordIndex > -1 ? student.attendanceRecords[todayRecordIndex].status : null;

                        if (newStatus === oldStatus) return student; // No change
                        wasChanged = true;

                        // Send notification if student is newly marked as absent
                        if (newStatus === AttendanceStatus.ABSENT && oldStatus !== AttendanceStatus.ABSENT) {
                            const parent = allUsers.find(u => u.id === student.parentId);
                            if(parent) {
                                const newNotification: Notification = {
                                    id: `notif-${Date.now()}`,
                                    message: `يرجى العلم بأن ابنكم ${student.name} قد تم تسجيله غائباً اليوم ${today}.`,
                                    date: new Date().toISOString(),
                                    read: false,
                                };
                                 setAllUsers(prevUsers => prevUsers.map(u => 
                                    u.id === parent.id 
                                        ? { ...u, notifications: [newNotification, ...(u.notifications || [])] }
                                        : u
                                ));
                            }
                        }

                        const newAttendanceRecords = [...student.attendanceRecords];
                        if (todayRecordIndex > -1) {
                            newAttendanceRecords[todayRecordIndex] = { ...newAttendanceRecords[todayRecordIndex], status: newStatus };
                        } else {
                            newAttendanceRecords.push({ date: today, status: newStatus });
                        }
                        
                        // Recalculate summary
                        const presentCount = newAttendanceRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
                        const absentCount = newAttendanceRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;
                        
                        return { 
                            ...student, 
                            attendanceRecords: newAttendanceRecords,
                            attendance: { present: presentCount, absent: absentCount }
                        };
                    });
                    return { ...c, students: updatedStudents };
                }
                return c;
            });
            
            if (wasChanged) {
                setClasses(updatedClasses);
                alert('تم حفظ سجل الحضور بنجاح!');
            } else {
                alert('لا توجد تغييرات لحفظها.');
            }
            setIsSaving(false);
        }, 1000);
    };
    
    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">تسجيل حضور ليوم: {new Date(today).toLocaleDateString('ar-MA')}</h3>
                <button 
                    onClick={handleSaveAttendance} 
                    className="flex items-center justify-center px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 disabled:bg-teal-300 transition-colors"
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <LoadingSpinnerIcon className="w-5 h-5 ml-2 animate-spin"/>
                            <span>جاري الحفظ...</span>
                        </>
                    ) : (
                        <span>حفظ الحضور</span>
                    )}
                </button>
            </div>
            <div className="space-y-2">
                {selectedClass.students.map(student => (
                    <div key={student.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <p className="font-semibold">{student.name}</p>
                        <div className="flex space-x-2" dir='ltr'>
                            <button
                                onClick={() => handleStatusChange(student.id, AttendanceStatus.PRESENT)}
                                className={`px-4 py-1 rounded-full text-sm ${attendance[student.id] === AttendanceStatus.PRESENT ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                            >
                                حاضر
                            </button>
                            <button
                                onClick={() => handleStatusChange(student.id, AttendanceStatus.ABSENT)}
                                className={`px-4 py-1 rounded-full text-sm ${attendance[student.id] === AttendanceStatus.ABSENT ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                            >
                                غائب
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ContentManagementView: React.FC<{
    selectedClass: SchoolClass,
    initialClasses: SchoolClass[],
    setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>,
}> = ({ selectedClass, initialClasses, setClasses }) => {
    
    type ModalType = 'lessons' | 'exercises' | 'materials' | 'quizzes' | null;
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

    const handleUpdate = (updatedContent: Partial<SchoolClass>) => {
        setClasses(prevClasses => prevClasses.map(c => 
            c.id === selectedClass.id ? { ...c, ...updatedContent } : c
        ));
    };

    const ContentCard: React.FC<{title: string, count: number, Icon: React.FC<any>, onManage: () => void}> = ({ title, count, Icon, onManage }) => (
        <div className="bg-gray-50 p-6 rounded-lg border flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
                <Icon className="h-8 w-8 text-teal-500 mb-3" />
                <h4 className="text-xl font-bold text-gray-800">{title}</h4>
                <p className="text-gray-500">{count} عناصر</p>
            </div>
            <button onClick={onManage} className="mt-4 w-full text-center px-4 py-2 bg-white border border-teal-500 text-teal-600 font-semibold rounded-lg hover:bg-teal-50 transition-colors">
                إدارة
            </button>
        </div>
    );

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ContentCard title="الدروس" count={selectedClass.lessons.length} Icon={BookOpenIcon} onManage={() => setActiveModal('lessons')} />
                <ContentCard title="التمارين" count={selectedClass.exercises.length} Icon={PencilIcon} onManage={() => setActiveModal('exercises')} />
                <ContentCard title="الموارد" count={selectedClass.materials.length} Icon={DocumentTextIcon} onManage={() => setActiveModal('materials')} />
                <ContentCard title="الاختبارات" count={selectedClass.quizzes.length} Icon={QuestionMarkCircleIcon} onManage={() => setActiveModal('quizzes')} />
            </div>

            {activeModal === 'lessons' && <LessonExerciseModal type="lesson" classData={selectedClass} onUpdate={handleUpdate} onClose={() => setActiveModal(null)} />}
            {activeModal === 'exercises' && <LessonExerciseModal type="exercise" classData={selectedClass} onUpdate={handleUpdate} onClose={() => setActiveModal(null)} />}
            {activeModal === 'materials' && <MaterialsModal materials={selectedClass.materials} onUpdate={(updatedMaterials) => handleUpdate({ materials: updatedMaterials })} onClose={() => setActiveModal(null)} />}
            {activeModal === 'quizzes' && (
                <QuizzesListModal
                    quizzes={selectedClass.quizzes}
                    onUpdate={(updatedQuizzes) => handleUpdate({ quizzes: updatedQuizzes })}
                    onClose={() => setActiveModal(null)}
                    onEditQuiz={setEditingQuiz}
                />
            )}
            {editingQuiz && (
                <QuizEditorModal
                    quiz={editingQuiz}
                    onClose={() => setEditingQuiz(null)}
                    onSave={(updatedQuiz) => {
                        const updatedQuizzes = selectedClass.quizzes.map(q => q.id === updatedQuiz.id ? updatedQuiz : q);
                        handleUpdate({ quizzes: updatedQuizzes });
                        setEditingQuiz(null);
                    }}
                />
            )}
        </>
    );
};

// Generic modal for Lessons and Exercises
const LessonExerciseModal: React.FC<{
    type: 'lesson' | 'exercise',
    classData: SchoolClass,
    onUpdate: (data: { lessons?: Lesson[], exercises?: Exercise[] }) => void,
    onClose: () => void
}> = ({ type, classData, onUpdate, onClose }) => {
    const isLesson = type === 'lesson';
    const title = isLesson ? "الدروس" : "التمارين";
    const items = isLesson ? classData.lessons : classData.exercises;
    const [editingItem, setEditingItem] = useState<(Lesson | Exercise | { id: null }) | null>(null);

    const handleDelete = (id: string) => {
        if (!confirm(`هل أنت متأكد من حذف هذا ${isLesson ? 'الدرس' : 'التمرين'}؟`)) return;
        const updatedItems = items.filter(item => item.id !== id);
        onUpdate(isLesson ? { lessons: updatedItems } : { exercises: updatedItems });
    };

    const handleSave = (itemToSave: Lesson | Exercise) => {
        let updatedItems;
        if ('id' in itemToSave && itemToSave.id) { // Editing existing
            updatedItems = items.map(item => item.id === itemToSave.id ? itemToSave : item);
        } else { // Adding new
            const newItem = { ...itemToSave, id: `${type}-${Date.now()}` };
            updatedItems = [...items, newItem];
        }
        onUpdate(isLesson ? { lessons: updatedItems } : { exercises: updatedItems });
        setEditingItem(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">إدارة {title}</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {editingItem ? (
                        <ItemForm item={editingItem} onSave={handleSave} onCancel={() => setEditingItem(null)} />
                    ) : (
                        <>
                            <div className="flex justify-end mb-4">
                                {/* FIX: Use ContentStatus.LOCKED instead of the string 'locked' to match the ContentStatus enum type. */}
                                <button onClick={() => setEditingItem({ id: null, title: '', description: '', status: ContentStatus.LOCKED })} className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                                    <PlusCircleIcon className="h-5 w-5 ml-2" /> إضافة {isLesson ? 'درس' : 'تمرين'}
                                </button>
                            </div>
                            <div className="space-y-3">
                                {items.map(item => (
                                    <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">{item.title}</p>
                                            <p className="text-sm text-gray-600">{item.description}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button onClick={() => setEditingItem(item)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon className="h-5 w-5" /></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && <p className="text-center text-gray-500 py-4">لا توجد عناصر.</p>}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const ItemForm: React.FC<{
    item: Lesson | Exercise | { id: null },
    onSave: (item: any) => void,
    onCancel: () => void
}> = ({ item, onSave, onCancel }) => {
    const [title, setTitle] = useState('title' in item ? item.title : '');
    const [description, setDescription] = useState('description' in item ? item.description : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...item, title, description });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-lg font-semibold">{item.id ? 'تعديل العنصر' : 'إضافة عنصر جديد'}</h4>
            <div>
                <label className="block text-sm font-medium text-gray-700">العنوان</label>
                <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">الوصف</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" required />
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-md">حفظ</button>
            </div>
        </form>
    );
};

const MaterialsModal: React.FC<{
    materials: CourseMaterial[],
    onUpdate: (materials: CourseMaterial[]) => void,
    onClose: () => void
}> = ({ materials, onUpdate, onClose }) => {
    const [newItemName, setNewItemName] = useState('');
    const [newItemType, setNewItemType] = useState<MaterialType>(MaterialType.PDF);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleAddMaterial = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemName.trim() === '' || !selectedFile) {
            alert("الرجاء إدخال اسم للمورد واختيار ملف.");
            return;
        }

        const newMaterial: CourseMaterial = {
            id: `mat-${Date.now()}`,
            name: newItemName,
            type: newItemType,
            url: `#/files/${selectedFile.name}` // Mock URL
        };

        onUpdate([...materials, newMaterial]);
        
        // Reset form
        setNewItemName('');
        setNewItemType(MaterialType.PDF);
        setSelectedFile(null);
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا المورد؟')) {
            onUpdate(materials.filter(m => m.id !== id));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">إدارة الموارد</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {/* Add New Material Form */}
                    <form onSubmit={handleAddMaterial} className="p-4 bg-gray-50 rounded-lg mb-6 space-y-4">
                        <h4 className="text-lg font-semibold">إضافة مورد جديد</h4>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">اسم المورد</label>
                            <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="mt-1 block w-full p-2 border rounded-md" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">نوع المورد</label>
                                <select value={newItemType} onChange={e => setNewItemType(e.target.value as MaterialType)} className="mt-1 block w-full p-2 border rounded-md">
                                    {Object.values(MaterialType).map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">رفع الملف</label>
                                <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                                                <span>اختر ملفاً</span>
                                                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} ref={fileInputRef} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">{selectedFile ? selectedFile.name : 'PDF, MP4, PPTX, DOCX'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                                <PlusCircleIcon className="h-5 w-5 ml-2" /> إضافة المورد
                            </button>
                        </div>
                    </form>

                    {/* Existing Materials List */}
                    <div className="space-y-3">
                        {materials.map(item => (
                            <div key={item.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{item.name}</p>
                                    <p className="text-sm text-gray-600">النوع: {item.type}</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        ))}
                        {materials.length === 0 && <p className="text-center text-gray-500 py-4">لا توجد موارد حالياً.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};


const QuizzesListModal: React.FC<{
    quizzes: Quiz[],
    onUpdate: (quizzes: Quiz[]) => void,
    onClose: () => void,
    onEditQuiz: (quiz: Quiz) => void
}> = ({ quizzes, onUpdate, onClose, onEditQuiz }) => {
    const [newQuizTitle, setNewQuizTitle] = useState('');

    const handleAddQuiz = () => {
        if (newQuizTitle.trim() === '') return;
        const newQuiz: Quiz = {
            id: `quiz-${Date.now()}`,
            title: newQuizTitle,
            questions: []
        };
        onUpdate([...quizzes, newQuiz]);
        setNewQuizTitle('');
    };

    const handleDeleteQuiz = (id: string) => {
        if (confirm('هل أنت متأكد من حذف هذا الاختبار؟')) {
            onUpdate(quizzes.filter(q => q.id !== id));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">إدارة الاختبارات</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="flex gap-2 mb-4">
                        <input value={newQuizTitle} onChange={e => setNewQuizTitle(e.target.value)} placeholder="عنوان اختبار جديد..." className="flex-grow p-2 border rounded-md"/>
                        <button onClick={handleAddQuiz} className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"><PlusCircleIcon className="h-6 w-6" /></button>
                    </div>
                    <div className="space-y-3">
                        {quizzes.map(quiz => (
                            <div key={quiz.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{quiz.title}</p>
                                    <p className="text-sm text-gray-600">{quiz.questions.length} أسئلة</p>
                                </div>
                                <div className="flex space-x-2">
                                    <button onClick={() => onEditQuiz(quiz)} className="p-2 text-gray-500 hover:text-blue-600"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        ))}
                        {quizzes.length === 0 && <p className="text-center text-gray-500 py-4">لا توجد اختبارات.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const QuizEditorModal: React.FC<{
    quiz: Quiz,
    onClose: () => void,
    onSave: (quiz: Quiz) => void
}> = ({ quiz, onClose, onSave }) => {
    const [editingQuiz, setEditingQuiz] = useState(quiz);
    
    const handleAddQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: `q-${Date.now()}`,
            questionText: 'سؤال جديد',
            type: QuestionType.MULTIPLE_CHOICE,
            options: [{ id: `o-${Date.now()}`, text: 'إجابة 1', isCorrect: true }]
        };
        setEditingQuiz(prev => ({...prev, questions: [...prev.questions, newQuestion]}));
    };

    const handleQuestionChange = <K extends keyof QuizQuestion>(questionId: string, field: K, value: QuizQuestion[K]) => {
        setEditingQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === questionId ? {...q, [field]: value} : q)
        }));
    };
    
    const handleQuestionTypeChange = (questionId: string, newType: QuestionType) => {
        setEditingQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => {
                if (q.id === questionId) {
                    const newQuestion: QuizQuestion = { ...q, type: newType, options: [], correctAnswer: '' };
                    if (newType === QuestionType.TRUE_FALSE) {
                        newQuestion.options = [
                            { id: `tf-${Date.now()}-1`, text: 'صحيح', isCorrect: true },
                            { id: `tf-${Date.now()}-2`, text: 'خطأ', isCorrect: false },
                        ];
                    } else if (newType === QuestionType.MULTIPLE_CHOICE) {
                         newQuestion.options = [
                            { id: `o-${Date.now()}`, text: 'إجابة 1', isCorrect: true },
                        ];
                    }
                    return newQuestion;
                }
                return q;
            })
        }));
    };

    const handleDeleteQuestion = (questionId: string) => {
        setEditingQuiz(prev => ({...prev, questions: prev.questions.filter(q => q.id !== questionId)}));
    };
    
    const handleAddOption = (questionId: string) => {
        const newOption: AnswerOption = { id: `o-${Date.now()}`, text: 'إجابة جديدة', isCorrect: false };
        setEditingQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === questionId ? {...q, options: [...(q.options || []), newOption]} : q)
        }));
    };
    
    const handleUpdateOption = (questionId: string, optionId: string, newText: string) => {
        setEditingQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === questionId ? {...q, options: (q.options || []).map(o => o.id === optionId ? {...o, text: newText} : o) } : q)
        }));
    };
    
    const handleSetCorrectOption = (questionId: string, optionId: string) => {
        setEditingQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === questionId ? {...q, options: (q.options || []).map(o => ({...o, isCorrect: o.id === optionId}))} : q)
        }));
    };

    const handleDeleteOption = (questionId: string, optionId: string) => {
        setEditingQuiz(prev => ({
            ...prev,
            questions: prev.questions.map(q => q.id === questionId ? {...q, options: (q.options || []).filter(o => o.id !== optionId) } : q)
        }));
    };
    
    const renderAnswerEditor = (q: QuizQuestion) => {
        switch(q.type) {
            case QuestionType.TRUE_FALSE:
                return (
                    <div className="space-y-2 mt-3">
                        {(q.options || []).map(o => (
                            <div key={o.id} className="flex items-center gap-2">
                                <input type="radio" name={`correct-${q.id}`} checked={o.isCorrect} onChange={() => handleSetCorrectOption(q.id, o.id)} />
                                <label className="text-sm">{o.text}</label>
                            </div>
                        ))}
                    </div>
                );
            case QuestionType.SHORT_ANSWER:
                return (
                    <div className="mt-3">
                        <label className="text-sm font-medium text-gray-700">الإجابة الصحيحة</label>
                        <input 
                            value={q.correctAnswer || ''} 
                            onChange={e => handleQuestionChange(q.id, 'correctAnswer', e.target.value)} 
                            className="mt-1 w-full p-1 border-b text-sm focus:outline-none focus:border-teal-500"
                            placeholder="اكتب الإجابة المتوقعة هنا..."
                        />
                    </div>
                );
            case QuestionType.MULTIPLE_CHOICE:
            default:
                return (
                    <div className="space-y-2 mt-3">
                        {(q.options || []).map(o => (
                            <div key={o.id} className="flex items-center gap-2">
                                <input type="radio" name={`correct-${q.id}`} checked={o.isCorrect} onChange={() => handleSetCorrectOption(q.id, o.id)} />
                                <input value={o.text} onChange={e => handleUpdateOption(q.id, o.id, e.target.value)} className="flex-grow p-1 border-b text-sm focus:outline-none focus:border-teal-500"/>
                                <button onClick={() => handleDeleteOption(q.id, o.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="h-4 w-4"/></button>
                            </div>
                        ))}
                        <button onClick={() => handleAddOption(q.id)} className="text-sm text-teal-600 hover:text-teal-800">+ إضافة إجابة</button>
                    </div>
                );
        }
    }


    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <input value={editingQuiz.title} onChange={e => setEditingQuiz(prev => ({...prev, title: e.target.value}))} className="text-xl font-bold border-b-2 border-transparent focus:border-teal-500 focus:outline-none"/>
                    <button onClick={onClose}><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto space-y-4">
                    {editingQuiz.questions.map((q) => (
                        <div key={q.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                                <textarea value={q.questionText} onChange={e => handleQuestionChange(q.id, 'questionText', e.target.value)} className="font-semibold w-full border-b focus:outline-none focus:border-teal-500 bg-transparent resize-none h-auto"/>
                                <div className="flex items-center">
                                    <select value={q.type} onChange={e => handleQuestionTypeChange(q.id, e.target.value as QuestionType)} className="ml-2 p-1 text-sm border-gray-300 rounded-md">
                                        <option value={QuestionType.MULTIPLE_CHOICE}>اختيار من متعدد</option>
                                        <option value={QuestionType.TRUE_FALSE}>صح / خطأ</option>
                                        <option value={QuestionType.SHORT_ANSWER}>إجابة قصيرة</option>
                                    </select>
                                    <button onClick={() => handleDeleteQuestion(q.id)} className="p-1 text-gray-400 hover:text-red-500"><TrashIcon className="h-5 w-5"/></button>
                                </div>
                            </div>
                           {renderAnswerEditor(q)}
                        </div>
                    ))}
                    <button onClick={handleAddQuestion} className="w-full mt-4 p-2 border-2 border-dashed rounded-lg text-gray-500 hover:bg-gray-100 hover:border-teal-500">
                        إضافة سؤال جديد
                    </button>
                </div>
                <div className="flex justify-end space-x-2 p-4 border-t">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                    <button onClick={() => onSave(editingQuiz)} className="px-4 py-2 bg-teal-500 text-white rounded-md">حفظ الاختبار</button>
                </div>
            </div>
        </div>
    );
};

const GradeSummaryView: React.FC<{ selectedClass: SchoolClass }> = ({ selectedClass }) => {
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'ascending' | 'descending' } | null>({ key: 'name', direction: 'ascending' });

    const subjects = useMemo(() => {
        const subjectSet = new Set<string>();
        selectedClass.students.forEach(student => {
            student.grades.forEach(grade => subjectSet.add(grade.subject));
        });
        return Array.from(subjectSet);
    }, [selectedClass.students]);

    const studentData = useMemo(() => {
        return selectedClass.students.map(student => {
            const gradesMap = new Map(student.grades.map(g => [g.subject, g.grade]));
            const total = student.grades.reduce((sum, g) => sum + g.grade, 0);
            const average = student.grades.length > 0 ? (total / student.grades.length) : 0;
            return { id: student.id, name: student.name, gradesMap, average };
        });
    }, [selectedClass.students]);

    const sortedStudents = useMemo(() => {
        let sortableItems = [...studentData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue, bValue;
                if (sortConfig.key === 'name') {
                    aValue = a.name;
                    bValue = b.name;
                } else if (sortConfig.key === 'average') {
                    aValue = a.average;
                    bValue = b.average;
                } else { // Subject grade
                    aValue = a.gradesMap.get(sortConfig.key) ?? -1;
                    bValue = b.gradesMap.get(sortConfig.key) ?? -1;
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [studentData, sortConfig]);

    const requestSort = (key: string) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
    };

    const getGradeColor = (grade: number) => {
        if (grade >= 15) return 'text-green-600 bg-green-50';
        if (grade >= 10) return 'text-yellow-600 bg-yellow-50';
        return 'text-red-600 bg-red-50';
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">ملخص نقط التلاميذ</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th onClick={() => requestSort('name')} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                اسم التلميذ {getSortIndicator('name')}
                            </th>
                            {subjects.map(subject => (
                                <th key={subject} onClick={() => requestSort(subject)} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                    {subject} {getSortIndicator(subject)}
                                </th>
                            ))}
                            <th onClick={() => requestSort('average')} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer">
                                المعدل {getSortIndicator('average')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedStudents.map(student => (
                            <tr key={student.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                {subjects.map(subject => {
                                    const grade = student.gradesMap.get(subject);
                                    return (
                                        <td key={subject} className={`px-6 py-4 whitespace-nowrap text-sm text-center font-semibold rounded-md ${grade !== undefined ? getGradeColor(grade) : 'text-gray-400'}`}>
                                            {grade !== undefined ? grade : 'N/A'}
                                        </td>
                                    );
                                })}
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${getGradeColor(student.average)}`}>
                                    {student.average.toFixed(2)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ProgressSummaryView: React.FC<{ selectedClass: SchoolClass }> = ({ selectedClass }) => {
    const subjects = useMemo(() => {
        const subjectSet = new Set<string>();
        selectedClass.students.forEach(student => {
            student.progress.forEach(p => subjectSet.add(p.subjectName));
        });
        return Array.from(subjectSet);
    }, [selectedClass.students]);

    const classAverages = useMemo(() => {
        return subjects.map(subjectName => {
            const progresses = selectedClass.students
                .map(student => student.progress.find(p => p.subjectName === subjectName)?.progress)
                .filter((p): p is number => p !== undefined);
            
            const total = progresses.reduce((sum, p) => sum + p, 0);
            const average = progresses.length > 0 ? total / progresses.length : 0;
            
            return { subjectName, average };
        });
    }, [selectedClass.students, subjects]);

    const studentProgressData = useMemo(() => {
        return selectedClass.students.map(student => {
            const progressMap = new Map(student.progress.map(p => [p.subjectName, p.progress]));
            return { id: student.id, name: student.name, progressMap };
        });
    }, [selectedClass.students]);
    
    const getProgressColor = (progress: number) => {
        if (progress >= 70) return 'text-green-800 bg-green-100';
        if (progress >= 40) return 'text-yellow-800 bg-yellow-100';
        return 'text-red-800 bg-red-100';
    };

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">متوسط تقدم إنجاز مواد القسم</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {classAverages.map(avg => (
                        <div key={avg.subjectName}>
                            <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold text-gray-600">{avg.subjectName}</p>
                                <p className="font-bold text-teal-600">{Math.round(avg.average)}%</p>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-4">
                                <div className="bg-teal-500 h-4 rounded-full transition-all duration-500" style={{ width: `${avg.average}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold mb-4">تقدم التلاميذ الفردي</h3>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    اسم التلميذ
                                </th>
                                {subjects.map(subject => (
                                    <th key={subject} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        {subject}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {studentProgressData.map(student => (
                                <tr key={student.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                    {subjects.map(subject => {
                                        const progress = student.progressMap.get(subject);
                                        return (
                                            <td key={subject} className="px-6 py-4 whitespace-nowrap text-sm text-center font-semibold">
                                                {progress !== undefined ? (
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getProgressColor(progress)}`}>
                                                        {progress}%
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};


export default TeacherDashboard;