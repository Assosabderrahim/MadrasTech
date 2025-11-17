// FIX: Removed file content delimiters (e.g., --- START OF FILE ---) that were causing compilation errors.
import React, { useState, useMemo } from 'react';
import { LogoutIcon, UserIcon, ChartBarIcon, ClipboardListIcon, PencilIcon, BellIcon, EnvelopeIcon, XIcon, LoadingSpinnerIcon, ClockIcon, InformationCircleIcon } from './icons';
import { Student, ManagedUser, UserRole, Notification, SchoolClass, Announcement } from '../types';

interface DashboardProps {
  onLogout: () => void;
  parentUser: ManagedUser;
  allUsers: ManagedUser[];
  setUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
  classes: SchoolClass[];
  announcements: Announcement[];
}

const MessagingModal: React.FC<{
    onClose: () => void;
    parentUser: ManagedUser;
    studentName: string;
    allUsers: ManagedUser[];
    setUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
}> = ({ onClose, parentUser, studentName, allUsers, setUsers }) => {
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipient || !subject.trim() || !body.trim()) {
            alert('الرجاء ملء جميع الحقول.');
            return;
        }

        setIsSending(true);
        setTimeout(() => {
            const targetRole = recipient === 'teacher' ? UserRole.TEACHER : UserRole.ADMIN;
            const targetUser = allUsers.find(u => u.role === targetRole);

            if (targetUser) {
                const newNotification: Notification = {
                    id: `notif-${Date.now()}`,
                    message: `رسالة من ولي الأمر ${parentUser.name} (ولي أمر ${studentName}): "${subject}"`,
                    date: new Date().toISOString(),
                    read: false,
                };

                setUsers(prevUsers => prevUsers.map(u =>
                    u.id === targetUser.id
                        ? { ...u, notifications: [newNotification, ...(u.notifications || [])] }
                        : u
                ));

                alert('تم إرسال رسالتك بنجاح!');
                onClose();
            } else {
                alert('عذراً، لم يتم العثور على مستلم. يرجى المحاولة مرة أخرى.');
            }
            setIsSending(false);
        }, 1000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">إرسال رسالة جديدة</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">إلى</label>
                            <select value={recipient} onChange={e => setRecipient(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required>
                                <option value="" disabled>اختر مستلماً</option>
                                <option value="teacher">الأستاذ(ة)</option>
                                <option value="admin">الإدارة</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الموضوع</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">الرسالة</label>
                            <textarea value={body} onChange={e => setBody(e.target.value)} rows={5} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 p-4 bg-gray-50 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md" disabled={isSending}>إلغاء</button>
                        <button type="submit" className="flex justify-center items-center w-28 px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:bg-amber-300" disabled={isSending}>
                            {isSending ? <LoadingSpinnerIcon className="w-5 h-5 animate-spin" /> : 'إرسال'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AnnouncementsComponent: React.FC<{ announcements: Announcement[] }> = ({ announcements }) => {
    if (!announcements || announcements.length === 0) return null;
    const latestAnnouncements = [...announcements]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 2);

    return (
        <div className="mb-8 p-6 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
            <h3 className="text-xl font-bold text-amber-800 mb-4 flex items-center">
                <InformationCircleIcon className="h-6 w-6 ml-3 text-amber-500" />
                أحدث إعلانات المؤسسة
            </h3>
            <div className="space-y-4">
                {latestAnnouncements.map(ann => (
                    <div key={ann.id} className="border-b border-amber-200 pb-3 last:border-b-0 last:pb-0">
                        <h4 className="font-semibold text-gray-800">{ann.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{ann.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ParentDashboard: React.FC<DashboardProps> = ({ onLogout, parentUser, allUsers, setUsers, classes, announcements }) => {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);

    const { student, studentClass } = useMemo(() => {
        const childId = parentUser.childIds?.[0];
        if (!childId) return { student: null, studentClass: null };

        let foundStudent: Student | null = null;
        let foundClass: SchoolClass | null = null;

        for (const schoolClass of classes) {
            const s = schoolClass.students.find(s => s.id === childId);
            if (s) {
                foundStudent = s;
                foundClass = schoolClass;
                break;
            }
        }
        return { student: foundStudent, studentClass: foundClass };
    }, [parentUser, classes]);
    
    const attendanceTotal = student ? student.attendance.present + student.attendance.absent : 0;
    const attendancePercentage = attendanceTotal > 0 && student ? Math.round((student.attendance.present / attendanceTotal) * 100) : 0;
    const maxGrade = 20;

    const unreadCount = parentUser.notifications?.filter(n => !n.read).length || 0;

    const handleToggleNotifications = () => {
        setNotificationsOpen(prev => !prev);
        if (!notificationsOpen && unreadCount > 0) {
            // Mark all as read when opening
            setUsers(prevUsers => 
                prevUsers.map(u => 
                    u.id === parentUser.id 
                        ? { ...u, notifications: u.notifications?.map(n => ({...n, read: true})) || [] }
                        : u
                )
            );
        }
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

    if (!student || !studentClass) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100">
                <div className="text-center">
                    <p className="text-xl text-gray-600">لم يتم العثور على بيانات التلميذ.</p>
                    <button onClick={onLogout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg">تسجيل الخروج</button>
                </div>
            </div>
        );
    }
    
    const timetable = studentClass.timetable;
    const daysOfWeek = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const timeSlots = Array.from(new Set(timetable.map(t => t.timeSlot))).sort();
    const timetableMap = new Map<string, string>();
    timetable.forEach(t => {
        timetableMap.set(`${t.day}-${t.timeSlot}`, t.subject);
    });

  return (
    <>
        <div className="p-8" dir="rtl">
          <header className="flex justify-between items-center mb-8 border-b pb-4">
            <div>
              <h1 className="text-4xl font-bold text-amber-700">واجهة ولي الأمر</h1>
              <p className="text-lg text-gray-500">مرحباً بك في لوحة متابعة الأبناء</p>
            </div>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button onClick={handleToggleNotifications} className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none">
                        <BellIcon className="h-7 w-7" />
                        {unreadCount > 0 && (
                            <span className="absolute top-0 right-0 block h-4 w-4 transform -translate-y-1/2 translate-x-1/2 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>
                    {notificationsOpen && (
                        <div className="absolute top-full mt-2 right-0 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border z-20 animate-fade-in">
                           <div className="p-3 font-bold text-gray-700 border-b">الإشعارات</div>
                            {parentUser.notifications && parentUser.notifications.length > 0 ? (
                                <ul>
                                    {parentUser.notifications.map(notif => (
                                        <li key={notif.id} className="border-b p-3 hover:bg-gray-50">
                                            <p className="text-sm text-gray-800">{notif.message}</p>
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
                <button onClick={onLogout} className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                  <LogoutIcon className="h-5 w-5 ml-2" />
                  <span>تسجيل الخروج</span>
                </button>
            </div>
          </header>
          <main className="animate-fade-in">
            <AnnouncementsComponent announcements={announcements} />
             <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-8 border-b pb-6">
                    <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mr-6">
                        <UserIcon className="h-10 w-10 text-amber-600"/>
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-gray-800">{student.name}</h2>
                        <p className="text-gray-500 text-lg">متابعة الأداء الدراسي والسلوك</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Performance */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center"><ChartBarIcon className="h-6 w-6 ml-3 text-amber-500" /> ملخص الأداء الدراسي</h3>
                            <div className="space-y-4">
                                {student.grades.map(grade => (
                                    <div key={grade.subject}>
                                        <div className="flex justify-between items-center mb-1">
                                            <p className="font-semibold text-gray-600">{grade.subject}</p>
                                            <p className="font-bold text-amber-600">{grade.grade}/{maxGrade}</p>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4">
                                            <div className="bg-amber-500 h-4 rounded-full" style={{ width: `${(grade.grade / maxGrade) * 100}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                         <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
                                <ClockIcon className="h-6 w-6 ml-3 text-amber-500" /> استعمال الزمن الأسبوعي
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse text-center">
                                    <thead>
                                        <tr className="bg-amber-100">
                                            <th className="p-3 font-semibold text-sm text-amber-800 border border-amber-200">الوقت</th>
                                            {daysOfWeek.map(day => (
                                                <th key={day} className="p-3 font-semibold text-sm text-amber-800 border border-amber-200">{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {timeSlots.map(slot => (
                                            <tr key={slot}>
                                                <td className="p-3 font-semibold text-sm text-gray-700 bg-gray-100 border border-gray-200">{slot}</td>
                                                {daysOfWeek.map(day => {
                                                    const subject = timetableMap.get(`${day}-${slot}`);
                                                    return (
                                                        <td key={day} className="p-3 text-sm text-gray-800 border border-gray-200 whitespace-nowrap">
                                                            {subject ? (
                                                                <span className="bg-amber-50 text-amber-700 font-medium py-1 px-3 rounded-full">{subject}</span>
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

                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center"><PencilIcon className="h-6 w-6 ml-3 text-amber-500" /> ملاحظات الأساتذة</h3>
                            <div className="space-y-3">
                                {student.notes.length > 0 ? student.notes.map((note) => (
                                    <p key={note.id} className="bg-white p-3 rounded text-gray-600 border-r-4 border-amber-200">{note.text}</p>
                                )) : <p className="text-gray-500">لا توجد ملاحظات.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Attendance & Activities */}
                    <div className="space-y-8">
                        <div className="p-6 bg-gray-50 rounded-lg text-center">
                            <h3 className="text-2xl font-bold text-gray-700 mb-4 flex items-center justify-center"><ClipboardListIcon className="h-6 w-6 ml-3 text-amber-500" /> سجل الحضور</h3>
                            <p className="text-5xl font-extrabold text-amber-600">{attendancePercentage}%</p>
                            <p className="text-gray-500">{student.attendance.present} يوم حضور / {student.attendance.absent} أيام غياب</p>
                        </div>
                        <div className="p-6 bg-gray-50 rounded-lg">
                            <h3 className="text-2xl font-bold text-gray-700 mb-4">الأنشطة المدرسية</h3>
                            <ul className="list-disc list-inside space-y-2 text-gray-600">
                                {student.activities.length > 0 ? student.activities.map((activity, index) => (
                                    <li key={index}>{activity}</li>
                                )) : <li>لم يشارك في أي نشاط.</li>}
                            </ul>
                        </div>
                        <div className="p-6 bg-amber-50 rounded-lg text-center border-2 border-dashed border-amber-300">
                            <h3 className="text-xl font-bold text-gray-700 mb-3 flex items-center justify-center"><EnvelopeIcon className="h-6 w-6 ml-3 text-amber-500" /> تواصل مع المدرسة</h3>
                            <p className="text-gray-600 mb-4 text-sm">هل لديك سؤال أو استفسار؟ تواصل مع الإدارة أو الأساتذة مباشرة.</p>
                            <button onClick={() => setIsMessagingModalOpen(true)} className="w-full px-4 py-2 bg-amber-500 text-white font-semibold rounded-lg hover:bg-amber-600 transition-colors">
                                إرسال رسالة
                            </button>
                        </div>
                    </div>
                </div>
            </div>
          </main>
        </div>
        {isMessagingModalOpen && (
            <MessagingModal
                onClose={() => setIsMessagingModalOpen(false)}
                parentUser={parentUser}
                studentName={student.name}
                allUsers={allUsers}
                setUsers={setUsers}
            />
        )}
    </>
  );
};

export default ParentDashboard;