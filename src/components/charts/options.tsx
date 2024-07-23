import { Box, SegmentedControl, Text } from "@mantine/core"

export function IntervalOptions({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  return (
    <Box>
      <Text>Last...</Text>
      <SegmentedControl
        value={value}
        onChange={onChange}
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
  )
}
