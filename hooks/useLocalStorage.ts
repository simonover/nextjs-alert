import { useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, fallbackValue: T) {
  const [value, setValue] = useState(fallbackValue)
  useEffect(() => {
    const stored = localStorage.getItem(key) as T
    setValue(stored ? stored : fallbackValue)
  }, [fallbackValue, key])

  useEffect(() => {
    localStorage.setItem(key, value as string)
  }, [key, value])

  return [value, setValue] as const
}
