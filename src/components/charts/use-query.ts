import useSWR from "swr"

import type { QueryResult } from "../../types"
import { apiPrefix, fetcher, fetchOptions } from "./fetcher"

export function useQuery(query: string) {
  return useSWR<QueryResult, Error>(
    `${apiPrefix}${new URLSearchParams({ query })}`,
    fetcher,
    fetchOptions,
  )
}
