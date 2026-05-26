import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { updateUser } from '../../services/userService';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['', 'Male', 'Female', '13-17 years', '18-35 years', '36-59 years', '60+ years'];
const ROLES = ['Patient', 'Doctor', 'Nurse', 'Admin', 'Support Staff'];

const EditUserModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        bloodGroup: user.bloodGroup || '',
        role: user.role || 'Patient',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.email?.trim()) {
      toast.error('Name and email are required');
      return;
    }
    setLoading(true);
    try {
      await updateUser(user._id, form);
      toast.success('User updated successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User" subtitle="Update user information">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input name="name" value={form.name || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input name="email" type="email" value={form.email || ''} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input name="dateOfBirth" type="date" value={form.dateOfBirth || ''} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={form.gender || ''} onChange={handleChange} className="input-field">
              {GENDERS.map((g) => <option key={g} value={g}>{g || 'Select gender'}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup || ''} onChange={handleChange} className="input-field">
              {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b || 'Select blood group'}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select name="role" value={form.role || ''} onChange={handleChange} className="input-field">
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
