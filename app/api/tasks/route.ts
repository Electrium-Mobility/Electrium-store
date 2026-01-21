import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// GET /api/tasks - Fetch all tasks with claimant information
export async function GET() {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch tasks with claimant details
    const { data: tasks, error } = await supabase
      .from("tasks")
      .select(`
        task_id,
        title,
        description,
        status,
        claimed_by,
        claimed_at,
        created_at,
        updated_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      return NextResponse.json(
        { error: "Failed to fetch tasks" },
        { status: 500 }
      );
    }

    // Get claimant names for tasks that have been claimed
    const claimedByIds = tasks
      ?.filter((task) => task.claimed_by)
      .map((task) => task.claimed_by) || [];

    let claimantMap: Record<string, string> = {};

    if (claimedByIds.length > 0) {
      const { data: customers } = await supabase
        .from("customers")
        .select("id, first_name, last_name")
        .in("id", claimedByIds);

      if (customers) {
        claimantMap = customers.reduce((acc, customer) => {
          const name = [customer.first_name, customer.last_name]
            .filter(Boolean)
            .join(" ") || "Unknown";
          acc[customer.id] = name;
          return acc;
        }, {} as Record<string, string>);
      }
    }

    // Add claimant names to tasks
    const tasksWithClaimants = tasks?.map((task) => ({
      ...task,
      claimant_name: task.claimed_by ? claimantMap[task.claimed_by] : null,
    }));

    return NextResponse.json({ tasks: tasksWithClaimants });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        title,
        description: description || null,
        status: "todo",
        created_by: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating task:", error);
      return NextResponse.json(
        { error: "Failed to create task" },
        { status: 500 }
      );
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
