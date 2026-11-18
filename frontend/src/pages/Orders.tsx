import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders';
import type { OrderDto } from '../types';
import { ClipboardList } from 'lucide-react';

export function Orders() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-12 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-warm-200 h-24 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <ClipboardList className="h-16 w-16 text-warm-300 mx-auto mb-6" />
        <h2 className="font-serif text-3xl font-bold mb-4">No orders yet</h2>
        <p className="text-warm-500 mb-8 max-w-md mx-auto">You haven't placed any orders yet. Discover books in our catalog!</p>
        <Link to="/books" className="px-8 py-3 bg-warm-900 hover:bg-warm-800 text-white font-medium rounded-full transition-colors">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold mb-10">My Orders</h1>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-warm-200 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-warm-900">Order #{order.id}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      order.status === 'DELIVERED'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-warm-100 text-warm-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-warm-500">
                    {new Date(order.orderDate).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                  <p className="text-sm text-warm-500 mt-1">
                    {order.orderItemDtos?.length ?? 0} item(s)
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-warm-900">${order.total?.toFixed(2) ?? '—'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
