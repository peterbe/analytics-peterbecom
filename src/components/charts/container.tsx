import { Card } from "@mantine/core";

export function ChartContainer({ children }: { children: React.ReactNode }) {
  return (
    <Card withBorder shadow="md" padding="lg" mt={10} mb={40}>
      {children}
    </Card>
  );
}
