import { MdCreditCard, MdAccountBalanceWallet, MdPayment, MdMoney } from 'react-icons/md';
import { getPaymentStatusColor, formatDateShort, formatCurrency } from '../../utils/helpers';

const METHOD_ICONS = {
  Card: MdCreditCard,
  UPI: MdAccountBalanceWallet,
  'Net Banking': MdPayment,
  Cash: MdMoney,
  Wallet: MdAccountBalanceWallet,
};

const METHOD_COLORS = {
  Card: 'bg-blue-50 text-blue-600',
  UPI: 'bg-purple-50 text-purple-600',
  'Net Banking': 'bg-indigo-50 text-indigo-600',
  Cash: 'bg-green-50 text-green-600',
  Wallet: 'bg-amber-50 text-amber-600',
};

const PaymentItem = ({ payment }) => {
  const statusColor = getPaymentStatusColor(payment.status);
  const orderAmount = payment.orderId?.totalAmount;
  const MethodIcon = METHOD_ICONS[payment.method] || MdCreditCard;
  const methodColor = METHOD_COLORS[payment.method] || 'bg-gray-50 text-gray-600';
  const shortId = payment._id?.slice(-8).toUpperCase();

  return (
    <div className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0">
      {/* Icon */}
      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
        <MdCreditCard className="w-5 h-5 text-green-600" />
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-semibold text-gray-900">{payment.type}</p>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
            {payment.status}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {payment.description && <span className="mr-2">{payment.description}</span>}
          <span>{formatDateShort(payment.paymentDate || payment.createdAt)}</span>
          {orderAmount && <span className="ml-2 text-gray-300">·</span>}
          {orderAmount && <span className="ml-2">{formatCurrency(orderAmount)}</span>}
        </p>
        {/* Payment ID */}
        <p className="text-[10px] text-gray-300 font-mono mt-0.5">ID: #{shortId}</p>
      </div>

      {/* Method badge */}
      <div className={`hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${methodColor} flex-shrink-0`}>
        <MethodIcon className="w-3 h-3" />
        {payment.method || 'Card'}
      </div>

      {/* Amount */}
      <p className="text-sm font-bold text-gray-900 flex-shrink-0 text-right">
        {formatCurrency(payment.amount)}
      </p>
    </div>
  );
};

export default PaymentItem;
