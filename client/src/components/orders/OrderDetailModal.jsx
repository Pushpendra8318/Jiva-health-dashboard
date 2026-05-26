import { MdClose, MdShoppingBag, MdLocalShipping, MdCreditCard, MdCalendarToday, MdLocationOn, MdReceipt } from 'react-icons/md';
import { formatDateShort, formatCurrency, getOrderStatusColor } from '../../utils/helpers';

const DELIVERY_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const OrderDetailModal = ({ order, user, onClose }) => {
  if (!order) return null;

  const stepIndex = DELIVERY_STEPS.indexOf(order.status);
  const isCancelled = order.status === 'Cancelled';

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
              <MdReceipt className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Order #{order.orderNumber ? order.orderNumber.replace(/^ORD-0*/, '') : order._id?.slice(-6).toUpperCase()}
              </h2>
              <p className="text-xs text-gray-400">{formatDateShort(order.orderDate || order.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
              {order.status}
            </span>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <MdClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Delivery Status Timeline */}
          {!isCancelled && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <MdLocalShipping className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-semibold text-gray-900">Delivery Status</h3>
              </div>
              <div className="relative">
                {/* Progress bar */}
                <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200">
                  <div
                    className="h-full bg-primary-500 transition-all duration-500"
                    style={{ width: stepIndex === -1 ? '0%' : `${(stepIndex / (DELIVERY_STEPS.length - 1)) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between relative">
                  {DELIVERY_STEPS.map((step, i) => {
                    const done = i <= stepIndex;
                    const current = i === stepIndex;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10
                          ${done ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}
                          ${current ? 'ring-4 ring-primary-100' : ''}
                        `}>
                          {done ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : i + 1}
                        </div>
                        <span className={`text-[10px] font-medium ${done ? 'text-primary-600' : 'text-gray-400'}`}>
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {order.deliveryDate && order.status === 'Delivered' && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Delivered on {formatDateShort(order.deliveryDate)}
                </p>
              )}
            </div>
          )}

          {isCancelled && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MdClose className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700">Order Cancelled</p>
                <p className="text-xs text-red-400">This order has been cancelled.</p>
              </div>
            </div>
          )}

          {/* Itemised List */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <MdShoppingBag className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900">Order Items</h3>
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                  <div className="w-10 h-10 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MdShoppingBag className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Qty: {item.quantity} &nbsp;×&nbsp; {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                    {formatCurrency((item.quantity || 1) * item.price)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Delivery Fee</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total Amount</span>
                <span className="text-primary-600">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MdLocationOn className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900">Shipping Address</h3>
            </div>
            {defaultAddress ? (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MdLocationOn className="w-4 h-4 text-primary-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{defaultAddress.type || 'Home'}</p>
                    {defaultAddress.isDefault && (
                      <span className="text-xs bg-primary-50 text-primary-600 px-1.5 py-0.5 rounded-full border border-primary-100">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{user?.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                    {defaultAddress.area}<br />
                    {defaultAddress.city}, {defaultAddress.state} – {defaultAddress.pinCode}<br />
                    {defaultAddress.country}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No address on file</p>
            )}
          </div>

          {/* Payment Info */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-3">
              <MdCreditCard className="w-4 h-4 text-primary-600" />
              <h3 className="text-sm font-semibold text-gray-900">Payment Information</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Amount Paid', value: formatCurrency(order.totalAmount) },
                { label: 'Payment Status', value: 'Completed', badge: true },
                { label: 'Order Date', value: formatDateShort(order.orderDate || order.createdAt) },
                { label: 'Order Type', value: order.type || 'Medicine' },
              ].map(({ label, value, badge }) => (
                <div key={label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  {badge ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      {value}
                    </span>
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
