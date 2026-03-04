import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { requestNotificationPermission } from './utils/notifications';

// Layout & Components
import { BottomNav } from './components/BottomNav';

// Patient Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Calendar } from './pages/Calendar';
import { DayDetail } from './pages/DayDetail';
import { Planner } from './pages/Planner';
import { EmergencyChat } from './pages/EmergencyChat';
import { UserProfile } from './pages/UserProfile';
import { Breathe } from './pages/Breathe';
import { Blog } from './pages/Blog';
import { AssessmentQuiz } from './pages/AssessmentQuiz';

// Psychologist Pages
import { PsychologistDashboard } from './pages/psychologist/PsychologistDashboard';
import { PsychologistPatients } from './pages/psychologist/PsychologistPatients';
import { PsychologistPatientDetail } from './pages/psychologist/PsychologistPatientDetail';
import { PsychologistAgenda } from './pages/psychologist/PsychologistAgenda';
import { PsychologistBlog } from './pages/psychologist/PsychologistBlog';
import { PsychologistAssessments } from './pages/psychologist/PsychologistAssessments';

function App() {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <Router>
      <div style={{ position: 'relative' }}>
        <Toaster position="top-center" toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--co-white)',
            color: 'var(--co-text-dark)',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '16px',
            border: '1px solid rgba(0,0,0,0.05)'
          },
          success: {
            iconTheme: {
              primary: 'var(--co-action)',
              secondary: 'white',
            },
          },
        }} />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/dia/:diaId" element={<DayDetail />} />
          <Route path="/emergencia" element={<EmergencyChat />} />
          <Route path="/breathe" element={<Breathe />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/assessment" element={<AssessmentQuiz />} />

          <Route path="/psicologo/dashboard" element={<PsychologistDashboard />} />
          <Route path="/psicologo/pacientes" element={<PsychologistPatients />} />
          <Route path="/psicologo/paciente/:id" element={<PsychologistPatientDetail />} />
          <Route path="/psicologo/agenda" element={<PsychologistAgenda />} />
          <Route path="/psicologo/blog" element={<PsychologistBlog />} />
          <Route path="/psicologo/avaliacoes" element={<PsychologistAssessments />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
