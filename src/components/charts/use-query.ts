import { useQuery as tanstack_useQuery } from "@tanstack/react-query"

import type { QueryResult } from "../../types"
import { apiPrefix, fetcher, fetchOptions } from "./fetcher"

export function useQuery(query: string) {
  return tanstack_useQuery<QueryResult>({
    queryKey: [query],
    queryFn: async () => {
      return fetcher(`${apiPrefix}${new URLSearchParams({ query })}`)
    },
    ...fetchOptions,
  })
}
