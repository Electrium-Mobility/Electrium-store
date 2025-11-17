"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface ReviewFormProps {
  productId: string;
}

/**
 * ReviewForm
 * Client component that allows authenticated users to submit a product review.
 * - Handles rating (1-5) and comment input
 * - Submits to POST /api/reviews/[productId]
 * - Displays success/error messages and refreshes the page on success
 */
export default function ReviewForm({ productId }: ReviewFormProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  /**
   * handleSubmit
   * Submit the review to the API and handle response states
   */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!content.trim()) {
      setError("Please enter your review content.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating, content }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          setError("You must be logged in to submit a review.");
        } else {
          setError(data.error || "Failed to submit review.");
        }
        return;
      }

      if (data.success) {
        setMessage("Thank you! Your review has been submitted.");
        setContent("");
        setRating(5);
        // Refresh server-rendered content to show new review
        router.refresh();
      } else {
        setError("Unexpected response from server.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mt-10 bg-surface rounded-2xl shadow-lg p-6 border border-border">
      <h3 className="text-xl font-bold text-text-primary mb-4 text-center">Write a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <label htmlFor="rating" className="text-sm font-medium text-text-primary">
            Rating
          </label>
          <select
            id="rating"
            value={rating}
            onChange={(e) => setRating(parseInt(e.target.value))}
            className="border border-border bg-surface p-2 rounded text-text-primary"
          >
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-text-primary mb-1">
            Your Review
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            placeholder="Share your experience with this product..."
            className="w-full border border-border bg-surface p-3 rounded text-text-primary placeholder-text-muted focus:ring-2 focus:ring-border-focus"
          />
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        {message && (
          <p className="text-sm text-status-success">{message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-6 py-2 rounded transition-colors ${
            isSubmitting
              ? "bg-surface-secondary text-text-muted cursor-not-allowed"
              : "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}