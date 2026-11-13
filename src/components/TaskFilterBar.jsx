import React from 'react';
import { TASK_STATUSES } from '../services/taskService';

/**
 * TaskFilterBar Component
 * Provides clean pill-based filter buttons for status filtering.
 */
export default function TaskFilterBar({ activeFilter, onSelectFilter, counts }) {
  const filterOptions = [
    { id: 'All', label: 'All', count: counts.all },
    { id: TASK_STATUSES.PLANNED, label: 'Planned', count: counts.planned },
    { id: TASK_STATUSES.IN_PROGRESS, label: 'In Progress', count: counts.inProgress },
    { id: TASK_STATUSES.COMPLETE, label: 'Complete', count: counts.complete },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 no-scrollbar">
      {filterOptions.map((filter) => {
        const isActive = activeFilter === filter.id;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onSelectFilter(filter.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-gray-900 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span>{filter.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                isActive ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
