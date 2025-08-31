from abc import ABC, abstractmethod
import json
from pathlib import Path
from typing import Dict, List, Literal, Optional, Type

from pydantic import RootModel

from .analyser import ComplexitySnippet, ComplexitySnippets

from .file import FileContents
from loguru import logger


class ComplexityResultCache(ABC):
    @classmethod
    @abstractmethod
    def load(cls, load_path: Path) -> "ComplexityResultCache":
        raise NotImplementedError

    @abstractmethod
    def save(self, save_path: Path) -> None:
        raise NotImplementedError

    @abstractmethod
    def is_cached(self, upload_file: FileContents) -> bool:
        raise NotImplementedError

    @abstractmethod
    def save_results(
        self, upload_file: FileContents, results: List[ComplexitySnippet]
    ) -> None:
        raise NotImplementedError

    @abstractmethod
    def get_cached_result(self, upload_file: FileContents) -> List[ComplexitySnippet]:
        raise NotImplementedError


SavedCache = RootModel[Dict[str, ComplexitySnippets]]


class SimpleCache(ComplexityResultCache):
    def __init__(self, loaded_cache: Optional[SavedCache] = None):
        self._cache: SavedCache = (
            SavedCache(root={}) if loaded_cache is None else loaded_cache
        )

    @classmethod
    def load(cls, load_path: Path) -> "SimpleCache":
        if not load_path.exists() or load_path.stat().st_size == 0:
            return cls()
        try:
            data = json.loads(load_path.read_text())
            parsed = SavedCache.model_validate(data)
            logger.info(
                f"Cache loaded from {load_path} with {len(parsed.root)} entries."
            )
            return cls(parsed)
        except Exception as e:
            # Cache load failed, start fresh
            logger.exception(f"Cache load failed ({e}), starting fresh.")
            return cls()

    def save(self, save_path: Path) -> None:
        """Persist cache to disk."""
        save_path.write_text(self._cache.model_dump_json(indent=2, exclude_none=True))

    def _key(self, upload_file: FileContents) -> str:
        # Use file hash as cache key
        logger.debug(
            f"Using hash {upload_file.file_contents_hash} for file {upload_file.file_name}"
        )
        return upload_file.file_contents_hash

    def is_cached(self, upload_file: FileContents) -> bool:
        return self._key(upload_file) in self._cache.root

    def save_results(
        self, upload_file: FileContents, results: List[ComplexitySnippet]
    ) -> None:
        key = self._key(upload_file)
        if key in self._cache.root:
            logger.warning(f"Overwriting existing cache entry for key: {key}")
        self._cache.root[key] = ComplexitySnippets(snippets=results)

    def get_cached_result(self, upload_file: FileContents) -> List[ComplexitySnippet]:
        val = self._cache.root.get(self._key(upload_file))
        if val is None:
            return []
        # Ensure we don't modify the cached data
        val = val.model_copy(deep=True)
        # If multiple files with same content but different names, set file_name
        for snip in val.snippets:
            snip.file_name = upload_file.file_name
        return val.snippets

    def clear(self) -> None:
        self._cache.root.clear()


class CacheLoader:
    @classmethod
    async def load(
        cls, cache_type: Literal["simple_cache"]
    ) -> Type[ComplexityResultCache]:
        if cache_type == "simple_cache":
            return SimpleCache
        else:
            raise ValueError(f"Unknown cache type: {cache_type}")
