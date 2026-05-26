import { useState } from 'react';
import { MdClose, MdAdd, MdDelete, MdShoppingBag } from 'react-icons/md';
import { createOrder } from '../../services/orderService';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ORDER_TYPES = ['Medicine', 'Lab Test', 'Consultation', 'Ambulance', 'Prime Subscription'];
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AddOrderModal = ({ userId, onClose, onSuccess }) => {
  const [form, setForm] = useState({ type: 'Medicine', status: 'Pending' });
  const [items, setItems] = useState([{ name: '', quantity: 1, price: '' }]);
  const [loading, setLoading] = useState(false);

  const totalAmount = items.reduce(
    (sum, item) => sum + (parseInt(item.quantity) || 1) * (parseFloat(item.price) || 0),
    0,
  );

  const addItem = () => setItems((prev) => [...prev, { name: '', quantity: 1, price: '' }]);

  const removeItem = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const updateItem = (i, field, value) =>
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validItems = items.filter((i) => i.name.trim());
    if (validItems.length === 0) { toast.error('Add at least one item with a name'); return; }
    setLoading(true);
    try {
      await createOrder({
        userId,
        ...form,
        items: validItems.map((i) => ({
          name: i.name.trim(),
          quantity: parseInt(i.quantity) || 1,
          price: parseFloat(i.price) || 0,
        })),
        totalAmount,
        orderDate: new Date(),
      });
      toast.success('Order created successfully');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
              <MdShoppingBag className="w-5 h-5 text-primary-600" />
            </div>
            <h2 className="text-base font-bold text-gray-900">Add New Order</h2>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Type & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Order Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all"
              >
                {ORDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:bg-white transition-all"
              >
                {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Order Items</label>
              <button
                type="button"
                onClick={addItem}
                className="flex items-center gap-1 text-xs text-primary-600 font-medium hover:text-primary-700 transition-colors"
              >
                <MdAdd className="w-4 h-4" /> Add Item
              </button>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr_56px_80px_32px] gap-2 mb-1.5 px-1">
              <p className="text-xs text-gray-400">Item name</p>
              <p className="text-xs text-gray-400 text-center">Qty</p>
              <p className="text-xs text-gray-400 text-center">Price (₹)</p>
              <span />
            </div>

            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-[1fr_56px_80px_32px] gap-2 items-center">
                  <input
                    type="text"
                    placeholder="e.g. Paracetamol 500mg"
                    value={item.name}
                    onChange={(e) => updateItem(i, 'name', e.target.value)}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 focus:bg-white"
                    required
                  />
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(i, 'quantity', e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 focus:bg-white"
                  />
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="0"
                    value={item.price}
                    onChange={(e) => updateItem(i, 'price', e.target.value)}
                    className="border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary-400 bg-gray-50 focus:bg-white"
                  />
                  {items.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <MdDelete className="w-4 h-4" />
                    </button>
                  ) : <span />}
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between py-3.5 px-4 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Total Amount</span>
            <span className="text-lg font-bold text-primary-600">{formatCurrency(totalAmount)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium disabled:opacity-60 hover:bg-primary-700 transition-colors"
            >
              {loading ? 'Creating...' : 'Create Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
