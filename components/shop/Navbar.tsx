// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { createClient } from "@/utils/supabase/client";
// import { signOutAction } from "@/app/action/auth";
// import { toast } from "sonner";
// import { User } from "@supabase/supabase-js";


// export default function Navbar() {
//     const [menuOpen, setMenuOpen] = useState(false);
//     const [user, setUser] = useState<User | null>(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             const supabase = createClient();
//             const { data: { user } } = await supabase.auth.getUser();
//             setUser(user);
//         };

//         fetchUser();
//     }, []);

//     const handleSignOut = async () => {
//         if (!user) {
//             toast.error("You are not logged in!");
//             return;
//         }
//         await signOutAction();
//         toast.success("You have signed out successfully!");
//         setUser(null);
//     }

//     return (
//         <nav className="p-4 bg-white shadow-md">
//             <div className="flex justify-between items-center">
//                 <div className="flex items-center">
//                     <Link href="/">
//                         <Image
//                             src="/img/logo-light-mode.png"
//                             alt="Electrium Mobility"
//                             width={150} height={40}
//                             className="w-[150px] h-auto"
//                         />
//                     </Link>
//                 </div>

//                 <button
//                     className="block md:hidden text-gray-600 focus:outline-none"
//                     onClick={() => setMenuOpen(!menuOpen)}
//                 >
//                     <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
//                 </button>

//                 {/* Desktop Menu */}
//                 <div className="hidden md:flex space-x-4">
//                     <Link href="https://electriummobility.com/about" className="text-gray-600 hover:text-gray-900">About</Link>
//                     <Link href="https://electriummobility.com/team" className="text-gray-600 hover:text-gray-900">Team</Link>
//                     <Link href="https://electriummobility.com/docs/W2024-projects/project1_2023" className="text-gray-600 hover:text-gray-900">Projects</Link>
//                     <Link href="https://electriummobility.com/sponsors" className="text-gray-600 hover:text-gray-900">Sponsors</Link>
//                     <Link href="/" className="text-gray-600 hover:text-gray-900">Shop</Link>
//                     <Link href="https://electriummobility.com/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
//                 </div>

//                 {/* Desktop Buttons & User Auth */}
//                 <div className="hidden md:flex items-center space-x-4">
//                     <button className="bg-blue-500 text-white px-4 py-2 rounded">Join Our Team</button>
//                     <button className="text-blue-500 border border-blue-500 px-4 py-2 rounded">Donate</button>
//                     <Link href="/checkout" className="text-gray-600 hover:text-gray-900">
//                         <i className="fas fa-shopping-cart"></i>
//                     </Link>
//                     <button className="text-gray-600 hover:text-gray-900">
//                         <i className="fas fa-sun"></i>
//                     </button>
//                     {user ? (
//                         <button className="text-gray-600 hover:text-gray-900" onClick={signOutAction}>
//                             <i className="fas fa-sign-out"></i>
//                         </button>
//                     ) : ""}
//                 </div>
//             </div>

