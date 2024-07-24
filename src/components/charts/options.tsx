import { Box, SegmentedControl, Text } from "@mantine/core"

export function IntervalOptions({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const days = [3, 7, 28]
  if (new Date(2024, 9, 0) < new Date()) {
    days.push(90)
  }
  const options = days.map((d) => ({ label: `${d} days`, value: `${d}` }))
  return (
    <Box>
      <Text>Last...</Text>
      <SegmentedControl
        value={value}
        onChange={onChange}
        withItemsBorders={false}
        transitionDuration={300}
        transitionTimingFunction="linear"
        data={options}
      />
    </Box>
  )
}

export function UrlFilterOptions({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const values = {
    "": "Any page",
    "lyrics-post": "Lyrics post",
    "lyrics-search": "Lyrics searches",
    "lyrics-song": "Lyrics songs",
  }
  const options = Object.entries(values).map(([value, label]) => ({
    label,
    value,
  }))
  return (
    <Box>
      <Text>Filter...</Text>
      <SegmentedControl
        value={value}
        onChange={onChange}
        withItemsBorders={false}
        transitionDuration={300}
        transitionTimingFunction="linear"
        data={options}
      />
    </Box>
  )
}
