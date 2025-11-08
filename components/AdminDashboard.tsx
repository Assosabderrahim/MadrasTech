

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
    LoadingSpinnerIcon
} from './icons';
import { ManagedUser, UserRole, SchoolStats, SystemConfig } from '../types';

interface DashboardProps {
  onLogout: () => void;
  initialUsers: ManagedUser[];
  setUsers: React.Dispatch<React.SetStateAction<ManagedUser[]>>;
  currentUser: ManagedUser;
}

// Mock data for admin dashboard
const mockStats: SchoolStats = {
    totalStudents: 1250,
    totalTeachers: 80,
    totalParents: 980,
    totalClasses: 45,
};

const mockConfig: SystemConfig = {
    schoolName: "مؤسسة النجاح التربوية",
    academicYear: "2023-2024",
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

type AdminView = 'dashboard' | 'users' | 'config';

const AdminDashboard: React.FC<DashboardProps> = ({ onLogout, initialUsers, setUsers, currentUser }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');
    const [users, localSetUsers] = useState<ManagedUser[]>(initialUsers);
    const [stats, setStats] = useState<SchoolStats>(mockStats);
    const [config, setConfig] = useState<SystemConfig>(mockConfig);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
    const [notificationsOpen, setNotificationsOpen] = useState(false);

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
        if (userToSave.id) {
            // Editing existing user
            updatedUsers = users.map(u => u.id === userToSave.id ? userToSave : u);
        } else {
            // Adding new user
            updatedUsers = [...users, { ...userToSave, id: `user-${Date.now()}` }];
        }
        localSetUsers(updatedUsers);
        setUsers(updatedUsers); // Update the parent state
        closeModal();
    };

    const handleDeleteUser = (userId: string) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
            const updatedUsers = users.filter(u => u.id !== userId);
            localSetUsers(updatedUsers);
            setUsers(updatedUsers); // Update the parent state
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
                        {/* More dashboard components can be added here */}
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
            <div className="flex h-screen bg-gray-100" dir="rtl">
                {/* Sidebar */}
                <div className="w-64 bg-white shadow-md flex flex-col">
                    <div className="p-4 border-b flex items-center justify-between">
                        <div className="flex items-center">
                            <ShieldCheckIcon className="h-10 w-10 text-gray-400 bg-gray-200 rounded-full p-2 ml-3" />
                            <div>
                                <h2 className="text-lg font-bold text-indigo-700">{currentUser.name}</h2>
                                <p className="text-sm text-gray-500">لوحة التحكم</p>
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
                        <NavLink view="dashboard" label="لوحة المعلومات" Icon={ChartPieIcon} />
                        <NavLink view="users" label="إدارة المستخدمين" Icon={UsersIcon} />
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

export default AdminDashboard;