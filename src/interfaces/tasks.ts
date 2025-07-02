import { Timestamp } from "firebase/firestore";

export interface Tasks {
  id: string;
  assignedTo: string[];
  category: string;
  date: Timestamp; 
  description: string;
  priority: string;
  status: string;
  subtasks: { title: string; done: boolean }[];
  title: string;
}

export interface TasksFirestoreData {
  assignedTo?: string[];
  category?: string;
  date?: Date | Timestamp; 
  description?: string;
  priority?: string;
  subtasks?: { title: string; done: boolean }[];
  title?: string;
  status?: string;
}

export interface Subtask {
    title: string;
    done: boolean;
}