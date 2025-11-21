import { db } from "./firebase.config";
import { collection, addDoc, updateDoc, doc, getDocs, query } from "firebase/firestore";

export type TaskResponse = {
  answer: boolean;
  reason: string;
  userId: string;
  createdAt: string;
};

export type TaskExample = {
  image?: string;
  description: string;
};

export type TaskType = {
  image: string;
  title: string;
  text: string;
  points: number;
  response: TaskResponse[];
  example: TaskExample;
};

export class TaskService {
  static async createTask(task: TaskType) {
    const ref = await addDoc(collection(db, "task"), task);
    return { id: ref.id, ...task };
  }

  static async addTaskResponse(taskId: string, response: TaskResponse) {
    const taskRef = doc(db, "task", taskId);
    // Get current responses
    const snapshot = await getDocs(query(collection(db, "task")));
    const taskDoc = snapshot.docs.find(doc => doc.id === taskId);
    const currentResponses = (taskDoc?.data().response as TaskResponse[]) || [];
    const updatedResponses = [...currentResponses, response];
    await updateDoc(taskRef, { response: updatedResponses });
    return { id: taskId, response: updatedResponses };
  }

  static async getAllTasks() {
    const snapshot = await getDocs(collection(db, "task"));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
}
