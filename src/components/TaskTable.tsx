import { useState } from 'react'
import { getTasks, updateTask, deleteTask } from '../data/store.ts'
import type { Task, TaskStatus, TaskPriority } from '../types.ts'

interface Props {
  projectId: string
}

const statusColors: Record<TaskStatus, string> = {
  'todo': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'done': 'bg-green-100 text-green-700',
}

const priorityColors: Record<TaskPriority, string> = {
  'low': 'bg-gray-100 text-gray-500',
  'medium': 'bg-amber-100 text-amber-700',
  'high': 'bg-red-100 text-red-700',
}

export default function TaskTable({ projectId }: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editStatus, setEditStatus] = useState<TaskStatus>('todo')
  const [editPriority, setEditPriority] = useState<TaskPriority>('medium')

  const tasks = getTasks(projectId)

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditStatus(task.status)
    setEditPriority(task.priority)
  }

  const saveEdit = () => {
    if (!editingId || !editTitle.trim()) return
    updateTask(editingId, {
      title: editTitle.trim(),
      status: editStatus,
      priority: editPriority,
    })
    setEditingId(null)
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <p className="text-base">No tasks yet</p>
        <p className="text-sm mt-1">Add your first task above</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wide">
            <th className="py-3 px-4 font-medium">Task</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Priority</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
              {editingId === task.id ? (
                <>
                  <td className="py-2 px-4">
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as TaskStatus)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm bg-white cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm bg-white cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </td>
                  <td className="py-2 px-4 text-right">
                    <button onClick={saveEdit} className="text-green-600 hover:text-green-800 text-sm font-medium mr-3 cursor-pointer">Save</button>
                    <button onClick={cancelEdit} className="text-gray-400 hover:text-gray-600 text-sm cursor-pointer">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="py-3 px-4 text-gray-800">{task.title}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[task.status]}`}>
                      {task.status === 'in-progress' ? 'In Progress' : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityColors[task.priority]}`}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => startEdit(task)} className="text-blue-500 hover:text-blue-700 text-sm mr-3 cursor-pointer">Edit</button>
                    <button onClick={() => { if (confirm('Delete this task?')) deleteTask(task.id) }} className="text-red-400 hover:text-red-600 text-sm cursor-pointer">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}