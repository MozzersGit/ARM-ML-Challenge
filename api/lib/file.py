from typing import List
from dataclasses import dataclass
import hashlib

from fastapi import HTTPException, UploadFile


@dataclass
class FileContents:
    file_name: str
    file_contents: List[str]
    file_contents_hash: str


def create_file_code_snippet(file_contents: FileContents) -> str:
    code_snippet = f"File: {file_contents.file_name}\n"
    code_snippet += (
        "\n".join(
            [f"{n + 1}|{line}" for n, line in enumerate(file_contents.file_contents)]
        )
        + "\n\n"
    )
    return code_snippet


def create_code_snippet_from_files(file_contents_list: List[FileContents]) -> str:
    return "\n".join([create_file_code_snippet(fc) for fc in file_contents_list])


def string_hash(content: str, algo: str = "sha256") -> str:
    return hashlib.new(algo, content.encode("utf-8")).hexdigest()


def create_file_contents_from_uploadfile(upload_file: UploadFile) -> FileContents:
    try:
        contents = upload_file.file.read().decode("utf-8").splitlines()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Error reading file {upload_file.filename}: {str(e)}",
        )
    file_hash = string_hash("".join(contents))
    return FileContents(
        file_name=upload_file.filename,
        file_contents=contents,
        file_contents_hash=file_hash,
    )
