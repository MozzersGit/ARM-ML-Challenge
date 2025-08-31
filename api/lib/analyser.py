from abc import ABC, abstractmethod
from typing import List, Literal
from openai import BaseModel, OpenAI
from pydantic import Field
from .file import create_code_snippet_from_files, FileContents
from .prompt import CODE_COMPLEXITY_PROMPT

client = OpenAI()


class ComplexitySnippet(BaseModel):
    complexity: float = Field(
        ...,
        description="A score between 0 and 10, estimating its relative complexity.",
        le=10,
        ge=0,
    )
    complexity_header: str = Field(
        ..., description="A header describing the complexity of the event."
    )
    complexity_reasoning: str = Field(
        ..., description="A reasoning for the complexity score."
    )
    file_name: str = Field(
        ...,
        description="The name of the file where the complex code snippet is located.",
    )
    line_number: int = Field(
        ..., description="The line number where the complex code snippet starts."
    )
    model_config = {"extra": "forbid"}


class ComplexitySnippets(BaseModel):
    snippets: List[ComplexitySnippet] = Field(
        default_factory=list,
        description="A list of complex code snippets with their complexity scores, headers, and reasoning.",
    )
    model_config = {"extra": "forbid"}


class ComplexityAnalyser(ABC):
    @abstractmethod
    def analyse(self, file: List[FileContents]) -> List[ComplexitySnippet]:
        raise NotImplementedError("Subclasses must implement this method.")


class OpenAIComplexityAnalyser(ComplexityAnalyser):
    def __init__(self, model: str):
        self.model = model

    def analyse(self, files: List[FileContents]) -> List[ComplexitySnippet]:
        code_snippet = create_code_snippet_from_files(files)

        # Parse the response
        response = client.responses.parse(
            model=self.model,
            input=[
                CODE_COMPLEXITY_PROMPT,
                {
                    "role": "user",
                    "content": code_snippet,
                },
            ],
            text_format=ComplexitySnippets,
        )

        event = response.output_parsed

        return event.snippets if isinstance(event, ComplexitySnippets) else []


class ComplexityAnalyserFactory:
    @staticmethod
    def load(model: str | Literal["gpt-5"]) -> "ComplexityAnalyser":
        if model == "gpt-5":
            return OpenAIComplexityAnalyser(model="gpt-5")
        else:
            raise ValueError(f"Unknown model: {model}")
