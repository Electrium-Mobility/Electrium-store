import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// POST /api/tasks/claim - Claim a task
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
    const { taskId } = body;

    if (!taskId) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 }
      );
    }

    // Check if task exists and is not already claimed
    const { data: existingTask, error: fetchError } = await supabase
      .from("tasks")
      .select("task_id, status, claimed_by")
      .eq("task_id", taskId)
      .single();

    if (fetchError || !existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (existingTask.claimed_by) {
      return NextResponse.json(
        { error: "Task is already claimed" },
        { status: 400 }
      );
    }

    if (existingTask.status !== "todo") {
      return NextResponse.json(
        { error: "Only tasks with 'todo' status can be claimed" },
        { status: 400 }
      );
    }

    // Claim the task - update status to 'assigned' and set claimed_by
    const { data: updatedTask, error: updateError } = await supabase
      .from("tasks")
      .update({
        claimed_by: user.id,
        claimed_at: new Date().toISOString(),
        status: "assigned",
      })
      .eq("task_id", taskId)
      .select()
      .single();

    if (updateError) {
      console.error("Error claiming task:", updateError);
      return NextResponse.json(
        { error: "Failed to claim task" },
        { status: 500 }
      );
    }

    // Get claimant name
    const { data: customer } = await supabase
      .from("customers")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single();

    const claimantName = customer
      ? [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
        "Unknown"
      : "Unknown";

    return NextResponse.json({
      task: {
        ...updatedTask,
        claimant_name: claimantName,
      },
      message: "Task claimed successfully",
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
