import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  deleteDoc,
} from '@angular/fire/firestore';
import { Subtask, Tasks, TasksFirestoreData } from '../../../interfaces/tasks';
import { Subject } from 'rxjs';

/**
 * Service for managing tasks in Firebase Firestore.
 */
@Injectable({
  providedIn: 'root',
})
export class TasksFirbaseService {
  firestore: Firestore = inject(Firestore);
  tasks: Tasks[] = [];
  subtasks: Subtask[] = [];

  tasksChanged = new Subject<void>();
  private unsubscribe: () => void;

  /**
   * Initializes service and sets up task subscriptions.
   */
  constructor() {
    this.loadTasksFromFirebase();
    this.unsubscribe = this.subTasks();
  }

  /**
   * Triggers task reload from Firebase.
   */
  loadTasksFromFirebase() {
    this.tasksChanged.next();
  }

  /**
   * Updates task data in Firestore.
   *
   * @param id - Task ID to update
   * @param data - Data object with fields to update
   *
   * @throws {Error} When task update fails
   */
  async updateTaskStatus(id: string, data: object) {
    const docRef = doc(this.firestore, `tasks/${id}`);
    await updateDoc(docRef, data);
  }

  /**
   * Gets the Firestore collection reference for tasks.
   */
  getTasks() {
    return collection(this.firestore, 'tasks');
  }

  /**
   * Subscribes to real-time task updates from Firestore.
   */
  subTasks(): () => void {
    return onSnapshot(this.getTasks(), (list) => {
      const newTasks: Tasks[] = [];
      list.forEach((element) => {
        newTasks.push(this.setTasksObject(element.data(), element.id));
      });
      this.tasks = newTasks;
      this.tasksChanged.next();
    });
  }

  /**
   * Converts date values to Firestore Timestamp format.
   *
   * @param date - Date value to convert
   */
  convertDate(date: Date | Timestamp | undefined): Timestamp {
    if (date instanceof Date) {
      return Timestamp.fromDate(date);
    } else if (date instanceof Timestamp) {
      return date;
    }
    return Timestamp.now();
  }

  /**
   * Converts Firestore data to Task object.
   *
   * @param obj - Raw Firestore task data
   * @param id - Document ID
   */
  setTasksObject(obj: TasksFirestoreData, id: string): Tasks {
    const subtask = Array.isArray(obj.subtasks)
      ? obj.subtasks.map((title) =>
          typeof title === 'string' ? { title, done: false } : title
        )
      : [];
    return {
      id: id,
      assignedTo: obj.assignedTo || [],
      category: obj.category || '',
      date: this.convertDate(obj.date),
      description: obj.description || '',
      priority: obj.priority || '',
      status: obj.status || '',
      subtasks: subtask || [],
      title: obj.title || '',
    };
  }

  /**
   * Adds a new task to Firestore.
   *
   * @param formData - Task data to add
   *
   * @throws {Error} When task creation fails
   */
  async addTask(formData: TasksFirestoreData) {
    try {
      const tasksCollection = this.getTasks();
      const taskData = {
        ...formData,
        date: this.convertDate(formData.date),
      };
      const docRef = await addDoc(tasksCollection, taskData);
      this.tasksChanged.next();
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deletes a task from Firestore.
   *
   * @param taskId - Task ID to delete
   *
   * @throws {Error} When task deletion fails
   */
  async deleteTask(taskId: string): Promise<void> {
    const taskDoc = doc(this.firestore, 'tasks', taskId);
    await deleteDoc(taskDoc);
  }

  /**
   * Cleans up subscriptions when service is destroyed.
   */
  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
