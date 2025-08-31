"use client";

import {  useState } from "react";
import {
  Title,
  Button,
  Text,
  Stack,
  Loader,
  Alert,
  Paper,
  Group,
  ThemeIcon,
  Center,
} from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import {
  IconUpload,
  IconFileCode,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import classes from "./page.module.css";


export default function LandingPage() {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const router = useRouter();

  // Update setFiles to also activate the button when files are added
  const handleDrop = (acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
    if (acceptedFiles.length > 0) {
      setActive(true);
    }
  };

  const handleAnalyse = async () => {
    if (files.length === 0) {
      setError("Please select at least one file.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const res = await fetch("http://localhost:8000/analyse", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(detail || "Failed to analyse files");
      }

      const data = await res.json();
      localStorage.setItem("complexityResults", JSON.stringify(data));

      const fileContents = await Promise.all(
        files.map(async (file) => ({
          file_name: file.name,
          file_content: await file.text(),
        }))
      );
      localStorage.setItem(
        "complexityResultFiles",
        JSON.stringify(fileContents)
      );
      router.push("/results");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Calculate dynamic height for file list
  const fileListMaxHeight = files.length > 3 ? 180 : files.length * 48 + 24; // 48px per file + padding

  return (
    <Center
      h="100vh"
      display="flex"
      bg="linear-gradient(135deg, #f0f4ff 0%, #ffffff 100%)"
    >
      <Paper
        withBorder
        shadow="xl"
        radius="lg"
        p="xl"
        maw={650}
        w="100%"
        bg="white"
      >
        <Stack align="center" gap="xl">
          {/* Header */}
          <Stack align="center" gap="xs">
            <Title order={1} size={36}>
              Code Complexity Analyser
            </Title>
            <Text size="sm" c="dimmed">
              Upload your source files and get instant complexity insights
            </Text>
          </Stack>

          {/* Dropzone */}
          <Dropzone
            onDrop={handleDrop}
            multiple
            radius="lg"
            onDragEnter={() => setActive(true)}
            onDragLeave={() => setActive(false)}
            mih={180}
            display="flex"
            ta="center"
            className={classes.dropzone}
          >
            <Stack align="center" gap="sm">
              <ThemeIcon size="lg" radius="xl" variant="light" color="blue">
                <IconUpload size={28} stroke={1.5} />
              </ThemeIcon>
              <Text size="lg" fw={500}>
                Drag & Drop your files here
              </Text>
              <Text size="sm" c="dimmed">
                Preferred: tsx, scss, html, bash, json, python, java, ruby, go,
                php, xml
              </Text>
            </Stack>
          </Dropzone>

          {/* File list */}
          {files.length > 0 && (
            <Paper
              radius="md"
              withBorder
              p="sm"
              bg="gray.0"
              w="100%"
              maw={500}
              style={{
                transition: "max-height 0.2s",
                maxHeight: fileListMaxHeight,
                overflow: "hidden",
              }}
            >
              <Text size="sm" fw={500} c="dimmed" mb="xs">
                Selected Files
              </Text>
              <div
                style={{
                  maxHeight: files.length > 3 ? 132 : "none", // 48*3 - 12 for padding
                  overflowY: files.length > 3 ? "auto" : "visible",
                  paddingRight: files.length > 3 ? 4 : 0,
                }}
              >
                <Stack gap="xs">
                  {files.map((file) => (
                    <Group key={file.name} gap="xs">
                      <ThemeIcon size="sm" variant="light" color="blue">
                        <IconFileCode size={16} />
                      </ThemeIcon>
                      <Text size="sm">{file.name}</Text>
                    </Group>
                  ))}
                </Stack>
              </div>
            </Paper>
          )}

          {/* Analyse button */}
          <Button
            onClick={handleAnalyse}
            disabled={loading || !active}
            size="md"
            radius="md"
            fullWidth
          >
            {loading ? (
              <>
                <Loader size="sm" mr="sm" /> Analysing...
              </>
            ) : (
              "Analyse"
            )}
          </Button>

          {/* Error */}
          {error && (
            <Alert
              color="red"
              radius="md"
              icon={<IconAlertTriangle size={16} />}
              variant="filled"
              w="100%"
            >
              {error}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Center>
  );
}
