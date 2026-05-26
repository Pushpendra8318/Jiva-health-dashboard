import { getInitials, getAvatarColor } from '../../utils/helpers';

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
};

const Avatar = ({ name, size = 'md', className = '' }) => {
  const colorClass = getAvatarColor(name);
  const sizeClass = sizeMap[size] || sizeMap.md;

  return (
    <div className={`${colorClass} ${sizeClass} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
