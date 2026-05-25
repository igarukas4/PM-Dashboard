export interface Project {
  id: string
  name: string
  description: string
}

export type TaskStatus = 'todo' | 'in-progress' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  status: TaskStatus
  projectId: string
  priority: TaskPriority
}