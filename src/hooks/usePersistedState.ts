import { useEffect, useState } from "react"

export function usePersistedState<T>(key: string, defaultValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // État local
  const [state, setState] = useState<T>(() => {
    try {
      // Essayer de récupérer depuis localStorage
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Erreur lors du chargement de ${key}:`, error)
      return defaultValue
    }
  })

  // Effet pour sauvegarder dans localStorage à chaque changement
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde de ${key}:`, error)
    }
  }, [key, state])

  return [state, setState]
}
