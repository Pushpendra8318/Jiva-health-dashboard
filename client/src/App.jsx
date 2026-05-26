import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import UserDetail from './pages/UserDetail';
import MedicineOrders from './pages/MedicineOrders';
import PlaceholderPage from './pages/PlaceholderPage';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontSize: '13px', borderRadius: '10px' },
            success: { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } },
            error: { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          {/* /register intentionally removed — admin-only platform, no public signup */}

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/users/:id" element={<UserDetail />} />
              <Route path="/organization" element={<PlaceholderPage />} />
              <Route path="/services" element={<PlaceholderPage />} />
              <Route path="/consultation" element={<PlaceholderPage />} />
              <Route path="/lab-test" element={<PlaceholderPage />} />
              <Route path="/medicine-orders" element={<MedicineOrders />} />
              <Route path="/ambulance" element={<PlaceholderPage />} />
              <Route path="/vendors" element={<PlaceholderPage />} />
              <Route path="/report" element={<PlaceholderPage />} />
              <Route path="/user-access" element={<PlaceholderPage />} />
              <Route path="/setting" element={<PlaceholderPage />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
