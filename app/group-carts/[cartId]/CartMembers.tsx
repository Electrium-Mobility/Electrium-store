'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth'; // Assuming you have a hook for auth status

export default function CartMembers({ members, cartId, ownerId }: { members: any[], cartId: string, ownerId: string }) {
  const router = useRouter();
  const { user } = useAuth(); // Custom hook to get current user

  const handleRemoveMember = async (userId: string) => {
    if (userId === ownerId) {
      alert("You cannot remove the owner of the group cart.");
      return;
    }
    
    await fetch(`/api/group-carts/${cartId}/members/${userId}`, {
      method: 'DELETE',
    });
    router.refresh();
  };

  return (
    <div className="border rounded-lg p-4">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between mb-2">
          <p>{member.email}</p>
          {user?.id === ownerId && user?.id !== member.id && (
            <button onClick={() => handleRemoveMember(member.id)} className="text-red-500 text-sm">
              Remove
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
