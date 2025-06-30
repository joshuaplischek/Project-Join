import { inject, Injectable } from '@angular/core';
import {collection, doc, Firestore, onSnapshot, Timestamp, updateDoc,} from '@angular/fire/firestore';
import { Tasks, TasksFirestoreData } from '../../../interfaces/tasks';

@Injectable({
  providedIn: 'root',
})
export class TasksFirbaseService {
  firestore: Firestore = inject(Firestore);
  tasks: Tasks[] = [];
  unsubscribe;

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

  subTasks() {
    return onSnapshot(this.getTasks(), (list) => {
      this.tasks = [];
      list.forEach((element) => {
        this.tasks.push(this.setTasksObject(element.data(), element.id));
      });
    });
  }

  setTasksObject(obj: TasksFirestoreData, id: string): Tasks {
    return {
      id: id,
      assignedTo: obj.assignedTo || [],
      category: obj.category || '',
      date: obj.date || Timestamp.now(),
      description: obj.description || '',
      priority: obj.priority || '',
      status: obj.status || '',
      subtasks: obj.subtasks || [],
      title: obj.title || '',
    };
  }

  ngOnDestroy() {
    this.unsubscribe();
  }
}
