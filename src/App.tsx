import { useState, useEffect } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage.ts'
import {
  initStore,
  getProjects,
  getAllTasks,
} from './data/store.ts'
import type { Project, Task } from './types.ts'
import ProjectList from './components/ProjectList.tsx'
import AddTaskForm from './components/AddTaskForm.tsx'
import TaskTable from './components/TaskTable.tsx'

export default function App() {
  const [savedData, setSavedData] = useLocalStorage<{
    projects: Project[]
    tasks: Task[]
  }>('pm-dashboard', { projects: [], tasks: [] })

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Init store with saved data on mount
  useEffect(() => {
    initStore(savedData, () => {
      setSavedData({ projects: getProjects(), tasks: getAllTasks() })
    })
  }, [])

  const selectedProject = savedData.projects.find(
    (p) => p.id === selectedProjectId
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          {selectedProject ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedProjectId(null)}
                className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm cursor-pointer"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {selectedProject.name}
                </h1>
                {selectedProject.description && (
                  <p className="text-gray-500 text-sm mt-0.5">
                    {selectedProject.description}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <h1 className="text-3xl font-bold text-gray-800">PM Dashboard</h1>
          )}
        </header>

        {/* Content */}
        {selectedProject ? (
          <div>
            <AddTaskForm projectId={selectedProject.id} />
            <TaskTable
              projectId={selectedProject.id}
            />
          </div>
        ) : (
          <ProjectList
            onSelectProject={setSelectedProjectId}
          />
        )}
      </div>
    </div>
  )
}