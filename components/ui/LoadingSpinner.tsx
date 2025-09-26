import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "white" | "gray";
  className?: string;
}

/**
 * A reusable loading spinner component with customizable size and color
 */
export default function LoadingSpinner({
  size = "md",
  color = "primary",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const colorClasses = {
    primary: "border-[hsl(var(--btn-primary))] border-t-transparent",
    white: "border-white border-t-transparent",
    gray: "border-gray-300 border-t-transparent",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]} 
        border-2 
        rounded-full 
        animate-spin
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
}

/**
 * A button component that shows loading state with spinner
 */
export function LoadingButton({
  isLoading,
  children,
  className = "",
  disabled = false,
  onClick,
  type = "button",
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={(e) => onClick?.(e)}
      disabled={disabled || isLoading}
      className={`
        relative
        flex
        items-center
        justify-center
        gap-2
        transition-all
        duration-200
        ${isLoading ? "cursor-not-allowed opacity-75" : ""}
        ${className}
      `}
    >
      {isLoading && (
        <LoadingSpinner
          size="sm"
          color={
            className.includes("text-white") ||
            className.includes("text-[hsl(var(--btn-primary-text))]")
              ? "white"
              : "primary"
          }
        />
      )}
      <span className={isLoading ? "opacity-75" : ""}>{children}</span>
    </button>
  );
}
