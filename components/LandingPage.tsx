import React, { useState } from 'react';
import { UserRole } from '../types';
import { 
    GraduationCapIcon, 
    PresentationChartBarIcon, 
    BriefcaseIcon, 
    UsersIcon,
    UserIcon,
    LockClosedIcon,
    ArrowRightIcon
} from './icons';

interface LandingPageProps {
  onSelectRole: (role: UserRole) => void;
}

const RoleCard: React.FC<{
  role: UserRole;
  icon: React.ReactNode;
  color: string;
  onSelect: (role: UserRole) => void;
}> = ({ role, icon, color, onSelect }) => (
  <div
    onClick={() => onSelect(role)}
    className={`group transform transition-transform duration-300 hover:-translate-y-2 cursor-pointer p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center ${color}`}
  >
    <div className="bg-white/30 p-4 rounded-full mb-4 group-hover:bg-white/50 transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white">{role}</h3>
  </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onSelectRole }) => {
  const [loginForRole, setLoginForRole] = useState<UserRole | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === '' || password.trim() === '') {
      setError('الرجاء إدخال اسم المستخدم وكلمة السر.');
      return;
    }
    // On successful mock login
    if (loginForRole) {
      onSelectRole(loginForRole);
    }
  };

  const handleBack = () => {
    setLoginForRole(null);
    setUsername('');
    setPassword('');
    setError('');
  };

  const roleStyling: { [key in UserRole]?: { color: string, bg: string, hoverBg: string } } = {
      [UserRole.STUDENT]: { color: 'text-blue-600', bg: 'bg-blue-500', hoverBg: 'hover:bg-blue-600' },
      [UserRole.TEACHER]: { color: 'text-teal-600', bg: 'bg-teal-500', hoverBg: 'hover:bg-teal-600' },
      [UserRole.ADMIN]: { color: 'text-indigo-600', bg: 'bg-indigo-500', hoverBg: 'hover:bg-indigo-600' },
      [UserRole.PARENT]: { color: 'text-amber-600', bg: 'bg-amber-500', hoverBg: 'hover:bg-amber-600' },
  };
  const selectedStyle = loginForRole ? (roleStyling[loginForRole] || { color: 'text-gray-600', bg: 'bg-gray-500', hoverBg: 'hover:bg-gray-600'}) : { color: 'text-gray-600', bg: 'bg-gray-500', hoverBg: 'hover:bg-gray-600'};
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-cyan-50 to-blue-100">
      <header className="text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800 mb-2">MadrasTech</h1>
        <p className="text-xl text-gray-600">المدرسة المغربية الذكية</p>
      </header>
      <main className="w-full max-w-4xl">
        {loginForRole ? (
          <div className="w-full max-w-md mx-auto bg-white p-8 rounded-2xl shadow-2xl relative animate-fade-in">
             <button onClick={handleBack} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <ArrowRightIcon className="h-6 w-6"/>
             </button>
             <div className="text-center mb-8">
                <h2 className={`text-3xl font-bold ${selectedStyle.color}`}>تسجيل الدخول</h2>
                <p className="text-gray-500">مرحباً بك، {loginForRole}</p>
             </div>
             <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <UserIcon className="h-5 w-5 text-gray-400"/>
                    </span>
                    <input
                        type="text"
                        placeholder="اسم المستخدم"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        aria-label="Username"
                    />
                </div>
                 <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <LockClosedIcon className="h-5 w-5 text-gray-400"/>
                    </span>
                    <input
                        type="password"
                        placeholder="كلمة السر"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                        aria-label="Password"
                    />
                </div>
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <button type="submit" className={`w-full text-white font-bold py-3 rounded-lg transition-colors ${selectedStyle.bg} ${selectedStyle.hoverBg}`}>
                    تسجيل الدخول
                </button>
             </form>
          </div>
        ) : (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">اختر صفتك للدخول</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <RoleCard
                role={UserRole.STUDENT}
                icon={<GraduationCapIcon className="h-12 w-12 text-white" />}
                color="bg-blue-500 hover:bg-blue-600"
                onSelect={setLoginForRole}
              />
              <RoleCard
                role={UserRole.TEACHER}
                icon={<PresentationChartBarIcon className="h-12 w-12 text-white" />}
                color="bg-teal-500 hover:bg-teal-600"
                onSelect={setLoginForRole}
              />
              <RoleCard
                role={UserRole.ADMIN}
                icon={<BriefcaseIcon className="h-12 w-12 text-white" />}
                color="bg-indigo-500 hover:bg-indigo-600"
                onSelect={setLoginForRole}
              />
              <RoleCard
                role={UserRole.PARENT}
                icon={<UsersIcon className="h-12 w-12 text-white" />}
                color="bg-amber-500 hover:bg-amber-600"
                onSelect={setLoginForRole}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LandingPage;