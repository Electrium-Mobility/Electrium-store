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
    <div className="w-80 absolute mt-24 right-6 rounded-xl bg-gray-50  space-y-7 flex-col align-center p-6 drop-shadow-lg">
      <div className="flex flex-row justify-between">
        <h1 className="text-base font-bold">Your Shopping Cart</h1>
        <button onClick={() => setNotifInfo(undefined)}>
          <i className="fas fa-xmark"></i>
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-self-start text-sm">
          Subtotal: &nbsp;<div className="font-semibold"> CA${subtotal}</div>
        </div>
        <div className="flex flex-row justify-self-end text-sm">
          <div className="font-semibold">{numItems}</div>&nbsp;item
        </div>
      </div>
      <div className="flex flex-row space-x-4">
        <img
          src={String(bike.image)}
          className="w-1/3 border-2 border-gray-200 bg-white rounded-xl"
        />
        <div className="flex-col">
          <div className="text-sm">{bike.name}</div>
          <div className="text-sm">CA${bike.sell_price}</div>
          <div className="text-sm text-gray-400">Quantity: {quantity}</div>
        </div>
      </div>
      <div className="flex flex-col space-y-4">
        <Link
          href="/cart"
          className="w-100 h-100 text-center bg-emerald-600 text-white p-3 text-m rounded-2xl"
        >
          View and Edit Cart
        </Link>
        <Link href="/checkout">
          <button className="w-100 h-100 text-center bg-emerald-600 text-white p-3 text-m rounded-2xl">
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
        className="border p-2 w-16 text-center text-gray-800"
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
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500"
        onClick={addToCart}
      >
        {bike.for_rent ? "Rent Now" : "Add to Cart"}
      </button>
    </div>
  );
}
