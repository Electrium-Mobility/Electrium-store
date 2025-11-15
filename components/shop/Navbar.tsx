"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/app/action/auth";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";
import { CheckoutBike } from "@/utils/getBike";

export default function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CheckoutBike[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Handle hydration
  useEffect(() => {
    setMounted(true);

    // Check for dark mode preference in localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme");
      if (stored === "dark") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    }
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

  const handleDarkModeToggle = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (typeof window !== "undefined") {
        const root = document.documentElement;
        if (next) {
          root.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          root.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }
      return next;
    });
  };

  const handleLogout = async () => {
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
    <nav className="h-[70px] px-6 bg-header-background shadow-md relative">
      <div className="h-full flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src={
                darkMode
                  ? "/img/logo-dark-mode.png"
                  : "/img/logo-light-mode.png"
              }
              alt="Electrium Logo"
              width={200}
              height={50}
              className="h-[30px] md:h-[30px] w-auto pl-2 md:pl-3 pr-4 md:pr-6"
            />
          </Link>
        </div>

        <div className="hidden lg:flex items-center space-x-5 md:space-x-6">
          {/* Cart Button */}
          <div
            className="relative"
            onMouseEnter={() => setIsCartOpen(true)}
            onMouseLeave={() => setIsCartOpen(false)}
          >
            <Link
              href="/cart"
              onMouseEnter={() => router.prefetch("/cart")}
              className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--btn-primary))] relative inline-block text-lg md:text-xl"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartTotal > 0 && (
                <span className="absolute -top-2 -right-2 bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartTotal}
                </span>
              )}
            </Link>

            {/* Cart Dropdown */}
            {isCartOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-[hsl(var(--background))] rounded-lg shadow-lg p-4 z-50 border border-[hsl(var(--border))]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-[hsl(var(--text-primary))]">
                    Shopping Cart
                  </h3>
                  <button onClick={() => setIsCartOpen(false)}>
                    <i className="fas fa-times text-[hsl(var(--text-primary))]"></i>
                  </button>
                </div>

                {cartItems.length > 0 ? (
                  <>
                    <div className="max-h-60 overflow-y-auto">
                      {cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-2 pb-2 border-b border-[hsl(var(--border))]"
                        >
                          <Image
                            src={item.image || "/img/placeholder.png"}
                            alt={item.name}
                            width={50}
                            height={50}
                            className="rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-[hsl(var(--text-primary))]">
                              {item.name}
                            </p>
                            <p className="text-xs text-[hsl(var(--text-secondary))]">
                              {item.orderType === "rent"
                                ? `CA $${item.rental_rate}/hour x ${item.quantity}`
                                : `CA $${item.sell_price} x ${item.quantity}`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
                      <div className="flex justify-between mb-2 text-[hsl(var(--text-primary))]">
                        <span>Subtotal:</span>
                        <span>CA ${cartSubtotal.toFixed(2)}</span>
                      </div>
                      <Link
                        href="/cart"
                        onMouseEnter={() => router.prefetch("/cart")}
                        className="block w-full text-center bg-[hsl(var(--btn-primary))] text-[hsl(var(--btn-primary-text))] py-2 rounded-lg hover:bg-[hsl(var(--btn-primary-hover))]"
                      >
                        View Cart
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <i className="fas fa-shopping-cart text-[hsl(var(--text-muted))] text-3xl mb-2"></i>
                    <p className="text-[hsl(var(--text-secondary))]">
                      Cart is empty
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--btn-primary))] text-lg md:text-xl"
            onClick={handleDarkModeToggle}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <i className={`fas ${darkMode ? "fa-moon" : "fa-sun"} text-xl`}></i>
          </button>

          {/* Authentication Buttons */}
          {mounted && (
            <>
              {/* Always show dashboard link for testing */}
              <Link
                href="/dashboard"
                className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-link))] mx-2 text-lg"
                title="Dashboard"
              >
                <i className="fas fa-user-circle text-xl"></i>
              </Link>

              {user ? (
                <>
                  {/* Logout Button - Only show when user is logged in */}
                  <button
                    className="text-[hsl(var(--text-primary))] hover:text-[hsl(var(--text-link))] text-lg"
                    onClick={handleLogout}
                    title="Sign Out"
                  >
                    <i className="fas fa-sign-out-alt text-xl"></i>
                  </button>
                </>
              ) : (
                /* Login Button - Only show when user is NOT logged in */
                <Link
                  href="/login"
                  onMouseEnter={() => router.prefetch("/login")}
                  className="bg-[hsl(var(--btn-primary))] hover:bg-[hsl(var(--btn-primary-hover))] text-[hsl(var(--btn-primary-text))] px-4 py-2 md:px-5 md:py-2 rounded-[8px] font-semibold text-sm md:text-base transition-colors duration-200"
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
