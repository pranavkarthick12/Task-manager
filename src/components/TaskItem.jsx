import React from 'react';
import { TASK_STATUSES, STATUS_LIST, formatTaskDate } from '../services/taskService';
import { Pencil, Trash2, Calendar } from 'lucide-react';

/**
 * TaskItem Component
 * Renders an individual task with title, description, creation date, status badge,
 * status dropdown, and Edit / Delete actions.
 */
export default function TaskItem({
  task,
  onStatusChange,
  onEdit,
  onDeleteRequest,
}) {
  // Status badge styling helper
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case TASK_STATUSES.COMPLETE:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case TASK_STATUSES.IN_PROGRESS:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case TASK_STATUSES.PLANNED:
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleSelectChange = (e) => {
    const newStatus = e.target.value;
    onStatusChange(task.id, newStatus);
  };

  const formattedDate = formatTaskDate(task.createdAt);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:border-gray-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Task Details */}
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h3 className="text-base font-semibold text-gray-900 break-words">
              {task.title}
            </h3>
            {/* Visual Status Badge */}
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>

          {task.description ? (
            <p className="text-sm text-gray-600 whitespace-pre-line break-words">
              {task.description}
            </p>
          ) : (
            <p className="text-xs text-gray-400 italic">No description provided</p>
          )}

          {/* Creation Date */}
          {formattedDate && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Created {formattedDate}</span>
            </div>
          )}
        </div>

        {/* Status Dropdown & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Dropdown */}
          <div className="flex items-center gap-1.5">
            <label
              htmlFor={`status-select-${task.id}`}
              className="text-xs font-medium text-gray-500 whitespace-nowrap"
            >
              Status:
            </label>
            <select
              id={`status-select-${task.id}`}
              value={task.status}
              onChange={handleSelectChange}
              aria-label={`Update status for ${task.title}`}
              className="text-xs font-medium border border-gray-300 rounded-md bg-white text-gray-700 px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 cursor-pointer"
            >
              {STATUS_LIST.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusOption}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons: Edit and Delete */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onEdit(task)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors"
              title="Edit Task"
              aria-label={`Edit ${task.title}`}
            >
              <Pencil className="w-3.5 h-3.5 text-gray-500" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={() => onDeleteRequest(task)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-white border border-gray-200 rounded-md hover:bg-red-50 hover:border-red-200 focus:outline-none focus:ring-1 focus:ring-red-600 transition-colors"
              title="Delete Task"
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
