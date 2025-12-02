"use client";

import { Task } from "./TaskCard";
import TaskCard from "./TaskCard";
import { ClipboardList, UserCheck, CheckCircle2 } from "lucide-react";

interface KanbanBoardProps {
  tasks: Task[];
  currentUserId: string | null;
  onClaimTask: (taskId: number) => Promise<void>;
  isLoading?: boolean;
}

interface ColumnProps {
  title: string;
  icon: React.ReactNode;
  tasks: Task[];
  currentUserId: string | null;
  onClaimTask: (taskId: number) => Promise<void>;
  isLoading?: boolean;
  bgColor: string;
  borderColor: string;
}

function KanbanColumn({
  title,
  icon,
  tasks,
  currentUserId,
  onClaimTask,
  isLoading,
  bgColor,
  borderColor,
}: ColumnProps) {
  return (
    <div className={`flex flex-col rounded-xl ${bgColor} border ${borderColor} min-h-[500px]`}>
      {/* Column Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-semibold text-text-primary">{title}</h2>
          </div>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-surface text-text-secondary">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mb-3">
              <ClipboardList className="w-6 h-6 text-text-muted" />
            </div>
            <p className="text-sm text-text-muted">No tasks here</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.task_id}
              task={task}
              currentUserId={currentUserId}
              onClaim={onClaimTask}
              isLoading={isLoading}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({
  tasks,
  currentUserId,
  onClaimTask,
  isLoading = false,
}: KanbanBoardProps) {
  // Separate tasks by status
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const assignedTasks = tasks.filter((task) => task.status === "assigned");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* To Do Column */}
      <KanbanColumn
        title="To Do"
        icon={<ClipboardList className="w-5 h-5 text-status-info-text" />}
        tasks={todoTasks}
        currentUserId={currentUserId}
        onClaimTask={onClaimTask}
        isLoading={isLoading}
        bgColor="bg-status-info-bg/30"
        borderColor="border-status-info-bg"
      />

      {/* Assigned Column */}
      <KanbanColumn
        title="Assigned"
        icon={<UserCheck className="w-5 h-5 text-status-warning-text" />}
        tasks={assignedTasks}
        currentUserId={currentUserId}
        onClaimTask={onClaimTask}
        isLoading={isLoading}
        bgColor="bg-status-warning-bg/30"
        borderColor="border-status-warning-bg"
      />

      {/* Done Column */}
      <KanbanColumn
        title="Done"
        icon={<CheckCircle2 className="w-5 h-5 text-status-success-text" />}
        tasks={doneTasks}
        currentUserId={currentUserId}
        onClaimTask={onClaimTask}
        isLoading={isLoading}
        bgColor="bg-status-success-bg/30"
        borderColor="border-status-success-bg"
      />
    </div>
  );
}
