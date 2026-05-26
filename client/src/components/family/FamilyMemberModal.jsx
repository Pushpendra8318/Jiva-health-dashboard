import { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { addFamilyMember, updateFamilyMember } from '../../services/familyService';
import toast from 'react-hot-toast';

const RELATIONS = ['Father', 'Mother', 'Son', 'Daughter', 'Spouse', 'Brother', 'Sister', 'Other'];
const GENDERS = ['Male', 'Female', 'Other'];
const BLOOD_GROUPS = ['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const FamilyMemberModal = ({ isOpen, onClose, userId, member, onSuccess }) => {
  const isEdit = !!member;
  const [form, setForm] = useState({ name: '', relation: '', phone: '', dateOfBirth: '', gender: 'Male', bloodGroup: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name || '',
        relation: member.relation || '',
        phone: member.phone || '',
        dateOfBirth: member.dateOfBirth ? member.dateOfBirth.split('T')[0] : '',
        gender: member.gender || 'Male',
        bloodGroup: member.bloodGroup || '',
      });
    } else {
      setForm({ name: '', relation: '', phone: '', dateOfBirth: '', gender: 'Male', bloodGroup: '' });
    }
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.relation) {
      toast.error('Name and relation are required');
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateFamilyMember(member._id, form);
        toast.success('Family member updated!');
      } else {
        await addFamilyMember({ ...form, userId });
        toast.success('Family member added!');
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edit Family Member' : 'Add Family Member'}
      subtitle={isEdit ? 'Update family member details' : 'Add a new family member'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="John Williams" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Relation *</label>
            <select name="relation" value={form.relation} onChange={handleChange} className="input-field">
              <option value="">Select relation</option>
              {RELATIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select name="gender" value={form.gender} onChange={handleChange} className="input-field">
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field">
              {BLOOD_GROUPS.map((b) => <option key={b} value={b}>{b || 'Select'}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
          <button type="submit" disabled={loading} className="bg-gray-900 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FamilyMemberModal;
