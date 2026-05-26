import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  MdPerson, MdEmail, MdLock, MdPhone, MdVisibility,
  MdVisibilityOff, MdCheckCircle,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { register } from '../../services/authService';
import toast from 'react-hot-toast';

const ROLES = ['Patient', 'Doctor', 'Nurse', 'Support Staff'];

const RegisterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    confirmPassword: '', role: 'Patient',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  if (user) return <Navigate to="/dashboard" replace />;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password, role: form.role });
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
      if (msg.toLowerCase().includes('email')) setErrors((p) => ({ ...p, email: msg }));
    } finally {
      setLoading(false);
    }
  };

  // Password strength checker
  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500', 'bg-green-600'][strength];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-7">
          <Link to="/login" className="inline-flex items-center gap-2 mb-3">
            <div className="w-11 h-11 bg-jiva-green rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">J</span>
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-jiva-green leading-none">Jiva</p>
              <p className="text-[10px] text-gray-500 font-semibold tracking-widest uppercase">Health</p>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Join Jiva Health admin platform</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-7">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  name="name" value={form.name} onChange={handleChange}
                  placeholder="John Smith"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-gray-50 transition-all outline-none focus:bg-white focus:border-primary-500 ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-gray-50 transition-all outline-none focus:bg-white focus:border-primary-500 ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone + Role row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <div className="relative">
                  <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    name="phone" value={form.phone} onChange={handleChange}
                    placeholder="+91 98765..."
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 outline-none focus:bg-white focus:border-primary-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                <select
                  name="role" value={form.role} onChange={handleChange}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 outline-none focus:bg-white focus:border-primary-500 transition-all"
                >
                  {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm bg-gray-50 transition-all outline-none focus:bg-white focus:border-primary-500 ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                </button>
              </div>
              {/* Strength bar */}
              {form.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${strength <= 1 ? 'text-red-500' : strength <= 2 ? 'text-orange-500' : strength <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full pl-10 pr-10 py-2.5 border rounded-xl text-sm bg-gray-50 transition-all outline-none focus:bg-white focus:border-primary-500 ${errors.confirmPassword ? 'border-red-400' : form.confirmPassword && form.password === form.confirmPassword ? 'border-green-400' : 'border-gray-200'}`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {form.confirmPassword && form.password === form.confirmPassword && (
                    <MdCheckCircle className="w-4 h-4 text-green-500" />
                  )}
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="text-gray-400 hover:text-gray-600">
                    {showConfirm ? <MdVisibilityOff className="w-5 h-5" /> : <MdVisibility className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full bg-jiva-green text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              style={{ '--hover-bg': '#2d8653' }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2d8653'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1a6b3c'; }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-jiva-green font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
