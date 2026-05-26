const StatCard = ({ label, value, color = 'text-gray-800' }) => {
  return (
    <div className="card p-5 flex-1 min-w-0">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${color}`}>{value}</p>
    </div>
  );
};

export default StatCard;
