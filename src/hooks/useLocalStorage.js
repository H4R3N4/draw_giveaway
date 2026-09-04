import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) return JSON.parse(item)
      return typeof initialValue === 'function' ? initialValue() : initialValue
    } catch {
      return typeof initialValue === 'function' ? initialValue() : initialValue
    }
  })

  const setValue = (value) => {
    try {
      const valueToStore = typeof value === 'function' ? value(storedValue) : value
      setStoredValue(valueToStore)
      localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}
