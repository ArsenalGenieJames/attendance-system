import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import AttendanceForm from './components/AttendanceForm';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AttendanceForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
