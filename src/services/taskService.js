/**
 * Task Service (Firebase Cloud Firestore)
 * 
 * Manages task operations directly within the user's isolated subcollection:
 * Path: users/{uid}/tasks/{taskId}
 * Every task document includes title, description, status, createdAt, and userId.
 * Real-time synchronization is handled via onSnapshot on the user's subcollection.
 */

import {
  collection,
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
 * Helper to get the Firestore collection reference for a user's tasks:
 * users/{userId}/tasks
 */
export const getUserTasksCollection = (userId) => {
  if (!userId) {
    throw new Error('User ID is required to access tasks collection.');
  }
  return collection(db, 'users', userId, 'tasks');
};

/**
 * Subscribe to real-time task updates for the authenticated user under users/{uid}/tasks.
 * Returns an unsubscribe function to be called on component unmount.
 */
export const subscribeToUserTasks = (userId, onTasksUpdate, onError) => {
  if (!userId) {
    onTasksUpdate([]);
    return () => {};
  }

  const userTasksRef = getUserTasksCollection(userId);

  return onSnapshot(
    userTasksRef,
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
 * Create a new task in Firestore under users/{userId}/tasks
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

  const docRef = await addDoc(getUserTasksCollection(userId), taskPayload);

  return {
    id: docRef.id,
    ...taskPayload,
  };
};

/**
 * Update an existing task's title and description under users/{userId}/tasks/{taskId}
 */
export const updateTask = async (userId, taskId, { title, description }) => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    throw new Error('Task title cannot be empty.');
  }

  if (!userId || !taskId) {
    throw new Error('User ID and Task ID are required for update.');
  }

  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await updateDoc(taskRef, {
    title: trimmedTitle,
    description: description ? description.trim() : '',
  });

  return { id: taskId, title: trimmedTitle, description: description ? description.trim() : '' };
};

/**
 * Update task status (Planned, In Progress, Complete) under users/{userId}/tasks/{taskId}
 */
export const updateTaskStatus = async (userId, taskId, newStatus) => {
  if (!STATUS_LIST.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}`);
  }

  if (!userId || !taskId) {
    throw new Error('User ID and Task ID are required for status update.');
  }

  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
  await updateDoc(taskRef, { status: newStatus });

  return { id: taskId, status: newStatus };
};

/**
 * Delete a task document from Firestore under users/{userId}/tasks/{taskId}
 */
export const deleteTask = async (userId, taskId) => {
  if (!userId || !taskId) {
    throw new Error('User ID and Task ID are required for deletion.');
  }

  const taskRef = doc(db, 'users', userId, 'tasks', taskId);
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
