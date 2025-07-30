"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

export type Engineer = {
  id: string
  name: string
  email: string
  skills: string[]
  status: "Available" | "Busy"
}

export type Project = {
  id: string
  name: string
  description: string
  deadline: string
  status: "Not Started" | "In Progress" | "Completed"
}

export type Assignment = {
  id: string
  engineerId: string
  projectId: string
  assignedAt: string
}

type DataContextType = {
  engineers: Engineer[]
  projects: Project[]
  assignments: Assignment[]
  addEngineer: (engineer: Omit<Engineer, "id">) => void
  updateEngineer: (id: string, engineer: Partial<Engineer>) => void
  deleteEngineer: (id: string) => void
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  addAssignment: (assignment: Omit<Assignment, "id" | "assignedAt">) => void
  removeAssignment: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

// Initial demo data
const INITIAL_ENGINEERS: Engineer[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice@demo.com",
    skills: ["React", "TypeScript", "Node.js"],
    status: "Available",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob@demo.com",
    skills: ["Python", "Django", "PostgreSQL"],
    status: "Busy",
  },
  {
    id: "3",
    name: "Carol Davis",
    email: "carol@demo.com",
    skills: ["Java", "Spring Boot", "AWS"],
    status: "Available",
  },
]

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "E-commerce Platform",
    description: "Build a modern e-commerce platform with React and Node.js",
    deadline: "2024-03-15",
    status: "In Progress",
  },
  {
    id: "2",
    name: "Mobile App Backend",
    description: "Create REST API for mobile application",
    deadline: "2024-02-28",
    status: "Not Started",
  },
  {
    id: "3",
    name: "Data Analytics Dashboard",
    description: "Build analytics dashboard for business metrics",
    deadline: "2024-04-10",
    status: "Completed",
  },
]

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "1",
    engineerId: "2",
    projectId: "1",
    assignedAt: "2024-01-15",
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [engineers, setEngineers] = useState<Engineer[]>(INITIAL_ENGINEERS)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS)
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS)

  const addEngineer = (engineer: Omit<Engineer, "id">) => {
    const newEngineer = { ...engineer, id: Date.now().toString() }
    setEngineers((prev) => [...prev, newEngineer])
  }

  const updateEngineer = (id: string, updates: Partial<Engineer>) => {
    setEngineers((prev) => prev.map((eng) => (eng.id === id ? { ...eng, ...updates } : eng)))
  }

  const deleteEngineer = (id: string) => {
    setEngineers((prev) => prev.filter((eng) => eng.id !== id))
    setAssignments((prev) => prev.filter((assign) => assign.engineerId !== id))
  }

  const addProject = (project: Omit<Project, "id">) => {
    const newProject = { ...project, id: Date.now().toString() }
    setProjects((prev) => [...prev, newProject])
  }

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) => prev.map((proj) => (proj.id === id ? { ...proj, ...updates } : proj)))
  }

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((proj) => proj.id !== id))
    setAssignments((prev) => prev.filter((assign) => assign.projectId !== id))
  }

  const addAssignment = (assignment: Omit<Assignment, "id" | "assignedAt">) => {
    const newAssignment = {
      ...assignment,
      id: Date.now().toString(),
      assignedAt: new Date().toISOString().split("T")[0],
    }
    setAssignments((prev) => [...prev, newAssignment])

    // Update engineer status to Busy
    updateEngineer(assignment.engineerId, { status: "Busy" })
  }

  const removeAssignment = (id: string) => {
    const assignment = assignments.find((a) => a.id === id)
    if (assignment) {
      setAssignments((prev) => prev.filter((assign) => assign.id !== id))

      // Check if engineer has other assignments
      const hasOtherAssignments = assignments.some((a) => a.id !== id && a.engineerId === assignment.engineerId)

      if (!hasOtherAssignments) {
        updateEngineer(assignment.engineerId, { status: "Available" })
      }
    }
  }

  return (
    <DataContext.Provider
      value={{
        engineers,
        projects,
        assignments,
        addEngineer,
        updateEngineer,
        deleteEngineer,
        addProject,
        updateProject,
        deleteProject,
        addAssignment,
        removeAssignment,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
