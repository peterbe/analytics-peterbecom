export async function fetcher(url: string) {
  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 400) {
      const json = await response.json()
      if (json.error) {
        throw new Error(json.error)
      }
    }
    throw new Error(`${response.status} on ${response.url}`)
  }
  return response.json()
}

export const fetchOptions = {
  revalidateOnFocus: false,
  refreshInterval: 5 * 60 * 1000,
}

export const apiPrefix = "/api/v0/analytics/query?"
