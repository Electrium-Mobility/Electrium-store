"use client";
import { useState, useEffect } from "react";
import { signup } from "../action/auth";
import Link from "next/link";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { LoadingButton } from "@/components/ui/LoadingSpinner";

export default function SignupPage() {
  // State for form fields
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [serverErrors, setServerErrors] = useState<{ [key: string]: string[] }>(
    {}
  );

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  useEffect(() => {
    setPasswordMatch(formData.password === formData.confirmPassword);
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = async (formDataSubmit: FormData) => {
    if (!passwordMatch || isLoading) return;

    setIsLoading(true);

    try {
      // Only clear errors for fields that have new submissions
      const newServerErrors = { ...serverErrors };
      Object.keys(newServerErrors).forEach((key) => {
        if (formDataSubmit.get(key)) {
          delete newServerErrors[key];
        }
      });
      setServerErrors(newServerErrors);

      const response = await signup(formDataSubmit);

      if (response && "errors" in response) {
        setServerErrors((prev) => ({
          ...prev,
          ...response.errors,
        }));
        return;
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center">
      <form
        className="bg-surface border border-border p-8 rounded-lg w-full max-w-sm"
        action={handleSubmit}
      >
        <h2 className="text-2xl font-bold mb-6 text-text-primary">Sign Up</h2>

        <label htmlFor="first_name" className="block text-text-primary mb-2">
          First Name:
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          value={formData.first_name}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-1 border border-[hsl(var(--border))] rounded bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:border-[hsl(var(--border-focus))] focus:outline-none"
        />
        {serverErrors.first_name && (
          <p className="text-status-error text-sm mb-2">
            {serverErrors.first_name[0]}
          </p>
        )}

        <label htmlFor="last_name" className="block text-text-primary mb-2">
          Last Name:
        </label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          value={formData.last_name}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-1 border border-[hsl(var(--border))] rounded bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:border-[hsl(var(--border-focus))] focus:outline-none"
        />
        {serverErrors.last_name && (
          <p className="text-status-error text-sm mb-2">
            {serverErrors.last_name[0]}
          </p>
        )}

        <label htmlFor="email" className="block text-text-primary mb-2">
          Email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full p-2 mb-1 border border-[hsl(var(--border))] rounded bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:border-[hsl(var(--border-focus))] focus:outline-none"
        />
        {serverErrors.email && (
          <p className="text-status-error text-sm mb-2">
            {serverErrors.email[0]}
          </p>
        )}

        <label htmlFor="password" className="block text-text-primary mb-2">
          Password:
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            value={formData.password}
            type={showPassword ? "text" : "password"}
            onChange={handleInputChange}
            required
            className="w-full p-2 pr-9 mb-1 border border-[hsl(var(--border))] rounded bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:border-[hsl(var(--border-focus))] focus:outline-none"
          />
          <span
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            style={{ height: "69%" }}
          >
            {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        {serverErrors.password && (
          <p className="text-status-error text-sm mb-2">
            {serverErrors.password[0]}
          </p>
        )}

        <label
          htmlFor="confirmPassword"
          className="block text-text-primary mb-2"
        >
          Confirm Password:
        </label>
        <div className="relative">
          <input
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            type={showConfirmPassword ? "text" : "password"}
            onChange={handleInputChange}
            required
            className="w-full p-2 pr-9 mb-1 border border-[hsl(var(--border))] rounded bg-[hsl(var(--surface))] text-[hsl(var(--text-primary))] focus:border-[hsl(var(--border-focus))] focus:outline-none"
          />
          <span
            onClick={toggleConfirmPasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            style={{ height: "69%" }}
          >
            {showConfirmPassword ? <FaRegEyeSlash /> : <FaRegEye />}
          </span>
        </div>
        {!passwordMatch && (
          <p className="text-status-error text-sm mb-2">
            Passwords do not match
          </p>
        )}

        <LoadingButton
          disabled={!passwordMatch}
          type="submit"
          isLoading={isLoading}
          className="w-full bg-green-600 font-bold text-text-inverse px-4 py-2 mt-4 rounded hover:bg-status-success disabled:bg-btn-disabled disabled:cursor-not-allowed"
        >
          Sign Up
        </LoadingButton>

        <Link href="/login">
          <p className="block text-center text-text-link mt-4 hover:text-text-link-hover hover:underline">
            Go back to login
          </p>
        </Link>
      </form>
    </div>
  );
}
