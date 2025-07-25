"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/action/auth";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { CheckoutBike } from "@/utils/getBike";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CheckoutBike[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Simple auth state management
  useEffect(() => {
    if (!mounted) return;

    const supabase = createClient();

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log("Navbar: User fetched:", user?.email);
      setUser(user);
    };

    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Navbar: Auth state changed:", event, session?.user?.email);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [mounted]);

  useEffect(() => {
    // Initial cart load
    const cartData = sessionStorage.getItem("cart");
    if (cartData) {
      setCartItems(JSON.parse(cartData));
    }

    // Listen for cart changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        setCartItems(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };

    // Listen for custom event for same-window updates
    const handleCustomEvent = (e: CustomEvent) => {
      if (e.detail.key === "cart") {
        setCartItems(e.detail.value ? JSON.parse(e.detail.value) : []);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener(
      "sessionStorageChange",
      handleCustomEvent as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "sessionStorageChange",
        handleCustomEvent as EventListener
      );
    };
  }, []);

  const handleSignOut = async () => {
    if (!user) {
      toast.error("You are not logged in!");
      return;
    }
    await signOutAction();
    toast.success("You have signed out successfully!");
    setUser(null);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.orderType === "rent" ? 0 : item.sell_price * item.quantity),
    0
  );

  return (
    <nav className="p-4 bg-white shadow-md relative">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/img/logo-light-mode.png"
              alt="Electrium Mobility"
              width={150}
              height={40}
              className="w-[150px] h-auto"
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-4">
          {/* Cart Button */}
          <div className="relative">
            <button
              className="text-gray-600 hover:text-gray-900 relative"
              onClick={() => setShowCart(!showCart)}
            >
              <i className="fas fa-shopping-cart"></i>
              {cartTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </button>

            {/* Cart Dropdown */}
            {showCart && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Shopping Cart</h3>
                  <button onClick={() => setShowCart(false)}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                {cartItems.length > 0 ? (
                  <>
                    <div className="max-h-60 overflow-y-auto">
                      {cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-2 pb-2 border-b"
                        >
                          <Image
                            src={item.image || "/img/placeholder.png"}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.orderType === "rent"
                                ? `CA $${item.rental_rate}/hour x ${item.quantity}`
                                : `CA $${item.sell_price} x ${item.quantity}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>CA ${cartSubtotal.toFixed(2)}</span>
                      </div>
                      <Link
                        href="/cart"
                        className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-500"
                      >
                        View Cart
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-shopping-cart text-gray-400 text-3xl mb-2"></i>
                    <p className="text-gray-500">Cart is empty</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button className="text-gray-600 hover:text-gray-900">
            <i className="fas fa-sun"></i>
          </button>

          {/* Authentication Buttons */}
          {mounted && (
            <>
              {/* Always show dashboard link for testing */}
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 mx-2"
                title="Dashboard"
              >
                <i className="fas fa-user-circle fa-lg"></i>
              </Link>

              {user ? (
                <>
                  {/* Logout Button - Only show when user is logged in */}
                  <button
                    className="text-gray-600 hover:text-gray-900"
                    onClick={handleSignOut}
                    title="Sign Out"
                  >
                    <i className="fas fa-sign-out-alt fa-lg"></i>
                  </button>
                </>
              ) : (
                /* Login Button - Only show when user is NOT logged in */
                <Link
                  href="/login"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Log In
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
