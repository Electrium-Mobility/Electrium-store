"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/action/auth";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";


export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };

        fetchUser();
    }, []);

    const handleSignOut = async () => {
        if (!user) {
            toast.error("You are not logged in!");
            return;
        }
        await signOutAction();
        toast.success("You have signed out successfully!");
        setUser(null);
    }

    return (
        <nav className="p-4 bg-white shadow-md">
            <div className="flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/img/logo-light-mode.png"
                            alt="Electrium Mobility"
                            width={150} height={40}
                            className="w-[150px] h-auto"
                        />
                    </Link>
                </div>

                <div className="hidden lg:flex items-center space-x-4">
                    <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-shopping-cart"></i>
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-sun"></i>
                    </button>
                    {user ? (
                        <button className="text-gray-600 hover:text-gray-900" onClick={handleSignOut}>
                            <i className="fas fa-sign-out"></i>
                        </button>
                    ) : ""}
                </div>
            </div>
        </nav>
    );
}
