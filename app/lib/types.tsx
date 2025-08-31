
export interface ComplexitySnippet {
  complexity: number;
  complexity_header: string;
  complexity_reasoning: string;
  file_name: string;
  line_number: number;
}

export interface FilesData {
  file_name: string;
  file_content: string;
}