import logging
import numpy as np
from typing import List, Optional

logger = logging.getLogger(__name__)


class EmbeddingModel:
    """Manages sentence/word embeddings for semantic matching."""

    def __init__(self):
        self._model = None
        self._initialized = False

    def initialize(self):
        try:
            from sentence_transformers import SentenceTransformer

            logger.info("Loading sentence transformer model...")
            self._model = SentenceTransformer("all-MiniLM-L6-v2")
            self._initialized = True
            logger.info("Sentence transformer model loaded successfully")
        except Exception as e:
            logger.warning(f"Could not load sentence transformer: {e}")
            logger.info("Falling back to TF-IDF based embeddings")
            self._initialized = False

    @property
    def is_available(self) -> bool:
        return self._initialized and self._model is not None

    def encode(self, texts: List[str]) -> Optional[np.ndarray]:
        if not self.is_available:
            return None
        try:
            embeddings = self._model.encode(texts, show_progress_bar=False)
            return np.array(embeddings)
        except Exception as e:
            logger.error(f"Encoding error: {e}")
            return None

    def compute_similarity(self, text1: str, text2: str) -> float:
        if not self.is_available:
            return 0.0
        try:
            embeddings = self._model.encode([text1, text2])
            similarity = self._cosine_similarity(embeddings[0], embeddings[1])
            return float(similarity)
        except Exception as e:
            logger.error(f"Similarity computation error: {e}")
            return 0.0

    def batch_similarity(self, query: str, candidates: List[str]) -> List[float]:
        if not self.is_available or not candidates:
            return [0.0] * len(candidates)
        try:
            all_texts = [query] + candidates
            embeddings = self._model.encode(all_texts, show_progress_bar=False)
            query_emb = embeddings[0]
            similarities = []
            for i in range(1, len(embeddings)):
                sim = self._cosine_similarity(query_emb, embeddings[i])
                similarities.append(float(sim))
            return similarities
        except Exception as e:
            logger.error(f"Batch similarity error: {e}")
            return [0.0] * len(candidates)

    @staticmethod
    def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        dot = np.dot(a, b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        return dot / (norm_a * norm_b)
