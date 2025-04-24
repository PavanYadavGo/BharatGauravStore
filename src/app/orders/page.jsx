'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../helpers/firebaseConfig';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to view your orders.');
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const ordersRef = collection(db, 'users', user.uid, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const fetchedOrders = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(fetchedOrders);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load orders.');
        console.error(error);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading your orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="text-center mt-10 text-gray-500">No orders found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="p-4 border border-gray-300 rounded shadow-sm flex gap-4 items-center">
            <Image
              src={order.image || '/assets/default-product.jpg'}
              alt={order.productName}
              width={100}
              height={100}
              className="object-cover rounded"
            />
            <div>
              <h2 className="text-lg font-semibold">{order.productName}</h2>
              <p>Qty: {order.quantity}</p>
              <p>Total: ₹{order.price}</p>
              <p className="text-sm text-gray-600">
                Payment: {order.paymentMethod?.toUpperCase()} | Ordered on:{" "}
                {order.createdAt?.toDate?.().toLocaleDateString() || "N/A"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
