import { useState, useEffect, useCallback } from 'react';
import { MdShoppingBag, MdSearch, MdRefresh } from 'react-icons/md';
import { getOrders, updateOrder, deleteOrder } from '../services/orderService';
import { getOrderStatusColor, formatCurrency, debounce } from '../utils/helpers';
import OrderDetailModal from '../components/orders/OrderDetailModal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUSES = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  Pending: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  Processing: 'bg-blue-50 text-blue-600 border-blue-100',
  Shipped: 'bg-cyan-50 text-cyan-600 border-cyan-100',
  Delivered: 'bg-green-50 text-green-600 border-green-100',
  Cancelled: 'bg-red-50 text-red-600 border-red-100',
};

const formatDateMid = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const MedicineOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (statusFilter !== 'All') params.status = statusFilter;
      const res = await getOrders(params);
      setOrders(res.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (e, orderId) => {
    e.stopPropagation();
    try {
      await updateOrder(orderId, { status: e.target.value });
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (e, orderId) => {
    e.stopPropagation();
    if (!window.confirm('Delete this order?')) return;
    try {
      await deleteOrder(orderId);
      toast.success('Order deleted');
      fetchOrders();
    } catch {
      toast.error('Failed to delete order');
    }
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(q) ||
      o.userId?.name?.toLowerCase().includes(q) ||
      o.type?.toLowerCase().includes(q) ||
      o.items?.[0]?.name?.toLowerCase().includes(q)
    );
  });

  const counts = STATUSES.slice(1).reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medicine Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {loading ? 'Loading...' : `${orders.length} total orders`}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 bg-white border border-gray-200 px-3 py-2 rounded-lg transition-colors"
        >
          <MdRefresh className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Status stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {STATUSES.slice(1).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? 'All' : s)}
            className={`card p-4 text-left hover:shadow-md transition-all border ${
              statusFilter === s ? 'ring-2 ring-primary-400 border-primary-200' : 'border-transparent'
            }`}
          >
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[s]} mb-2`}>
              {s}
            </span>
            <p className="text-2xl font-bold text-gray-900">{counts[s] ?? 0}</p>
          </button>
        ))}
      </div>

      {/* Search + filter bar */}
      <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by order #, user name, or item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 focus:bg-white transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
        </select>
      </div>

      {/* Orders table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-20"><LoadingSpinner /></div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center">
              <MdShoppingBag className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-500">No orders found</p>
            <p className="text-xs text-gray-400">
              {search ? 'Try a different search term' : 'Orders will appear here once created'}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <span>Order</span>
              <span>Customer</span>
              <span>Type</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            <div className="divide-y divide-gray-50">
              {filtered.map((order) => {
                const displayNum = order.orderNumber
                  ? order.orderNumber.replace(/^ORD-0*/, '')
                  : order._id?.slice(-6).toUpperCase();
                const itemName = order.items?.[0]?.name || 'Unknown item';
                const extra = (order.items?.length || 1) - 1;

                return (
                  <div
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="grid grid-cols-1 sm:grid-cols-[2fr_1.5fr_1fr_1fr_1fr_auto] gap-3 sm:gap-4 px-5 py-4 hover:bg-gray-50 cursor-pointer transition-colors items-center"
                  >
                    {/* Order info */}
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MdShoppingBag className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">Order #{displayNum}</p>
                        <p className="text-xs text-gray-400 truncate">
                          {itemName}{extra > 0 && <span className="text-gray-300"> +{extra} more</span>}
                        </p>
                      </div>
                    </div>

                    {/* Customer */}
                    <p className="text-sm text-gray-700 truncate">
                      {order.userId?.name || <span className="text-gray-400">Unknown</span>}
                    </p>

                    {/* Type */}
                    <p className="text-xs text-gray-500">{order.type || 'Medicine'}</p>

                    {/* Date */}
                    <p className="text-xs text-gray-500">{formatDateMid(order.orderDate || order.createdAt)}</p>

                    {/* Amount */}
                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>

                    {/* Status select */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e, order._id)}
                        className={`text-xs border rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary-500 ${getOrderStatusColor(order.status)} bg-white`}
                      >
                        {STATUSES.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer count */}
            <div className="px-5 py-3 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Showing {filtered.length} of {orders.length} orders
              </p>
            </div>
          </>
        )}
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          user={selectedOrder.userId}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default MedicineOrders;
