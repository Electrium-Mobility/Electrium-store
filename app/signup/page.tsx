'use client';

import { useState, useEffect } from "react";
import { signup } from "../action/auth";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordMatch, setPasswordMatch] = useState(true);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    function comparePasswords() {
      if (password === confirmPassword) {
        setPasswordMatch(true);
      } else {
        setPasswordMatch(false);
      }
    }
    comparePasswords();
  }, [password, confirmPassword]);
  
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form className="bg-gray-100 border border-gray-200 p-8 rounded-lg w-full max-w-sm" action={(data) => {setPassword(""); setConfirmPassword(""); signup(data)}}>
        <h2 className="text-2xl font-bold mb-6 text-green-700">Sign Up</h2>
        <label htmlFor="first_name" className="block text-black mb-2">First Name:</label>
        <input id="first_name" name="first_name" type="text" required className="w-full p-2 mb-4 border border-green-300 rounded" />
        <label htmlFor="last_name" className="block text-black mb-2">Last Name:</label>
        <input id="last_name" name="last_name" type="text" required className="w-full p-2 mb-4 border border-green-300 rounded" />
        <label htmlFor="email" className="block text-black mb-2">Email:</label>
        <input id="email" name="email" type="email" required className="w-full p-2 mb-4 border border-green-300 rounded" />
        <label htmlFor="password" className="block text-black mb-2">Password:</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 pr-9 mb-4 border border-green-300 rounded"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            style={{ height: "69%" }}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        <label htmlFor="confirmpassword" className="block text-black mb-2">Confirm Password:</label>
        <div className="relative">
          <input
            id="confirmpassword"
            name="confirmpassword"
            value={confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-2 pr-9 mb-4 border border-green-300 rounded"
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            style={{ height: "69%" }}
          >
            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        {!passwordMatch && <p className="text-red-500 mt-[-5px] mb-[-5px] text-sm">Passwords do not match</p>}
        <button disabled={!passwordMatch} type="submit" className="w-full bg-green-600 font-bold text-white px-4 py-2 mt-4 rounded hover:bg-green-500">Sign Up</button>
        <Link href="/login">
          <p className="block text-center text-green-500 mt-4 hover:underline">Go back to login</p>
        </Link>
      </form>
    </div>
  );
}
