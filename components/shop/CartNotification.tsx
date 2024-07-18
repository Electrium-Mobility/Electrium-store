import Image from 'next/image';

export default function CartNotification({image, name, price, subtotal, quantity, numItems}: {
    image: string,
    name: string,
    price: number
    subtotal: number,
    quantity: number
    numItems: number
}) {
    return (
        <div className="w-1/4 rounded-3xl bg-gray-100  space-y-7 flex-col align-center rounded-lg p-6 drop-shadow-lg">
        <h1 className="text-base font-semibold">Your Shopping Cart</h1>
        <div className="flex flex-row justify-between">
            <div className="justify-self-start text-sm">Subtotal: {subtotal}</div>
            <div className="justify-self-end text-sm">{numItems} item</div>
        </div>
        <div className="flex flex-row space-x-4">
            <img src={image}
                className="w-1/3 border-2 border-gray-200 bg-white rounded-xl"/>
            <div className="flex-col">
                <div className="text-sm">{name}</div>
                <div className="text-sm">{price}</div>
                <div className="text-sm text-zinc-500">Quantity:{quantity}</div>
            </div>
        </div>
        <div className="flex flex-col space-y-4">    
            <button className="w-100 h-100 text-center bg-emerald-600 text-white p-3 text-m rounded-2xl">View and edit cart</button>
            <button className="w-100 h-100 text-center bg-emerald-600 text-white p-3 text-m rounded-2xl">Secure Checkout</button>
        </div>
    </div>
    );
}