import { useState } from 'react';
import Modal from '../common/Modal';
import { createUser } from '../../services/userService';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const GENDERS = ['Male', 'Female', '13-17 years', '18-35 years', '36-59 years', '60+ years'];
const STATES = [
  'Andhra Pradesh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

const initialForm = {
  name: '', email: '', phone: '+91 98765 43210', dateOfBirth: '',
  gender: '', bloodGroup: '', area: '', pinCode: '400001',
  city: 'Mumbai', state: '', country: 'India',
};

const AddUserModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email format';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await createUser(form);
      toast.success('User created successfully!');
      setForm(initialForm);
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New User"
      subtitle="Create a new user account with role and permissions"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name + Email */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., John Smith"
              className={`input-field ${errors.name ? 'border-red-400' : ''}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john.smith@email.com"
              className={`input-field ${errors.email ? 'border-red-400' : ''}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
        </div>

        {/* Row 2: Phone + DOB */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        {/* Row 3: Gender + Blood Group */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
              <option value="">Select gender</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field">
              <option value="">Select blood group</option>
              {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
        </div>

        {/* Area Detail */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Area Detail</label>
          <input
            name="area"
            value={form.area}
            onChange={handleChange}
            placeholder="House/Flat No., Building Name, Street"
            className="input-field"
          />
        </div>

        {/* Row 4: Pin + City */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
            <input name="pinCode" value={form.pinCode} onChange={handleChange} placeholder="400001" className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="input-field" />
          </div>
        </div>

        {/* Row 5: State + Country */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
            <select name="state" value={form.state} onChange={handleChange} className="input-field">
              <option value="">Select state</option>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
            <input name="country" value={form.country} onChange={handleChange} className="input-field" />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={handleClose} className="btn-secondary">Cancel</button>
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddUserModal;
