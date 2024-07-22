import { LineChart } from "@mantine/charts";
import {
  Box,
  LoadingOverlay,
  SegmentedControl,
  Text,
  Title,
} from "@mantine/core";
import { useState } from "react";
import useSWR from "swr";

import type { QueryResult } from "../../types";
import { ChartContainer } from "./container";

async function fetcher(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 400) {
      const json = await response.json();
      if (json.error) {
        throw new Error(json.error);
      }
    }
    throw new Error(`${response.status} on ${response.url}`);
  }
  return response.json();
}

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
`;
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
`;
export function Pageviews() {
  const [intervalDays, setIntervalDays] = useState("7");
  const xhrPrefix = "/api/v0/analytics/query?";

  const fetchOptions = {
    revalidateOnFocus: false,
    refreshInterval: 5 * 60 * 1000,
  };

  const { data, error, isLoading } = useSWR<QueryResult, Error>(
    `${xhrPrefix}${new URLSearchParams({ query: sqlQuery(Number(intervalDays)) })}`,
    fetcher,
    fetchOptions,
  );

  const previous = useSWR<QueryResult, Error>(
    `${xhrPrefix}${new URLSearchParams({ query: sqlQueryPrevious(Number(intervalDays)) })}`,
    fetcher,
    fetchOptions,
  );

  type DataRow = {
    date: string;
    count?: number;
    countPrevious?: number;
  };

  const dataX: DataRow[] = [];
  const series: {
    name: string;
    label: string;
    strokeDasharray?: string;
  }[] = [{ name: "count", label: "Number of pageviews" }];
  const dataO: Record<string, number> = {};
  const dataP: Record<string, number> = {};
  const keys: string[] = [];
  if (data) {
    for (const row of data.rows) {
      const d = new Date(row.day as string);
      const k = `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
      dataO[k] = row.count as number;
      keys.push(k);
    }
  }
  if (previous.data) {
    for (const row of previous.data.rows) {
      const d = addDays(new Date(row.day as string), Number(intervalDays));
      const k = `${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}`;
      dataP[k] = row.count as number;
    }
    series.push({
      name: "countPrevious",
      label: "Previous period",
      strokeDasharray: "5 5",
    });
  }
  for (const k of keys) {
    const entry: {
      date: string;
      count: number;
      countPrevious?: number;
    } = {
      date: k,
      count: dataO[k],
    };
    if (k in dataP) {
      entry.countPrevious = dataP[k];
    }
    dataX.push(entry);
  }

  return (
    <ChartContainer>
      <Title order={3}>Pageviews</Title>
      <Box pos="relative" mt={25} mb={30}>
        <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />

        {!error && (
          <LineChart
            h={400}
            data={dataX}
            series={series}
            dataKey="date"
            type="gradient"
            gradientStops={[
              { offset: 0, color: "red.6" },
              { offset: 20, color: "orange.6" },
              { offset: 40, color: "yellow.5" },
              { offset: 70, color: "lime.5" },
              { offset: 80, color: "cyan.5" },
              { offset: 100, color: "blue.5" },
            ]}
            strokeWidth={3}
            curveType="natural"
            valueFormatter={(value) => value.toLocaleString()}
          />
        )}
      </Box>

      <Box>
        <Text>Last...</Text>
        <SegmentedControl
          value={intervalDays}
          onChange={setIntervalDays}
          withItemsBorders={false}
          transitionDuration={300}
          transitionTimingFunction="linear"
          data={[
            { label: "3 days", value: "3" },
            { label: "7 days", value: "7" },
            { label: "28 days", value: "28" },
          ]}
        />
      </Box>
    </ChartContainer>
  );
}
function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
