import { useEffect, useRef } from "react";
import { useState } from "react";
import { Alert, Code, Container, Table, HoverCard } from "@mantine/core";
import { Textarea, Text } from "@mantine/core";
import { Kbd } from "@mantine/core";
import { useDocumentTitle, useLocalStorage } from "@mantine/hooks";
import useSWR from "swr";

type QueryMetaResult = {
  took_seconds: number;
  count_rows: number;
  maxed_rows: boolean;
};
type QueryResult = {
  rows: any[];
  meta: QueryMetaResult;
  error: string | null;
};

export function Query() {
  const [value, setValue] = useLocalStorage({
    key: "saved-query",
    defaultValue: "",
  });
  const [activeQuery, setActiveQuery] = useState("");
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
        formSubmit();
      }
    };
    if (textareaElement) textareaElement.addEventListener("keydown", listener);

    return () => {
      if (textareaElement)
        textareaElement.removeEventListener("keydown", listener);
    };
  }, [textareaElement, formSubmit]);

  useEffect(() => {
    if (textareaRef.current && value) {
      setActiveQuery(extractActiveQuery(value, textareaRef.current));
    }
  }, [textareaRef, value]);

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
        throw new Error(`${response.status} on ${response.url}`);
      }
      return response.json();
    }
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

  function formSubmit() {
    if (textareaRef.current) {
      setActiveQuery(extractActiveQuery(typedQuery, textareaRef.current));
      setValue(typedQuery);
    }
  }

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
          <b>Tip!</b> Use <Kbd>⌘</Kbd>-<Kbd>Enter</Kbd> to run the query when
          focus is inside textarea
        </Text>
      </Container>
      {isLoading && <Alert color="gray">Loading...</Alert>}
      {error && <Alert color="red">{error.message}</Alert>}

      {data && <Show data={data} />}
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

function Show({ data }: { data: QueryResult }) {
  return (
    <div>
      <Text size="xs">
        Rows: {data.meta.count_rows.toLocaleString()}. Took{" "}
        <Took seconds={data.meta.took_seconds} />
      </Text>
      <Rows data={data.rows} />
    </div>
  );
}

function Took({ seconds }: { seconds: number }) {
  if (seconds < 1) {
    return <span>{(seconds * 1000).toFixed(1)} milliseconds</span>;
  }
  return <span>{seconds.toFixed(2)} seconds</span>;
}

function Rows({ data }: { data: object[] }) {
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
          {keys.map((key) => (
            <Table.Th key={key}>{key}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((row, i) => (
          <Table.Tr key={prefix + i}>
            {keys.map((key, j) => {
              const value = (row as any)[key];
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

function Value({ value, column }: { value: any; column: string }) {
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
      console.log({ strinified: JSON.stringify(JSON.parse(value), null, 2) });

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
  if (typeof value === "number" && Number.isInteger(value)) {
    return value.toLocaleString();
  }
  return value.toString();
}
