import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { createOrder, processPayment } from '@/lib/api';
import SEOHead from '@/components/SEOHead';

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCart();
    const { format } = useCurrency();
    const navigate = useNavigate();
    const [address, setAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
    const [loading, setLoading] = useState(false);
    const [paymentMethod] = useState('PayHere(Mock)');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;
        setLoading(true);

        try {
            // 1. Create Order
            const order = await createOrder({
                orderItems: items.map(item => ({ ...item, product: item.id })),
                shippingAddress: address,
                paymentMethod,
                itemsPrice: totalPrice,
                taxPrice: 0,
                shippingPrice: 0,
                totalPrice: totalPrice,
            });

            // 2. Process mock payment
            await processPayment({
                amount: totalPrice,
                orderId: order._id,
            });

            clearCart();
            alert('Order placed and payment processed successfully!');
            navigate('/');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Error processing checkout. Please ensure you are logged in.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-charcoal pt-32 text-center text-ivory">
                <h2 className="font-display text-3xl mb-4">Your cart is empty</h2>
                <button onClick={() => navigate('/shop')} className="text-gold font-mono uppercase text-sm">Return to Shop</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-charcoal pt-32 pb-16 px-4">
            <SEOHead
                title="Checkout — Silonka"
                description="Complete your order for premium Ceylon spices from Silonka."
                canonicalPath="/checkout"
                noIndex={true}
            />
            <div className="max-w-3xl mx-auto bg-charcoal-card p-8 rounded-card border border-white/5">
                <h1 className="font-display text-3xl text-ivory mb-8">Checkout</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <h2 className="font-mono text-label text-gold uppercase mb-4">Shipping Address</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input type="text" placeholder="Address" required value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} className="col-span-1 sm:col-span-2 px-4 py-3 rounded bg-charcoal border border-white/10 text-ivory focus:border-gold/50 outline-none" />
                            <input type="text" placeholder="City" required value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="px-4 py-3 rounded bg-charcoal border border-white/10 text-ivory focus:border-gold/50 outline-none" />
                            <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={e => setAddress({ ...address, postalCode: e.target.value })} className="px-4 py-3 rounded bg-charcoal border border-white/10 text-ivory focus:border-gold/50 outline-none" />
                            <input type="text" placeholder="Country" required value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} className="col-span-1 sm:col-span-2 px-4 py-3 rounded bg-charcoal border border-white/10 text-ivory focus:border-gold/50 outline-none" />
                        </div>
                    </div>
                    <div>
                        <h2 className="font-mono text-label text-gold uppercase mb-4">Order Summary</h2>
                        <div className="bg-charcoal p-4 rounded border border-white/5 mb-4 space-y-2">
                            {items.map(item => (
                                <div key={item.id} className="flex justify-between text-ivory text-sm">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span className="font-mono">{ format(item.price * item.quantity)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between text-gold font-display text-xl border-t border-white/10 pt-4">
                            <span>Total</span>
                            <span>{format(totalPrice)}</span>
                        </div>
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-gold text-charcoal font-mono uppercase tracking-widest rounded hover:bg-gold-light disabled:opacity-50">
                        {loading ? 'Processing...' : `Pay with ${paymentMethod}`}
                    </button>
                </form>
            </div>
        </div>
    );
}
