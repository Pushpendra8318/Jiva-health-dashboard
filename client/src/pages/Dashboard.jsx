import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MdPeople, MdShoppingBag, MdCreditCard, MdGroup,
  MdWorkspacePremium, MdArrowForward, MdRefresh, MdTrendingUp,
} from 'react-icons/md';
import { getDashboardStats } from '../services/dashboardService';
import { getOrderStatusColor, formatCurrency } from '../utils/helpers';
import Avatar from '../components/common/Avatar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const formatDateMid = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await getDashboardStats();
      setStats(res.data);
    } catch {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers ?? 0,
      sub: stats?.primeUsers ? `${stats.primeUsers} Prime members` : null,
      icon: MdPeople,
      bg: 'bg-blue-50',
      color: 'text-blue-500',
      link: '/users',
    },
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? 0,
      icon: MdShoppingBag,
      bg: 'bg-purple-50',
      color: 'text-purple-500',
      link: '/medicine-orders',
    },
    {
      label: 'Family Members',
      value: stats?.totalFamilyMembers ?? 0,
      icon: MdGroup,
      bg: 'bg-green-50',
      color: 'text-green-500',
      link: '/users',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue ?? 0),
      icon: MdCreditCard,
      bg: 'bg-amber-50',
      color: 'text-amber-500',
      link: '#',
      big: true,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back to Jiva Health Admin Panel</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg transition-colors"
        >
          <MdRefresh className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, sub, icon: Icon, bg, color, link, big }) => (
          <Link key={label} to={link} className="card p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">{label}</p>
                <p className={`font-bold mt-1 ${big ? 'text-xl' : 'text-3xl text-primary-600'}`}>{value}</p>
                {sub && (
                  <div className="flex items-center gap-1 mt-1">
                    <MdWorkspacePremium className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-gray-400">{sub}</p>
                  </div>
                )}
              </div>
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 ml-3 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity — 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Recent Users */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MdPeople className="w-4 h-4 text-primary-600" />
              <h2 className="font-semibold text-gray-900">Recent Users</h2>
            </div>
            <Link to="/users" className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:underline">
              View all <MdArrowForward className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentUsers?.length > 0 ? (
            <div className="space-y-1">
              {stats.recentUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => navigate(`/users/${user._id}`)}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <Avatar name={user.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {user.isPrime && (
                      <MdWorkspacePremium className="w-3.5 h-3.5 text-amber-500" title="Prime" />
                    )}
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <MdPeople className="w-10 h-10 text-gray-200" />
              <p className="text-sm text-gray-400">No users yet</p>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MdShoppingBag className="w-4 h-4 text-primary-600" />
              <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            </div>
            <Link to="/medicine-orders" className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:underline">
              View all <MdArrowForward className="w-3.5 h-3.5" />
            </Link>
          </div>

          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-1">
              {stats.recentOrders.map((order) => {
                const displayNum = order.orderNumber
                  ? order.orderNumber.replace(/^ORD-0*/, '')
                  : order._id?.slice(-4).toUpperCase();
                return (
                  <div key={order._id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MdShoppingBag className="w-4 h-4 text-primary-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">Order #{displayNum}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {order.userId?.name || 'Unknown'} · {formatDateMid(order.orderDate || order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${getOrderStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <MdShoppingBag className="w-10 h-10 text-gray-200" />
              <p className="text-sm text-gray-400">No orders yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="card p-5 mt-5">
        <div className="flex items-center gap-2 mb-4">
          <MdTrendingUp className="w-4 h-4 text-primary-600" />
          <h2 className="font-semibold text-gray-900">Quick Navigation</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'User Management', path: '/users' },
            { label: 'Medicine Orders', path: '/medicine-orders' },
            { label: 'Consultation', path: '/consultation' },
            { label: 'Lab Test Booking', path: '/lab-test' },
            { label: 'Ambulance Booking', path: '/ambulance' },
            { label: 'Reports', path: '/report' },
          ].map(({ label, path }) => (
            <Link
              key={label}
              to={path}
              className="flex items-center justify-center px-3 py-3 bg-gray-50 rounded-xl text-xs font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors border border-gray-100 text-center leading-tight"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
