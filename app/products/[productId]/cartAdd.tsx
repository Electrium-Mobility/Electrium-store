"use client";
import { Bike } from "@/utils/getBike";
import { useState, useEffect } from "react";
import { LoadingButton } from "@/components/ui/LoadingSpinner";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function CartAdd({ bike }: { bike: Bike }) {
  const [amount, setAmount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCart, setSelectedCart] = useState<string>('personal');
  const [groupCarts, setGroupCarts] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchGroupCarts = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase.rpc('get_user_group_carts');
        if (data) {
          setGroupCarts(data);
        }
      }
    };

    fetchGroupCarts();
  }, [supabase]);

  async function addToCart() {
    if (amount <= 0 || amount > bike.amount_stocked || isLoading) return;

    setIsLoading(true);

    let url = '';
    let body: any = {};

    if (selectedCart === 'personal') {
      url = '/api/personal-cart/items';
      body = {
        product_id: bike.bike_id,
        quantity: amount,
      };
    } else {
      url = `/api/group-carts/${selectedCart}/items`;
      body = {
        product_id: bike.bike_id,
        quantity: amount,
      };
    }

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to add item to cart');
      }

      // Maybe show a success notification
      alert('Item added to cart!');

    } catch (error: any) {
      console.error("Error adding to cart:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-4 mb-6">
      <input
        id="select_amount"
        type="number"
        value={amount}
        min={1}
        max={bike.amount_stocked}
        className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-2 w-20 text-center text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
        onChange={(e) => setAmount(parseInt(e.currentTarget.value) || 1)}
      />
      <select
        value={selectedCart}
        onChange={(e) => setSelectedCart(e.target.value)}
        className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-2 rounded text-[hsl(var(--text-primary))]"
      >
        <option value="personal">My Cart</option>
        {groupCarts.map((cart) => (
          <option key={cart.id} value={cart.id}>{cart.name}</option>
        ))}
      </select>
      <LoadingButton
        isLoading={isLoading}
        className={`px-6 py-2 rounded transition-colors ${
          amount <= 0 || amount > bike.amount_stocked
            ? "bg-[hsl(var(--surface-secondary))] text-[hsl(var(--text-muted))] cursor-not-allowed"
            : "bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] hover:bg-[hsl(var(--btn-primary-hover))]"
        }`}
        onClick={addToCart}
        disabled={amount <= 0 || amount > bike.amount_stocked}
      >
        {bike.for_rent ? "Rent Now" : "Add to Cart"}
      </LoadingButton>
    </div>
  );
}
