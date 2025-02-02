'use client';

import { useState } from "react";
import { login } from "../action/auth";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";


export default function LoginPage() {
  const [displayEmail, setDisplayEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [unsuccessfulLogin, setUnsuccessfulLogin] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  async function handleSubmit(formData: FormData): Promise<void> {
    if (await login(formData)) { 
      console.log("Logged in"); 
    } else {
      setUnsuccessfulLogin(true); // Display "invalid email or password" message
    }
  }

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form className="border border-gray-200 bg-gray-100 p-8 rounded-lg w-full max-w-sm" action={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-green-700">Login</h2>
        {unsuccessfulLogin && <p className="text-red-600 mb-3 mt-[-15px]">Invalid email or password</p>}
        <label htmlFor="email" className="block text-black mb-2">Email:</label>
        <input id="email" name="email" type="email" value={displayEmail} onChange={(e) => setDisplayEmail(e.target.value)} required className="w-full p-2 mb-4 border border-green-300 rounded" />
        <label htmlFor="password" className="block text-black mb-2">Password:</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full p-2 pr-9 mb-4 border border-green-300 rounded"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            style={{ height: '69%' }}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        <button type="submit" className="w-full bg-green-600 text-white font-bold px-4 py-2 mt-4 rounded hover:bg-green-500">Log in</button>
        <Link href="/signup">
          <p className="block text-center text-green-500 mt-4 hover:underline">Create an account?</p>
        </Link>
      </form>
    </div>
  );
}