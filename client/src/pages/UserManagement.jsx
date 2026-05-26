import { useState, useEffect, useCallback } from 'react';
import { MdSearch, MdFilterList, MdAdd, MdPeople } from 'react-icons/md';
import { getUsers, deleteUser } from '../services/userService';
import UserCard from '../components/users/UserCard';
import AddUserModal from '../components/users/AddUserModal';
import EditUserModal from '../components/users/EditUserModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import StatCard from '../components/common/StatCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { debounce } from '../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['All', 'Active', 'Inactive'];
const USER_TYPE_OPTIONS = ['All', 'Normal User', 'Prime User'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, primeUsers: 0, nonPrimeUsers: 0, totalFamilyMembers: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchUsers = useCallback(async (searchVal = search, status = statusFilter, type = typeFilter, page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (searchVal) params.search = searchVal;
      if (status !== 'All') params.status = status;
      if (type !== 'All') params.userType = type;

      const res = await getUsers(params);
      setUsers(res.data);
      setStats(res.stats);
      setPagination(res.pagination);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const debouncedSearch = useCallback(
    debounce((val) => fetchUsers(val, statusFilter, typeFilter), 400),
    [statusFilter, typeFilter]
  );

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    fetchUsers(search, status, typeFilter);
  };

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    fetchUsers(search, statusFilter, type);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await deleteUser(deleteTarget._id);
      toast.success(`${deleteTarget.name} deleted successfully`);
      setDeleteTarget(null);
      fetchUsers();
    } catch {
      toast.error('Failed to delete user');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage user accounts and permissions</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          <MdAdd className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total User" value={stats.totalUsers} />
        <StatCard label="Prime User" value={stats.primeUsers} color="text-primary-600" />
        <StatCard label="Non-Prime User" value={stats.nonPrimeUsers} color="text-primary-600" />
        <StatCard label="Total Family members" value={stats.totalFamilyMembers} color="text-primary-600" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by patient, doctor, or specialty..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2.5 bg-white cursor-pointer min-w-[140px]">
            <MdFilterList className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => handleStatusFilter(e.target.value)}
              className="text-sm text-gray-700 bg-transparent outline-none cursor-pointer flex-1"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* User Type Filter */}
        <div className="relative">
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-2.5 bg-white cursor-pointer min-w-[140px]">
            <MdFilterList className="w-4 h-4 text-gray-400" />
            <select
              value={typeFilter}
              onChange={(e) => handleTypeFilter(e.target.value)}
              className="text-sm text-gray-700 bg-transparent outline-none cursor-pointer flex-1"
            >
              {USER_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t === 'All' ? 'All Types' : t}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* User List */}
      {loading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <div className="card p-12 flex flex-col items-center justify-center gap-3 text-center">
          <MdPeople className="w-12 h-12 text-gray-300" />
          <p className="text-gray-500 font-medium">No users found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <UserCard
              key={user._id}
              user={user}
              onEdit={(u) => setEditUser(u)}
              onDelete={(u) => setDeleteTarget(u)}
              onRefresh={() => fetchUsers()}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => fetchUsers(search, statusFilter, typeFilter, p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                p === pagination.page
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Modals */}
      <AddUserModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={() => fetchUsers()}
      />
      <EditUserModal
        isOpen={!!editUser}
        onClose={() => setEditUser(null)}
        user={editUser}
        onSuccess={() => { setEditUser(null); fetchUsers(); }}
      />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        loading={deleteLoading}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will also remove all their orders, payments, and family members.`}
        confirmText="Delete"
      />
    </div>
  );
};

export default UserManagement;
