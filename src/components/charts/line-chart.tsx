import { LineChart } from "@mantine/charts"

export type DataRow = {
  date: string
  count: number
  countPrevious?: number
}
export type DataSerie = {
  name: string
  label: string
  strokeDasharray?: string
  color?: string
}

export function BasicLineChart({
  data,
  series,
  dataKey,
  curveType = "natural",
}: {
  data: DataRow[]
  series: DataSerie[]
  dataKey: string
  curveType?: "natural" | "linear" | "monotone"
}) {
  return (
    <LineChart
      h={400}
      data={data}
      series={series}
      dataKey={dataKey}
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
      curveType={curveType}
      valueFormatter={(value) => new Intl.NumberFormat("en-US").format(value)}
    />
  )
}
