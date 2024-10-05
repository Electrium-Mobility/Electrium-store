'use client'
import {Bike, CheckoutBike} from '@/utils/getBike'
import { MouseEventHandler, useState } from 'react'

function CartNotification({bike, subtotal, quantity, numItems}: {
    bike: Bike,
    subtotal: number,
    quantity: number,
    numItems: number
}) {
    //<CartNotification bike={bike} subtotal={100} quantity={2} numItems={2}/>
        return (
            <div className="w-80 absolute mt-24 right-6 rounded-3xl bg-gray-50  space-y-7 flex-col align-center rounded-xl p-6 drop-shadow-lg">
                <h1 className="text-base font-bold">Your Shopping Cart</h1>
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row justify-self-start text-sm">Subtotal: &nbsp;<div className="font-semibold"> CA${subtotal}</div></div>
                    <div className="flex flex-row justify-self-end text-sm"><div className="font-semibold">{numItems}</div>&nbsp;item</div>
                </div>
                <div className="flex flex-row space-x-4">
                    <img src={String(bike.image)}
                        className="w-1/3 border-2 border-gray-200 bg-white rounded-xl"/>
                    <div className="flex-col">
                        <div className="text-sm">{bike.name}</div>
                        <div className="text-sm">CA${bike.sell_price}</div>
                        <div className="text-sm text-gray-400">Quantity: {quantity}</div>
                    </div>
                </div>
                <div className="flex flex-col space-y-4">    
                    <button className="w-100 h-100 text-center bg-emerald-600 text-white p-3 text-m rounded-2xl">View and Edit Cart</button>
                    <button className="w-100 h-100 text-center bg-emerald-600 text-white p-3 text-m rounded-2xl">Secure Checkout</button>
                </div>
            </div>
        );
}

export default function CartAdd({bike}: {bike: Bike}) {
    const [amount, setAmount] = useState<number>(1);
    function addToCart(e: React.MouseEvent<HTMLButtonElement>) {
        var val = sessionStorage.getItem("cart");
        var currentCart : CheckoutBike[] = [];
        if (val) {
            currentCart = JSON.parse(val);
        }
        var existingBike = currentCart.findIndex((b) => b.bike_id === bike.bike_id)
        if (existingBike != -1) {
            if (amount == 0) {
                currentCart.splice(existingBike, 1);
            } else {
                currentCart[existingBike].quantity = amount;
            }
        } else {
            currentCart.push({
                ...bike,
                quantity: amount,
                orderType: bike.for_rent ? 'rent' : 'buy' 
            })
        }
        sessionStorage.setItem("cart", JSON.stringify(currentCart));
    }
    return (
        <div className="flex items-center gap-4 mb-6">
            <input id="select_amount" type="number" defaultValue={1} min={1} max={bike.amount_stocked}
                className="border p-2 w-16 text-center text-gray-800"
                onChange={(e) => setAmount(parseInt(e.currentTarget.value))}/>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-500" 
                onClick={addToCart}>
                {bike.for_rent ? 'Rent Now' : 'Add to Cart'}
            </button>
        </div>
    )
}