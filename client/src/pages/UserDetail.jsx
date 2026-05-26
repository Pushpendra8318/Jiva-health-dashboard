import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MdArrowBack, MdWorkspacePremium, MdEdit, MdAdd, MdDelete,
  MdEmail, MdPhone, MdCalendarToday, MdBloodtype, MdPerson,
  MdHome, MdShoppingBag, MdPeople, MdCreditCard,
} from 'react-icons/md';
import { getUserById, togglePrime, toggleStatus, updateUser, addAddress, deleteAddress } from '../services/userService';
import { deleteFamilyMember } from '../services/familyService';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import OrderItem from '../components/orders/OrderItem';
import OrderDetailModal from '../components/orders/OrderDetailModal';
import AddOrderModal from '../components/orders/AddOrderModal';
import PaymentItem from '../components/payments/PaymentItem';
import FamilyMemberCard from '../components/family/FamilyMemberCard';
import FamilyMemberModal from '../components/family/FamilyMemberModal';
import EditUserModal from '../components/users/EditUserModal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import { formatDate, formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';

const TABS = ['Overview', 'Orders & Bookings', 'Payments', 'Family Members'];

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({ type: 'Home', area: '', pinCode: '', city: '', state: '', country: 'India', isDefault: false });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getUserById(id);
      setData(res.data);
    } catch {
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleTogglePrime = async () => {
    try {
      const res = await togglePrime(id);
      toast.success(res.message);
      fetchData();
    } catch {
      toast.error('Failed to update prime status');
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await toggleStatus(id, newStatus);
      toast.success(`Status updated to ${newStatus}`);
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteMember = async () => {
    setDeleteLoading(true);
    try {
      await deleteFamilyMember(deleteMember._id);
      toast.success('Family member deleted');
      setDeleteMember(null);
      fetchData();
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(id, addressForm);
      toast.success('Address added');
      setShowAddressModal(false);
      setAddressForm({ type: 'Home', area: '', pinCode: '', city: '', state: '', country: 'India', isDefault: false });
      fetchData();
    } catch {
      toast.error('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;
    try {
      await deleteAddress(id, addressId);
      toast.success('Address deleted');
      fetchData();
    } catch {
      toast.error('Failed to delete address');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!data) return <div className="text-center py-12 text-gray-500">User not found</div>;

  const { user, orders, payments, familyMembers } = data;

  return (
    <div>
      {/* Back */}
      <Link to="/users" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <MdArrowBack className="w-4 h-4" />
        Back to User Management
      </Link>

      {/* Profile Header */}
      <div className="card p-6 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar + Info */}
          <div className="flex items-center gap-4 flex-1">
            <Avatar name={user.name} size="xl" />
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <Badge label={user.status} variant={user.status?.toLowerCase()} />
                <Badge label={user.role} variant={user.role?.toLowerCase()} />
                <Badge label={user.userType} variant={user.userType === 'Prime User' ? 'prime' : 'normal'} />
                <span className="text-sm text-gray-500">ID: #{user._id?.slice(-4)}</span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <MdCalendarToday className="w-3.5 h-3.5" />
                  <span>Joined {formatDate(user.joinedDate)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>Last active {formatDate(user.lastActive)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!user.isPrime ? (
              <button onClick={handleTogglePrime} className="btn-prime">
                <MdWorkspacePremium className="w-4 h-4" />
                Upgrade to Prime
              </button>
            ) : (
              <button onClick={handleTogglePrime} className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-200 hover:bg-amber-100 transition-colors">
                <MdWorkspacePremium className="w-4 h-4" />
                Prime Member
              </button>
            )}
            <select
              value={user.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Orders', value: user.totalOrders || orders.length, icon: MdShoppingBag, bg: 'bg-blue-50', iconColor: 'text-blue-500' },
          { label: 'Total Booking & Appointment', value: user.totalBookings || 0, icon: MdCalendarToday, bg: 'bg-green-50', iconColor: 'text-green-500' },
          { label: 'Total Family Member', value: familyMembers.length, icon: MdPeople, bg: 'bg-purple-50', iconColor: 'text-purple-500' },
          { label: 'Total Spent', value: formatCurrency(user.totalSpent), icon: MdCreditCard, bg: 'bg-emerald-50', iconColor: 'text-emerald-500', big: true },
        ].map(({ label, value, icon: Icon, bg, iconColor, big }) => (
          <div key={label} className="card p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className={`font-bold mt-0.5 ${big ? 'text-lg' : 'text-3xl text-primary-600'}`}>{value}</p>
            </div>
            <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
              <Icon className={`w-6 h-6 ${iconColor}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TABS.map((tab) => {
            const icons = { 'Overview': MdPerson, 'Orders & Bookings': MdShoppingBag, 'Payments': MdCreditCard, 'Family Members': MdPeople };
            const Icon = icons[tab];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                  ${activeTab === tab
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {tab}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {/* ── Overview Tab ── */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Personal Information</h3>
                  <button onClick={() => setShowEditModal(true)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
                    <MdEdit className="w-4 h-4" /> Edit
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: MdEmail, label: 'Email', value: user.email },
                    { icon: MdPhone, label: 'Phone', value: user.phone || '-' },
                    { icon: MdCalendarToday, label: 'Date of Birth', value: user.dateOfBirth ? formatDate(user.dateOfBirth) : '-' },
                    { icon: MdPerson, label: 'Gender', value: user.gender || '-' },
                    { icon: MdBloodtype, label: 'Blood Group', value: user.bloodGroup || '-' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0">{label}:</span>
                      <span className="text-sm text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Addresses */}
              <div className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Addresses</h3>
                  <button onClick={() => setShowAddressModal(true)} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                    <MdAdd className="w-4 h-4" /> Add
                  </button>
                </div>
                {user.addresses?.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-4">No addresses added</p>
                ) : (
                  <div className="space-y-3">
                    {user.addresses?.map((addr) => (
                      <div key={addr._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MdHome className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900">{addr.type}</p>
                            {addr.isDefault && (
                              <span className="text-xs bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-0.5">{addr.area}</p>
                          <p className="text-xs text-gray-500">{addr.city}, {addr.state} {addr.pinCode}</p>
                          <p className="text-xs text-gray-500">{addr.country}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors">
                            <MdEdit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr._id)}
                            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                          >
                            <MdDelete className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Orders & Bookings Tab ── */}
          {activeTab === 'Orders & Bookings' && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Order History</h3>
                <div className="flex items-center gap-2">
                  {orders.length > 0 && (
                    <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                      {orders.length} order{orders.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <button
                    onClick={() => setShowAddOrderModal(true)}
                    className="flex items-center gap-1.5 text-xs bg-primary-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    <MdAdd className="w-3.5 h-3.5" />
                    Add Order
                  </button>
                </div>
              </div>
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <MdShoppingBag className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No orders yet</p>
                  <p className="text-xs text-gray-400">Orders placed by this user will appear here</p>
                </div>
              ) : (
                orders.map((order) => (
                  <OrderItem key={order._id} order={order} onRefresh={fetchData} onViewDetail={setSelectedOrder} />
                ))
              )}
            </div>
          )}

          {/* ── Payments Tab ── */}
          {activeTab === 'Payments' && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Order History</h3>
                {payments.length > 0 && (
                  <span className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-medium">
                    {payments.length} transaction{payments.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {payments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
                    <MdCreditCard className="w-7 h-7 text-gray-300" />
                  </div>
                  <p className="text-sm font-medium text-gray-500">No payments yet</p>
                  <p className="text-xs text-gray-400">Payment transactions will appear here</p>
                </div>
              ) : (
                payments.map((payment) => (
                  <PaymentItem key={payment._id} payment={payment} />
                ))
              )}
            </div>
          )}

          {/* ── Family Members Tab ── */}
          {activeTab === 'Family Members' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Family Members</h3>
                <button
                  onClick={() => { setEditMember(null); setShowFamilyModal(true); }}
                  className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  <MdAdd className="w-4 h-4" />
                  Add Member
                </button>
              </div>
              {familyMembers.length === 0 ? (
                <div className="card p-12 flex flex-col items-center gap-3 text-center">
                  <MdPeople className="w-12 h-12 text-gray-200" />
                  <p className="text-gray-500">No family members added yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {familyMembers.map((member) => (
                    <FamilyMemberCard
                      key={member._id}
                      member={member}
                      onEdit={(m) => { setEditMember(m); setShowFamilyModal(true); }}
                      onDelete={(m) => setDeleteMember(m)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSuccess={fetchData}
      />

      {/* Family Member Modal */}
      <FamilyMemberModal
        isOpen={showFamilyModal}
        onClose={() => { setShowFamilyModal(false); setEditMember(null); }}
        userId={id}
        member={editMember}
        onSuccess={fetchData}
      />

      {/* Delete Family Member Confirm */}
      <ConfirmDialog
        isOpen={!!deleteMember}
        onClose={() => setDeleteMember(null)}
        onConfirm={handleDeleteMember}
        loading={deleteLoading}
        title="Delete Family Member"
        message={`Are you sure you want to remove ${deleteMember?.name}?`}
        confirmText="Delete"
      />

      {/* Add Address Modal */}
      <Modal isOpen={showAddressModal} onClose={() => setShowAddressModal(false)} title="Add Address">
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={addressForm.type}
                onChange={(e) => setAddressForm((p) => ({ ...p, type: e.target.value }))}
                className="input-field"
              >
                {['Home', 'Work', 'Other'].map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
              <input value={addressForm.pinCode} onChange={(e) => setAddressForm((p) => ({ ...p, pinCode: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Area / Street</label>
            <input value={addressForm.area} onChange={(e) => setAddressForm((p) => ({ ...p, area: e.target.value }))} className="input-field" placeholder="House/Flat No., Building, Street" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input value={addressForm.city} onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input value={addressForm.state} onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input value={addressForm.country} onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))} className="input-field" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={addressForm.isDefault}
              onChange={(e) => setAddressForm((p) => ({ ...p, isDefault: e.target.checked }))}
              className="rounded text-primary-600"
            />
            Set as default address
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowAddressModal(false)} className="btn-secondary">Cancel</button>
            <button type="submit" className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors">
              Add Address
            </button>
          </div>
        </form>
      </Modal>

      {/* Order Detail Modal — 4th screen per assignment */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          user={user}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Add Order Modal */}
      {showAddOrderModal && (
        <AddOrderModal
          userId={user._id}
          onClose={() => setShowAddOrderModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
};

export default UserDetail;
