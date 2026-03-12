'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartItems({ items, cartId }: { items: any[], cartId: string }) {
  const router = useRouter();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    await fetch(`/api/group-carts/${cartId}/items/${itemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity }),
    });
    router.refresh();
  };

  const handleRemoveItem = async (itemId: string) => {
    await fetch(`/api/group-carts/${cartId}/items/${itemId}`, {
      method: 'DELETE',
    });
    router.refresh();
  };
  
  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.product_price * item.quantity, 0).toFixed(2);
  }

  return (
    <div className="border rounded-lg p-4">
      {items.length === 0 ? (
        <p>This cart is empty.</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <img src={item.product_image} alt={item.product_name} className="w-16 h-16 object-cover mr-4" />
                <div>
                  <p className="font-semibold">{item.product_name}</p>
                  <p className="text-sm text-gray-500">Added by: {item.user_email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="border p-1 rounded w-16 text-center"
                />
                <p className="mx-4 font-semibold">${(item.product_price * item.quantity).toFixed(2)}</p>
                <button onClick={() => handleRemoveItem(item.id)} className="text-red-500">
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl mt-4">
            Total: ${calculateTotal()}
          </div>
        </>
      )}
    </div>
  );
}
