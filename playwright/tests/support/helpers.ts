import { expect, APIRequestContext } from "@playwright/test";
import { TaskModel } from "../fixtures/task.model";

require('dotenv').config()

const BASE_API = process.env.BASE_API

export async function postTask(request: APIRequestContext, task: TaskModel) {
  const response = await request.post(`${BASE_API}/tasks`, {
    data: task,
  });
  expect(response.ok()).toBeTruthy()
}

export async function getTasks(request: APIRequestContext) {
  const response = await request.get(`${BASE_API}/tasks`)
  expect(response.ok()).toBeTruthy()
  return await response.json()
}

export async function deleteTaskByHelper(request: APIRequestContext, taskName: string) {
  const response = await request.delete(`${BASE_API}/helper/tasks/${taskName}`)
  expect(response.ok()).toBeTruthy()
}

export async function deleteAllTasks(request: APIRequestContext) {
  const tasks = await getTasks(request)
  if (tasks.length) {
    for (const t of tasks) {
      await deleteTaskByHelper(request, t.name)
    }
  }
}

export async function thisTaskExists(request: APIRequestContext, taskName: string) {
  const tasks = await getTasks(request)
  return tasks.some((t: any) => t.name === taskName)
}