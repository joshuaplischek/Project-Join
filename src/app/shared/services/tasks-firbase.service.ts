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

@Injectable({
  providedIn: 'root',
})
export class TasksFirbaseService {
  firestore: Firestore = inject(Firestore);
  tasks: Tasks[] = [];
  subtasks: Subtask[] = [];

  tasksChanged = new Subject<void>();
  private unsubscribe: () => void;

  constructor() {
    this.unsubscribe = this.subTasks();
  }

  async updateTaskStatus(id: string, data: object) {
    const docRef = doc(this.firestore, `tasks/${id}`);
    await updateDoc(docRef, data);
  }

  getTasks() {
    return collection(this.firestore, 'tasks');
  }

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

  convertDate(date: Date | Timestamp | undefined): Timestamp {
    if (date instanceof Date) {
      return Timestamp.fromDate(date);
    } else if (date instanceof Timestamp) {
      return date;
    }
    return Timestamp.now();
  }

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

  async deleteTask(taskId: string): Promise<void> {
    const taskDoc = doc(this.firestore, 'tasks', taskId);
    await deleteDoc(taskDoc);
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}