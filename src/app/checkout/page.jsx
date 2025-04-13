"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { doc, getDoc, collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../helpers/firebaseConfig";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ClientCheckout() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const router = useRouter();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    if (!user) {
      toast.error("Please log in to access checkout.");
      router.push("/login");
    }
  }, [user]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      const productRef = doc(db, "products", productId);
      const productSnap = await getDoc(productRef);
      if (productSnap.exists()) {
        setProduct({ id: productSnap.id, ...productSnap.data() });
        if (user?.email) setBuyerEmail(user.email);
      }
    };
    if (user) fetchProduct();
  }, [productId, user]);

  const handleConfirmPurchase = async () => {
    if (!buyerEmail || !product || !buyerName || !contactNumber || !address || !zipCode) {
      return toast.error("Please fill all fields!");
    }

    try {
      const productImage = product.images?.[0] || product.mainImage || product.imageUrl || "";

      await addDoc(collection(db, "orders"), {
        productId: product.id,
        productName: product.name,
        price: product.price,
        image: productImage,
        buyerEmail,
        buyerName,
        contactNumber,
        address,
        zipCode,
        createdAt: serverTimestamp(),
      });

      toast.success("Order placed successfully!");
      router.push("/order-success");
    } catch (error) {
      toast.error("Failed to place order.");
      console.error(error);
    }
  };

  if (!user || !product) {
    return (
      <p className="text-center mt-10 text-gray-600">Loading checkout...</p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>

      <div className="flex gap-6 items-center">
        <Image
          src={
            product.images?.[0] ||
            product.mainImage ||
            product.imageUrl ||
            "/assets/default-product.jpg"
          }
          alt={product.name}
          width={120}
          height={120}
          className="rounded object-cover"
        />
        <div>
          <p className="text-xl font-semibold">{product.name}</p>
          <p className="text-green-600 text-lg font-medium">₹{product.price}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            value={buyerName}
            onChange={(e) => setBuyerName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Your full name"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            value={buyerEmail}
            disabled
            className="w-full p-3 border border-gray-300 rounded bg-gray-100"
            placeholder="Your email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Contact Number</label>
          <input
            type="tel"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Mobile number"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Zip Code</label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Postal code"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block mb-1 font-medium">Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded"
            placeholder="Full delivery address"
            rows={3}
          />
        </div>
      </div>

      <button
        onClick={handleConfirmPurchase}
        className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded font-semibold hover:bg-blue-700 transition"
      >
        ✅ Confirm Purchase
      </button>
    </div>
  );
}
