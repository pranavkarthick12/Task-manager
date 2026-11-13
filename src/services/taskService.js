/**
 * Task Service (Firebase Cloud Firestore)
 * 
 * Manages task operations directly with Firestore 'tasks' collection.
 * Every task document includes title, description, status, createdAt, and userId.
 * Real-time synchronization is handled via onSnapshot filtered by userId.
 */

import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const TASK_STATUSES = {
  PLANNED: 'Planned',
  IN_PROGRESS: 'In Progress',
  COMPLETE: 'Complete',
};

export const STATUS_LIST = [
  TASK_STATUSES.PLANNED,
  TASK_STATUSES.IN_PROGRESS,
  TASK_STATUSES.COMPLETE,
];

/**
 * Subscribe to real-time task updates for the authenticated user.
 * Filters tasks strictly by userId and sorts them by creation date.
 * Returns an unsubscribe function to be called on component unmount.
 */
export const subscribeToUserTasks = (userId, onTasksUpdate, onError) => {
  if (!userId) {
    onTasksUpdate([]);
    return () => {};
  }

  const tasksCollection = collection(db, 'tasks');
  const userTasksQuery = query(tasksCollection, where('userId', '==', userId));

  return onSnapshot(
    userTasksQuery,
    (snapshot) => {
      const tasks = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));

      // Sort descending by createdAt
      tasks.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      onTasksUpdate(tasks);
    },
    (error) => {
      console.error('Firestore onSnapshot subscription error:', error);
      if (onError) onError(error);
    }
  );
};

/**
 * Create a new task in Firestore
 * Enforces title validation, default status 'Planned', createdAt ISO string, and userId.
 */
export const createTask = async ({ title, description, userId }) => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error('Task title cannot be empty.');
  }

  if (!userId) {
    throw new Error('User must be authenticated to create a task.');
  }

  const taskPayload = {
    title: trimmedTitle,
    description: description ? description.trim() : '',
    status: TASK_STATUSES.PLANNED,
    createdAt: new Date().toISOString(),
    userId,
  };

  const docRef = await addDoc(collection(db, 'tasks'), taskPayload);

  return {
    id: docRef.id,
    ...taskPayload,
  };
};

/**
 * Update an existing task's title and description
 */
export const updateTask = async (taskId, { title, description }) => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error('Task title cannot be empty.');
  }

  if (!taskId) {
    throw new Error('Task ID is required for update.');
  }

  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, {
    title: trimmedTitle,
    description: description ? description.trim() : '',
  });

  return { id: taskId, title: trimmedTitle, description: description ? description.trim() : '' };
};

/**
 * Update task status (Planned, In Progress, Complete)
 */
export const updateTaskStatus = async (taskId, newStatus) => {
  if (!STATUS_LIST.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  if (!taskId) {
    throw new Error('Task ID is required for status update.');
  }

  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, { status: newStatus });

  return { id: taskId, status: newStatus };
};

/**
 * Delete a task document from Firestore
 */
export const deleteTask = async (taskId) => {
  if (!taskId) {
    throw new Error('Task ID is required for deletion.');
  }

  const taskRef = doc(db, 'tasks', taskId);
  await deleteDoc(taskRef);

  return { id: taskId, success: true };
};

/**
 * Format ISO date string into readable format: "Nov 13, 2026"
 */
export const formatTaskDate = (isoString) => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '';
  }
};
