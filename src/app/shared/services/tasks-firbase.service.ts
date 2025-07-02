import { inject, Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  doc, 
  updateDoc, 
  onSnapshot,
  Timestamp,
  serverTimestamp 
} from '@angular/fire/firestore';  // Alle Imports aus @angular/fire/firestore
import { Tasks, TasksFirestoreData } from '../../../interfaces/tasks';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksFirbaseService {
  firestore: Firestore = inject(Firestore);
  tasks: Tasks[] = [];
  unsubscribe;
  tasksChanged = new Subject<void>();

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
    const newTasks: Tasks[] = [];
      list.forEach((element) => {
        newTasks.push(this.setTasksObject(element.data(), element.id));
      });
          this.tasks = newTasks;
          this.tasksChanged.next();
    });
  }

  setTasksObject(obj: TasksFirestoreData, id: string): Tasks {
    // Datum-Konvertierung vor der Objekterstellung
    let dateValue: Timestamp;
    if (obj.date instanceof Date) {
      dateValue = Timestamp.fromDate(obj.date);
    } else if (obj.date instanceof Timestamp) {
      dateValue = obj.date;
    } else {
      dateValue = Timestamp.now();
    }

    return {
      id: id,
      assignedTo: obj.assignedTo || [],
      category: obj.category || '',
      date: dateValue,
      description: obj.description || '',
      priority: obj.priority || '',
      status: obj.status || '',
      subtasks: obj.subtasks || [],
      title: obj.title || '',
    };
  }

  

async addTask(formData: TasksFirestoreData) {
  try {
    const tasksCollection = this.getTasks();
    // Datum korrekt konvertieren
    let dateTimestamp: Timestamp;
    if (formData.date instanceof Date) {
      dateTimestamp = Timestamp.fromDate(formData.date);
    } else if (formData.date instanceof Timestamp) {
      dateTimestamp = formData.date;
    } else {
      dateTimestamp = Timestamp.now();
    }

    const taskData = {
      ...formData,
      status: 'todo',
      date: dateTimestamp
    };

    const docRef = await addDoc(tasksCollection, taskData);
    console.log('Task erfolgreich hinzugefügt, ID:', docRef.id);
    this.tasksChanged.next();
    return docRef.id;
  } catch (error) {
    console.error('Fehler beim Hinzufügen des Tasks:', error);
    throw error;
  }
}

  ngOnDestroy() {
    this.unsubscribe();
  }
}
