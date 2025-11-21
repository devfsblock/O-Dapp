import { NextRequest, NextResponse } from "next/server";
import { TaskService, TaskResponse } from "@/lib/task-service";
import sharp from "sharp";

export async function GET(req: NextRequest) {
  try {
    // Admin fetches all tasks
    const tasks = await TaskService.getAllTasks();
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File;
    const title = formData.get("title") as string;
    const text = formData.get("text") as string;
    const points = Number(formData.get("points"));
    const exampleDescription = formData.get("exampleDescription") as string;
    const exampleImageFile = formData.get("exampleImage") as File | null;
    let exampleImageBase64 = undefined;
    if (exampleImageFile && exampleImageFile.size > 0) {
      const buffer = Buffer.from(await exampleImageFile.arrayBuffer());
      exampleImageBase64 = (await sharp(buffer).toBuffer()).toString("base64");
    }
    if (!imageFile || !title || !text || isNaN(points) || !exampleDescription) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = (await sharp(buffer).toBuffer()).toString("base64");
    const task = await TaskService.createTask({
      image: base64Image,
      title,
      text,
      points,
      response: [],
      example: {
        image: exampleImageBase64,
        description: exampleDescription,
      },
    });
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to create task" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { taskId, answer, reason, userId } = await req.json();
    if (!taskId || typeof answer !== "boolean" || !reason || !userId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const response: TaskResponse = {
      answer,
      reason,
      userId,
      createdAt: new Date().toISOString(),
    };
    const updatedTask = await TaskService.addTaskResponse(taskId, response);
    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed to update task response" }, { status: 500 });
  }
}
