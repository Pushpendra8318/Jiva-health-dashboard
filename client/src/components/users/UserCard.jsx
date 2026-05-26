import { useNavigate } from 'react-router-dom';
import { MdEmail, MdPhone, MdWorkspacePremium, MdVisibility, MdEdit, MdDelete } from 'react-icons/md';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import { formatDateShort } from '../../utils/helpers';
import { togglePrime } from '../../services/userService';
import toast from 'react-hot-toast';

const UserCard = ({ user, onEdit, onDelete, onRefresh }) => {
  const navigate = useNavigate();

  const handleUpgradePrime = async (e) => {
    e.stopPropagation();
    try {
      const res = await togglePrime(user._id);
      toast.success(res.message);
      onRefresh?.();
    } catch {
      toast.error('Failed to update prime status');
    }
  };

  return (
    <div className="card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Avatar + Info */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Avatar name={user.name} size="md" />
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <Badge label={user.role} variant={user.role?.toLowerCase()} />
              <Badge label={user.status} variant={user.status?.toLowerCase()} />
            </div>
            <p className="text-xs text-gray-500 mt-1">{user.userType}</p>
          </div>
        </div>

        {/* Contact */}
        <div className="min-w-0 w-48">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MdEmail className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="truncate text-xs">{user.email}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-600 mt-1">
            <MdPhone className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-xs">{user.phone || '-'}</span>
          </div>
        </div>

        {/* Dates */}
        <div className="min-w-0 w-36">
          <p className="text-xs text-gray-500">Joined</p>
          <p className="text-sm font-medium text-gray-800">{formatDateShort(user.joinedDate)}</p>
          <p className="text-xs text-gray-500 mt-1">Last: {formatDateShort(user.lastActive)}</p>
        </div>

        {/* Appointments */}
        <div className="w-24 text-center">
          <p className="text-xs text-gray-500">Appointments</p>
          <p className="text-2xl font-bold text-primary-600">{user.appointmentsCount || 0}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!user.isPrime && (
            <button
              onClick={handleUpgradePrime}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-jiva-orange text-white text-xs font-medium rounded-lg hover:bg-jiva-orange-dark transition-colors"
            >
              <MdWorkspacePremium className="w-3.5 h-3.5" />
              Upgrade to Prime
            </button>
          )}
          {user.isPrime && (
            <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg border border-amber-200">
              <MdWorkspacePremium className="w-3.5 h-3.5" />
              Prime
            </span>
          )}
          <button
            onClick={() => navigate(`/users/${user._id}`)}
            className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <MdVisibility className="w-3.5 h-3.5" />
            View
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(user); }}
            className="flex items-center gap-1 px-3 py-1.5 text-gray-600 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <MdEdit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(user); }}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete user"
          >
            <MdDelete className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
