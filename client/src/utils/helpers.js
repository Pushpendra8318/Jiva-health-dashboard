export const getInitials = (name) => {
  if (!name) return '??';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateShort = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0.00';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

export const getAvatarColor = (name) => {
  const colors = [
    'bg-blue-500', 'bg-purple-500', 'bg-green-600', 'bg-teal-500',
    'bg-indigo-500', 'bg-pink-500', 'bg-orange-500', 'bg-cyan-600',
  ];
  if (!name) return colors[0];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'badge-active';
    case 'Inactive': return 'badge-inactive';
    default: return 'badge-inactive';
  }
};

export const getOrderStatusColor = (status) => {
  const map = {
    Delivered: 'bg-green-100 text-green-700',
    Processing: 'bg-blue-100 text-blue-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Shipped: 'bg-cyan-100 text-cyan-700',
    Cancelled: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

export const getPaymentStatusColor = (status) => {
  const map = {
    Completed: 'bg-green-100 text-green-700',
    Pending: 'bg-yellow-100 text-yellow-700',
    Failed: 'bg-red-100 text-red-700',
    Refunded: 'bg-purple-100 text-purple-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};
