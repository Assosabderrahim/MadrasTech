



import React, { useState } from 'react';
import { 
    LogoutIcon, 
    UserIcon, 
    UsersIcon, 
    PencilIcon, 
    TrashIcon, 
    PlusCircleIcon, 
    XIcon, 
    ChartPieIcon, 
    GraduationCapIcon, 
    PresentationChartBarIcon, 
    BellIcon,
    CogIcon,
    ShieldCheckIcon,
    LoadingSpinnerIcon,
    ClockIcon,
    ClipboardListIcon,
    SparklesIcon,
} from './icons';
import { ManagedUser, UserRole, SchoolStats, SystemConfig, SchoolClass, TimetableEntry, AuditLog, AuditLogAction, Announcement } from '../types';
import { analyzeSchoolPerformance } from '../services/geminiService';

interface DashboardProps {
  onLogout: () => void;
  initialUsers: ManagedUser[];
  setUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
  currentUser: ManagedUser;
  initialClasses: SchoolClass[];
  setClasses: React.Dispatch<React.SetStateAction<SchoolClass[]>>;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}

// Mock data for admin dashboard
const mockStats: SchoolStats = {
    totalStudents: 1250,
    totalTeachers: 80,
    totalParents: 980,
    totalClasses: 45,
};

const mockConfig: SystemConfig = {
    schoolName: "ثانوية الاطلس الاعدادية",
    academicYear: "2025-2026",
    parentPortalEnabled: true,
    maintenanceMode: false,
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

type AdminView = 'dashboard' | 'users' | 'config' | 'timetables' | 'history' | 'announcements';

const AdminDashboard: React.FC<DashboardProps> = ({ onLogout, initialUsers, setUsers, currentUser, initialClasses, setClasses, auditLogs, setAuditLogs, announcements, setAnnouncements }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [users, localSetUsers] = useState<ManagedUser[]>(initialUsers);
    const [stats, setStats] = useState<SchoolStats>(mockStats);
    const [config, setConfig] = useState<SystemConfig>(mockConfig);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [analysisError, setAnalysisError] = useState<string | null>(null);

    const handleAnalysisRequest = async () => {
        setIsAnalyzing(true);
        setAnalysisResult(null);
        setAnalysisError(null);
        try {
            const result = await analyzeSchoolPerformance(initialClasses);
            setAnalysisResult(result);
        } catch (error) {
            console.error(error);
            setAnalysisError("حدث خطأ غير متوقع أثناء التحليل.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const unreadCount = currentUser.notifications?.filter(n => !n.read).length || 0;

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

    React.useEffect(() => {
        localSetUsers(initialUsers);
    }, [initialUsers]);

    const openModal = (user: ManagedUser | null = null) => {
        setEditingUser(user ? { ...user } : { id: '', name: '', email: '', role: UserRole.STUDENT, createdAt: new Date().toISOString().split('T')[0] });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = (userToSave: ManagedUser) => {
        let updatedUsers;
        const originalUser = users.find(u => u.id === userToSave.id);

        if (originalUser) { // Editing existing user
            updatedUsers = users.map(u => u.id === userToSave.id ? userToSave : u);
            
            const changes: string[] = [];
            if (originalUser.name !== userToSave.name) changes.push(`تم تغيير الاسم من "${originalUser.name}" إلى "${userToSave.name}".`);
            if (originalUser.email !== userToSave.email) changes.push(`تم تغيير البريد الإلكتروني.`);
            if (originalUser.role !== userToSave.role) changes.push(`تم تغيير الدور من "${originalUser.role}" إلى "${userToSave.role}".`);
            
            if (changes.length > 0) {
                const newLog: AuditLog = {
                    id: `log-${Date.now()}`, timestamp: new Date().toISOString(), adminId: currentUser.id, adminName: currentUser.name,
                    action: AuditLogAction.USER_UPDATED, targetUserId: userToSave.id, targetUserName: userToSave.name, details: changes.join(' ')
                };
                setAuditLogs(prev => [newLog, ...prev]);
            }

        } else { // Adding new user
            const newUserId = `user-${Date.now()}`;
            updatedUsers = [...users, { ...userToSave, id: newUserId }];
            const newLog: AuditLog = {
                id: `log-${Date.now()}`, timestamp: new Date().toISOString(), adminId: currentUser.id, adminName: currentUser.name,
                action: AuditLogAction.USER_CREATED, targetUserId: newUserId, targetUserName: userToSave.name, details: `تم إنشاء المستخدم بالدور: ${userToSave.role}.`
            };
            setAuditLogs(prev => [newLog, ...prev]);
        }
        
        localSetUsers(updatedUsers);
        setUsers(updatedUsers);
        closeModal();
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            const userToDelete = users.find(u => u.id === userId);
            if (userToDelete) {
                const newLog: AuditLog = {
                    id: `log-${Date.now()}`, timestamp: new Date().toISOString(), adminId: currentUser.id, adminName: currentUser.name,
                    action: AuditLogAction.USER_DELETED, targetUserId: userToDelete.id, targetUserName: userToDelete.name, details: `تم حذف المستخدم "${userToDelete.name}".`
                };
                setAuditLogs(prev => [newLog, ...prev]);
            }
            const updatedUsers = users.filter(u => u.id !== userId);
            localSetUsers(updatedUsers);
            setUsers(updatedUsers);
        }
    };
    
    const renderView = () => {
        switch (activeView) {
            case 'users':
                return (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">إدارة المستخدمين</h2>
                            <button onClick={() => openModal()} className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                                <PlusCircleIcon className="h-5 w-5 ml-2" /> إضافة مستخدم
                            </button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">البريد الإلكتروني</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الدور</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإنشاء</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">إجراءات</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString('ar-MA')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                                                <button onClick={() => openModal(user)} className="text-indigo-600 hover:text-indigo-900 ml-4"><PencilIcon className="h-5 w-5" /></button>
                                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900"><TrashIcon className="h-5 w-5" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'config':
                return (
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h2 className="text-2xl font-bold mb-4">إعدادات النظام</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">اسم المدرسة</label>
                                <input type="text" value={config.schoolName} onChange={e => setConfig(c => ({...c, schoolName: e.target.value}))} className="mt-1 w-full p-2 border rounded-md"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">السنة الدراسية</label>
                                <input type="text" value={config.academicYear} onChange={e => setConfig(c => ({...c, academicYear: e.target.value}))} className="mt-1 w-full p-2 border rounded-md"/>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" checked={config.parentPortalEnabled} onChange={e => setConfig(c => ({...c, parentPortalEnabled: e.target.checked}))} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                                <label className="mr-2 text-sm text-gray-900">تفعيل بوابة أولياء الأمور</label>
                            </div>
                            <div className="flex items-center">
                                <input type="checkbox" checked={config.maintenanceMode} onChange={e => setConfig(c => ({...c, maintenanceMode: e.target.checked}))} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                                <label className="mr-2 text-sm text-gray-900">تفعيل وضع الصيانة</label>
                            </div>
                            <div className="pt-4 flex justify-end">
                                <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">حفظ الإعدادات</button>
                            </div>
                        </div>
                    </div>
                );
            case 'timetables':
                return <TimetablesView allClasses={initialClasses} allUsers={users} />;
            case 'history':
                return <AuditLogView logs={auditLogs} />;
            case 'announcements':
                return <AnnouncementsManagementView announcements={announcements} setAnnouncements={setAnnouncements} />;
            case 'dashboard':
            default:
                return (
                    <div className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon={<GraduationCapIcon className="h-8 w-8 text-white"/>} title="الطلاب" value={stats.totalStudents} color="bg-blue-500" />
                            <StatCard icon={<PresentationChartBarIcon className="h-8 w-8 text-white"/>} title="الأساتذة" value={stats.totalTeachers} color="bg-teal-500" />
                            <StatCard icon={<UsersIcon className="h-8 w-8 text-white"/>} title="أولياء الأمور" value={stats.totalParents} color="bg-amber-500" />
                            <StatCard icon={<ChartPieIcon className="h-8 w-8 text-white"/>} title="الأقسام" value={stats.totalClasses} color="bg-indigo-500" />
                        </div>
                        <AdminAssistant
                            onAnalyze={handleAnalysisRequest}
                            isAnalyzing={isAnalyzing}
                            result={analysisResult}
                            error={analysisError}
                        />
                    </div>
                );
        }
    };

    const NavLink: React.FC<{ view: AdminView, label: string, Icon: React.FC<any> }> = ({ view, label, Icon }) => (
        <a href="#" onClick={e => {e.preventDefault(); setActiveView(view)}}
            className={`flex items-center p-3 rounded-lg transition-colors ${activeView === view ? 'bg-indigo-100 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Icon className={`h-6 w-6 ml-3 ${activeView === view ? 'text-indigo-600' : ''}`} />
            <span>{label}</span>
        </a>
    );

    return (
        <>
            <div className="flex min-h-screen bg-gray-100" dir="rtl">
                {/* Sidebar */}
                <div className="relative w-64 bg-white shadow-md flex flex-col z-10">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center">
                            <ShieldCheckIcon className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2 ml-3" />
                            <div>
                                <h2 className="text-lg font-bold text-indigo-700">{currentUser.name}</h2>
                                <p className="text-sm text-gray-500">لوحة التحكم</p>
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
                        <NavLink view="dashboard" label="لوحة المعلومات" Icon={ChartPieIcon} />
                        <NavLink view="users" label="إدارة المستخدمين" Icon={UsersIcon} />
                        <NavLink view="timetables" label="استعمال الزمن" Icon={ClockIcon} />
                        <NavLink view="announcements" label="النشرة الإخبارية" Icon={ClipboardListIcon} />
                        <NavLink view="history" label="سجل التغييرات" Icon={ClockIcon} />
                        <NavLink view="config" label="إعدادات النظام" Icon={CogIcon} />
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
                    {renderView()}
                </main>
            </div>
            {isModalOpen && (
                <UserEditModal 
                    user={editingUser} 
                    onClose={closeModal} 
                    onSave={handleSaveUser} 
                />
            )}
        </>
    );
};

const StatCard: React.FC<{icon: React.ReactNode, title: string, value: number, color: string}> = ({ icon, title, value, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
        <div className={`p-4 rounded-full ${color} ml-4`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const AdminAssistant: React.FC<{
    onAnalyze: () => void;
    isAnalyzing: boolean;
    result: string | null;
    error: string | null;
}> = ({ onAnalyze, isAnalyzing, result, error }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
                <SparklesIcon className="h-8 w-8 text-indigo-500" />
                <h2 className="text-2xl font-bold text-gray-800 mr-3">مساعد المدير الذكي</h2>
            </div>
            
            {isAnalyzing ? (
                <div className="flex flex-col items-center justify-center p-8">
                    <LoadingSpinnerIcon className="w-12 h-12 text-indigo-500 animate-spin" />
                    <p className="mt-4 text-gray-600">...جاري تحليل بيانات المدرسة وتقديم التوصيات</p>
                </div>
            ) : error ? (
                <div className="text-center p-8">
                    <p className="text-red-600">{error}</p>
                    <button onClick={onAnalyze} className="mt-4 flex items-center mx-auto px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                        حاول مرة أخرى
                    </button>
                </div>
            ) : result ? (
                <div className="space-y-4">
                     <div className="p-4 bg-indigo-50 rounded-lg text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
                        {result}
                     </div>
                     <button onClick={onAnalyze} className="mt-4 flex items-center mx-auto px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
                        إعادة التحليل
                    </button>
                </div>
            ) : (
                <>
                    <p className="text-gray-600 mb-6">
                        احصل على تحليل فوري لأداء التلاميذ، نسبة الحضور، مع توصيات عملية لتحسين إدارة المدرسة.
                    </p>
                    <div className="text-center">
                        <button onClick={onAnalyze} className="flex items-center mx-auto px-8 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-600 transition-all transform hover:scale-105">
                            <SparklesIcon className="h-6 w-6 ml-3" />
                            تحليل الأداء العام
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

const UserEditModal: React.FC<{
    user: ManagedUser | null,
    onClose: () => void,
    onSave: (user: ManagedUser) => void
}> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState(user);
    const [isSaving, setIsSaving] = useState(false);

    if (!formData) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            setIsSaving(true);
            // Simulate API call
            setTimeout(() => {
                onSave(formData);
                // No need to set isSaving back to false, as the modal will close
            }, 1000);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">{formData.id ? 'تعديل المستخدم' : 'إضافة مستخدم جديد'}</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">الاسم الكامل</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">البريد الإلكتروني</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">الدور</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded-md" required>
                            {Object.values(UserRole).filter(r => r !== UserRole.NONE).map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md" disabled={isSaving}>إلغاء</button>
                        <button 
                            type="submit" 
                            className="flex justify-center items-center w-24 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 disabled:bg-indigo-300"
                            disabled={isSaving}
                        >
                            {isSaving ? <LoadingSpinnerIcon className="w-5 h-5 animate-spin" /> : 'حفظ'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const TimetablesView: React.FC<{ allClasses: SchoolClass[]; allUsers: ManagedUser[] }> = ({ allClasses, allUsers }) => {
    const [viewMode, setViewMode] = useState<'classes' | 'teachers'>('classes');
    const [selectedClassId, setSelectedClassId] = useState<string>(allClasses[0]?.id || '');
    const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

    const teachers = allUsers.filter(u => u.role === UserRole.TEACHER);

    const selectedClass = allClasses.find(c => c.id === selectedClassId);
    const selectedTeacher = teachers.find(t => t.id === selectedTeacherId);

    // Set a default teacher when switching to teacher view if none is selected
    React.useEffect(() => {
        if (viewMode === 'teachers' && !selectedTeacherId && teachers.length > 0) {
            setSelectedTeacherId(teachers[0].id);
        }
    }, [viewMode, teachers, selectedTeacherId]);

    const timetableData = viewMode === 'classes' ? selectedClass?.timetable : selectedTeacher?.timetable;
    const timetableTitle = viewMode === 'classes' ? `استعمال الزمن للقسم: ${selectedClass?.name || ''}` : `استعمال الزمن للأستاذ: ${selectedTeacher?.name || ''}`;

    const daysOfWeek = ['الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const timeSlots = Array.from(new Set(timetableData?.map(t => t.timeSlot) || [])).sort();
    
    const timetableMap = new Map<string, TimetableEntry>();
    timetableData?.forEach(t => {
        timetableMap.set(`${t.day}-${t.timeSlot}`, t);
    });

    return (
        <div className="bg-white p-6 rounded-xl shadow-md animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-800">استعمال الزمن</h2>
                <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg mt-4 sm:mt-0" dir="ltr">
                    <button onClick={() => setViewMode('classes')} className={`px-4 py-1 rounded-md text-sm font-semibold transition-all ${viewMode === 'classes' ? 'bg-white shadow' : 'text-gray-600'}`}>الأقسام</button>
                    <button onClick={() => setViewMode('teachers')} className={`px-4 py-1 rounded-md text-sm font-semibold transition-all ${viewMode === 'teachers' ? 'bg-white shadow' : 'text-gray-600'}`}>الأساتذة</button>
                </div>
            </div>
            
            {viewMode === 'classes' ? (
                <div className="mb-4">
                    <label htmlFor="class-select" className="block text-sm font-medium text-gray-700 mb-1">اختر القسم</label>
                    <select id="class-select" value={selectedClassId} onChange={e => setSelectedClassId(e.target.value)} className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        {allClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            ) : (
                <div className="mb-4">
                    <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700 mb-1">اختر الأستاذ</label>
                    <select id="teacher-select" value={selectedTeacherId} onChange={e => setSelectedTeacherId(e.target.value)} className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500">
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
            )}

            {timetableData && timetableData.length > 0 ? (
                 <div className="overflow-x-auto">
                    <h3 className="text-xl font-bold text-gray-700 mb-4">{timetableTitle}</h3>
                    <table className="min-w-full border-collapse text-center">
                        <thead>
                            <tr className="bg-indigo-100">
                                <th className="p-3 font-semibold text-sm text-indigo-800 border border-indigo-200">الوقت</th>
                                {daysOfWeek.map(day => (
                                    <th key={day} className="p-3 font-semibold text-sm text-indigo-800 border border-indigo-200">{day}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {timeSlots.map(slot => (
                                <tr key={slot}>
                                    <td className="p-3 font-semibold text-sm text-gray-700 bg-gray-100 border border-gray-200">{slot}</td>
                                    {daysOfWeek.map(day => {
                                        const entry = timetableMap.get(`${day}-${slot}`);
                                        return (
                                            <td key={day} className="p-3 text-sm text-gray-800 border border-gray-200 whitespace-nowrap">
                                                {entry ? (
                                                    <div>
                                                        <p className="font-bold">{entry.subject}</p>
                                                        <p className="text-xs text-indigo-600">
                                                            {viewMode === 'classes' ? entry.teacherName : entry.className}
                                                        </p>
                                                    </div>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center text-gray-500 py-8">
                    <ClockIcon className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p>
                      {viewMode === 'classes' ? (selectedClass ? 'لا يوجد استعمال زمن لهذا القسم.' : 'الرجاء اختيار قسم.') : (selectedTeacher ? 'لا يوجد استعمال زمن لهذا الأستاذ.' : 'الرجاء اختيار أستاذ.')}
                    </p>
                </div>
            )}
        </div>
    );
};

const AuditLogView: React.FC<{ logs: AuditLog[] }> = ({ logs }) => {
    const getActionStyle = (action: AuditLogAction) => {
        switch (action) {
            case AuditLogAction.USER_CREATED: return 'bg-green-100 text-green-800';
            case AuditLogAction.USER_UPDATED: return 'bg-blue-100 text-blue-800';
            case AuditLogAction.USER_DELETED: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    
    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4">سجل التغييرات</h2>
            <div className="overflow-x-auto max-h-[70vh]">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوقت</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المسؤول</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراء</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المستخدم المستهدف</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">التفاصيل</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.length > 0 ? logs.map(log => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleString('ar-MA')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.adminName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getActionStyle(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{log.targetUserName}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{log.details}</td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">لا توجد سجلات تغييرات حتى الآن.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AnnouncementModal: React.FC<{
    announcement: Announcement | null;
    onClose: () => void;
    onSave: (announcement: Announcement) => void;
}> = ({ announcement, onClose, onSave }) => {
    const [title, setTitle] = useState(announcement?.title || '');
    const [content, setContent] = useState(announcement?.content || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: announcement?.id || `anno-${Date.now()}`,
            title,
            content,
            date: announcement ? announcement.date : new Date().toISOString(), // Preserve original date on edit
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                <div className="flex justify-between items-center p-4 border-b">
                    <h3 className="text-xl font-bold">{announcement ? 'تعديل الإعلان' : 'إعلان جديد'}</h3>
                    <button onClick={onClose}><XIcon className="h-6 w-6 text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">العنوان</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">المحتوى</label>
                            <textarea value={content} onChange={e => setContent(e.target.value)} rows={8} className="mt-1 w-full p-2 border rounded-md" required />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 p-4 bg-gray-50 border-t">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">إلغاء</button>
                        <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md">حفظ</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const AnnouncementsManagementView: React.FC<{
    announcements: Announcement[];
    setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
}> = ({ announcements, setAnnouncements }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

    const handleSave = (announcement: Announcement) => {
        const sortedAnnouncements = (anns: Announcement[]) => [...anns].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        const index = announcements.findIndex(a => a.id === announcement.id);
        
        if (index > -1) {
            setAnnouncements(sortedAnnouncements(announcements.map(a => a.id === announcement.id ? { ...announcement, date: new Date().toISOString() } : a)));
        } else {
            setAnnouncements(sortedAnnouncements([announcement, ...announcements]));
        }
        setIsModalOpen(false);
        setEditingAnnouncement(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
            setAnnouncements(announcements.filter(a => a.id !== id));
        }
    };

    const openModal = (ann: Announcement | null) => {
        setEditingAnnouncement(ann);
        setIsModalOpen(true);
    };
    
    const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">إدارة النشرة الإخبارية</h2>
                    <button onClick={() => openModal(null)} className="flex items-center px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
                        <PlusCircleIcon className="h-5 w-5 ml-2" /> إضافة إعلان
                    </button>
                </div>
                <div className="space-y-4">
                    {sortedAnnouncements.map(ann => (
                        <div key={ann.id} className="bg-gray-50 p-4 rounded-lg flex justify-between items-start">
                            <div>
                                <p className="font-bold text-lg text-gray-800">{ann.title}</p>
                                <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{ann.content.substring(0, 150)}...</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(ann.date).toLocaleString('ar-MA')}</p>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0 mt-2">
                                <button onClick={() => openModal(ann)} className="p-2 text-gray-500 hover:text-indigo-600"><PencilIcon className="h-5 w-5" /></button>
                                <button onClick={() => handleDelete(ann.id)} className="p-2 text-gray-500 hover:text-red-600"><TrashIcon className="h-5 w-5" /></button>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && <p className="text-center text-gray-500 py-8">لا توجد إعلانات حالياً.</p>}
                </div>
            </div>
            {isModalOpen && <AnnouncementModal announcement={editingAnnouncement} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </>
    );
};


export default AdminDashboard;