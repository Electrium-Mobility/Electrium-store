'use client';

import { useState } from "react";
import { login } from "../action/auth";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-green-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" action={login}>
        <h2 className="text-2xl font-bold mb-6 text-green-700">Login</h2>
        <label htmlFor="email" className="block text-green-700 mb-2">Email:</label>
        <input id="email" name="email" type="email" required className="w-full p-2 mb-4 border border-green-300 rounded" />
        <label htmlFor="password" className="block text-green-700 mb-2">Password:</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full p-2 mb-4 border border-green-300 rounded"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer h-69"
            style={{ height: '69%' }}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Log in</button>
        <Link href="/signup">
          <p className="block text-center text-green-500 mt-4 hover:underline">Sign up</p>
        </Link>
      </form>
    </div>
  );
}