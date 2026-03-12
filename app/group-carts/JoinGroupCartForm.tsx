'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinGroupCartForm() {
  const [shareableLink, setShareableLink] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!shareableLink) {
      setError('Please enter a shareable link to join a group cart.');
      return;
    }

    const res = await fetch('/api/group-carts/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareable_link: shareableLink }),
    });

    if (res.ok) {
      setSuccess('Successfully joined the group cart!');
      setShareableLink('');
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Failed to join group cart.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={shareableLink}
        onChange={(e) => setShareableLink(e.target.value)}
        placeholder="Enter Shareable Link"
        className="border p-2 rounded w-full mb-2"
      />
      <button type="submit" className="bg-green-500 text-white p-2 rounded w-full">
        Join Cart
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </form>
  );
}
