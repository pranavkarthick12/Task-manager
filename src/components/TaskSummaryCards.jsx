import React from 'react';
import { TASK_STATUSES } from '../services/taskService';
import { ListFilter, Clock, CheckCircle2, Circle } from 'lucide-react';

/**
 * TaskSummaryCards Component
 * Displays 4 compact dynamic summary cards:
 * Total Tasks, Planned, In Progress, Complete.
 */
export default function TaskSummaryCards({ tasks = [], activeFilter = 'All', onSelectFilter }) {
  const totalCount = tasks.length;
  const plannedCount = tasks.filter((t) => t.status === TASK_STATUSES.PLANNED).length;
  const inProgressCount = tasks.filter((t) => t.status === TASK_STATUSES.IN_PROGRESS).length;
  const completeCount = tasks.filter((t) => t.status === TASK_STATUSES.COMPLETE).length;

  const cards = [
    {
      id: 'All',
      label: 'Total Tasks',
      count: totalCount,
      icon: ListFilter,
      badgeColor: 'text-gray-900 bg-gray-100',
      activeRing: activeFilter === 'All' ? 'ring-2 ring-gray-900 border-gray-900' : 'border-gray-200',
    },
    {
      id: TASK_STATUSES.PLANNED,
      label: 'Planned',
      count: plannedCount,
      icon: Circle,
      badgeColor: 'text-slate-700 bg-slate-100',
      activeRing: activeFilter === TASK_STATUSES.PLANNED ? 'ring-2 ring-slate-700 border-slate-700' : 'border-gray-200',
    },
    {
      id: TASK_STATUSES.IN_PROGRESS,
      label: 'In Progress',
      count: inProgressCount,
      icon: Clock,
      badgeColor: 'text-amber-700 bg-amber-50',
      activeRing: activeFilter === TASK_STATUSES.IN_PROGRESS ? 'ring-2 ring-amber-600 border-amber-600' : 'border-gray-200',
    },
    {
      id: TASK_STATUSES.COMPLETE,
      label: 'Complete',
      count: completeCount,
      icon: CheckCircle2,
      badgeColor: 'text-emerald-700 bg-emerald-50',
      activeRing: activeFilter === TASK_STATUSES.COMPLETE ? 'ring-2 ring-emerald-600 border-emerald-600' : 'border-gray-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected = activeFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectFilter && onSelectFilter(card.id)}
            className={`text-left bg-white p-4 rounded-lg border shadow-sm transition-all hover:border-gray-300 focus:outline-none ${card.activeRing}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`p-1.5 rounded-md ${card.badgeColor}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                {card.count}
              </span>
              {isSelected && (
                <span className="text-[10px] uppercase font-semibold text-gray-400">
                  Active
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
