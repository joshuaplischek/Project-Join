import { inject, Injectable } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  getDoc,
  addDoc,
  deleteDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { single } from 'rxjs';
import { idToken } from '@angular/fire/auth';
import { Tasks, TasksFirestoreData } from '../../../interfaces/tasks';
import { Task } from 'zone.js/lib/zone-impl';
import { Timestamp } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  firestore: Firestore = inject(Firestore);
  tasks: Tasks[] = [];
  unsubscribe;

  constructor() {
    this.unsubscribe = this.subTasks();
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
      category: obj.category || [],
      date: obj.date || Timestamp.now(),
      descritpion: obj.descritpion || '',
      priority: obj.priority || [],
      subtasks: obj.subtasks || [],
      title: obj.title || '',
    };
  }
}
