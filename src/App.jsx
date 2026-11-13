import React, { useState, useEffect, useMemo } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase/config';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskSummaryCards from './components/TaskSummaryCards';
import ProductivityOverview from './components/ProductivityOverview';
import TaskFilterBar from './components/TaskFilterBar';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Notification from './components/Notification';
import {
  TASK_STATUSES,
  subscribeToUserTasks,
  createTask as apiCreateTask,
  updateTask as apiUpdateTask,
  updateTaskStatus as apiUpdateTaskStatus,
  deleteTask as apiDeleteTask,
} from './services/taskService';
import { Plus, LogOut, CheckSquare, Loader2 } from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Task List State (Synchronized via Firestore onSnapshot)
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  // Status Filter State ('All' | 'Planned' | 'In Progress' | 'Complete')
  const [activeFilter, setActiveFilter] = useState('All');

  // Task Create / Edit Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Delete Confirmation Dialog State
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notification Toast State
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // 1. Firebase Authentication Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Real-Time Firestore Tasks Subscription (Scoped to Authenticated User)
  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setIsLoadingTasks(false);
      return;
    }

    setIsLoadingTasks(true);

    // Subscribe to Firestore 'tasks' where userId == currentUser.uid
    const unsubscribe = subscribeToUserTasks(
      currentUser.uid,
      (userTasks) => {
        setTasks(userTasks);
        setIsLoadingTasks(false);
      },
      (error) => {
        console.error('Firestore subscription error:', error);
        showNotification('Failed to sync tasks from Cloud Firestore.', 'error');
        setIsLoadingTasks(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      showNotification('Logged out successfully.');
    } catch (err) {
      console.error('Logout error:', err);
      showNotification('Failed to log out. Please try again.', 'error');
    }
  };

  // Dynamic status counts
  const counts = useMemo(() => {
    return {
      all: tasks.length,
      planned: tasks.filter((t) => t.status === TASK_STATUSES.PLANNED).length,
      inProgress: tasks.filter((t) => t.status === TASK_STATUSES.IN_PROGRESS).length,
      complete: tasks.filter((t) => t.status === TASK_STATUSES.COMPLETE).length,
    };
  }, [tasks]);

  // Filtered task list
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'All') return tasks;
    return tasks.filter((t) => t.status === activeFilter);
  }, [tasks, activeFilter]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setTaskToEdit(null);
    setIsTaskModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsTaskModalOpen(true);
  };

  // Close Task Modal (Create / Edit)
  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskToEdit(null);
  };

  // Submit Handler for TaskForm (handles both Create and Edit in Firestore)
  const handleTaskFormSubmit = async ({ id, title, description }) => {
    if (!currentUser) {
      showNotification('You must be signed in to manage tasks.', 'error');
      return;
    }

    try {
      if (id) {
        // Update existing task in Firestore
        await apiUpdateTask(id, { title, description });
        showNotification('Task updated successfully.');
      } else {
        // Create new task in Firestore scoped to currentUser.uid
        await apiCreateTask({
          title,
          description,
          userId: currentUser.uid,
        });
        showNotification('Task created successfully.');
      }
    } catch (err) {
      console.error('Task form submit error:', err);
      showNotification(err.message || 'Failed to save task to Firestore.', 'error');
      throw err;
    }
  };

  // Update task status handler in Firestore
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await apiUpdateTaskStatus(taskId, newStatus);
      showNotification(`Task status updated to "${newStatus}".`);
    } catch (err) {
      console.error('Status update error:', err);
      showNotification('Failed to update task status in Firestore.', 'error');
    }
  };

  // Prompt delete confirmation
  const handleDeleteRequest = (task) => {
    setTaskToDelete(task);
  };

  // Confirm delete handler in Firestore
  const handleConfirmDelete = async () => {
    if (!taskToDelete) return;
    try {
      setIsDeleting(true);
      await apiDeleteTask(taskToDelete.id);
      showNotification('Task deleted successfully.');
      setTaskToDelete(null);
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Failed to delete task from Firestore.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Cancel delete
  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  // Initial Auth Loading Screen
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin text-gray-900 mb-3" />
        <p className="text-sm font-medium">Initializing Task Manager...</p>
      </div>
    );
  }

  // 1. LOGIN SCREEN (If user is not authenticated)
  if (!currentUser) {
    return <Login />;
  }

  // User display name or email prefix
  const userGreetingName =
    currentUser.displayName ||
    (currentUser.email ? currentUser.email.split('@')[0] : 'Support Engineer');

  // 2. TASK DASHBOARD (When authenticated)
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 text-white rounded flex items-center justify-center">
              <CheckSquare className="w-4 h-4" />
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Task Manager
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500 hidden sm:inline-block">
              {currentUser.email}
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-900 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section & Dashboard Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Welcome, {userGreetingName}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your tasks and track real-time progress.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-900 transition-colors self-start sm:self-auto shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          </div>
        </div>

        {/* 3. Task Summary Cards */}
        <TaskSummaryCards
          tasks={tasks}
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        {/* Productivity Analytics Section */}
        <ProductivityOverview tasks={tasks} />

        {/* 4. Status Filtering & Section Header */}
        <section aria-labelledby="task-list-heading">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 px-1">
            <h3
              id="task-list-heading"
              className="text-sm font-semibold text-gray-700 uppercase tracking-wider"
            >
              {activeFilter === 'All' ? 'All Tasks' : `${activeFilter} Tasks`} ({filteredTasks.length})
            </h3>
          </div>

          <TaskFilterBar
            activeFilter={activeFilter}
            onSelectFilter={setActiveFilter}
            counts={counts}
          />

          {/* Task List / Empty States */}
          {isLoadingTasks ? (
            <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-sm text-gray-500 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              <span>Syncing tasks with Firestore...</span>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              totalTasksCount={tasks.length}
              activeFilter={activeFilter}
              onResetFilter={() => setActiveFilter('All')}
              onStatusChange={handleStatusChange}
              onEdit={handleOpenEditModal}
              onDeleteRequest={handleDeleteRequest}
              onOpenCreateModal={handleOpenCreateModal}
            />
          )}
        </section>
      </main>

      {/* Task Form Modal (Create & Edit) */}
      <TaskForm
        isOpen={isTaskModalOpen}
        taskToEdit={taskToEdit}
        onClose={handleCloseTaskModal}
        onSubmit={handleTaskFormSubmit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(taskToDelete)}
        taskTitle={taskToDelete?.title || ''}
        isDeleting={isDeleting}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />

      {/* Feedback Notification Toast */}
      <Notification
        notification={notification}
        onDismiss={() => setNotification(null)}
      />
    </div>
  );
}
