"use client"

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../helpers/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");

  const handleSignup = async () => {
    if (!email || !password || !username || !address || !zip)
      return toast.error("Please fill in all fields");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store extra details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        username,
        address,
        zip,
        createdAt: new Date(),
      });

      toast.success("Account created!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>
      <div className="space-y-4">
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
        <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
        <input type="text" placeholder="Zip Code" value={zip} onChange={(e) => setZip(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border border-gray-300 rounded" />
        <button onClick={handleSignup} className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition">Sign Up</button>
      </div>
    </div>
  );
}
