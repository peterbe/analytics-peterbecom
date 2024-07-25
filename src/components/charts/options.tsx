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
      <Text span>Last...</Text>
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

const DEFAULT_URLFILTER_VALUES = {
  "": "Any page",
  "lyrics-post": "Lyrics post",
  "lyrics-search": "Lyrics searches",
  "lyrics-song": "Lyrics songs",
  "not-lyrics": "Not lyrics",
}
export function UrlFilterOptions({
  value,
  onChange,
  values = DEFAULT_URLFILTER_VALUES,
}: {
  value: string
  onChange: (value: string) => void
  values?: Record<string, string>
}) {
  const options = Object.entries(values).map(([value, label]) => ({
    label,
    value,
  }))
  return (
    <Box>
      <Text span>Filter...</Text>
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

export function urlFilterToSQL(urlFilter: string) {
  if (!urlFilter) {
    return ""
  }
  if (urlFilter === "lyrics-post") {
    return `
    AND (
      data->>'pathname' LIKE '/plog/blogitem-040601-1/p%' OR
      data->>'pathname' = '/plog/blogitem-040601-1'
    )
      `.trim()
  }
  if (urlFilter === "lyrics-search") {
    return `
    AND data->>'pathname' LIKE '/plog/blogitem-040601-1/q/%'
      `.trim()
  }
  if (urlFilter === "lyrics-song") {
    return `
    AND data->>'pathname' LIKE '/plog/blogitem-040601-1/song/%'
      `.trim()
  }
  if (urlFilter === "not-lyrics") {
    return `
    AND data->>'pathname' NOT LIKE '/plog/blogitem-040601-1%'
      `.trim()
  }

  throw new Error(`Unknown urlFilter: ${urlFilter}`)
}

export function RowsOptions({
  value,
  onChange,
  range,
}: {
  value: string
  onChange: (value: string) => void
  range: number[]
}) {
  const options = range.map((x) => {
    return { label: `${x}`, value: `${x}` }
  })
  return (
    <Box>
      <Text span>Rows...</Text>
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
