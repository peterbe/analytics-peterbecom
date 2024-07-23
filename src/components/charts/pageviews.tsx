import { Box, Title } from "@mantine/core"

import { ChartContainer } from "./container"
import { BasicLineChart, type DataRow, type DataSerie } from "./line-chart"
import { Loading } from "./loading"
import { IntervalOptions } from "./options"
import { useInterval } from "./use-interval"
import { useQuery } from "./use-query"
import { addDays } from "./utils"

const sqlQuery = (days = 7) => `
SELECT
    DATE_TRUNC('day', created) AS day,
    COUNT(url) AS count
FROM
    analytics
WHERE
    type='pageview'
    and created > now() - interval '${days} days'
GROUP BY
    day
ORDER BY
    day;
`
const sqlQueryPrevious = (days = 7) => `
SELECT
    DATE_TRUNC('day', created) AS day,
    COUNT(url) AS count
FROM
    analytics
WHERE
    type='pageview'
    and created < now() - interval '${days} days'
    and created > now() - interval '${days + days} days'
GROUP BY
    day
ORDER BY
    day;
`
export function Pageviews() {
  const [intervalDays, setIntervalDays] = useInterval("pageviews")

  const current = useQuery(sqlQuery(Number(intervalDays)))
  const previous = useQuery(sqlQueryPrevious(Number(intervalDays)))

  const dataX: DataRow[] = []
  const series: DataSerie[] = [{ name: "count", label: "Number of pageviews" }]
  const dataO: Record<string, number> = {}
  const dataP: Record<string, number> = {}
  const keys: string[] = []
  if (current.data) {
    for (const row of current.data.rows) {
      const d = new Date(row.day as string)
      const k = `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`
      dataO[k] = row.count as number
      keys.push(k)
    }
  }
  if (previous.data) {
    for (const row of previous.data.rows) {
      const d = addDays(new Date(row.day as string), Number(intervalDays))
      const k = `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`
      dataP[k] = row.count as number
    }
    series.push({
      name: "countPrevious",
      label: "Previous period",
      strokeDasharray: "5 5",
    })
  }
  for (const k of keys) {
    const entry: {
      date: string
      count: number
      countPrevious?: number
    } = {
      date: k,
      count: dataO[k],
    }
    if (k in dataP) {
      entry.countPrevious = dataP[k]
    }
    dataX.push(entry)
  }

  return (
    <ChartContainer>
      <Title order={3}>Pageviews</Title>
      <Box pos="relative" mt={25} mb={30}>
        <Loading visible={current.isLoading} />

        {!current.error && (
          <BasicLineChart data={dataX} series={series} dataKey="date" />
        )}
      </Box>

      <IntervalOptions value={intervalDays} onChange={setIntervalDays} />
    </ChartContainer>
  )
}
