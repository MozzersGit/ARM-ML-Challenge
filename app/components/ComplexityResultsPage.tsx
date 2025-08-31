"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CodeHighlightTabs,
  CodeHighlightTabsCode,
} from "@mantine/code-highlight";
import {
  Group,
  Stack,
  Text,
  Paper,
  Title,
  Badge,
  Box,
  Button,
  ScrollArea,
} from "@mantine/core";
import { ComplexitySnippet, FilesData } from "../lib/types";
import { getFileLanguage } from "./CodeHighlightAdapter";

function ComplexityResultsPage({
  data,
  files,
}: {
  data: ComplexitySnippet[];
  files: FilesData[];
}) {
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  // Auto-select first tab when files change
  useEffect(() => {
    if (files.length > 0) {
      setActiveTab(0);
    }
  }, [files]);

  // Build code snippets
  const codeSnippets: CodeHighlightTabsCode[] = files.map(
    (file: FilesData) => ({
      fileName: file.file_name,
      code: file.file_content,
      language: getFileLanguage(file.file_name),
    })
  );

  const isValidTab = activeTab >= 0 && activeTab < codeSnippets.length;
  const currentFile = isValidTab ? codeSnippets[activeTab].fileName : "";
  const currentResults = data.filter(
    (s: ComplexitySnippet) => s.file_name === currentFile
  );

  // File summary
  const hasResults = currentResults.length > 0;
  const avgComplexity = hasResults
    ? currentResults.reduce((sum, r) => sum + r.complexity, 0) / currentResults.length
    : 0;

  // Handle back button
  const handleBack = () => {
    localStorage.removeItem("complexityResults");
    localStorage.removeItem("complexityResultFiles");
    router.push("/"); // Go back to landing
  };

  return (
    <Stack px="xl" py="lg"  style={{ height: "100vh" }}>
      {/* Header */}
      <Group p={"md"} align="center">
        <Button variant="subtle" onClick={handleBack}>
          ← Back
        </Button>
        <Title order={2}>Complexity Analysis Results</Title>
        <Box style={{ width: 80 }} /> {/* Spacer */}
      </Group>

      <Group
        align="stretch"
      >
        {/* Left column: Code (scrollable) */}
        <Box style={{ flex: 3, display: "flex", flexDirection: "column" }}>
          <ScrollArea h="80vh" offsetScrollbars type="hover">
            <CodeHighlightTabs
              code={codeSnippets}
              radius="md"
              activeTab={activeTab}
              onTabChange={setActiveTab}
              style={{ width: "100%" }}
            />
          </ScrollArea>
        </Box>

        {/* Right column: Summary + Results */}
        <Stack style={{ flex: 2, overflow: "hidden" }} >
          {/* File Summary Section */}
         
          <Stack>
            <Title order={4}>File Summary</Title>
            <Paper
              withBorder
              radius="md"
              shadow="xs"
              p="sm"
              style={{ backgroundColor: "#f9fafb" }}
            >
              <Group align="center" >
                <Badge
                  size="xl"
                  radius="md"
                  color={
                    !hasResults
                      ? "gray"
                      : avgComplexity > 6
                      ? "red"
                      : avgComplexity > 3
                      ? "yellow"
                      : "green"
                  }
                  style={{
                    width: 60,
                    height: 60,
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {hasResults ? avgComplexity.toFixed(1) : "-"}
                </Badge>

                <Group  style={{ flex: 1 }}>
                  <Text fw={500}>{currentFile}</Text>
                  <Text size="sm" c="dimmed">
                    {currentResults.length} complexity finding
                    {currentResults.length !== 1 ? "s" : ""}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Avg. score {hasResults ? avgComplexity.toFixed(1) : "-"}
                  </Text>
                </Group>
              </Group>
            </Paper>
          </Stack>

          {/* Complexity Findings Section */}
          <Stack  style={{ flex: 1, overflow: "hidden" }}>
            <Title order={4}>Complexity Findings</Title>
            <ScrollArea h="60vh" type="auto">
              <Stack >
                {currentResults.length > 0 ? (
                  currentResults.map((r, idx) => (
                    <Paper key={idx} radius="md" p="sm" withBorder shadow="xs">
                      <Group align="flex-start" >
                        <Badge
                          size="lg"
                          radius="md"
                          color={
                            r.complexity > 6
                              ? "red"
                              : r.complexity > 3
                              ? "yellow"
                              : "green"
                          }
                          style={{
                            width: 40,
                            height: 40,
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {r.complexity.toFixed(1)}
                        </Badge>
                        <Stack style={{ flex: 1 }}>
                          <Text fw={500} size="sm">
                            {r.complexity_header}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {r.complexity_reasoning}
                          </Text>
                          <Text size="xs" c="dimmed" mt={2}>
                            Line {r.line_number}
                          </Text>
                        </Stack>
                      </Group>
                    </Paper>
                  ))
                ) : (
                  <Text c="dimmed">No complexity results for this file.</Text>
                )}
              </Stack>
            </ScrollArea>
          </Stack>
        </Stack>
      </Group>
    </Stack>
  );
}

export default ComplexityResultsPage;
