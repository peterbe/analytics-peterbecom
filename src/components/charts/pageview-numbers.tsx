import { Box, Group, Paper, SimpleGrid, Text } from "@mantine/core"

import { ChartContainer } from "./container"
import { Loading } from "./loading"
import { formatNumber } from "./number-format"
import classes from "./StatsGrid.module.css"
import { useQuery } from "./use-query"

export function PageviewNumbers() {
  return (
    <ChartContainer id="pageview-numbers" title="Pageview Numbers">
      <Inner />
    </ChartContainer>
  )
}

const sqlQuery = (days = 0, back = 0) => `
SELECT
    count(url) AS count
FROM
    analytics
WHERE
    type='pageview'
    and ${createdRange(days, back)}
`
function createdRange(days: number, back: number) {
  const ranges: string[] = []
  ranges.push(`created > now() - interval '${days} days'`)
  if (back) {
    ranges.push(`created < (now() - interval '${back} days')`)
  }
  return ranges.join(" and ")
}

function Inner() {
  const today = useQuery(sqlQuery(1))
  const yesterday = useQuery(sqlQuery(2, 1))

  const thisWeek = useQuery(sqlQuery(7))
  const lastWeek = useQuery(sqlQuery(14, 7))

  const thisMonth = useQuery(sqlQuery(28))
  const lastMonth = useQuery(sqlQuery(52, 28))

  return (
    <>
      <Box pos="relative" mt={25} mb={50}>
        <Loading visible={today.isLoading && yesterday.isLoading} />

        <SimpleGrid cols={{ base: 1, xs: 2, md: 4 }}>
          {today.data && yesterday.data && (
            <GridItem
              value={today.data.rows[0]?.count as number}
              title="Pageviews today"
              note="Last 24 hours"
              diffPercentage={
                (100 * (today.data.rows[0]?.count as number)) /
                  (yesterday.data.rows[0]?.count as number) -
                100
              }
            />
          )}
          {thisWeek.data && lastWeek.data && (
            <GridItem
              value={thisWeek.data.rows[0]?.count as number}
              title="Pageviews this week"
              note="Last 7 days"
              diffPercentage={
                (100 * (thisWeek.data.rows[0]?.count as number)) /
                  (lastWeek.data.rows[0]?.count as number) -
                100
              }
            />
          )}
          {thisMonth.data && lastMonth.data && (
            <GridItem
              value={thisMonth.data.rows[0]?.count as number}
              title="Pageviews this month"
              note="Last 28 days"
              diffPercentage={
                lastMonth.data.rows[0]?.count
                  ? (100 * (thisMonth.data.rows[0]?.count as number)) /
                      (lastMonth.data.rows[0]?.count as number) -
                    100
                  : undefined
              }
            />
          )}
        </SimpleGrid>
      </Box>
    </>
  )
}

// function hoursSinceMidnightUTC() {
//   // Get the current date and time in UTC
//   const now = new Date()

//   // Create a new date object representing midnight of the current day in UTC
//   const midnightUTC = new Date(
//     Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
//   )

//   // Calculate the difference in milliseconds
//   const diffInMs = now.getTime() - midnightUTC.getTime()

//   // Convert milliseconds to hours
//   const hoursSinceMidnight = diffInMs / (1000 * 60 * 60)

//   return hoursSinceMidnight
// }

function GridItem({
  value,
  title,
  note,
  diffPercentage,
}: {
  value: number
  title: string
  note?: string
  diffPercentage?: number
}) {
  return (
    <Paper withBorder p="md" radius="md">
      <Text size="xs" c="dimmed" className={classes.title}>
        {title}
      </Text>
      <Group align="flex-end" gap="xs" mt={25}>
        <Text className={classes.value}>{formatNumber(value)}</Text>
        {diffPercentage !== undefined && diffPercentage !== null && (
          <Text
            c={diffPercentage > 0 ? "teal" : "red"}
            fz="sm"
            fw={500}
            className={classes.diff}
          >
            <span>{diffPercentage.toFixed(1)}%</span>
            {/* <DiffIcon size="1rem" stroke={1.5} /> */}
          </Text>
        )}
      </Group>

      {note && (
        <Text fz="xs" c="dimmed" mt={7}>
          {note}
        </Text>
      )}
    </Paper>
  )
}
