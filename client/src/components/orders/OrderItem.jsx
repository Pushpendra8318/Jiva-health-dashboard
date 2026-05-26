import { MdShoppingBag, MdDelete, MdChevronRight } from 'react-icons/md';
import { getOrderStatusColor, formatDateShort, formatCurrency } from '../../utils/helpers';
import { updateOrder, deleteOrder } from '../../services/orderService';
import toast from 'react-hot-toast';
import { useState } from 'react';

const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const OrderItem = ({ order, onRefresh, onViewDetail }) => {
  const [deleting, setDeleting] = useState(false);

  const handleStatusChange = async (e) => {
    e.stopPropagation();
    try {
      await updateOrder(order._id, { status: e.target.value });
      toast.success('Order status updated');
      onRefresh?.();
    } catch {
      toast.error('Failed to update order');
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this order?')) return;
    setDeleting(true);
    try {
      await deleteOrder(order._id);
      toast.success('Order deleted');
      onRefresh?.();
    } catch {
      toast.error('Failed to delete order');
    } finally {
      setDeleting(false);
    }
  };

  const itemName = order.items?.[0]?.name || 'Unknown item';
  const statusColor = getOrderStatusColor(order.status);
  const extraItems = (order.items?.length || 1) - 1;
  const displayNumber = order.orderNumber
    ? order.orderNumber.replace(/^ORD-0*/, '')
    : order._id?.slice(-6).toUpperCase();

  return (
    <div
      onClick={() => onViewDetail?.(order)}
      className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50 rounded-xl px-2 -mx-2 transition-colors group"
    >
      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <MdShoppingBag className="w-5 h-5 text-primary-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900">
            Order #{displayNumber}
          </p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
            {order.status}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {itemName}
          {extraItems > 0 && <span className="text-gray-400"> +{extraItems} more</span>}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {formatDateShort(order.orderDate || order.createdAt)}
          &nbsp;·&nbsp;
          <span className="font-medium text-gray-600">{formatCurrency(order.totalAmount)}</span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <select
          value={order.status}
          onChange={handleStatusChange}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <MdDelete className="w-4 h-4" />
        </button>
      </div>

      <MdChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 flex-shrink-0 transition-colors" />
    </div>
  );
};

export default OrderItem;
