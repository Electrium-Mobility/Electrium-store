"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { KanbanBoard, Task } from "@/components/tasks";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ClipboardList, RefreshCw } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch current user
  useEffect(() => {
    async function fetchUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    }
    fetchUser();
  }, []);

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setError(null);
      const response = await fetch("/api/tasks");
      
      if (!response.ok) {
        if (response.status === 401) {
          setError("Please log in to view tasks");
          return;
        }
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle claiming a task
  const handleClaimTask = async (taskId: number) => {
    try {
      const response = await fetch("/api/tasks/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to claim task");
      }

      const data = await response.json();
      
      // Update the task in local state
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.task_id === taskId ? data.task : task
        )
      );
    } catch (err) {
      console.error("Error claiming task:", err);
      alert(err instanceof Error ? err.message : "Failed to claim task");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-text-secondary">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <p className="text-status-error-text mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-btn-primary text-btn-primary-text rounded-lg hover:bg-btn-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary">Tasks</h1>
          <p className="text-text-secondary mt-1">
            View and claim tasks from the board
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${
            refreshing
              ? "bg-btn-disabled text-btn-disabled-text cursor-not-allowed"
              : "bg-btn-secondary text-text-primary hover:bg-btn-secondary-hover"
          }`}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-background rounded-xl shadow-sm border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">To Do</p>
              <p className="text-2xl font-bold text-text-primary">
                {tasks.filter((t) => t.status === "todo").length}
              </p>
            </div>
            <div className="p-3 bg-status-info-bg rounded-lg">
              <ClipboardList className="w-5 h-5 text-status-info-text" />
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-sm border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Assigned</p>
              <p className="text-2xl font-bold text-text-primary">
                {tasks.filter((t) => t.status === "assigned").length}
              </p>
            </div>
            <div className="p-3 bg-status-warning-bg rounded-lg">
              <ClipboardList className="w-5 h-5 text-status-warning-text" />
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl shadow-sm border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-secondary">Done</p>
              <p className="text-2xl font-bold text-text-primary">
                {tasks.filter((t) => t.status === "done").length}
              </p>
            </div>
            <div className="p-3 bg-status-success-bg rounded-lg">
              <ClipboardList className="w-5 h-5 text-status-success-text" />
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <KanbanBoard
        tasks={tasks}
        currentUserId={currentUserId}
        onClaimTask={handleClaimTask}
        isLoading={refreshing}
      />
    </div>
  );
}
