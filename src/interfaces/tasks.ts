import { Timestamp } from "firebase/firestore";

export interface Tasks {
    id?: string | undefined;
    assignedTo: string[];
    category: string[];
    date: Timestamp;
    descritpion: string;
    priority: string[];
    subtasks: string[];
    title: string;
}

export interface TasksFirestoreData {

    assignedTo?: string[];
    category?: string[];
    date?: Timestamp;
    descritpion?: string;
    priority?: string[];
    subtasks?: string[];
    title?: string;
}