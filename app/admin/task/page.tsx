"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AdminTaskPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [newTask, setNewTask] = useState<{ title: string, text: string, image: File | null | undefined, points: number, exampleDescription: string, exampleImage: File | null | undefined }>({ title: "", text: "", image: null, points: 0, exampleDescription: "", exampleImage: null });
  const [error, setError] = useState("");
  const [editResponse, setEditResponse] = useState<{ answer: boolean, reason: string, userId: string }>({ answer: false, reason: "", userId: "admin" });

  // Fetch all tasks
  useEffect(() => {
    setLoading(true);
    fetch("/api/task")
      .then(res => res.json())
      .then(data => {
        setTasks(data.tasks || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Handle edit
  const handleEdit = (task: any) => {
    setEditingTask(task);
    setEditResponse({ answer: false, reason: "", userId: "admin" });
  };

  const handleEditResponseChange = (field: string, value: any) => {
    setEditResponse(prev => ({ ...prev, [field]: value }));
  };

  const handleEditSave = async () => {
    if (!editingTask) return;
    setLoading(true);
    const res = await fetch("/api/task", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: editingTask.id,
        answer: editResponse.answer,
        reason: editResponse.reason,
        userId: editResponse.userId,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setTasks(tasks.map(t => (t.id === editingTask.id ? { ...t, ...data.task } : t)));
      setEditingTask(null);
    } else {
      setError(data.error || "Failed to update task");
    }
    setLoading(false);
  };

  // Handle new task
  const handleNewTaskChange = (field: string, value: any) => {
    setNewTask(prev => ({ ...prev, [field]: value }));
  };

  const handleNewTaskImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTask(prev => ({ ...prev, image: e.target.files?.item(0) }));
    }
  };

  const handleNewExampleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewTask(prev => ({ ...prev, exampleImage: e.target.files?.item(0) }));
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.text || !newTask.image || !newTask.points || !newTask.exampleDescription) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", newTask.title);
    formData.append("text", newTask.text);
    formData.append("image", newTask.image);
    formData.append("points", String(newTask.points));
    formData.append("exampleDescription", newTask.exampleDescription);
    if (newTask.exampleImage) formData.append("exampleImage", newTask.exampleImage);
    const res = await fetch("/api/task", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setTasks([...tasks, data.task]);
      setNewTask({ title: "", text: "", image: null, points: 0, exampleDescription: "", exampleImage: null });
      setError("");
    } else {
      setError(data.error || "Failed to add task");
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Task Management</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label>Title</Label>
              <input
                type="text"
                value={newTask.title}
                onChange={e => handleNewTaskChange("title", e.target.value)}
                className="w-full border rounded p-2"
              />
              <Label>Description</Label>
              <Textarea
                value={newTask.text}
                onChange={e => handleNewTaskChange("text", e.target.value)}
                className="w-full"
              />
              <Label>Points</Label>
              <input
                type="number"
                value={newTask.points}
                onChange={e => handleNewTaskChange("points", Number(e.target.value))}
                className="w-full border rounded p-2"
                min={0}
              />
              <Label>Image</Label>
              <input type="file" accept="image/*" onChange={handleNewTaskImage} />
              <Label>Example Description (Markdown)</Label>
              <Textarea
                value={newTask.exampleDescription}
                onChange={e => handleNewTaskChange("exampleDescription", e.target.value)}
                className="w-full"
                placeholder="Enter markdown for example description"
              />
              <Label>Example Image (optional)</Label>
              <input type="file" accept="image/*" onChange={handleNewExampleImage} />
              <Button onClick={handleAddTask} disabled={loading} className="mt-4">
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map(task => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle>{task.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img src={`data:image/png;base64,${task.image}`} alt={task.title} className="w-full h-40 object-cover rounded mb-2" />
                  <div className="mb-2">{task.text}</div>
                  <div className="mb-2 text-xs text-gray-500">Points: {task.points}</div>
                  <div className="mb-2">
                    <Label>Example</Label>
                    {task.example?.image && (
                      <img src={`data:image/png;base64,${task.example.image}`} alt="Example" className="w-full h-32 object-cover rounded mb-2" />
                    )}
                    <div className="prose max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{(task.example?.description || "No example description.").replace(/\\r\\n|\\n|\\r/g, "\n")}</ReactMarkdown>
                    </div>
                  </div>
                  <div className="mb-2">
                    <Label>Responses</Label>
                    <ul className="mb-2">
                      {Array.isArray(task.response) && task.response.length > 0 ? (
                        task.response.map((resp: any, idx: number) => (
                          <li key={idx} className="border-b py-1 text-xs">
                            <span className="font-semibold">User:</span> {resp.userId} | <span className="font-semibold">Answer:</span> {resp.answer ? "Accepted" : "Rejected"} | <span className="font-semibold">Reason:</span> {resp.reason} | <span className="font-semibold">At:</span> {resp.createdAt}
                          </li>
                        ))
                      ) : (
                        <li className="text-gray-400">No responses yet.</li>
                      )}
                    </ul>
                  </div>
                  {editingTask?.id === task.id ? (
                    <div className="mb-2">
                      <Label>Edit Response</Label>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          checked={editResponse.answer}
                          onChange={e => handleEditResponseChange("answer", e.target.checked)}
                        />
                        <span>Accepted</span>
                      </div>
                      <Label>Reason</Label>
                      <Textarea
                        value={editResponse.reason}
                        onChange={e => handleEditResponseChange("reason", e.target.value)}
                        className="w-full mb-2"
                      />
                      <Button onClick={handleEditSave} disabled={loading} className="mt-2">Save</Button>
                    </div>
                  ) : (
                    <Button onClick={() => handleEdit(task)} className="mt-2">Add Response</Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
