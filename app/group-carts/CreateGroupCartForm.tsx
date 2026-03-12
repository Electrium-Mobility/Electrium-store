'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateGroupCartForm() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name) {
      setError('Please enter a name for your group cart.');
      return;
    }

    const res = await fetch('/api/group-carts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (res.ok) {
      setSuccess(`Group cart created! Shareable link: ${data.shareable_link}`);
      setName('');
      router.refresh(); // Refresh the page to show the new cart
    } else {
      setError(data.error || 'Failed to create group cart.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Group Cart Name"
        className="border p-2 rounded w-full mb-2"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
        Create Cart
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </form>
  );
}
