import { supabase } from './supabase.ts'
import type { Project, Task } from '../types.ts'

function toProject(row: any): Project {
  return { id: row.id, name: row.name, description: row.description ?? '' }
}

function toTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    status: row.status,
    projectId: row.project_id,
    priority: row.priority,
  }
}

// -- Projects --

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []).map(toProject)
}

export async function addProject(
  name: string,
  description: string
): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert({ name, description })
    .select()
    .single()
  if (error) throw error
  return toProject(data)
}

export async function updateProject(
  id: string,
  updates: Partial<Project>
) {
  const { error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
  if (error) throw error
}

export async function deleteProject(id: string) {
  // Tasks cascade deleted by DB
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// -- Tasks --

export async function getTasks(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data ?? []).map(toTask)
}

export async function addTask(
  title: string,
  projectId: string,
  priority: Task['priority']
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, project_id: projectId, priority, status: 'todo' })
    .select()
    .single()
  if (error) throw error
  return toTask(data)
}

export async function updateTask(
  id: string,
  updates: Partial<Task>
) {
  const dbUpdates: Record<string, any> = {}
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.status !== undefined) dbUpdates.status = updates.status
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority

  const { error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('id', id)
  if (error) throw error
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  if (error) throw error
}