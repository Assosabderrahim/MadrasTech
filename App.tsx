import React, { useState } from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import Footer from "./components/Footer";

import DashboardDirector from "./components/dashboards/DashboardDirector";
import DashboardAdmin from "./components/dashboards/DashboardAdmin";
import DashboardParent from "./components/dashboards/DashboardParent";
import DashboardTeacher from "./components/dashboards/DashboardTeacher";
import DashboardStudent from "./components/dashboards/DashboardStudent";

import {
  UserRole,
  User,
  initialUsers,
  initialTeachers,
  initialParents,
  initialClasses,
  initialLessons,
  initialAnnouncements,
} from "./data/mockData";

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(UserRole.NONE);

  const [users] = useState(initialUsers);
  const [teachers] = useState(initialTeachers);
  const [parents] = useState(initialParents);
  const [classes] = useState(initialClasses);
  const [lessons] = useState(initialLessons);
  const [announcements] = useState(initialAnnouncements);

  // -----------------------------------------------------
  // LOGIN
  // -----------------------------------------------------
  const handleLogin = (email: string, password: string) => {
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) {
      alert("معلومات الدخول غير صحيحة");
      return;
    }

    setUser(foundUser);
    setUserRole(foundUser.role); // CRUCIAL
  };

  // -----------------------------------------------------
  // LOGOUT
  // -----------------------------------------------------
  const handleLogout = () => {
    setUser(null);
    setUserRole(UserRole.NONE);
  };

  // -----------------------------------------------------
  // ROUTING SELON LE ROLE
  // -----------------------------------------------------
  const renderDashboard = () => {
    switch (userRole) {
      case UserRole.DIRECTOR:
        return <DashboardDirector onLogout={handleLogout} users={users} classes={classes} />;

      case UserRole.ADMIN:
        return <DashboardAdmin onLogout={handleLogout} teachers={teachers} parents={parents} />;

      case UserRole.TEACHER:
        return <DashboardTeacher onLogout={handleLogout} lessons={lessons} classes={classes} />;

      case UserRole.PARENT:
        return <DashboardParent onLogout={handleLogout} announcements={announcements} />;

      case UserRole.STUDENT:
        return <DashboardStudent onLogout={handleLogout} lessons={lessons} />;

      default:
        return <Login onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {userRole !== UserRole.NONE && <Header onLogout={handleLogout} user={user} />}
      <main className="flex-grow">{renderDashboard()}</main>
      {userRole !== UserRole.NONE && <Footer />}
    </div>
  );
};

export default App;