//             {/* mobile dropdown Menu */}
//             {menuOpen && (
//                 <div className="md:hidden flex flex-col space-y-2 mt-4 bg-white p-4 shadow-lg rounded-md">
//                     <Link href="https://electriummobility.com/about" className="text-gray-600 hover:text-gray-900">About</Link>
//                     <Link href="https://electriummobility.com/team" className="text-gray-600 hover:text-gray-900">Team</Link>
//                     <Link href="https://electriummobility.com/docs/W2024-projects/project1_2023" className="text-gray-600 hover:text-gray-900">Projects</Link>
//                     <Link href="https://electriummobility.com/sponsors" className="text-gray-600 hover:text-gray-900">Sponsors</Link>
//                     <Link href="/" className="text-gray-600 hover:text-gray-900">Shop</Link>
//                     <Link href="https://electriummobility.com/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
//                     <button className="bg-blue-500 text-white px-4 py-2 rounded">Join Our Team</button>
//                     <button className="text-blue-500 border border-blue-500 px-4 py-2 rounded">Donate</button>
//                     <Link href="/checkout" className="text-gray-600 hover:text-gray-900">
//                         <i className="fas fa-shopping-cart"></i>
//                     </Link>
//                     {user ? (
//                         <button className="text-gray-600 hover:text-gray-900" onClick={handleSignOut}>
//                             <i className="fas fa-sign-out"></i>
//                         </button>
//                     ) : ""}
//                 </div>
//             )}
//         </nav>
//     );
// }
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
    const [menuOpen, setMenuOpen] = useState(false);
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

                {/* Mobile Menu Button */}
                <button
                    className="block lg:hidden text-gray-600 focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-2xl`}></i>
                </button>

                {/* Desktop Menu */}
                <div className="hidden lg:flex space-x-4">
                    <Link href="https://electriummobility.com/about" className="text-gray-600 hover:text-gray-900">About</Link>
                    <Link href="https://electriummobility.com/team" className="text-gray-600 hover:text-gray-900">Team</Link>
                    <Link href="https://electriummobility.com/docs/W2024-projects/project1_2023" className="text-gray-600 hover:text-gray-900">Projects</Link>
                    <Link href="https://electriummobility.com/sponsors" className="text-gray-600 hover:text-gray-900">Sponsors</Link>
                    <Link href="https://electriummobility.com/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>
                </div>

                {/* Desktop Buttons & User Auth */}
                <div className="hidden lg:flex items-center space-x-4">
                    {/* Updated Join Our Team button */}
                    <button className="border-2 border-gray-500 text-black px-4 py-2 rounded transition-all hover:bg-green-500 hover:text-white">
                        Join Our Team
                    </button>

                    {/* Donate button */}
                    <button className="border-2 border-gray-500 text-black px-4 py-2 rounded">
                        Donate
                    </button>

                    {/* Icons */}
                    <Link href="/checkout" className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-shopping-cart"></i>
                    </Link>
                    <button className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-sun"></i>
                    </button>
                    {user ? (
                        <button className="text-gray-600 hover:text-gray-900" onClick={signOutAction}>
                            <i className="fas fa-sign-out"></i>
                        </button>
                    ) : ""}
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="lg:hidden flex flex-col space-y-2 mt-4 bg-white p-4 shadow-lg rounded-md">
                    <Link href="https://electriummobility.com/about" className="text-gray-600 hover:text-gray-900">About</Link>
                    <Link href="https://electriummobility.com/team" className="text-gray-600 hover:text-gray-900">Team</Link>
                    <Link href="https://electriummobility.com/docs/W2024-projects/project1_2023" className="text-gray-600 hover:text-gray-900">Projects</Link>
                    <Link href="https://electriummobility.com/sponsors" className="text-gray-600 hover:text-gray-900">Sponsors</Link>
                    <Link href="/" className="text-gray-600 hover:text-gray-900">Shop</Link>
                    <Link href="https://electriummobility.com/contact" className="text-gray-600 hover:text-gray-900">Contact</Link>

                    {/* Updated Join Our Team button */}
                    <button className="border-2 border-black text-black px-4 py-2 rounded transition-all hover:bg-green-500 hover:text-white">
                        Join Our Team
                    </button>

                    {/* Donate button */}
                    <button className="border-2 border-blue-500 text-blue-500 px-4 py-2 rounded">
                        Donate
                    </button>

                    {/* Icons */}
                    <Link href="/checkout" className="text-gray-600 hover:text-gray-900">
                        <i className="fas fa-shopping-cart"></i>
                    </Link>
                    {user ? (
                        <button className="text-gray-600 hover:text-gray-900" onClick={handleSignOut}>
                            <i className="fas fa-sign-out"></i>
                        </button>
                    ) : ""}
                </div>
            )}
        </nav>
    );
}
