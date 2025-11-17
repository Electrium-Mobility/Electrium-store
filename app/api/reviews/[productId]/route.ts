import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * GET /api/reviews/[productId]
 * Fetch all reviews for a specific product/bike
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const supabase = await createClient();

    // Convert productId to number since bike_id is bigint in database
    const bikeId = parseInt(productId);
    if (isNaN(bikeId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // 正常的API逻辑开始

    // Fetch reviews with customer information
    console.log("Fetching reviews for bike_id:", bikeId);
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`
        review_id,
        rating,
        content,
        created_at,
        customer_id
      `)
      .eq("bike_id", bikeId)
      .order("created_at", { ascending: false });

    console.log("Reviews query result:", { reviews, error });
    
    // If we have reviews, fetch customer names separately
    let reviewsWithCustomers = [];
    if (reviews && reviews.length > 0) {
      for (const review of reviews) {
        const { data: customer } = await supabase
          .from("customers")
          .select("first_name, last_name")
          .eq("id", review.customer_id)
          .single();
        
        reviewsWithCustomers.push({
          ...review,
          customer
        });
      }
    }

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    // Transform the data to match the expected format
    const transformedReviews = reviewsWithCustomers?.map((review) => {
      return {
        id: review.review_id,
        name: review.customer?.first_name && review.customer?.last_name
          ? `${review.customer.first_name} ${review.customer.last_name}`
          : review.customer?.first_name || "Anonymous",
        rating: review.rating,
        comment: review.content,
        created_at: review.created_at,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      reviews: transformedReviews,
    });

  } catch (error) {
    console.error("Unexpected error in reviews API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reviews/[productId]
 * Create a new review for a specific product/bike
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Convert productId to number
    const bikeId = parseInt(productId);
    if (isNaN(bikeId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { rating, content } = body;

    // Validate input
    if (!rating || !content) {
      return NextResponse.json(
        { error: "Rating and content are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    // Insert new review
    const { data: review, error: insertError } = await supabase
      .from("reviews")
      .insert({
        customer_id: user.id,
        bike_id: bikeId,
        rating: rating,
        content: content,
      })
      .select(`
        review_id,
        rating,
        content,
        created_at,
        customers (
          first_name,
          last_name
        )
      `)
      .single();

    if (insertError) {
      console.error("Error creating review:", insertError);
      return NextResponse.json(
        { error: "Failed to create review" },
        { status: 500 }
      );
    }

    // Transform the response
    const customer = Array.isArray(review.customers) ? review.customers[0] : review.customers;
    const transformedReview = {
      id: review.review_id,
      name: customer?.first_name && customer?.last_name
        ? `${customer.first_name} ${customer.last_name}`
        : customer?.first_name || "Anonymous",
      rating: review.rating,
      comment: review.content,
      created_at: review.created_at,
    };

    return NextResponse.json({
      success: true,
      review: transformedReview,
    });

  } catch (error) {
    console.error("Unexpected error in create review API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}