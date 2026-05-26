import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import {
  MdDashboard, MdBusiness, MdPeople, MdMedicalServices,
  MdLocalHospital, MdScience, MdMedication, MdAirportShuttle,
  MdHandshake, MdBarChart, MdSecurity, MdSettings,
  MdExpandMore, MdLogout,
} from 'react-icons/md';
import { useState } from 'react';

const NAV_ITEMS = [
  { path: '/dashboard',       label: 'Dashboard',         icon: MdDashboard },
  { path: '/organization',    label: 'Organization',       icon: MdBusiness },
  { path: '/users',           label: 'User Management',    icon: MdPeople },
  { path: '/services',        label: 'Services',           icon: MdMedicalServices, hasArrow: true },
  { path: '/consultation',    label: 'Consultation',       icon: MdLocalHospital },
  { path: '/lab-test',        label: 'Lab test Booking',   icon: MdScience },
  { path: '/medicine-orders', label: 'Medicine Orders',    icon: MdMedication },
  { path: '/ambulance',       label: 'Ambulance booking',  icon: MdAirportShuttle },
  { path: '/vendors',         label: 'Vendor & Partners',  icon: MdHandshake },
  { path: '/report',          label: 'Report',             icon: MdBarChart },
  { path: '/user-access',     label: 'User Access',        icon: MdSecurity },
  { path: '/setting',         label: 'Setting',            icon: MdSettings },
];

const Sidebar = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <aside
        className={`
          fixed left-0 top-0 h-full bg-white border-r border-gray-100 z-30
          flex flex-col transition-all duration-300 shadow-sm
          ${collapsed ? 'w-16' : 'w-60'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-center h-14 px-4 border-b border-gray-100 flex-shrink-0">
          {!collapsed ? (
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 bg-jiva-green rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">J</span>
              </div>
              <div>
                <span className="text-lg font-bold text-jiva-green leading-none">Jiva</span>
                <span className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase ml-0.5">™ Health</span>
              </div>
            </div>
          ) : (
            <div className="w-7 h-7 bg-jiva-green rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">J</span>
            </div>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === '/users' && location.pathname.startsWith('/users'));

            return (
              <NavLink
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : ''}
                className={() =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 group
                  ${isActive
                    ? 'bg-jiva-green-light text-jiva-green font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`
                }
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0
                    ${isActive ? 'text-jiva-green' : 'text-gray-400 group-hover:text-gray-600'}`}
                />
                {!collapsed && (
                  <span className="text-sm truncate flex-1">{item.label}</span>
                )}
                {!collapsed && item.hasArrow && (
                  <MdExpandMore className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom: User profile + Logout */}
        <div className="border-t border-gray-100 flex-shrink-0">
          {/* User info row */}
          <div className={`flex items-center gap-3 px-3 py-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-jiva-green flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {getInitials(user?.name || 'AD')}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-gray-400 truncate leading-tight">
                  {user?.email || 'admin@healthcare.com'}
                </p>
              </div>
            )}
          </div>

          {/* Logout button */}
          <div className="px-2 pb-3">
            <button
              onClick={() => setShowLogoutConfirm(true)}
              title={collapsed ? 'Logout' : ''}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-red-500 transition-all duration-150 group
                hover:bg-red-50 hover:text-red-600
                ${collapsed ? 'justify-center' : ''}
              `}
            >
              <MdLogout className="w-5 h-5 flex-shrink-0 rotate-180" />
              {!collapsed && (
                <span className="text-sm font-medium">Logout</span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Logout Confirm Overlay */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MdLogout className="w-7 h-7 text-red-500 rotate-180" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Sign out?</h3>
            <p className="text-sm text-gray-500 mt-1 mb-6">
              You'll be returned to the login screen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
