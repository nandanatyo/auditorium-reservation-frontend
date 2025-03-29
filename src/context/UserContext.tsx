"use client"

import { createContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "coordinator" | "admin"
  bio?: string
  organization?: string
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (userData: any) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: () => {},
})

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call
    // Simulating authentication for demo purposes
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Mock user data - in a real app, this would come from the server
        const mockUser = {
          id: "1",
          name: "John Doe",
          email: email,
          role: email.includes("admin") ? "admin" : email.includes("coordinator") ? "coordinator" : "user",
          bio: "Software developer with 5 years of experience",
          organization: "Tech Company",
        }

        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        resolve()
      }, 1000)
    })
  }

  const register = async (userData: any) => {
    // In a real app, this would be an API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: userData.name,
          email: userData.email,
          role: "user",
          bio: userData.bio || "",
          organization: userData.organization || "",
        }

        setUser(newUser)
        localStorage.setItem("user", JSON.stringify(newUser))
        resolve()
      }, 1000)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <UserContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

