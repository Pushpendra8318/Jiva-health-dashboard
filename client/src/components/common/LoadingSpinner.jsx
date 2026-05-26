const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClass = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }[size] || 'w-10 h-10';

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div className={`${sizeClass} border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
