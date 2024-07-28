import { LineChart, LineChartSeries } from "@mantine/charts"
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Group,
  Table,
  Text,
  TextInput,
} from "@mantine/core"
import { useLocalStorage } from "@mantine/hooks"
import { useState } from "react"

import { type QueryResultRow } from "../../types"
import { ChartContainer } from "./container"
import { Loading } from "./loading"
import { useQuery } from "./use-query"

const sqlQuery = ({ limit = 200, filter = "", exclude = false } = {}) => `
SELECT
    url,
    meta->'performance' AS performance
FROM analytics
WHERE
    type='pageview'
    AND meta->'performance'->>'render' IS NOT NULL
    ${filter ? `AND url ${exclude ? "NOT" : ""} LIKE '${filter}'` : ""}
ORDER BY created desc
LIMIT ${Number(limit)}
`
export function RenderingPerformance() {
  const [urlFilter, setURLFilter] = useState("")
  const [excludeFilter, setExcludeFilter] = useState(false)

  const current = useQuery(
    sqlQuery({ limit: 200, filter: urlFilter, exclude: excludeFilter }),
  )
  return (
    <ChartContainer id="rendering-performance" title="Rendering Performance">
      <Box pos="relative" mt={25} mb={50}>
        <Loading visible={current.isLoading} />

        {!current.error && current.data && <LChart rows={current.data.rows} />}
        <FilterByUrl
          filter={urlFilter}
          setFilter={setURLFilter}
          exclude={excludeFilter}
          setExclude={setExcludeFilter}
        />
      </Box>

      {current.error && (
        <Alert variant="filled" color="red" title="Error">
          {current.error.message}
        </Alert>
      )}
    </ChartContainer>
  )
}

type D = Record<string, number> & {
  url: string
}

function LChart({ rows }: { rows: QueryResultRow[] }) {
  const [keysToShow, setKeysToShow] = useLocalStorage<string[]>({
    key: "analytics-rendering-performance-keys-to-show",
    defaultValue: ["render"],
    serialize: (value) => {
      return JSON.stringify(value)
    },
    deserialize: (localStorageValue) => {
      if (localStorageValue) return JSON.parse(localStorageValue)
      return []
    },
  })

  const numbers = new Map<string, number[]>()
  for (const row of rows) {
    const performance = JSON.parse(row.performance as string)
    if (
      Object.values(performance).some(
        (v) => typeof v !== "number" || (v as number) < 0,
      )
    ) {
      continue
    }
    for (const [key, value] of Object.entries(performance)) {
      if (!numbers.has(key)) {
        numbers.set(key, [])
      }
      numbers.get(key)!.push(value as number)
    }
  }

  const medians = new Map<string, number>()
  for (const [key, values] of numbers) {
    medians.set(key, median(values))
  }

  const data: D[] = []
  let keys: string[] | null = null

  const omitted: QueryResultRow[] = []
  for (const row of rows) {
    const url = row.url as string
    const performance = JSON.parse(row.performance as string)
    if (
      Object.entries(performance).some(([k, v]) => {
        if (typeof v !== "number") return true
        if (typeof k !== "string") return true
        if (v < 0) return true
        if (v < 0 || v > 3000) {
          return true
        }

        return false
      })
    ) {
      omitted.push(row)
      continue
    }
    if (!keys) {
      keys = Object.keys(performance)
    }
    const entry: D = { url, ...performance }
    data.push(entry)
  }

  const colors = ["blue", "grape", "cyan", "teal", "indigo", "red", "orange"]
  function nextColor() {
    return colors.shift() || "gray"
  }
  const series: LineChartSeries[] = []
  if (keys) {
    for (const key of keys) {
      if (!keysToShow.length || keysToShow.includes(key)) {
        series.push({
          name: key,
          color: nextColor(),
        })
      }
    }
  }

  return (
    <>
      {!data.length && (
        <Alert variant="light" color="orange" title="No data points">
          There are no data points left to display. ({rows.length} rows)
        </Alert>
      )}
      <LineChart
        h={400}
        data={data}
        dataKey="url"
        tickLine="none"
        withLegend
        yAxisProps={{ tickMargin: 15, orientation: "right" }}
        xAxisProps={{ hide: true }}
        series={series}
        valueFormatter={(value) => `${value.toFixed(1)}ms`}
      />
      {keys && (
        <Checkbox.Group value={keysToShow} onChange={setKeysToShow} mt={20}>
          <Group>
            {keys.map((key) => (
              <Checkbox key={key} value={key} label={key} />
            ))}
          </Group>
        </Checkbox.Group>
      )}
      {omitted.length > 0 && (
        <Text mt={10}>
          {omitted.length} rows (of {rows.length}) omitted as outliers
        </Text>
      )}
      <Table mt={50}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Key</Table.Th>
            <Table.Th>Median</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Array.from(medians).map(([key, value]) => (
            <Table.Tr key={key}>
              <Table.Td>{key}</Table.Td>
              <Table.Td>{value.toFixed(1)}ms</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {keys && keys.length > 0 && <SlowestURLs data={data} keys={keys} />}
    </>
  )
}

function median(values: number[]) {
  values.sort()
  const half = Math.floor(values.length / 2)
  if (values.length % 2) {
    return values[half]
  }
  return (values[half - 1] + values[half]) / 2.0
}

function SlowestURLs({ data, keys }: { data: D[]; keys: string[] }) {
  const [sortKey, setSortKey] = useState("render")
  const [sortReverse, setSortReverse] = useState(false)
  const sorted = [...data].sort((a, b) => {
    const x = a[sortKey] || 0
    const y = b[sortKey] || 0
    return sortReverse ? x - y : y - x
  })

  return (
    <>
      <Text mt={50}>
        {sortReverse ? "Fastest" : "Slowest"} URLs by {sortKey}
      </Text>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>URL</Table.Th>
            {keys.map((key) => (
              <Table.Th key={key}>
                <Text
                  fs={key === sortKey ? "italic" : undefined}
                  onClick={() => {
                    if (key === sortKey) {
                      setSortReverse(!sortReverse)
                    } else {
                      setSortKey(key)
                    }
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {key}
                </Text>
              </Table.Th>
            ))}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {sorted.slice(0, 25).map((row, i) => {
            return (
              <Table.Tr key={`${row.url}${i}`}>
                <Table.Td>{shortenString(row.url, 100)}</Table.Td>
                {keys.map((key) => (
                  <Table.Td key={key}>{(row[key] || 0).toFixed(1)}ms</Table.Td>
                ))}
              </Table.Tr>
            )
          })}
        </Table.Tbody>
      </Table>
    </>
  )
}

function shortenString(s: string, maxLength: number) {
  if (s.length <= maxLength) return s
  return s.slice(0, maxLength - 3) + "…"
}

function FilterByUrl({
  filter,
  setFilter,
  exclude,
  setExclude,
}: {
  filter: string
  setFilter: (value: string) => void
  exclude: boolean
  setExclude: (value: boolean) => void
}) {
  const [value, setValue] = useState("")
  return (
    <Box mt={20}>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setFilter(value)
        }}
      >
        <TextInput
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          label="Filter by URL"
          placeholder="/plog/blogitem-040601-1%"
        />
        <Checkbox
          checked={exclude}
          onChange={(event) => setExclude(event.currentTarget.checked)}
          label="Exclude selected URLs"
          mt={10}
        />
        {filter && <Button onClick={() => setFilter("")}>Clear</Button>}
      </form>
    </Box>
  )
}
