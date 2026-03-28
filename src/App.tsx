import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { requestNotificationPermission } from './utils/notifications';
import { offlineSyncService } from './services/offlineSyncService';

// Layout & Components
import { BottomNav } from './components/BottomNav';

// Patient Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Calendar } from './pages/Calendar';
import { DayDetail } from './pages/DayDetail';
import { VaultList } from './pages/VaultList';
import { Planner } from './pages/Planner';
import { EmergencyHub } from './pages/EmergencyHub';
import { UserProfile } from './pages/UserProfile';
import { Breathe } from './pages/Breathe';
import { Grounding } from './pages/Grounding';
import { Blog } from './pages/Blog';
import { AssessmentQuiz } from './pages/AssessmentQuiz';
import { NeuroEvalInfo } from './pages/NeuroEvalInfo';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';

// Psychologist Pages
import { PsychologistDashboard } from './pages/psychologist/PsychologistDashboard';
import { PsychologistPatients } from './pages/psychologist/PsychologistPatients';
import { PsychologistPatientDetail } from './pages/psychologist/PsychologistPatientDetail';
import { PsychologistAgenda } from './pages/psychologist/PsychologistAgenda';
import { PsychologistBlog } from './pages/psychologist/PsychologistBlog';
import { PsychologistAssessments } from './pages/psychologist/PsychologistAssessments';
import { PsychologistFinancial } from './pages/psychologist/PsychologistFinancial';

import { HelmetProvider } from 'react-helmet-async';

function App() {
  useEffect(() => {
    requestNotificationPermission();

    // Sincronização offline
    const handleOnline = () => {
      offlineSyncService.processQueue();
    };

    window.addEventListener('online', handleOnline);
    
    // Tenta processar ao abrir o app se já estiver online
    if (navigator.onLine) {
      offlineSyncService.processQueue();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <HelmetProvider>
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
          <Route path="/cofre" element={<VaultList />} />
          <Route path="/dia/:diaId" element={<DayDetail />} />
          <Route path="/emergencia" element={<EmergencyHub />} />
          <Route path="/breathe" element={<Breathe />} />
          <Route path="/grounding" element={<Grounding />} />
          <Route path="/perfil" element={<UserProfile />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/assessment" element={<AssessmentQuiz />} />
          <Route path="/avaliacao-neuropsicologica" element={<NeuroEvalInfo />} />
          <Route path="/privacidade" element={<PrivacyPolicy />} />
          <Route path="/termos" element={<TermsOfUse />} />

          <Route path="/psicologo/dashboard" element={<PsychologistDashboard />} />
          <Route path="/psicologo/pacientes" element={<PsychologistPatients />} />
          <Route path="/psicologo/paciente/:id" element={<PsychologistPatientDetail />} />
          <Route path="/psicologo/agenda" element={<PsychologistAgenda />} />
          <Route path="/psicologo/blog" element={<PsychologistBlog />} />
          <Route path="/psicologo/avaliacoes" element={<PsychologistAssessments />} />
          <Route path="/psicologo/financeiro" element={<PsychologistFinancial />} />
        </Routes>
        <BottomNav />
      </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
