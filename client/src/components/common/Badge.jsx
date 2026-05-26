const variants = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  prime: 'bg-amber-50 text-amber-700 border border-amber-200',
  normal: 'bg-gray-100 text-gray-600',
  patient: 'bg-blue-50 text-blue-700',
  doctor: 'bg-purple-50 text-purple-700',
  nurse: 'bg-pink-50 text-pink-700',
  admin: 'bg-red-50 text-red-700',
  delivered: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-700',
  failed: 'bg-red-100 text-red-700',
  default: 'bg-gray-100 text-gray-600',
};

const Badge = ({ label, variant }) => {
  const key = (variant || label || '').toLowerCase();
  const style = variants[key] || variants.default;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
};

export default Badge;
