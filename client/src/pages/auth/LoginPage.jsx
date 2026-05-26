import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdAdminPanelSettings } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@healthcare.com', password: 'admin123' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please enter your email and password'); return; }
    setError('');
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result?.success) navigate('/dashboard');
    else setError(result?.message || 'Invalid credentials. Please try again.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50 flex">

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-5/12 bg-jiva-green flex-col items-center justify-center p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

        <div className="relative z-10 text-center text-white">
          {/* Logo */}
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <span className="text-jiva-green text-4xl font-black">J</span>
          </div>
          <h1 className="text-4xl font-black mb-2">Jiva Health</h1>
          <p className="text-green-200 text-lg font-medium mb-8">Admin Dashboard</p>

          <div className="space-y-4 text-left">
            {[
              'Manage all users & patient records',
              'Track orders, payments & bookings',
              'Family member management',
              'Prime user upgrades & access control',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-jiva-green rounded-xl flex items-center justify-center">
              <span className="text-white text-lg font-bold">J</span>
            </div>
            <div>
              <p className="text-xl font-bold text-jiva-green leading-none">Jiva Health</p>
              <p className="text-xs text-gray-400 tracking-widest uppercase">Admin Panel</p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-green-50 text-jiva-green px-3 py-1.5 rounded-full text-xs font-semibold mb-3 border border-green-100">
              <MdAdminPanelSettings className="w-4 h-4" />
              Admin Access Only
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Sign in to your account</h2>
            <p className="text-gray-500 text-sm mt-1">
              This dashboard is restricted to authorized administrators.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-5">
              <div className="w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">!</div>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  placeholder="admin@healthcare.com"
                  className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-jiva-green text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-md"
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2d8653'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a6b3c'; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Demo credentials box */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
            <p className="text-xs font-bold text-amber-700 mb-2 uppercase tracking-wide">
              Demo Credentials
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Email</span>
                <code className="text-xs bg-white px-2 py-0.5 rounded-lg border border-amber-100 text-gray-700 font-mono">
                  admin@healthcare.com
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Password</span>
                <code className="text-xs bg-white px-2 py-0.5 rounded-lg border border-amber-100 text-gray-700 font-mono">
                  admin123
                </code>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;
