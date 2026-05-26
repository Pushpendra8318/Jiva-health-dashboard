import { MdPhone, MdCalendarToday, MdEdit, MdDelete } from 'react-icons/md';
import Avatar from '../common/Avatar';
import { formatDateShort } from '../../utils/helpers';

const FamilyMemberCard = ({ member, onEdit, onDelete }) => {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <Avatar name={member.name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{member.name}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 mt-0.5">
            {member.relation}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <MdPhone className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-xs text-gray-500">{member.phone || '-'}</span>
          </div>
          {member.dateOfBirth && (
            <div className="flex items-center gap-1 mt-0.5">
              <MdCalendarToday className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs text-gray-500">{formatDateShort(member.dateOfBirth)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit?.(member)}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MdEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete?.(member)}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <MdDelete className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberCard;
