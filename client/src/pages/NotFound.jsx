import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
    <div className="text-8xl font-black text-gray-200">404</div>
    <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
    <p className="text-gray-500 text-sm">The page you're looking for doesn't exist.</p>
    <Link to="/dashboard" className="btn-primary mt-2">Go to Dashboard</Link>
  </div>
);

export default NotFound;
