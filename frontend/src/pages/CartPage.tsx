import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeCartItem, updateCartItem } from '../api/cart';
import { createOrder } from '../api/orders';
import type { ShoppingCartDto } from '../types';

export default function CartPage() {
  const [cart, setCart] = useState<ShoppingCartDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [ordering, setOrdering] = useState(false);
  const navigate = useNavigate();

  const loadCart = async () => {
    setLoading(true);
    try {
      const res = await getCart();
      setCart(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (itemId: number) => {
    await removeCartItem(itemId);
    loadCart();
  };

  const handleUpdateQty = async (itemId: number, qty: number) => {
    if (qty < 1) return;
    const res = await updateCartItem(itemId, qty);
    setCart(res.data);
  };

  const handleOrder = async () => {
    if (!address.trim()) return alert('Введіть адресу доставки');
    setOrdering(true);
    try {
      await createOrder(address);
      navigate('/orders');
    } finally {
      setOrdering(false);
    }
  };

  if (loading) return <div className="loading">Завантаження...</div>;

  const items = cart?.cartItemDtos ?? [];

  return (
    <div className="page">
      <h1>Кошик</h1>
      {items.length === 0 ? (
        <div className="empty">
          <p>Кошик порожній</p>
          <button className="btn btn-primary" onClick={() => navigate('/books')}>
            До каталогу
          </button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-title">{item.bookTitle}</span>
                </div>
                <div className="cart-item-controls">
                  <button className="qty-btn" onClick={() => handleUpdateQty(item.id, item.quantity - 1)}>−</button>
                  <span className="qty-value">{item.quantity}</span>
                  <button className="qty-btn" onClick={() => handleUpdateQty(item.id, item.quantity + 1)}>+</button>
                  <button className="btn btn-danger" onClick={() => handleRemove(item.id)}>Видалити</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h2>Оформити замовлення</h2>
            <div className="field">
              <label>Адреса доставки</label>
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="м. Київ, вул. Хрещатик 1"
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={handleOrder}
              disabled={ordering}
            >
              {ordering ? 'Оформлення...' : 'Замовити'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
