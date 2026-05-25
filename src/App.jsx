import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import MainLayout from './components/layout/MainLayout';
import AdminLayout from './components/layout/AdminLayout';
import AdminRoute from './components/AdminRoute';
import Home from './pages/Home';
import Bands from './pages/Bands';
import BandDetail from './pages/BandDetail';
import BookBand from './pages/BookBand';
import About from './pages/About';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBands from './pages/admin/AdminBands';
import AdminFestivals from './pages/admin/AdminFestivals';
import AdminBookings from './pages/admin/AdminBookings';
import ArchiveDownloads from './pages/admin/ArchiveDownloads.jsx';
import BandEditor from './pages/BandEditor';
import BandMap from './pages/BandMap';
import WCMF from './pages/WCMF';
import Questionnaire from './pages/Questionnaire';
import Contact from './pages/Contact';
import PublicMap from './pages/PublicMap';
import FieldworkEntry from './pages/FieldworkEntry';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    // For auth_required and other errors, still render the public routes.
    // The AdminLayout handles its own auth gate.
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/questionnaire" element={<Questionnaire />} />
        <Route path="/map" element={<PublicMap />} />
        {/* Admin-only pages */}
        <Route element={<AdminRoute />}>
          <Route path="/bands" element={<Bands />} />
          <Route path="/bands/:id" element={<BandDetail />} />
          <Route path="/book" element={<BookBand />} />
          <Route path="/band-editor" element={<BandEditor />} />
          <Route path="/band-map" element={<BandMap />} />
          <Route path="/wcmf" element={<WCMF />} />
          <Route path="/fieldwork" element={<FieldworkEntry />} />
        </Route>
      </Route>
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/bands" element={<AdminBands />} />
        <Route path="/admin/festivals" element={<AdminFestivals />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
        <Route path="/admin/downloads" element={<ArchiveDownloads />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App