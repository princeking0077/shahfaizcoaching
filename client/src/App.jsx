import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';

import AdminDashboard from './pages/AdminDashboard';

import TeacherDashboard from './pages/TeacherDashboard';

// Placeholder for Dashboards
// const AdminDashboard = () => <div className="p-10 text-white"><h1>Admin Dashboard (Coming Soon)</h1></div>;
import StudentDashboard from './pages/StudentDashboard';

// Placeholder for Dashboards
// const AdminDashboard = () => <div className="p-10 text-white"><h1>Admin Dashboard (Coming Soon)</h1></div>;
// const TeacherDashboard = () => <div className="p-10 text-white"><h1>Teacher Dashboard (Coming Soon)</h1></div>;
// const StudentDashboard = () => <div className="p-10 text-white"><h1>Student Dashboard (Coming Soon)</h1></div>;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/student" element={<StudentDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
