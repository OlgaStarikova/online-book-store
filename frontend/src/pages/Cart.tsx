import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../lib/AppContext';
import { createOrder } from '../api/orders';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

export function Cart() {
  const { cart, removeFromCart, updateQuantity, reloadCart } = useAppContext();
  const [checkingOut, setCheckingOut] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placing, setPlacing] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.book.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) return;
    setPlacing(true);
    setOrderError('');
    try {
      await createOrder(shippingAddress);
      await reloadCart();
      setOrderSuccess(true);
      setCheckingOut(false);
    } catch {
      setOrderError('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="text-5xl mb-6">🎉</div>
        <h2 className="font-serif text-3xl font-bold mb-4">Order placed!</h2>
        <p className="text-warm-500 mb-8 max-w-md mx-auto">Your order has been placed successfully.</p>
        <div className="flex gap-4">
          <Link to="/orders" className="px-8 py-3 bg-warm-900 hover:bg-warm-800 text-white font-medium rounded-full transition-colors">
            View Orders
          </Link>
          <Link to="/books" className="px-8 py-3 bg-warm-100 hover:bg-warm-200 font-medium rounded-full transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="font-serif text-3xl font-bold mb-4">Your cart is empty</h2>
        <p className="text-warm-500 mb-8 max-w-md mx-auto">Looks like you haven't added any books to your cart yet.</p>
        <Link to="/books" className="px-8 py-3 bg-warm-900 hover:bg-warm-800 text-white font-medium rounded-full transition-colors">
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="font-serif text-3xl font-bold mb-10">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-12">

          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
              <div className="divide-y divide-warm-200">
                {cart.map((item) => (
                  <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                    <div className="w-24 sm:w-32 h-32 sm:h-44 flex-shrink-0 bg-warm-100 rounded-lg overflow-hidden">
                      {item.book.coverImage ? (
                        <img src={item.book.coverImage} alt={item.book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-warm-400 text-xs">No cover</div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link to={`/books/${item.book.id}`}>
                            <h3 className="font-serif text-xl font-bold hover:text-accent-terracotta transition-colors">
                              {item.book.title}
                            </h3>
                          </Link>
                          {item.book.author.name && (
                            <p className="text-warm-500 text-sm">By {item.book.author.name}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {item.book.price > 0 && (
                            <>
                              <p className="font-bold text-lg">${(item.book.price * item.quantity).toFixed(2)}</p>
                              <p className="text-warm-400 text-sm">${item.book.price.toFixed(2)} each</p>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-warm-200 rounded-full bg-warm-50">
                          <button
                            className="p-2 hover:text-accent-terracotta transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            className="p-2 hover:text-accent-indigo transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-warm-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-warm-200 p-6 sticky top-24">
              <h2 className="font-serif text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-warm-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-warm-500">
                  <span>Estimated Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-warm-500">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="pt-4 border-t border-warm-200 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {checkingOut ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Shipping address"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-warm-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent-indigo/50"
                  />
                  {orderError && <p className="text-red-500 text-xs">{orderError}</p>}
                  <button
                    onClick={handleCheckout}
                    disabled={placing || !shippingAddress.trim()}
                    className="w-full py-4 bg-accent-terracotta hover:bg-[#a3360a] text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {placing ? 'Placing...' : 'Place Order'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCheckingOut(false)}
                    className="w-full py-2 text-sm text-warm-500 hover:text-warm-900 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setCheckingOut(true)}
                  className="w-full py-4 bg-accent-terracotta hover:bg-[#a3360a] text-white rounded-full font-medium transition-colors flex items-center justify-center gap-2"
                >
                  Checkout
                  <ArrowRight className="h-5 w-5" />
                </button>
              )}

              <p className="text-warm-400 text-xs text-center mt-4">
                Shipping & taxes are calculated during checkout.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
