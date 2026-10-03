from pathlib import Path

import chromadb


# --------------------------------------------------
# ChromaDB configuration
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

CHROMA_PATH = BASE_DIR / "chroma_db"

COLLECTION_NAME = "portfolio"


# --------------------------------------------------
# Connect to ChromaDB
# --------------------------------------------------

client = chromadb.PersistentClient(
    path=str(CHROMA_PATH)
)

collection = client.get_collection(
    name=COLLECTION_NAME
)


# --------------------------------------------------
# Similarity Search
# --------------------------------------------------

def search_similar(
    query_embedding,
    top_k=5
):
    """
    Search ChromaDB for the most relevant chunks.

    Args:
        query_embedding: Embedding of the user query.
        top_k: Number of chunks to retrieve.

    Returns:
        ChromaDB search results.
    """

    results = collection.query(
        query_embeddings=[
            query_embedding
        ],
        n_results=top_k,

        include=[
            "documents",
            "metadatas",
            "distances"
        ]
    )

    return results