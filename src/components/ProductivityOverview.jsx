import React, { useMemo } from 'react';
import { TASK_STATUSES } from '../services/taskService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sparkles } from 'lucide-react';

// Status colors aligned with the application theme
const STATUS_COLORS = {
  [TASK_STATUSES.PLANNED]: '#64748b',    // Slate-500
  [TASK_STATUSES.IN_PROGRESS]: '#f59e0b', // Amber-500
  [TASK_STATUSES.COMPLETE]: '#10b981',   // Emerald-500
};

const EMPTY_COLOR = '#e2e8f0'; // Slate-200

/**
 * ProductivityOverview Component
 * Displays real-time task productivity metrics, a doughnut distribution chart,
 * and an overall completion progress bar.
 */
export default function ProductivityOverview({ tasks = [] }) {
  // Dynamically calculate all metrics using useMemo (no duplicate state variables)
  const metrics = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === TASK_STATUSES.COMPLETE).length;
    const inProgressTasks = tasks.filter((t) => t.status === TASK_STATUSES.IN_PROGRESS).length;
    const plannedTasks = tasks.filter((t) => t.status === TASK_STATUSES.PLANNED).length;

    // Remaining tasks: Planned + In Progress (Total - Completed)
    const remainingTasks = totalTasks - completedTasks;

    // Completion Rate formula: (Completed Tasks / Total Tasks) * 100
    // Handles zero tasks gracefully to avoid division by zero
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      plannedTasks,
      remainingTasks,
      completionRate,
    };
  }, [tasks]);

  // Doughnut chart data derived directly from task state
  const chartData = useMemo(() => {
    if (metrics.totalTasks === 0) {
      return [{ name: 'No Tasks', value: 1, color: EMPTY_COLOR }];
    }

    return [
      {
        name: TASK_STATUSES.COMPLETE,
        value: metrics.completedTasks,
        color: STATUS_COLORS[TASK_STATUSES.COMPLETE],
      },
      {
        name: TASK_STATUSES.IN_PROGRESS,
        value: metrics.inProgressTasks,
        color: STATUS_COLORS[TASK_STATUSES.IN_PROGRESS],
      },
      {
        name: TASK_STATUSES.PLANNED,
        value: metrics.plannedTasks,
        color: STATUS_COLORS[TASK_STATUSES.PLANNED],
      },
    ].filter((item) => item.value > 0);
  }, [metrics]);

  const hasTasks = metrics.totalTasks > 0;

  return (
    <section
      aria-labelledby="productivity-heading"
      className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-gray-100 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-gray-100 text-gray-700 rounded-md">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 id="productivity-heading" className="text-base font-semibold text-gray-900">
              Productivity Overview
            </h2>
            <p className="text-xs text-gray-500">
              Live completion analytics and task distribution
            </p>
          </div>
        </div>

        {/* Dynamic Completion Rate Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-medium text-gray-500">Overall Progress:</span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              metrics.completionRate === 100
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : metrics.completionRate > 0
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {metrics.completionRate}%
          </span>
        </div>
      </div>

      {/* Empty State Banner (Feature 5) */}
      {!hasTasks && (
        <div className="mb-5 p-3.5 bg-gray-50 border border-dashed border-gray-200 rounded-md flex items-center gap-2.5 text-xs text-gray-500">
          <Sparkles className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>Create your first task to see your productivity insights.</span>
        </div>
      )}

      {/* Main Grid: Metrics & Progress on Left, Doughnut Chart on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Progress Bar + Metric Cards (7 cols on desktop) */}
        <div className="md:col-span-7 space-y-4">
          {/* Feature 3: Visual Completion Progress Bar */}
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Task Completion Progress
              </span>
              <span className="text-xs font-bold text-gray-900">
                {metrics.completionRate}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  metrics.completionRate === 100
                    ? 'bg-emerald-500'
                    : metrics.completionRate > 0
                    ? 'bg-gray-900'
                    : 'bg-transparent'
                }`}
                style={{ width: `${metrics.completionRate}%` }}
                role="progressbar"
                aria-valuenow={metrics.completionRate}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1.5">
              <span>{metrics.completedTasks} completed</span>
              <span>{metrics.remainingTasks} remaining</span>
            </div>
          </div>

          {/* Feature 1: Productivity Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {/* Completion Rate */}
            <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">
                Rate
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                {metrics.completionRate}%
              </span>
            </div>

            {/* Completed Tasks */}
            <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
              <span className="text-[11px] font-medium text-emerald-600 uppercase tracking-wider block">
                Completed
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                {metrics.completedTasks}
              </span>
            </div>

            {/* Remaining Tasks */}
            <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
              <span className="text-[11px] font-medium text-amber-600 uppercase tracking-wider block">
                Remaining
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                {metrics.remainingTasks}
              </span>
            </div>

            {/* Total Tasks */}
            <div className="bg-gray-50 border border-gray-100 rounded-md p-3">
              <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block">
                Total
              </span>
              <span className="text-xl font-bold text-gray-900 mt-1 block">
                {metrics.totalTasks}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Feature 2 - Doughnut Chart Distribution (5 cols on desktop) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-3 bg-gray-50 border border-gray-100 rounded-lg">
          <div className="w-full flex items-center justify-between mb-1 px-1">
            <span className="text-xs font-semibold text-gray-700">
              Status Distribution
            </span>
            <span className="text-[11px] text-gray-400">
              {metrics.totalTasks} Total
            </span>
          </div>

          {/* Doughnut Chart with Centered Total */}
          <div className="relative w-full h-40 min-h-[160px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={62}
                  paddingAngle={hasTasks ? 3 : 0}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            {/* Centered Total inside Doughnut Hole (No overlap) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-xl font-bold text-gray-900 leading-none">
                {metrics.totalTasks}
              </span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mt-1">
                Total Tasks
              </span>
            </div>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 mt-2 w-full pt-2 border-t border-gray-200/60 text-xs">
            {/* Planned Legend */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_COLORS[TASK_STATUSES.PLANNED] }}
              />
              <span className="text-gray-600 text-[11px]">Planned:</span>
              <span className="font-semibold text-gray-900 text-[11px]">
                {metrics.plannedTasks}
              </span>
            </div>

            {/* In Progress Legend */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_COLORS[TASK_STATUSES.IN_PROGRESS] }}
              />
              <span className="text-gray-600 text-[11px]">In Progress:</span>
              <span className="font-semibold text-gray-900 text-[11px]">
                {metrics.inProgressTasks}
              </span>
            </div>

            {/* Complete Legend */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: STATUS_COLORS[TASK_STATUSES.COMPLETE] }}
              />
              <span className="text-gray-600 text-[11px]">Complete:</span>
              <span className="font-semibold text-gray-900 text-[11px]">
                {metrics.completedTasks}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
