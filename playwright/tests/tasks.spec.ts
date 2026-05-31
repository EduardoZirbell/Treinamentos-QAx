import { TaskModel } from "./fixtures/task.model";
import { postTask, getTasks, deleteTaskByHelper, deleteAllTasks } from "./support/helpers";
import { test, expect } from "@playwright/test";
import { TasksPage } from "./support/pages/tasks/index";

const taskData = require('./fixtures/tasks.json')
let tasksPage: TasksPage;

test.describe('Tasks UI', () => {
    test.beforeEach(async ({ page, request }) => {
        await deleteAllTasks(request)
        tasksPage = new TasksPage(page);
    });

    test('should create a new task', async () => {
        const task: TaskModel = taskData.success
        await tasksPage.goto()
        await tasksPage.createTask(task)
        await tasksPage.shouldHaveText(task.name)
        await tasksPage.shouldBeUndone(task.name)
    })

    test('should delete a task', async () => {
        const task: TaskModel = taskData.success
        await tasksPage.goto()
        await tasksPage.createTask(task)
        await tasksPage.deleteTask(task.name)
        await tasksPage.shouldNotExist(task.name)
    });

    test('should toggle task done/undone', async () => {
        const task: TaskModel = taskData.success
        await tasksPage.goto()
        await tasksPage.createTask(task)
        await tasksPage.shouldHaveText(task.name)
        await tasksPage.shouldBeUndone(task.name)
        await tasksPage.toggleTask(task.name)
        await tasksPage.shouldBeDone(task.name)
        await tasksPage.toggleTask(task.name)
        await tasksPage.shouldBeUndone(task.name)
    })

    test('shouldnt create duplicate tasks', async ({ request }) => {
        const task: TaskModel = taskData.duplicate
        await postTask(request, task)
        await tasksPage.goto()
        await tasksPage.createDuplicateTask(task)
        await tasksPage.alertShouldHaveText('Task already exists!')
    })

    test('should preserve creation order', async () => {
        const t1: TaskModel = taskData.order.task1
        const t2: TaskModel = taskData.order.task2
        const t3: TaskModel = taskData.order.task3
        await tasksPage.goto();
        await tasksPage.createTask(t1);
        await tasksPage.createTask(t2);
        await tasksPage.createTask(t3);
        await tasksPage.shouldHaveText(t1.name);
        await tasksPage.shouldHaveText(t2.name);
        await tasksPage.shouldHaveText(t3.name);
        const items = await tasksPage.getTasks();
        await expect(items.nth(0)).toHaveText(t1.name);
        await expect(items.nth(1)).toHaveText(t2.name);
        await expect(items.nth(2)).toHaveText(t3.name);
    })
})