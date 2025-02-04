import Link from 'next/link';
import Image from 'next/image';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { createClient } from "@/utils/supabase/server";
import { signOutAction } from '@/app/action/auth';

export default async function Navbar() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (

        <nav className="flex justify-between items-center p-4 bg-white">
            <div className="flex items-center">
                <Image src="/img/favicon.png" alt="Electrium Mobility" width={40} height={40} />
                <span className="ml-2 text-xl font-semibold">electrium mobility</span>
            </div>
            <div className="space-x-4">
                <Link href="https://electriummobility.com/about" className="text-gray-600 hover:text-gray-900">About</Link>
                <Link href="https://electriummobility.com/team" className="text-gray-600 hover:text-gray-900">Team</Link>
                <Link href="https://electriummobility.com/docs/W2024-projects/project1_2023" className="text-gray-600 hover:text-gray-900">Projects</Link>
                <Link href="https://electriummobility.com/sponsors" className="text-gray-600 hover:text-gray-900">Sponsors</Link>
                <Link href="/" className="text-gray-600 hover:text-gray-900">Shop</Link>
                <Link href="https://electriummobility.com/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
            </div>
            <div className="flex items-center space-x-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Join Our Team</button>
                <button className="text-blue-500 border border-blue-500 px-4 py-2 rounded">Donate</button>
                <Link href="/checkout" className="text-gray-600 hover:text-gray-900">
                    <i className="fas fa-shopping-cart"></i>
                </Link>
                <button className="text-gray-600 hover:text-gray-900">
                    <i className="fas fa-sun"></i>
                </button>
                {user ? 
                <button className="text-gray-600 hover:text-gray-900" onClick={signOutAction}>
                    <i className="fas fa-sign-out"></i>
                </button> : ""}
            </div>
        </nav>
    );
}