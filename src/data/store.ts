import { type Project, type Task } from '../types'

export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 10)
}

interface StoreData {
  projects: Project[]
  tasks: Task[]
}

let data: StoreData = { projects: [], tasks: [] }
let saveCallback: (() => void) | null = null

export function initStore(initialData: StoreData, onSave: () => void) {
  data = initialData
  saveCallback = onSave
}

function save() {
  saveCallback?.()
}

// -- Projects --

export function getProjects(): Project[] {
  return data.projects
}

export function addProject(name: string, description: string): Project {
  const project: Project = { id: generateId(), name, description }
  data.projects = [...data.projects, project]
  save()
  return project
}

export function updateProject(id: string, updates: Partial<Project>) {
  data.projects = data.projects.map((p) =>
    p.id === id ? { ...p, ...updates } : p
  )
  save()
}

export function deleteProject(id: string) {
  data.projects = data.projects.filter((p) => p.id !== id)
  data.tasks = data.tasks.filter((t) => t.projectId !== id)
  save()
}

// -- Tasks --

export function getTasks(projectId: string): Task[] {
  return data.tasks.filter((t) => t.projectId === projectId)
}

export function getAllTasks(): Task[] {
  return data.tasks
}

export function addTask(
  title: string,
  projectId: string,
  priority: Task['priority']
): Task {
  const task: Task = {
    id: generateId(),
    title,
    status: 'todo',
    projectId,
    priority,
  }
  data.tasks = [...data.tasks, task]
  save()
  return task
}

export function updateTask(id: string, updates: Partial<Task>) {
  data.tasks = data.tasks.map((t) =>
    t.id === id ? { ...t, ...updates } : t
  )
  save()
}

export function deleteTask(id: string) {
  data.tasks = data.tasks.filter((t) => t.id !== id)
  save()
}