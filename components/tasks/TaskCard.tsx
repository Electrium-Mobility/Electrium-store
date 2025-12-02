"use client";

import { useState } from "react";
import { User, Clock, CheckCircle } from "lucide-react";

export interface Task {
  task_id: number;
  title: string;
  description: string | null;
  status: "todo" | "assigned" | "done";
  claimed_by: string | null;
  claimed_at: string | null;
  claimant_name?: string;
  created_at: string;
  updated_at: string;
}

interface TaskCardProps {
  task: Task;
  currentUserId: string | null;
  onClaim: (taskId: number) => Promise<void>;
  isLoading?: boolean;
}

export default function TaskCard({
  task,
  currentUserId,
  onClaim,
  isLoading = false,
}: TaskCardProps) {
  const [claiming, setClaiming] = useState(false);

  const handleClaim = async () => {
    if (claiming || isLoading) return;
    setClaiming(true);
    try {
      await onClaim(task.task_id);
    } finally {
      setClaiming(false);
    }
  };

  const isClaimedByCurrentUser = task.claimed_by === currentUserId;
  const canClaim = task.status === "todo" && !task.claimed_by && currentUserId;

  const getStatusBadge = () => {
    switch (task.status) {
      case "todo":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-status-info-bg text-status-info-text">
            <Clock className="w-3 h-3 mr-1" />
            To Do
          </span>
        );
      case "assigned":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-status-warning-bg text-status-warning-text">
            <User className="w-3 h-3 mr-1" />
            Assigned
          </span>
        );
      case "done":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-status-success-bg text-status-success-text">
            <CheckCircle className="w-3 h-3 mr-1" />
            Done
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-background rounded-xl shadow-sm border border-border p-4 hover:shadow-md transition-shadow duration-200">
      {/* Header with status badge */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-text-primary text-sm leading-tight flex-1 mr-2">
          {task.title}
        </h3>
        {getStatusBadge()}
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-text-secondary text-xs mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Claimant info */}
      {task.claimed_by && task.claimant_name && (
        <div className="flex items-center mb-3 p-2 bg-surface-hover rounded-lg">
          <div className="w-6 h-6 rounded-full bg-status-success-bg flex items-center justify-center mr-2">
            <User className="w-3 h-3 text-status-success-text" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-text-primary">
              {isClaimedByCurrentUser ? "Claimed by you" : `Claimed by ${task.claimant_name}`}
            </p>
            {task.claimed_at && (
              <p className="text-xs text-text-muted">
                {new Date(task.claimed_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Claim button */}
      {canClaim && (
        <button
          onClick={handleClaim}
          disabled={claiming || isLoading}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            claiming || isLoading
              ? "bg-btn-disabled text-btn-disabled-text cursor-not-allowed"
              : "bg-btn-primary text-btn-primary-text hover:bg-btn-primary-hover active:scale-[0.98]"
          }`}
        >
          {claiming ? "Claiming..." : "Claim Task"}
        </button>
      )}

      {/* Created date */}
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-text-muted">
          Created {new Date(task.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
