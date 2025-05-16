'use client';

import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth(); // You’ll define this
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const router = useRouter();

  const handleSave = async () => {
    try {
      await updateUserProfile({ displayName, photoURL });
      alert('Profile updated successfully!');
      router.push('/');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
      <label className="block mb-2 text-sm">Display Name</label>
      <input
        className="w-full p-2 mb-4 border rounded"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <label className="block mb-2 text-sm">Profile Photo URL</label>
      <input
        className="w-full p-2 mb-4 border rounded"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
      />
      <button
        onClick={handleSave}
        className="bg-[#ff6740] text-white px-4 py-2 rounded hover:opacity-90"
      >
        Save Changes
      </button>
    </div>
  );
}
