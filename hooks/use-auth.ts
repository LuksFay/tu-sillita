"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("admin-token")
    setIsAuthenticated(!!token)
    setIsLoading(false)
  }, [])

  const login = (password: string) => {
    // Contraseña fija para demo - en producción usar el backend
    if (password === "admin123") {
      localStorage.setItem("admin-token", "authenticated")
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("admin-token")
    setIsAuthenticated(false)
  }

  return { isAuthenticated, isLoading, login, logout }
}
