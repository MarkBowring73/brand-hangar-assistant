import { useState } from 'react';

export default function OrderLookup() {
  const [orderNumber, setOrderNumber] = useState('');
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      const response = await fetch(`https://backend-api-xlt6.onrender.com/api/order?ordernumber=${orderNumber}`);

      const data = await response.json();

      if (response.ok) {
        setOrderData(data[0]);
        setError(null);
      } else {
        setError(data.error?.MessageDetail || 'Error fetching order');
        setOrderData(null);
      }
    } catch (err) {
      setError('Network error');
      setOrderData(null);
    }
  };

  const getStatusDetails = (statusId) => {
    const map = {
      1: { label: 'NEW', color: 'bg-gray-200 text-gray-800' },
      2: { label: 'PRINTED', color: 'bg-blue-200 text-blue-800' },
      3: { label: 'CANCELLED', color: 'bg-red-200 text-red-800' },
      4: { label: 'DESPATCHED', color: 'bg-green-200 text-green-800' },
      5: { label: 'INVOICED', color: 'bg-indigo-200 text-indigo-800' },
      6: { label: 'INVOICE FAILED', color: 'bg-red-300 text-red-900' },
      7: { label: 'HOLDING', color: 'bg-yellow-200 text-yellow-800' },
      8: { label: 'FAILED', color: 'bg-red-300 text-red-900' },
      9: { label: 'ON BACKORDER', color: 'bg-orange-200 text-orange-800' },
      10: { label: 'AWAITING CONFIRMATION', color: 'bg-yellow-100 text-yellow-700' },
      11: { label: 'AWAITING DOCUMENTATION', color: 'bg-yellow-100 text-yellow-700' },
      12: { label: 'AWAITING PAYMENT', color: 'bg-yellow-100 text-yellow-700' },
      13: { label: 'QUERY RAISED', color: 'bg-red-100 text-red-700' },
      14: { label: 'PACK AND HOLD', color: 'bg-blue-100 text-blue-700' },
      15: { label: 'AWAITING PICKING', color: 'bg-purple-200 text-purple-800' },
      16: { label: 'PICKING STARTED', color: 'bg-purple-300 text-purple-900' },
      17: { label: 'PICKED', color: 'bg-teal-200 text-teal-800' },
      18: { label: 'FRAUD RISK', color: 'bg-red-400 text-white' },
      19: { label: 'PICKING SKIPPED', color: 'bg-yellow-200 text-yellow-800' },
      20: { label: 'PACKED', color: 'bg-green-100 text-green-800' }
    };

    return map[parseInt(statusId)] || {
      label: `Unknown (ID: ${statusId})`,
      color: 'bg-gray-100 text-gray-600'
    };
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Order Lookup</h2>
      <input
        type="text"
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        placeholder="Enter order number"
        className="border p-2 rounded mr-2"
      />
      <button onClick={fetchOrder} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {orderData && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Order: {orderData.OrderNumber}</h3>
          <p><strong>Name:</strong> {orderData.FirstName} {orderData.LastName}</p>
          <p><strong>Email:</strong> {orderData.Email}</p>
          <p className="flex items-center gap-2">
            <strong>Status:</strong>
            <span className={`px-2 py-1 text-sm font-semibold rounded ${getStatusDetails(orderData.OrderStatusId).color}`}>
              {getStatusDetails(orderData.OrderStatusId).label}
            </span>
          </p>
          <p><strong>Total Items:</strong> {orderData.TotalItems}</p>
          <p><strong>Value:</strong> £{orderData.OrderValue}</p>
          <p><strong>Shipping:</strong> {orderData.Address1}, {orderData.Town}, {orderData.PostCode}</p>
          {orderData.TrackingURL && (
            <p>
              <strong>Tracking:</strong>{' '}
              <a
                href={orderData.TrackingURL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Track your order
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
