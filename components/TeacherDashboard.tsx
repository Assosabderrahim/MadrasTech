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
  BellIcon,
  ClipboardListIcon,
  CalendarIcon,
  InformationCircleIcon,
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
    ContentStatus,
    TimetableEntry,
    Homework,
    Attachment,
    Announcement,
    UserRole,
} from '../types';

type ClassView = 'students' | 'content' | 'grades' | 'attendance' | 'progress' | 'homework';

interface TeacherDashboardProps {
  onLogout: () => void;
  initialClasses: SchoolClass[];
  allUsers: ManagedUser[];
  setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
  setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
  currentUser: ManagedUser;
  announcements: Announcement[];
}

const CreateClassModal: React.FC<{
    onClose: () => void;
    onCreate: (className: string) => void;
}> = ({ onClose, onCreate }) => {
    const [className, setClassName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (className.trim()) {
            onCreate(className.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">إنشاء قسم جديد</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition-colors"><XIcon className="h-6 w-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <label htmlFor="className" className="block text-sm font-medium text-gray-700">اسم القسم</label>
                        <input
                            type="text"
                            id="className"
                            value={className}
                            onChange={e => setClassName(e.target.value)}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 transition"
                            required
                            placeholder="مثال: الأولى إعدادي - 2"
                        />
                    </div>
                    <div className="flex justify-end space-x-2 space-x-reverse p-4 bg-gray-50 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors">إنشاء</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const GradeSummaryView: React.FC<{ selectedClass: SchoolClass }> = ({ selectedClass }) => {
    const subjects = useMemo(() => {
        const allSubjects = new Set<string>();
        selectedClass.students.forEach(s => {
            s.grades.forEach(g => allSubjects.add(g.subject));
        });
        return Array.from(allSubjects);
    }, [selectedClass.students]);

    return (
        <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">ملخص نقط التلاميذ</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم التلميذ</th>
                            {subjects.map(subject => (
                                <th key={subject} className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{subject}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {selectedClass.students.map(student => (
                            <tr key={student.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{student.name}</td>
                                {subjects.map(subject => {
                                    const grade = student.grades.find(g => g.subject === subject);
                                    return (
                                        <td key={subject} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-center font-mono">
                                            {grade ? `${grade.grade}/20` : '-'}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const ProgressSummaryView: React.FC<{ selectedClass: SchoolClass }> = ({ selectedClass }) => {
    return (
        <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
            <h3 className="text-xl font-bold mb-4">ملخص تقدم التلاميذ</h3>
            <div className="space-y-6">
                {selectedClass.students.map(student => (
                    <div key={student.id} className="p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-bold text-lg mb-3 text-gray-800">{student.name}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {student.progress.map(p => (
                                <div key={p.subjectName}>
                                    <div className="flex justify-between items-center text-sm mb-1">
                                        <span className="text-gray-600">{p.subjectName}</span>
                                        <span className="font-semibold text-teal-600">{p.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                                        <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${p.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HomeworkModal: React.FC<{
    homework: Homework | null;
    onClose: () => void;
    onSave: (homework: Homework) => void;
    classId: string;
    subjects: { id: string, name: string }[];
}> = ({ homework, onClose, onSave, classId, subjects }) => {
    const [formData, setFormData] = useState<Partial<Homework>>({
        title: homework?.title || '',
        description: homework?.description || '',
        dueDate: homework?.dueDate || '',
        attachments: homework?.attachments || [],
        classId: classId,
        subjectId: homework?.subjectId || subjects[0]?.id || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            id: homework?.id || `hw-${Date.now()}`,
            createdAt: homework?.createdAt || new Date().toISOString(),
            status: homework?.status || 'pending',
        } as Homework);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">{homework ? 'تعديل الواجب' : 'إضافة واجب جديد'}</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <input type="text" name="title" placeholder="العنوان" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded" required />
                        <select name="subjectId" value={formData.subjectId} onChange={handleChange} className="w-full p-2 border rounded" required>
                             {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <textarea name="description" placeholder="الوصف" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows={4} required />
                        <div>
                            <label className="text-sm">تاريخ التسليم</label>
                            <input type="date" name="dueDate" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border rounded" required />
                        </div>
                        {/* Attachment UI can be added here */}
                    </div>
                    <div className="flex justify-end space-x-2 space-x-reverse p-4 bg-gray-50 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-teal-500 text-white rounded-md">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const HomeworkManagementView: React.FC<{
    selectedClass: SchoolClass,
    initialClasses: SchoolClass[],
    setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>,
    allUsers: ManagedUser[],
    setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>
}> = ({ selectedClass, initialClasses, setClasses, allUsers, setAllUsers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingHomework, setEditingHomework] = useState<Homework | null>(null);
    
    // In a real app, subjects would be managed globally. Here we derive them.
    const classSubjects = useMemo(() => {
        const subjectSet = new Set<{id: string, name: string}>();
        selectedClass.timetable.forEach(t => subjectSet.add({id: t.subject, name: t.subject})); // Mocking ID = name
        return Array.from(subjectSet);
    }, [selectedClass.timetable]);


    const handleSaveHomework = (homework: Homework) => {
        const isEditing = selectedClass.homeworks.some(hw => hw.id === homework.id);
        const updatedHomeworks = isEditing
            ? selectedClass.homeworks.map(hw => (hw.id === homework.id ? homework : hw))
            : [...selectedClass.homeworks, homework];

        setClasses(initialClasses.map(c => c.id === selectedClass.id ? { ...c, homeworks: updatedHomeworks } : c));

        // Notify students
        if (!isEditing) {
            const studentIds = new Set(selectedClass.students.map(s => s.id));
             const subjectName = classSubjects.find(s => s.id === homework.subjectId)?.name || 'مادة غير محددة';
            const newNotification: Notification = {
                id: `notif-${Date.now()}`,
                message: `تمت إضافة واجب جديد في ${subjectName}: "${homework.title}"`,
                date: new Date().toISOString(),
                read: false,
            };
            setAllUsers(prevUsers => prevUsers.map(u => 
                studentIds.has(u.id) 
                    ? { ...u, notifications: [newNotification, ...(u.notifications || [])] }
                    : u
            ));
        }

        setIsModalOpen(false);
        setEditingHomework(null);
    };
    
    const handleDeleteHomework = (homeworkId: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الواجب؟')) {
            const updatedHomeworks = selectedClass.homeworks.filter(hw => hw.id !== homeworkId);
            setClasses(initialClasses.map(c => c.id === selectedClass.id ? { ...c, homeworks: updatedHomeworks } : c));
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">إدارة الواجبات المنزلية</h3>
                    <button onClick={() => { setEditingHomework(null); setIsModalOpen(true); }} className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                        <PlusCircleIcon className="h-5 w-5 ml-2" /> إضافة واجب
                    </button>
                </div>
                <div className="space-y-4">
                    {selectedClass.homeworks.map(hw => (
                        <div key={hw.id} className="p-4 border rounded-lg flex justify-between items-center bg-gray-50">
                            <div>
                                <p className="font-bold">{hw.title}</p>
                                <p className="text-sm text-gray-500">تاريخ التسليم: {hw.dueDate}</p>
                            </div>
                            <div className="flex space-x-2 space-x-reverse">
                                <button onClick={() => { setEditingHomework(hw); setIsModalOpen(true); }} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100 transition-colors"><PencilIcon className="h-5 w-5" /></button>
                                <button onClick={() => handleDeleteHomework(hw.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                        </div>
                    ))}
                    {selectedClass.homeworks.length === 0 && <p className="text-center text-gray-500 py-4">لا توجد واجبات حالياً.</p>}
                </div>
            </div>
            {isModalOpen && (
                <HomeworkModal
                    homework={editingHomework}
                    onClose={() => { setIsModalOpen(false); setEditingHomework(null); }}
                    onSave={handleSaveHomework}
                    classId={selectedClass.id}
                    subjects={classSubjects}
                />
            )}
        </>
    );
};

const AssignStudentModal: React.FC<{
    selectedClass: SchoolClass,
    initialClasses: SchoolClass[],
    onClose: () => void,
    onAssign: (student: Student) => void
}> = ({ selectedClass, initialClasses, onClose, onAssign }) => {
    const allStudents = useMemo(() => 
        initialClasses.flatMap(c => c.students), 
    [initialClasses]);

    const availableStudents = allStudents.filter(
        s => !selectedClass.students.some(cs => cs.id === s.id)
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">إضافة تلميذ إلى القسم</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500" /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {availableStudents.length > 0 ? (
                        <ul className="space-y-2">
                            {availableStudents.map(student => (
                                <li key={student.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span>{student.name}</span>
                                    <button onClick={() => { onAssign(student); }} className="px-3 py-1 bg-teal-500 text-white text-sm rounded hover:bg-teal-600">إضافة</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-500 py-4">جميع التلاميذ تم تعيينهم في أقسام.</p>
                    )}
                </div>
                 <div className="flex justify-end p-4 bg-gray-50 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إغلاق</button>
                </div>
            </div>
        </div>
    );
};

const QuizzesListModal: React.FC<{
    quizzes: Quiz[],
    onUpdate: (quizzes: Quiz[]) => void,
    onClose: () => void,
    onEditQuiz: (quiz: Quiz) => void,
}> = ({ quizzes, onUpdate, onClose, onEditQuiz }) => {

    const handleAddQuiz = () => {
        const newQuiz: Quiz = {
            id: `quiz-${Date.now()}`,
            title: 'اختبار جديد (بدون عنوان)',
            questions: []
        };
        onEditQuiz(newQuiz);
    };

    const handleDeleteQuiz = (quizId: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الاختبار؟ سيتم حذف جميع أسئلته بشكل نهائي.')) {
            onUpdate(quizzes.filter(q => q.id !== quizId));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">إدارة الاختبارات</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    <div className="flex justify-end mb-4">
                        <button onClick={handleAddQuiz} className="flex items-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600">
                            <PlusCircleIcon className="h-5 w-5 ml-2" /> إضافة اختبار
                        </button>
                    </div>
                    <div className="space-y-3">
                        {quizzes.map(quiz => (
                            <div key={quiz.id} className="bg-gray-50 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{quiz.title}</p>
                                    <p className="text-sm text-gray-600">{quiz.questions.length} أسئلة</p>
                                </div>
                                <div className="flex space-x-2 space-x-reverse">
                                    <button onClick={() => onEditQuiz(quiz)} className="p-2 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-100"><PencilIcon className="h-5 w-5" /></button>
                                    <button onClick={() => handleDeleteQuiz(quiz.id)} className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-100"><TrashIcon className="h-5 w-5" /></button>
                                </div>
                            </div>
                        ))}
                        {quizzes.length === 0 && <p className="text-center text-gray-500 py-4">لا توجد اختبارات. انقر على "إضافة اختبار" للبدء.</p>}
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
    const [localQuiz, setLocalQuiz] = useState<Quiz>(quiz);

    const handleQuizTitleChange = (title: string) => {
        setLocalQuiz(prev => ({ ...prev, title }));
    };

    const handleQuestionChange = (qIndex: number, text: string) => {
        const updatedQuestions = [...localQuiz.questions];
        updatedQuestions[qIndex] = { ...updatedQuestions[qIndex], questionText: text };
        setLocalQuiz(prev => ({ ...prev, questions: updatedQuestions }));
    };

    const handleAddQuestion = () => {
        const newQuestion: QuizQuestion = {
            id: `q-${Date.now()}`,
            questionText: '',
            type: QuestionType.MULTIPLE_CHOICE,
            options: [{ id: `o-${Date.now()}`, text: '', isCorrect: true }]
        };
        setLocalQuiz(prev => ({ ...prev, questions: [...prev.questions, newQuestion] }));
    };
    
    const handleDeleteQuestion = (qIndex: number) => {
        const updatedQuestions = localQuiz.questions.filter((_, index) => index !== qIndex);
        setLocalQuiz(prev => ({...prev, questions: updatedQuestions}));
    };

    const handleAddOption = (qIndex: number) => {
        const updatedQuestions = [...localQuiz.questions];
        const question = updatedQuestions[qIndex];
        if (question.options) {
            question.options.push({ id: `o-${Date.now()}`, text: '', isCorrect: false });
            setLocalQuiz(prev => ({...prev, questions: updatedQuestions}));
        }
    };
    
    const handleOptionChange = (qIndex: number, oIndex: number, text: string) => {
        const updatedQuestions = [...localQuiz.questions];
        const question = updatedQuestions[qIndex];
        if (question.options) {
            question.options[oIndex].text = text;
            setLocalQuiz(prev => ({...prev, questions: updatedQuestions}));
        }
    };

    const handleCorrectOptionChange = (qIndex: number, oIndex: number) => {
        const updatedQuestions = [...localQuiz.questions];
        const question = updatedQuestions[qIndex];
        if (question.options) {
            question.options.forEach((opt, idx) => opt.isCorrect = idx === oIndex);
            setLocalQuiz(prev => ({...prev, questions: updatedQuestions}));
        }
    };
    
    const handleDeleteOption = (qIndex: number, oIndex: number) => {
         const updatedQuestions = [...localQuiz.questions];
        const question = updatedQuestions[qIndex];
        if (question.options && question.options.length > 1) { // must have at least one option
            question.options = question.options.filter((_, idx) => idx !== oIndex);
             if (!question.options.some(o => o.isCorrect)) {
                question.options[0].isCorrect = true;
            }
            setLocalQuiz(prev => ({...prev, questions: updatedQuestions}));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">محرر الاختبار</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto space-y-4">
                    <div>
                        <label className="font-semibold">عنوان الاختبار</label>
                        <input type="text" value={localQuiz.title} onChange={e => handleQuizTitleChange(e.target.value)} className="w-full p-2 border rounded-md" />
                    </div>
                    {localQuiz.questions.map((q, qIndex) => (
                        <div key={q.id} className="p-4 border rounded-lg bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <label className="font-semibold">السؤال {qIndex + 1}</label>
                                <button onClick={() => handleDeleteQuestion(qIndex)} className="p-1 text-red-500 rounded-full hover:bg-red-100"><TrashIcon className="h-5 w-5"/></button>
                            </div>
                            <textarea value={q.questionText} onChange={e => handleQuestionChange(qIndex, e.target.value)} className="w-full p-2 border rounded" rows={2} placeholder="نص السؤال"/>
                            {q.type === QuestionType.MULTIPLE_CHOICE && q.options && (
                                <div className="mt-2 space-y-2">
                                    <p className="text-sm font-medium text-gray-600">الخيارات (حدد الإجابة الصحيحة):</p>
                                    {q.options.map((opt, oIndex) => (
                                        <div key={opt.id} className="flex items-center gap-2">
                                            <input type="radio" name={`correct-${q.id}`} checked={opt.isCorrect} onChange={() => handleCorrectOptionChange(qIndex, oIndex)} className="w-4 h-4 text-teal-600 focus:ring-teal-500"/>
                                            <input type="text" value={opt.text} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} className="flex-grow p-1 border rounded" placeholder={`الخيار ${oIndex + 1}`} />
                                            <button onClick={() => handleDeleteOption(qIndex, oIndex)} className="text-red-500 disabled:opacity-50" disabled={q.options && q.options.length <= 1}><XIcon className="h-4 w-4"/></button>
                                        </div>
                                    ))}
                                    <button onClick={() => handleAddOption(qIndex)} className="text-sm text-teal-600 hover:underline">+ إضافة خيار</button>
                                </div>
                            )}
                             {/* Add UI for other question types here */}
                        </div>
                    ))}
                    <button onClick={handleAddQuestion} className="w-full p-2 border-2 border-dashed rounded-lg text-teal-600 hover:bg-teal-50 transition-colors">+ إضافة سؤال جديد</button>
                </div>
                <div className="flex justify-end space-x-2 space-x-reverse p-4 bg-gray-50 border-t">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                    <button onClick={() => onSave(localQuiz)} className="px-4 py-2 bg-teal-500 text-white rounded-md">حفظ الاختبار</button>
                </div>
            </div>
        </div>
    );
};

const AttendanceView: React.FC<{
    selectedClass: SchoolClass,
    setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>,
    initialClasses: SchoolClass[],
    allUsers: ManagedUser[],
    setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>
}> = ({ selectedClass, setClasses, initialClasses, allUsers, setAllUsers }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
        const updatedClasses = initialClasses.map(c => {
            if (c.id === selectedClass.id) {
                const updatedStudents = c.students.map(s => {
                    if (s.id === studentId) {
                        const existingRecordIndex = s.attendanceRecords.findIndex(r => r.date === selectedDate);
                        let newRecords;
                        if (existingRecordIndex > -1) {
                            newRecords = s.attendanceRecords.map((r, index) => index === existingRecordIndex ? { ...r, status } : r);
                        } else {
                            newRecords = [...s.attendanceRecords, { date: selectedDate, status }];
                        }
                        
                        // Recalculate attendance stats
                        const presentCount = newRecords.filter(r => r.status === AttendanceStatus.PRESENT).length;
                        const absentCount = newRecords.filter(r => r.status === AttendanceStatus.ABSENT).length;

                        return { ...s, attendanceRecords: newRecords, attendance: { present: presentCount, absent: absentCount } };
                    }
                    return s;
                });
                return { ...c, students: updatedStudents };
            }
            return c;
        });
        setClasses(updatedClasses);

        // Notify parent if student is marked absent
        if (status === AttendanceStatus.ABSENT) {
            const student = selectedClass.students.find(s => s.id === studentId);
            if (student && student.parentId) {
                const newNotification: Notification = {
                    id: `notif-${Date.now()}`,
                    message: `تم تسجيل غياب ابنكم ${student.name} اليوم (${selectedDate}).`,
                    date: new Date().toISOString(),
                    read: false,
                };
                setAllUsers(prevUsers => prevUsers.map(u => 
                    u.id === student.parentId
                        ? { ...u, notifications: [newNotification, ...(u.notifications || [])] }
                        : u
                ));
            }
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">سجل الحضور</h3>
                <div className="mt-4 sm:mt-0">
                    <label htmlFor="attendance-date" className="block text-sm font-medium text-gray-700 mb-1">اختر التاريخ:</label>
                    <input
                        type="date"
                        id="attendance-date"
                        value={selectedDate}
                        onChange={e => setSelectedDate(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
                    />
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">اسم التلميذ</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {selectedClass.students.map(student => {
                            const record = student.attendanceRecords.find(r => r.date === selectedDate);
                            const status = record ? record.status : null;
                            const wasPreviouslyAbsent = student.attendanceRecords.some(
                                r => r.date < selectedDate && r.status === AttendanceStatus.ABSENT
                            );
                            return (
                                <tr key={student.id} className={status === AttendanceStatus.ABSENT ? 'bg-red-50' : 'hover:bg-gray-50'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        <div className="flex items-center">
                                            <span>{student.name}</span>
                                            {wasPreviouslyAbsent && (
                                                <div className="group relative flex items-center mr-3">
                                                    <InformationCircleIcon className="h-5 w-5 text-red-500 cursor-pointer" />
                                                    <span className="absolute hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded py-1 px-2 bottom-full mb-1 left-1/2 transform -translate-x-1/2 z-10 shadow-lg">
                                                        لديه غيابات سابقة
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                                        <div className="flex justify-center space-x-2 space-x-reverse">
                                            <button onClick={() => handleStatusChange(student.id, AttendanceStatus.PRESENT)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${status === AttendanceStatus.PRESENT ? 'bg-teal-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>حاضر</button>
                                            <button onClick={() => handleStatusChange(student.id, AttendanceStatus.ABSENT)} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${status === AttendanceStatus.ABSENT ? 'bg-red-500 text-white shadow-sm' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>غائب</button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MaterialsListModal: React.FC<{
    materials: CourseMaterial[],
    onUpdate: (materials: CourseMaterial[]) => void,
    onClose: () => void
}> = ({ materials, onUpdate, onClose }) => {
    const [localMaterials, setLocalMaterials] = useState(materials);
    const [newMaterialName, setNewMaterialName] = useState('');
    const [newMaterialType, setNewMaterialType] = useState<MaterialType>(MaterialType.PDF);

    const handleAddMaterial = () => {
        if (!newMaterialName.trim()) return;
        const newMaterial: CourseMaterial = {
            id: `mat-${Date.now()}`,
            name: newMaterialName.trim(),
            type: newMaterialType,
            url: '#'
        };
        setLocalMaterials(prev => [...prev, newMaterial]);
        setNewMaterialName('');
    };

    const handleDeleteMaterial = (id: string) => {
        setLocalMaterials(prev => prev.filter(m => m.id !== id));
    };

    const handleSaveChanges = () => {
        onUpdate(localMaterials);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">إدارة المواد التعليمية</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6" /></button>
                </div>
                <div className="p-4 overflow-y-auto flex-grow">
                    <div className="space-y-3">
                        {localMaterials.map(material => (
                            <div key={material.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span>{material.name} ({material.type})</span>
                                <button onClick={() => handleDeleteMaterial(material.id)} className="text-red-500 p-1 rounded-full hover:bg-red-100"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-4 border-t bg-gray-50">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newMaterialName}
                            onChange={e => setNewMaterialName(e.target.value)}
                            placeholder="اسم المادة الجديدة"
                            className="flex-grow p-2 border rounded"
                        />
                        <select value={newMaterialType} onChange={e => setNewMaterialType(e.target.value as MaterialType)} className="p-2 border rounded">
                            {Object.values(MaterialType).map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                        <button onClick={handleAddMaterial} className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600">إضافة</button>
                    </div>
                </div>
                <div className="flex justify-end p-4 border-t">
                    <button onClick={handleSaveChanges} className="px-6 py-2 bg-teal-600 text-white rounded hover:bg-teal-700">حفظ التغييرات</button>
                </div>
            </div>
        </div>
    );
};

const ContentManagementView: React.FC<{
    selectedClass: SchoolClass,
    setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>,
    initialClasses: SchoolClass[]
}> = ({ selectedClass, setClasses, initialClasses }) => {
    const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);
    const [isQuizzesModalOpen, setIsQuizzesModalOpen] = useState(false);
    const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);

    const handleUpdateMaterials = (materials: CourseMaterial[]) => {
        const updatedClasses = initialClasses.map(c => 
            c.id === selectedClass.id ? { ...c, materials } : c
        );
        setClasses(updatedClasses);
    };

    const handleUpdateQuizzes = (quizzes: Quiz[]) => {
        const updatedClasses = initialClasses.map(c => 
            c.id === selectedClass.id ? { ...c, quizzes } : c
        );
        setClasses(updatedClasses);
    };

    const handleSaveQuiz = (quiz: Quiz) => {
        const index = selectedClass.quizzes.findIndex(q => q.id === quiz.id);
        let updatedQuizzes;
        if (index > -1) {
            updatedQuizzes = selectedClass.quizzes.map(q => q.id === quiz.id ? quiz : q);
        } else {
            updatedQuizzes = [...selectedClass.quizzes, quiz];
        }
        handleUpdateQuizzes(updatedQuizzes);
        setEditingQuiz(null);
        setIsQuizzesModalOpen(true);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">المواد التعليمية</h3>
                        <button onClick={() => setIsMaterialsModalOpen(true)} className="flex items-center text-sm px-3 py-1.5 bg-teal-50 text-teal-600 rounded-md hover:bg-teal-100">
                            <PencilIcon className="h-4 w-4 ml-2"/> إدارة
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {selectedClass.materials.slice(0, 5).map(material => (
                            <li key={material.id} className="flex items-center text-gray-700">
                                <DocumentTextIcon className="h-5 w-5 ml-3 text-gray-400" /> {material.name}
                            </li>
                        ))}
                        {selectedClass.materials.length === 0 && <p className="text-gray-500">لا توجد مواد.</p>}
                        {selectedClass.materials.length > 5 && <p className="text-gray-500 text-sm mt-2">... والمزيد</p>}
                    </ul>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6">
                     <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold">الاختبارات</h3>
                         <button onClick={() => setIsQuizzesModalOpen(true)} className="flex items-center text-sm px-3 py-1.5 bg-teal-50 text-teal-600 rounded-md hover:bg-teal-100">
                            <PencilIcon className="h-4 w-4 ml-2"/> إدارة
                        </button>
                    </div>
                     <ul className="space-y-2">
                        {selectedClass.quizzes.slice(0, 5).map(quiz => (
                            <li key={quiz.id} className="flex items-center text-gray-700">
                                <QuestionMarkCircleIcon className="h-5 w-5 ml-3 text-gray-400" /> {quiz.title}
                            </li>
                        ))}
                        {selectedClass.quizzes.length === 0 && <p className="text-gray-500">لا توجد اختبارات.</p>}
                        {selectedClass.quizzes.length > 5 && <p className="text-gray-500 text-sm mt-2">... والمزيد</p>}
                    </ul>
                </div>
                {/* We could add Lessons and Exercises management here as well */}
            </div>
            {isMaterialsModalOpen && (
                <MaterialsListModal
                    materials={selectedClass.materials}
                    onUpdate={handleUpdateMaterials}
                    onClose={() => setIsMaterialsModalOpen(false)}
                />
            )}
            {isQuizzesModalOpen && (
                <QuizzesListModal
                    quizzes={selectedClass.quizzes}
                    onUpdate={handleUpdateQuizzes}
                    onClose={() => setIsQuizzesModalOpen(false)}
                    onEditQuiz={(quiz) => {
                        setEditingQuiz(quiz);
                        setIsQuizzesModalOpen(false);
                    }}
                />
            )}
            {editingQuiz && (
                <QuizEditorModal
                    quiz={editingQuiz}
                    onClose={() => {
                        setEditingQuiz(null);
                        setIsQuizzesModalOpen(true);
                    }}
                    onSave={handleSaveQuiz}
                />
            )}
        </>
    );
};

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

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout, initialClasses, allUsers, setAllUsers, setClasses, currentUser, announcements }) => {
  const [selectedClassId, setSelectedClassId] = useState<string | null>(initialClasses[0]?.id || null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isCreateClassModalOpen, setIsCreateClassModalOpen] = useState(false);

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

  const handleCreateClass = (className: string) => {
    if (!className.trim()) return;

    const newClass: SchoolClass = {
        id: `class-${Date.now()}`,
        name: className.trim(),
        students: [],
        materials: [],
        quizzes: [],
        lessons: [],
        exercises: [],
        timetable: [],
        homeworks: [],
    };

    const updatedClasses = [...initialClasses, newClass];
    setClasses(updatedClasses);
    setSelectedClassId(newClass.id); // Select the new class
    setIsCreateClassModalOpen(false);
  };

  return (
    <>
      <div className="flex min-h-screen bg-gray-100" dir="rtl">
        {/* Sidebar */}
        <div className="relative w-64 bg-white shadow-md flex flex-col z-10">
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <PresentationChartBarIcon className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2 ml-3" />
              <div>
                <h2 className="text-lg font-bold text-teal-700">{currentUser.name}</h2>
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
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
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
              <button
                  onClick={() => setIsCreateClassModalOpen(true)}
                  className="flex items-center justify-center w-full p-3 text-teal-600 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors font-semibold"
              >
                  <PlusCircleIcon className="h-6 w-6 ml-2" />
                  <span>إضافة قسم جديد</span>
              </button>
            </div>
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
                  announcements={announcements}
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                    <UsersIcon className="h-24 w-24 text-gray-300 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-700">مرحباً في لوحة تحكم الأستاذ</h2>
                    <p className="text-lg text-gray-500 mt-2">اختر قسماً من القائمة للبدء، أو قم بإنشاء قسم جديد.</p>
                </div>
            )}
        </main>
      </div>
       {isCreateClassModalOpen && (
          <CreateClassModal
              onClose={() => setIsCreateClassModalOpen(false)}
              onCreate={handleCreateClass}
          />
      )}
    </>
  );
};

const AllAnnouncementsModal: React.FC<{ announcements: Announcement[], onClose: () => void }> = ({ announcements, onClose }) => {
    const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">جميع إعلانات المؤسسة</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500" /></button>
                </div>
                <div className="p-6 overflow-y-auto space-y-6">
                    {sortedAnnouncements.map(ann => (
                        <div key={ann.id} className="bg-gray-50 p-4 rounded-lg border-r-4 border-teal-500">
                             <h4 className="font-bold text-lg text-gray-800">{ann.title}</h4>
                             <p className="text-xs text-gray-400 mt-1 mb-2">{new Date(ann.date).toLocaleString('ar-MA')}</p>
                             <p className="text-gray-700 whitespace-pre-line">{ann.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const AnnouncementsComponent: React.FC<{ announcements: Announcement[], onShowAll: () => void }> = ({ announcements, onShowAll }) => {
    if (!announcements || announcements.length === 0) {
        return null;
    }

    const latestAnnouncements = [...announcements]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);

    return (
        <div className="mb-6 p-6 bg-teal-50 border-l-4 border-teal-400 rounded-r-lg">
            <h3 className="text-xl font-bold text-teal-800 mb-4 flex items-center">
                <InformationCircleIcon className="h-6 w-6 ml-3 text-teal-500" />
                أحدث الإعلانات
            </h3>
            <div className="space-y-4">
                {latestAnnouncements.map(ann => (
                    <div key={ann.id} className="border-b border-teal-200 pb-3 last:border-b-0 last:pb-0">
                        <h4 className="font-semibold text-gray-800">{ann.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                    </div>
                ))}
            </div>
            <div className="mt-4 text-left">
                <button onClick={onShowAll} className="text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors">
                    عرض جميع الإعلانات &rarr;
                </button>
            </div>
        </div>
    );
};


const ClassDashboard: React.FC<{
    selectedClass: SchoolClass, 
    allUsers: ManagedUser[], 
    setAllUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>,
    initialClasses: SchoolClass[],
    setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>,
    announcements: Announcement[],
}> = ({ selectedClass, allUsers, setAllUsers, initialClasses, setClasses, announcements }) => {
    const [activeView, setActiveView] = useState<ClassView>('students');
    const [isAllAnnouncementsModalOpen, setIsAllAnnouncementsModalOpen] = useState(false);

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
            case 'homework':
                return <HomeworkManagementView selectedClass={selectedClass} initialClasses={initialClasses} setClasses={setClasses} allUsers={allUsers} setAllUsers={setAllUsers} />
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
            <AnnouncementsComponent announcements={announcements} onShowAll={() => setIsAllAnnouncementsModalOpen(true)} />
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{selectedClass.name}</h1>
                    <p className="text-gray-500">{selectedClass.students.length} تلميذ</p>
                </div>
            </header>
            <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-2 space-x-reverse" >
                    <NavTab view="students" label="التلاميذ" Icon={UsersIcon} />
                    <NavTab view="content" label="المحتوى" Icon={BookOpenIcon} />
                    <NavTab view="homework" label="الواجبات" Icon={ClipboardListIcon} />
                    <NavTab view="attendance" label="سجل الحضور" Icon={CheckBadgeIcon} />
                    <NavTab view="grades" label="ملخص النقط" Icon={ChartBarIcon} />
                    <NavTab view="progress" label="ملخص التقدم" Icon={PresentationChartBarIcon} />
                </nav>
            </div>
            {renderView()}
            {isAllAnnouncementsModalOpen && (
                <AllAnnouncementsModal
                    announcements={announcements}
                    onClose={() => setIsAllAnnouncementsModalOpen(false)}
                />
            )}
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
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSelectStudent = (student: Student) => {
        setSelectedStudent(student);
        setIsProfileModalOpen(true);
    };

    const handleCloseProfileModal = () => {
        setIsProfileModalOpen(false);
        setSelectedStudent(null);
    };
    
    const handleAssignStudent = (studentToAssign: Student) => {
        const updatedClasses = initialClasses.map(c => {
            if (c.id === selectedClass.id) {
                // Check if student is not already in the class
                if (!c.students.some(s => s.id === studentToAssign.id)) {
                    return { ...c, students: [...c.students, studentToAssign] };
                }
            }
            return c;
        });
        setClasses(updatedClasses);
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
            <div className="bg-white rounded-xl shadow-md p-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                     <div className="relative flex-grow w-full sm:w-auto">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
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
                     <button 
                        onClick={() => setIsAssignModalOpen(true)}
                        className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
                    >
                        <PlusCircleIcon className="h-5 w-5 ml-2" />
                        إضافة تلميذ
                    </button>
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
                                    <tr key={student.id} className="hover:bg-gray-50">
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
                                        { selectedClass.students.length === 0 ? "لا يوجد تلاميذ في هذا القسم. قم بإضافة تلميذ." : "لا يوجد تلاميذ يطابقون بحثك."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isProfileModalOpen && selectedStudent && (
                <StudentProfileModal 
                    student={selectedStudent} 
                    onClose={handleCloseProfileModal} 
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
            {isAssignModalOpen && (
                <AssignStudentModal
                    selectedClass={selectedClass}
                    initialClasses={initialClasses}
                    onClose={() => setIsAssignModalOpen(false)}
                    onAssign={handleAssignStudent}
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in p-4">
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
{/* Observations Section */}
                        <div>
                           <h4 className="text-lg font-semibold text-gray-700 mb-2">الملاحظات الصفية</h4>
                           <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                               {localStudent.observations.map(obs => (
                                   <div key={obs.id} className="text-sm p-2 bg-white rounded border">
                                       <p>{obs.text}</p>
                                       <p className="text-xs text-gray-400 text-left">{new Date(obs.date).toLocaleDateString('ar-MA')}</p>
                                   </div>
                               ))}
                           </div>
                           <div className="flex mt-2">
                               <input type="text" value={newObservationText} onChange={e => setNewObservationText(e.target.value)} placeholder="إضافة ملاحظة جديدة..." className="flex-grow p-2 border rounded-r-md" />
                               <button onClick={() => handleAddNote('observation')} className="px-4 bg-teal-500 text-white rounded-l-md">إضافة</button>
                           </div>
                        </div>

                        {/* Notes Section */}
                        <div>
                           <h4 className="text-lg font-semibold text-gray-700 mb-2">ملاحظات عامة</h4>
                           <div className="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg">
                               {localStudent.notes.map(note => (
                                   <div key={note.id} className="text-sm p-2 bg-white rounded border">
                                       <p>{note.text}</p>
                                       <p className="text-xs text-gray-400 text-left">{new Date(note.date).toLocaleDateString('ar-MA')}</p>
                                   </div>
                               ))}
                           </div>
                           <div className="flex mt-2">
                               <input type="text" value={newNoteText} onChange={e => setNewNoteText(e.target.value)} placeholder="إضافة ملاحظة جديدة..." className="flex-grow p-2 border rounded-r-md" />
                               <button onClick={() => handleAddNote('note')} className="px-4 bg-teal-500 text-white rounded-l-md">إضافة</button>
                           </div>
                        </div>

                        {/* Custom Fields Section */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-700 mb-2">معلومات إضافية</h4>
                            <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                                {localStudent.customFields.map(field => (
                                    <div key={field.id} className="flex items-center gap-2">
                                        <label className="w-1/3 text-sm font-medium text-gray-600">{field.label}:</label>
                                        <input type="text" value={field.value} onChange={e => handleCustomFieldChange(field.id, e.target.value)} className="flex-grow p-1 border rounded" />
                                        <button onClick={() => handleDeleteCustomField(field.id)}><TrashIcon className="h-4 w-4 text-red-400 hover:text-red-600" /></button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2 pt-2 border-t">
                                    <input type="text" value={newFieldLabel} onChange={e => setNewFieldLabel(e.target.value)} placeholder="عنوان الحقل" className="w-1/3 p-1 border rounded" />
                                    <input type="text" value={newFieldValue} onChange={e => setNewFieldValue(e.target.value)} placeholder="القيمة" className="flex-grow p-1 border rounded" />
                                    <button onClick={handleAddCustomField} className="px-3 py-1 bg-teal-500 text-white text-sm rounded">إضافة</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t mt-4">
                        <button onClick={handleSaveChanges} className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600">
                            حفظ التغييرات
                        </button>
                    </div>
                </div>
            </div>
            {isMessageModalOpen && parent && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[60]">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">إرسال رسالة إلى ولي الأمر</h3>
                        <textarea value={messageText} onChange={e => setMessageText(e.target.value)} rows={5} className="w-full p-2 border rounded" placeholder="اكتب رسالتك هنا..."></textarea>
                        <div className="flex justify-end space-x-2 space-x-reverse mt-4">
                            <button onClick={() => setIsMessageModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded">إلغاء</button>
                            <button onClick={handleSendMessage} className="px-4 py-2 bg-teal-500 text-white rounded">إرسال</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default TeacherDashboard;
