import type { Cache } from "swr"

const KEY = "analytics-swr-cache-provider"

export function localStorageProvider() {
  let map = new Map<string, object>()
  try {
    map = new Map(JSON.parse(localStorage.getItem("app-cache") || "[]"))
  } catch (e) {
    console.warn("Failed to load cache from localStorage", e)
  }
  window.addEventListener("beforeunload", () => {
    const appCache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem(KEY, appCache)
  })

  return map as Cache
}
