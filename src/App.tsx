import { useState, useEffect, useCallback } from 'react'
import { getProjects, getTasks } from './data/store.ts'
import type { Project, Task } from './types.ts'
import ProjectList from './components/ProjectList.tsx'
import AddTaskForm from './components/AddTaskForm.tsx'
import TaskTable from './components/TaskTable.tsx'

export default function App() {
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  const loadProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProjects()
      setProjects(data)
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const loadTasks = useCallback(async (projectId: string) => {
    try {
      const data = await getTasks(projectId)
      setTasks(data)
    } catch (err) {
      console.error('Failed to load tasks:', err)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects, refreshKey])

  useEffect(() => {
    if (selectedProjectId) {
      loadTasks(selectedProjectId)
    }
  }, [selectedProjectId, loadTasks, refreshKey])

  const handleRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const selectedProject = projects.find((p) => p.id === selectedProjectId)

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading...</p>
      </div>
    )
  }

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
            <AddTaskForm
              projectId={selectedProject.id}
              onTaskAdded={handleRefresh}
            />
            <TaskTable
              tasks={tasks}
              onRefresh={handleRefresh}
            />
          </div>
        ) : (
          <ProjectList
            projects={projects}
            onSelectProject={setSelectedProjectId}
            onRefresh={handleRefresh}
          />
        )}
      </div>
    </div>
  )
}