import { Button, Container, SimpleGrid, Text } from "@mantine/core"
import { Link, useLocation, useSearch } from "wouter"

import type { QueryResult } from "../../types"
import { ChartData } from "./chart-data"
import { Rows } from "./rows"
import { Took } from "./took"

export function Show({
  data,
  isFetching,
  refetch,
}: {
  data: QueryResult
  isFetching: boolean
  refetch: () => void
}) {
  const search = useSearch()
  const [location] = useLocation()
  const searchParams = new URLSearchParams(search)
  const newChartSearchParams = new URLSearchParams(searchParams)
  newChartSearchParams.delete("chart")

  const chart = searchParams.get("chart")
  return (
    <div>
      {chart && ["bar", "line", "pie"].includes(chart) && (
        <Container fluid m={40}>
          <p>
            <Link
              href={
                newChartSearchParams.toString()
                  ? `?${newChartSearchParams}`
                  : location
              }
            >
              Close chart
            </Link>
          </p>
          <ChartData name="main" data={data} chart={chart} />
        </Container>
      )}
      <SimpleGrid cols={2}>
        <Text size="sm">
          Rows: {data.meta.count_rows.toLocaleString()}. Took{" "}
          <Took seconds={data.meta.took_seconds} />
          {data.meta.maxed_rows && (
            <span>
              {" "}
              (maxed rows, only showing first{" "}
              {data.meta.count_rows.toLocaleString()})
            </span>
          )}
        </Text>

        <Button
          disabled={isFetching}
          loading={isFetching}
          loaderProps={{ children: "Refreshing" }}
          variant="transparent"
          size="xs"
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </SimpleGrid>

      <Rows data={data.rows} />
    </div>
  )
}
