import { useLocation } from 'react-router-dom';

const PlaceholderPage = () => {
  const { pathname } = useLocation();
  const name = pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-3xl">🏗️</span>
      </div>
      <h2 className="text-xl font-semibold text-gray-700">{name}</h2>
      <p className="text-sm text-gray-400">This page is under construction</p>
    </div>
  );
};

export default PlaceholderPage;
