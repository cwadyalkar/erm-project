
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type User = {
  id: string
  name: string
  email: string
  role: "Manager" | "Engineer"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Hardcoded users for demo
const DEMO_USERS: User[] = [
  { id: "1", name: "John Manager", email: "manager@demo.com", role: "Manager" },
  { id: "2", name: "Alice Engineer", email: "alice@demo.com", role: "Engineer" },
  { id: "3", name: "Bob Engineer", email: "bob@demo.com", role: "Engineer" },
]

const DEMO_PASSWORDS: Record<string, string> = {
  "manager@demo.com": "manager123",
  "alice@demo.com": "alice123",
  "bob@demo.com": "bob123",
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string): boolean => {
    const user = DEMO_USERS.find((u) => u.email === email)
    if (user && DEMO_PASSWORDS[email] === password) {
      setUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
