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
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (
        showMobileMenu &&
        !target.closest(".mobile-menu") &&
        !target.closest(".mobile-menu-button")
      ) {
        setShowMobileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMobileMenu]);

  // Close mobile menu when route changes
  const pathname = usePathname();
  useEffect(() => {
    setShowMobileMenu(false);
  }, [pathname]);

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

    // Clear cart on logout
    sessionStorage.removeItem("cart");
    setCartItems([]);

    // Dispatch custom event to update cart across components
    window.dispatchEvent(
      new CustomEvent("sessionStorageChange", {
        detail: { key: "cart", value: null },
      })
    );

    await signOutAction();
    toast.success("You have signed out successfully!");
    setUser(null);
    setShowMobileMenu(false);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.orderType === "rent" ? 0 : item.sell_price * item.quantity),
    0
  );

  return (
    <>
      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 lg:hidden mobile-menu ${
          showMobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link href="/" onClick={() => setShowMobileMenu(false)}>
              <Image
                src="/img/logo-light-mode.png"
                alt="Electrium Mobility"
                width={120}
                height={32}
                className="w-[120px] h-auto"
              />
            </Link>
            <button
              onClick={() => setShowMobileMenu(false)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 p-4 space-y-6">
            {/* Mobile Cart */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-shopping-cart text-gray-600"></i>
                  <span className="font-medium text-gray-900">
                    Shopping Cart
                  </span>
                </div>
                {cartTotal > 0 && (
                  <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartTotal}
                  </span>
                )}
              </div>
              {cartItems.length > 0 ? (
                <div className="space-y-2 mb-3">
                  {cartItems.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className="w-8 h-8 bg-gray-200 rounded flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.orderType === "rent"
                            ? `$${item.rental_rate}/hour`
                            : `$${item.sell_price}`}{" "}
                          x {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {cartItems.length > 3 && (
                    <p className="text-xs text-gray-500 text-center">
                      +{cartItems.length - 3} more items
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center">
                  Cart is empty
                </p>
              )}
              <Link
                href="/cart"
                className="block w-full text-center bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                View Cart
              </Link>
            </div>

            {/* Mobile Navigation Links */}
            <div className="space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="fas fa-user-circle text-gray-600 w-5"></i>
                <span className="font-medium text-gray-900">Dashboard</span>
              </Link>

              <Link
                href="/"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="fas fa-home text-gray-600 w-5"></i>
                <span className="font-medium text-gray-900">Home</span>
              </Link>

              <Link
                href="/products"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="fas fa-bicycle text-gray-600 w-5"></i>
                <span className="font-medium text-gray-900">Products</span>
              </Link>

              <Link
                href="/rentals"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                <i className="fas fa-clock text-gray-600 w-5"></i>
                <span className="font-medium text-gray-900">Rentals</span>
              </Link>
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {mounted && (
                <>
                  {user ? (
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <i className="fas fa-sign-out-alt text-gray-600 w-5"></i>
                      <span className="font-medium text-gray-900">Logout</span>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="flex items-center space-x-3 p-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <i className="fas fa-sign-in-alt w-5"></i>
                      <span className="font-medium">Log In</span>
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Navbar */}
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

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="text-gray-600 hover:text-gray-900 p-2 mobile-menu-button"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
