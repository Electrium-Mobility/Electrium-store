"use client";
import { Bike, CheckoutBike } from "@/utils/getBike";
import { MouseEventHandler, useState } from "react";
import Link from "next/link";

function CartNotification({
  setNotifInfo,
  bike,
  subtotal,
  quantity,
  numItems,
}: {
  setNotifInfo: React.SetStateAction<any>;
  bike: Bike;
  subtotal: number;
  quantity: number;
  numItems: number;
}) {
  return (
    <div className="w-80 absolute mt-24 right-6 rounded-xl bg-[hsl(var(--surface))] space-y-7 flex-col align-center p-6 drop-shadow-lg">
      <div className="flex flex-row justify-between">
        <h1 className="text-base font-bold text-[hsl(var(--text-primary))]">
          Your Shopping Cart
        </h1>
        <button onClick={() => setNotifInfo(undefined)}>
          <i className="fas fa-xmark text-[hsl(var(--text-primary))]"></i>
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-self-start text-sm text-[hsl(var(--text-primary))]">
          Subtotal: &nbsp;<div className="font-semibold"> CA${subtotal}</div>
        </div>
        <div className="flex flex-row justify-self-end text-sm text-[hsl(var(--text-primary))]">
          <div className="font-semibold">{numItems}</div>&nbsp;item
        </div>
      </div>
      <div className="flex flex-row space-x-4">
        <img
          src={String(bike.image)}
          className="w-1/3 border-2 border-[hsl(var(--border))] bg-[hsl(var(--background))] rounded-xl"
        />
        <div className="flex-col">
          <div className="text-sm text-[hsl(var(--text-primary))]">
            {bike.name}
          </div>
          <div className="text-sm text-[hsl(var(--text-primary))]">
            {bike.for_rent 
              ? `CA$${bike.rental_rate?.toFixed(2) || "0.00"} per hour`
              : `CA$${bike.sell_price}`
            }
          </div>
          <div className="text-sm text-[hsl(var(--text-muted))]">
            Quantity: {quantity}
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <Link
          href="/cart"
          className="w-100 h-100 text-center bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] p-3 text-m rounded-2xl hover:bg-[hsl(var(--btn-primary-hover))]"
        >
          View and Edit Cart
        </Link>
        <Link href="/checkout">
          <button className="w-100 h-100 text-center bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] p-3 text-m rounded-2xl hover:bg-[hsl(var(--btn-primary-hover))]">
            Secure Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function CartAdd({ bike }: { bike: Bike }) {
  const [amount, setAmount] = useState<number>(1);
  const [notifInfo, setNotifInfo] = useState<{
    bike: Bike;
    subtotal: number;
    quantity: number;
    numItems: number;
  }>();
  function addToCart(e: React.MouseEvent<HTMLButtonElement>) {
    if (amount == 0 || amount > bike.amount_stocked) return;
    var val = sessionStorage.getItem("cart");
    var currentCart: CheckoutBike[] = [];
    if (val) {
      currentCart = JSON.parse(val);
    }
    var existingBike = currentCart.findIndex((b) => b.bike_id === bike.bike_id);
    if (existingBike != -1) {
      currentCart[existingBike].quantity = amount;
    } else {
      currentCart.push({
        ...bike,
        quantity: amount,
        orderType: bike.for_rent ? "rent" : "buy",
      });
    }
    const cartString = JSON.stringify(currentCart);
    sessionStorage.setItem("cart", cartString);

    // Dispatch custom event for same-window updates
    window.dispatchEvent(
      new CustomEvent("sessionStorageChange", {
        detail: { key: "cart", value: cartString },
      })
    );

    setNotifInfo({
      bike: bike,
      subtotal: currentCart.reduce(
        (acc: number, cur: CheckoutBike) =>
          acc + (cur.orderType == "rent" ? 0 : cur.sell_price * cur.quantity),
        0
      ),
      quantity: amount,
      numItems: currentCart.length,
    });
  }
  return (
    <div className="flex items-center gap-4 mb-6">
      <input
        id="select_amount"
        type="number"
        defaultValue={0}
        min={0}
        max={bike.amount_stocked}
        className="border border-[hsl(var(--border))] bg-[hsl(var(--surface))] p-2 w-16 text-center text-[hsl(var(--text-primary))] focus:ring-2 focus:ring-[hsl(var(--border-focus))] focus:border-[hsl(var(--border-focus))]"
        onChange={(e) => setAmount(parseInt(e.currentTarget.value))}
      />
      {notifInfo ? (
        <CartNotification
          setNotifInfo={setNotifInfo}
          bike={notifInfo.bike}
          subtotal={notifInfo.subtotal}
          quantity={notifInfo.quantity}
          numItems={notifInfo.numItems}
        />
      ) : (
        ""
      )}
      <button
        className="bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] px-6 py-2 rounded hover:bg-[hsl(var(--btn-primary-hover))]"
        onClick={addToCart}
      >
        {bike.for_rent ? "Rent Now" : "Add to Cart"}
      </button>
    </div>
  );
}
