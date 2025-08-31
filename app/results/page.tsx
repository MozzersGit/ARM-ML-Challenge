"use client";

import { useEffect, useState } from "react";
import ComplexityResultsPage from "../components/ComplexityResultsPage";
import { ComplexitySnippet, FilesData } from "../lib/types";

export default function ResultsPage() {
  const [data, setData] = useState<ComplexitySnippet[] >([]);
  const [files, setFiles] = useState<FilesData[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("complexityResults");
    const storedFiles = localStorage.getItem("complexityResultFiles");
    if (stored && storedFiles) {
      setData(JSON.parse(stored));
      setFiles(JSON.parse(storedFiles));
    }
  }, []);


  if (data.length === 0 || files.length === 0) {
    return <p style={{ padding: 20 }}>No results found. Please run an analysis first.</p>;
  }

  return <ComplexityResultsPage data={data} files={files}/>;
}
