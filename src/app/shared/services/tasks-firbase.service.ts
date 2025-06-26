import { inject, Injectable } from '@angular/core';
import { collection, Firestore, onSnapshot, Timestamp } from '@angular/fire/firestore';
import { Tasks, TasksFirestoreData } from '../../../interfaces/tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksFirbaseService {
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
        console.log(this.tasks);

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

  ngOnDestroy() {
    this.unsubscribe();
  }
}
