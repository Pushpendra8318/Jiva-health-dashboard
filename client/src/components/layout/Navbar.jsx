import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdMenu, MdSearch, MdDarkMode, MdLightMode,
  MdNotifications, MdLogout, MdPerson, MdSettings,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import Badge from '../common/Badge';

const Navbar = ({ onToggleSidebar, darkMode, onToggleDark }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setDropdownOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 right-0 left-0 h-14 bg-white border-b border-gray-100 z-20 flex items-center px-4 gap-4 shadow-sm">

      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors flex-shrink-0"
        title="Toggle Sidebar"
      >
        <MdMenu className="w-5 h-5" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text" placeholder="Search"
            value={searchValue} onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5 ml-auto">

        {/* Dark mode toggle */}
        <button
          onClick={onToggleDark}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <MdLightMode className="w-5 h-5" /> : <MdDarkMode className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors">
          <MdNotifications className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            1
          </span>
        </button>

        {/* User avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-jiva-green flex items-center justify-center text-white text-xs font-bold">
              {getInitials(user?.name || 'AD')}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-tight max-w-[100px] truncate">
                {user?.name || 'Admin'}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">{user?.role || 'Admin'}</p>
            </div>
          </button>

          {/* Dropdown panel */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">

              {/* User info header */}
              <div className="px-4 py-4 bg-gradient-to-br from-jiva-green-light to-white border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-jiva-green flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {getInitials(user?.name || 'AD')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name || 'Admin User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    <div className="mt-1">
                      <Badge label={user?.role || 'Admin'} variant={(user?.role || 'admin').toLowerCase()} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                    <MdPerson className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">My Profile</p>
                    <p className="text-xs text-gray-400">View account details</p>
                  </div>
                </button>

                <button
                  onClick={() => { setDropdownOpen(false); navigate('/setting'); }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MdSettings className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Settings</p>
                    <p className="text-xs text-gray-400">App preferences</p>
                  </div>
                </button>
              </div>

              {/* Logout */}
              <div className="p-2 pt-0 border-t border-gray-100 mt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors text-left"
                >
                  <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
                    <MdLogout className="w-4 h-4 text-red-500 rotate-180" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Sign Out</p>
                    <p className="text-xs text-gray-400">End your session</p>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
