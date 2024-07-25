import { Card } from "@mantine/core"

export function ChartContainer({
  children,
  id,
}: {
  children: React.ReactNode
  id: string
}) {
  return (
    <Card withBorder shadow="md" padding="lg" mt={10} mb={40} id={id}>
      {children}
    </Card>
  )
}
