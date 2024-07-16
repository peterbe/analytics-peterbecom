import { Alert, Code, Container, HoverCard, Paper, Table } from "@mantine/core";
import { Text, Textarea } from "@mantine/core";
import { Kbd } from "@mantine/core";
import { useDocumentTitle, useLocalStorage } from "@mantine/hooks";
import { memo, useEffect, useRef } from "react";
import { useState } from "react";
import useSWR from "swr";

type QueryMetaResult = {
  took_seconds: number;
  count_rows: number;
  maxed_rows: boolean;
};
type QueryResultRowValue = string | null | number;
type QueryResultRow = {
  [key: string]: QueryResultRowValue;
};
type QueryResult = {
  rows: QueryResultRow[];
  meta: QueryMetaResult;
  error: string | null;
};

export function Query() {
  const [value, setValue] = useLocalStorage({
    key: "saved-queries",
    defaultValue: "",
  });
  const [activeQuery, setActiveQuery] = useLocalStorage({
    key: "active-query",
    defaultValue: "",
  });

  const [typedQuery, setTypedQuery] = useState(value);
  useEffect(() => {
    if (value && !typedQuery) {
      setTypedQuery(value);
    }
  }, [value, typedQuery]);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaElement = textareaRef.current;
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Enter" && event.metaKey) {
        if (!typedQuery.trim()) {
          console.warn("No typed query yet");

          return;
        }
        if (textareaRef.current) {
          const extracted = extractActiveQuery(typedQuery, textareaRef.current);
          if (extracted.length <= 1) {
            console.log({ typedQuery, extracted });
            throw new Error("Extracting query from position failed");
          }
          // console.log({ extracted });

          setActiveQuery(extracted);
          setValue(typedQuery);
        }
      }
    };
    if (textareaElement) textareaElement.addEventListener("keydown", listener);

    return () => {
      if (textareaElement)
        textareaElement.removeEventListener("keydown", listener);
    };
  }, [textareaElement, typedQuery]);

  // useEffect(() => {
  //   if (textareaRef.current && value) {
  //     setActiveQuery(extractActiveQuery(value, textareaRef.current));
  //   }
  // }, [textareaRef, value]);

  let xhrUrl = null;
  if (activeQuery.trim()) {
    const sp = new URLSearchParams();
    sp.set("query", activeQuery);
    xhrUrl = "/api/v0/analytics/query?" + sp.toString();
  }

  const { data, error, isLoading } = useSWR<QueryResult, Error>(
    xhrUrl,
    async (url: string) => {
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
    },
  );

  let title = "Query";
  if (error) {
    title = `Error in query`;
  } else if (isLoading) {
    title = "Loading query...";
  } else if (data) {
    title = `${data.meta.count_rows.toLocaleString()} rows`;
  }
  useDocumentTitle(title);

  // function formSubmit() {}

  return (
    <div>
      <Textarea
        placeholder="select * from analytics order by created desc limit 20"
        label="SQL Query"
        resize="both"
        autosize
        minRows={4}
        autoFocus
        required
        // size="xl"
        // cols={100}
        style={{ width: "100%" }}
        ref={textareaRef}
        value={typedQuery}
        onChange={(event) => {
          setTypedQuery(event.target.value);
        }}
        autoCorrect="off"
      />
      <Container mb={20}>
        <Text size="sm" ta="right">
          Use <Kbd>⌘</Kbd>-<Kbd>Enter</Kbd> to run the query when focus is
          inside textarea
        </Text>
      </Container>

      {isLoading && <Alert color="gray">Loading...</Alert>}
      {error && (
        <Alert color={error.message.includes("500") ? "red" : "yellow"}>
          <pre style={{ margin: 0 }}>{error.message}</pre>
        </Alert>
      )}

      {data && <Show data={data} />}

      {activeQuery && (
        <Paper>
          Active query: <Code>{activeQuery}</Code>
        </Paper>
      )}
    </div>
  );
}

function extractActiveQuery(typedQuery: string, textarea: HTMLTextAreaElement) {
  let a = textarea.selectionStart;
  let b = textarea.selectionEnd;
  while (a) {
    const here = typedQuery.substring(a - 2, a);
    if (here === "\n\n") {
      break;
    }
    a--;
  }
  while (b < typedQuery.length) {
    const here = typedQuery.substring(b, b + 2);
    if (here === "\n\n") {
      break;
    }
    b++;
  }
  return typedQuery.substring(a, b);
}

const Show = memo(function Show({ data }: { data: QueryResult }) {
  return (
    <div>
      <Text size="sm">
        Rows: {data.meta.count_rows.toLocaleString()}. Took{" "}
        <Took seconds={data.meta.took_seconds} />
        {data.meta.maxed_rows && (
          <span>
            {" "}
            (maxed rows, only showing first{" "}
            {data.meta.count_rows.toLocaleString()})
          </span>
        )}
      </Text>
      <Rows data={data.rows} />
    </div>
  );
});

function Took({ seconds }: { seconds: number }) {
  if (seconds < 1) {
    return <span>{(seconds * 1000).toFixed(1)} milliseconds</span>;
  }
  return <span>{seconds.toFixed(2)} seconds</span>;
}

function Rows({ data }: { data: QueryResultRow[] }) {
  if (data.length === 0) {
    return <Text>No rows to show.</Text>;
  }
  const first = data[0];
  const keys = Object.keys(first);
  const prefix = keys.join("");
  return (
    <Table highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th></Table.Th>
          {keys.map((key) => (
            <Table.Th key={key}>{key}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((row, i) => (
          <Table.Tr key={prefix + i} id={`r${i + 1}`}>
            <Table.Td>
              <a href={`#r${i + 1}`}>{i + 1}</a>
            </Table.Td>
            {keys.map((key, j) => {
              const value = row[key];
              return (
                <Table.Td key={key + j}>
                  <Text size="xs">
                    <Value value={value} column={key} />
                  </Text>
                </Table.Td>
              );
            })}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

function Value({
  value,
  column,
}: {
  value: QueryResultRowValue;
  column: string;
}) {
  if (value === null) {
    return "null";
  }
  if (
    ["data", "meta"].includes(column) &&
    typeof value === "string" &&
    value.startsWith("{") &&
    value.endsWith("}")
  ) {
    const asString = value;
    if (asString.length > 50) {
      return (
        <HoverCard width={680} shadow="md">
          <HoverCard.Target>
            <Text span>{asString}...</Text>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Code block>{JSON.stringify(JSON.parse(value), null, 2)}</Code>
          </HoverCard.Dropdown>
        </HoverCard>
      );
    }

    return asString;
  }
  if (typeof value === "number" && Number.isInteger(value) && column !== "id") {
    return value.toLocaleString();
  }
  return value.toString();
}
