import { Page, expect } from '@playwright/test'
import { TaskModel } from '../../../fixtures/task.model'
import { getTasks } from '../../helpers'

interface TaskElements {
    readonly createdTaskCounter: string
    readonly doneTaskCounter: string
    readonly inputTaskName: string
    readonly buttonAddTask: string
    readonly itemList: string
    readonly toggleButton: string
    readonly deleteButton: string
    readonly alertContainer: string
}

export class TasksPage {
    readonly page: Page
    readonly elements: TaskElements

    constructor(page: Page) {
        this.page = page
        this.elements = {
            createdTaskCounter: 'div[class*=listCreatedTaskCounter] >> span',
            doneTaskCounter: 'div[class*=listDoneTaskCounter] >> span',
            inputTaskName: 'input[class*=InputNewTask]',
            buttonAddTask: 'css=button >> text=Create',
            itemList: '.task-item p',
            toggleButton: 'xpath=.. >> button[class*=listItemToggle]',
            deleteButton: 'xpath=.. >> button[class*=listItemDeleteButton]',
            alertContainer: '.swal2-html-container'
        }
    }

    async goto() {
        await this.page.goto('/')
    }

    async createTask(task: TaskModel) {
        const createdTaskCounter = this.page.locator(this.elements.createdTaskCounter)
        const inputTaskName = this.page.locator(this.elements.inputTaskName)
        await inputTaskName.fill(task.name)
        const buttonAddTask = this.page.locator(this.elements.buttonAddTask)
        await buttonAddTask.click()
        const expected = `${parseInt(await createdTaskCounter.innerText()) + 1}`
        await expect(createdTaskCounter).toHaveText(expected)
    }

    async createDuplicateTask(task: TaskModel) {
        const inputTaskName = this.page.locator(this.elements.inputTaskName)
        await inputTaskName.fill(task.name)
        const buttonAddTask = this.page.locator(this.elements.buttonAddTask)
        await buttonAddTask.click()
    }

    async getTasks() {
        const target = this.page.locator(this.elements.itemList)
        return await target
    }

    async deleteTask(taskName: string) {
        const target = this.page.locator(`${this.elements.itemList} >> text=${taskName} >> ${this.elements.deleteButton}`)
        await target.click()
    }

    async toggleTask(taskName: string) {
        const target = this.page.locator(`${this.elements.itemList} >> text=${taskName} >> ${this.elements.toggleButton}`)
        await target.click()
    }

    async shouldHaveText(taskName: string) {
        const target = this.page.locator(`${this.elements.itemList} >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

    async shouldNotExist(taskName: string) {
        const target = this.page.locator(`${this.elements.itemList} >> text=${taskName}`)
        await expect(target).toHaveCount(0)
    }

    async shouldBeDone(taskName: string) {
        const targetP = this.page.locator(`${this.elements.itemList} >> text=${taskName}`)
        const targetButton = targetP.locator(this.elements.toggleButton)
        await expect(targetButton).toHaveClass(/listItemToggleSelected/)
        await expect(targetP).toHaveClass(/listItemTextSelected/)
    }

    async shouldBeUndone(taskName: string) {
        const targetP = this.page.locator(`${this.elements.itemList} >> text=${taskName}`)
        const targetButton = targetP.locator(this.elements.toggleButton)
        await expect(targetButton).not.toHaveClass(/listItemToggleSelected/)
        await expect(targetP).not.toHaveClass(/listItemTextSelected/)
    }

    async alertShouldHaveText(expectedText: string) {
        const target = this.page.locator(this.elements.alertContainer)
        await expect(target).toBeVisible()
        await expect(target).toHaveText(expectedText)
    }
}