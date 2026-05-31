import { test, expect } from "@playwright/test";
import { getTasks, postTask, deleteTaskByHelper, deleteAllTasks, thisTaskExists } from "./support/helpers";
import { TaskModel } from "./fixtures/task.model";
const taskData = require("./fixtures/tasks.json");

const BASE_API = process.env.BASE_API

test.describe('Tasks API', () => {
  test.beforeEach(async ({ request }) => {
    await deleteAllTasks(request)
  })
  test('should list tasks', async ({ request }) => {
    const task1: TaskModel = taskData.order.task1
    const task2: TaskModel = taskData.order.task2
    const task3: TaskModel = taskData.order.task3
    await postTask(request, task1)
    await new Promise((r) => setTimeout(r, 50))
    await postTask(request, task2)
    await new Promise((r) => setTimeout(r, 50))
    await postTask(request, task3)
    const tasks = await getTasks(request)
    const names = tasks.map((t: any) => t.name)
    const idxA = names.indexOf(task1.name)
    const idxB = names.indexOf(task2.name)
    const idxC = names.indexOf(task3.name)
    expect(idxA).toBeLessThan(idxB)
    expect(idxB).toBeLessThan(idxC)
  })

  test('should create task', async ({ request }) => {
    const task: TaskModel = taskData.success
    await postTask(request, task)
    await thisTaskExists(request, task.name)
  })

  test('shouldnt create duplicate tasks', async ({ request }) => {
    const task: TaskModel = taskData.duplicate
    await postTask(request, task)
    const res = await request.post(`${BASE_API}/tasks`, {
      data: task,
    })
    expect(res.status()).toBe(400)
  })

  test('shouldnt create with empty name', async ({ request }) => {
    const task: TaskModel = taskData.name_invalid
    const res = await request.post(`${BASE_API}/tasks`, {
      data: task,
    })
    expect(res.status()).toBe(400)
  })

  test('shouldnt create with invalid is_done', async ({ request }) => {
    const task: TaskModel = taskData.is_done_invalid
    const res = await request.post(`${BASE_API}/tasks`, {
      data: task,
    })
    expect(res.status()).toBe(400)
  })

  test('should update task', async ({ request }) => {
    const task: TaskModel = taskData.success
    const taskUpdate: TaskModel = taskData.update
    await postTask(request, task)
    const tasks = await getTasks(request)
    const response = tasks.find((t: any) => t.name === task.name)
    expect(response).toBeTruthy()
    const id = response.id
    const update = await request.put(`${BASE_API}/tasks/${id}`, {
      data: taskUpdate,
    })
    expect(update.status()).toBe(200)
    const refreshed = await getTasks(request)
    const updated = refreshed.find((t: any) => t.id === id)
    expect(updated.is_done).toBeTruthy()
  })

  test('shouldnt update name', async ({ request }) => {
    const task: TaskModel = taskData.success
    const taskUpdate: TaskModel = taskData.update
    await postTask(request, task)
    const tasks = await getTasks(request)
    const response = tasks.find((t: any) => t.name === task.name)
    expect(response).toBeTruthy()
    const id = response.id
    console.log(task.name, taskUpdate.name)
    const update = await request.put(`${BASE_API}/tasks/${id}`, {
      data: { name: taskUpdate.name }
    })
    expect(update.status()).toBe(400)
  })

  test('should update is_done', async ({ request }) => {
    const task: TaskModel = taskData.success
    const taskUpdate: TaskModel = taskData.update
    await postTask(request, task)
    const tasks = await getTasks(request)
    const response = tasks.find((t: any) => t.name === task.name)
    expect(response).toBeTruthy()
    const id = response.id
    const update = await request.put(`${BASE_API}/tasks/${id}`, {
      data: { is_done: taskUpdate.is_done },
    })
    expect(update.status()).toBe(200)
    const refreshed = await getTasks(request)
    const updated = refreshed.find((t: any) => t.id === id)
    expect(updated.is_done).toBeTruthy()
  })

  test('should delete task', async ({ request }) => {
    const task: TaskModel = taskData.success
    await postTask(request, task);
    const tasks = await getTasks(request);
    const response = tasks.find((t: any) => t.name === task.name);
    expect(response).toBeTruthy();
    const id = response.id;
    const del = await request.delete(`${BASE_API}/tasks/${id}`);
    expect(del.status()).toBe(204);
    const after = await getTasks(request);
    expect(after.some((t: any) => t.id === id)).toBeFalsy();
  })

  test('shouldnt delete non existing task', async ({ request }) => {
    const response = await request.delete(`${BASE_API}/tasks/999999`)
    expect(response.status()).toBe(204)
  })

  test('should delete task by helper', async ({ request }) => {
    const task: TaskModel = taskData.success
    await postTask(request, task)
    await deleteTaskByHelper(request, task.name)
  })
})
