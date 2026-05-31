import { useEffect, useState } from 'react';
import { getOrders } from '../api/orders';
import type { OrderDto } from '../types';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Очікує',
  DELIVERED: 'Доставлено',
  COMPLETED: 'Завершено',
  CANCELLED: 'Скасовано',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="loading">Завантаження...</div>;

  return (
    <div className="page">
      <h1>Мої замовлення</h1>
      {orders.length === 0 ? (
        <div className="empty">Замовлень ще немає</div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <span className="order-id">Замовлення #{order.id}</span>
                <span className={`order-status status-${order.status.toLowerCase()}`}>
                  {STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              <div className="order-meta">
                <span>{new Date(order.orderDate).toLocaleDateString('uk-UA')}</span>
                <span className="order-total">Сума: {Number(order.total).toFixed(2)} ₴</span>
              </div>
              <div className="order-items">
                {order.orderItemDtos.map((item) => (
                  <div key={item.id} className="order-item">
                    Книга #{item.bookId} × {item.quantity}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
