import { useLocalStorage } from "@mantine/hooks"
import { useEffect } from "react"

export function useMinimized(): [string[], (id: string) => void] {
  const [minimized, setMinimized, removeMinimized] = useLocalStorage<string[]>({
    key: "analytics-minimized-charts",
    defaultValue: [],
    serialize: (value) => {
      return JSON.stringify(value)
    },
    deserialize: (localStorageValue) => {
      if (localStorageValue) return JSON.parse(localStorageValue)
      return []
    },
  })

  function toggleMinimized(id: string) {
    setMinimized((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  useEffect(() => {
    if (minimized.length === 0) {
      removeMinimized()
    }
  }, [minimized, removeMinimized])

  return [minimized, toggleMinimized]
}
