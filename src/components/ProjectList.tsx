import { useState } from 'react'
import { getProjects, addProject, deleteProject } from '../data/store.ts'

interface Props {
  onSelectProject: (id: string) => void
}

export default function ProjectList({ onSelectProject }: Props) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const projects = getProjects()

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    addProject(name.trim(), description.trim())
    setName('')
    setDescription('')
  }

  return (
    <div>
      {/* Add Project Form */}
      <form onSubmit={handleAdd} className="mb-8 flex flex-wrap gap-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Project name"
          className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description"
          className="flex-1 min-w-[200px] px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
        >
          + Add Project
        </button>
      </form>

      {/* Project Cards */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg">No projects yet</p>
          <p className="text-sm mt-1">Create your first project above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p.id}
              className="border border-gray-200 rounded-xl p-5 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
              onClick={() => onSelectProject(p.id)}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800 text-lg">{p.name}</h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (confirm(`Delete "${p.name}"?`)) deleteProject(p.id)
                  }}
                  className="text-gray-300 hover:text-red-500 transition-colors text-lg cursor-pointer opacity-0 group-hover:opacity-100"
                  title="Delete project"
                >
                  ✕
                </button>
              </div>
              {p.description && (
                <p className="text-gray-500 text-sm mt-1">{p.description}</p>
              )}
              <div className="mt-3 text-xs text-gray-400">
                Click to open →
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}