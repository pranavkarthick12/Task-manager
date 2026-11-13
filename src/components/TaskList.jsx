import React from 'react';
import TaskItem from './TaskItem';
import { ClipboardList, Filter } from 'lucide-react';

/**
 * TaskList Component
 * Displays the filtered list of tasks or an appropriate empty state.
 */
export default function TaskList({
  tasks,
  totalTasksCount,
  activeFilter,
  onResetFilter,
  onStatusChange,
  onEdit,
  onDeleteRequest,
  onOpenCreateModal,
}) {
  // Empty State 1: When no tasks exist at all in the application
  if (totalTasksCount === 0) {
    return (
      <div className="bg-white border border-gray-200 border-dashed rounded-lg p-12 text-center">
        <div className="w-12 h-12 mx-auto bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
          <ClipboardList className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">No tasks yet</h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          Get started by creating your first task to track your progress.
        </p>
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="mt-4 inline-flex items-center px-3.5 py-2 text-xs font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
        >
          Create First Task
        </button>
      </div>
    );
  }

  // Empty State 2: When tasks exist, but none match the active status filter
  if (!tasks || tasks.length === 0) {
    return (
      <div className="bg-white border border-gray-200 border-dashed rounded-lg p-12 text-center">
        <div className="w-12 h-12 mx-auto bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
          <Filter className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900">
          No {activeFilter} tasks found
        </h3>
        <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
          There are currently no tasks with status "{activeFilter}".
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onResetFilter}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            View All Tasks
          </button>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
          >
            Create Task
          </button>
        </div>
      </div>
    );
  }

  // Task Items List
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDeleteRequest={onDeleteRequest}
        />
      ))}
    </div>
  );
}
