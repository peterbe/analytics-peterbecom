import useSWR from "swr"
import { fetcher, fetchOptions, apiPrefix } from "./fetcher"
import type { QueryResult } from "../../types"

export function useQuery(query: string) {
  return useSWR<QueryResult, Error>(
    `${apiPrefix}${new URLSearchParams({ query })}`,
    fetcher,
    fetchOptions,
  )
}
