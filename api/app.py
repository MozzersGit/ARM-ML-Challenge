from pathlib import Path
from typing import Annotated, List
from fastapi import Depends, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from lib.analyser import ComplexityAnalyserFactory, ComplexitySnippet
from lib.cache import CacheLoader, ComplexityResultCache
from lib.file import create_file_contents_from_uploadfile
from contextlib import asynccontextmanager
from loguru import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load simple cache from disk
    cache_path = Path("cache.json")
    Cache = await CacheLoader.load("simple_cache")
    cache = Cache.load(cache_path)
    logger.info("Cache loaded.")

    app.state.cache = cache  # Store cache in app state
    yield
    cache.save(cache_path)


app = FastAPI(lifespan=lifespan)


async def get_cache() -> ComplexityResultCache:
    return app.state.cache


# Configure CORS (Cross-Origin Resource Sharing)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Which origins are allowed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.post("/analyse")
async def analyse_complexity(
    cache: Annotated[ComplexityResultCache, Depends(get_cache)],
    files: List[UploadFile] = File(...),
) -> List[ComplexitySnippet]:
    """
    Analyse the complexity of the given files.
    """
    logger.info(f"Received {len(files)} files for analysis.")
    analyser = ComplexityAnalyserFactory.load(model="gpt-5")
    logger.info("Loaded analyser and cache.")
    file_contents = [create_file_contents_from_uploadfile(file) for file in files]

    # Cached results
    results = []
    cached_files = [fc for fc in file_contents if cache.is_cached(fc)]
    for file in cached_files:
        logger.info(f"Retrieving cached results for file: {file.file_name}")
        complexity_results = cache.get_cached_result(file)
        if complexity_results:
            logger.info(f"{complexity_results[0].file_name} {file.file_name}")
        results += complexity_results

    # Non cached results
    non_cached_files = [fc for fc in file_contents if not cache.is_cached(fc)]
    logger.info(f"{len(non_cached_files)} files are not cached, analysing...")
    for file in non_cached_files:
        logger.info(f"Analysing file: {file.file_name}")
        complexity_results = analyser.analyse([file])
        cache.save_results(file, complexity_results)
        results += complexity_results

    return results
