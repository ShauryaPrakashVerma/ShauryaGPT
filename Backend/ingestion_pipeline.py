from document_extraction import extract_and_chunk
from embedding import generate_embeddings

import chromadb


# -----------------------------
# Configuration
# -----------------------------

DOCUMENT_PATH = "../Personal_Information/MY PROJECTS.docx"

CHROMA_PATH = "../chroma_db"

COLLECTION_NAME = "portfolio"


# -----------------------------
# Initialize ChromaDB
# -----------------------------

client = chromadb.PersistentClient(
    path=CHROMA_PATH
)

collection = client.get_or_create_collection(
    name=COLLECTION_NAME,
    configuration={
        "hnsw": {
            "space": "cosine"
        }
    }
)


# -----------------------------
# Ingestion Pipeline
# -----------------------------

def ingest_document():

    print("Extracting document...")

    chunks = extract_and_chunk(DOCUMENT_PATH)

    if not chunks:
        print("No chunks were extracted.")
        return

    print(f"Extracted {len(chunks)} chunks.")

    # --------------------------------
    # Extract text from chunks
    # --------------------------------

    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    # --------------------------------
    # Generate embeddings
    # --------------------------------

    print("Generating embeddings...")

    embeddings = generate_embeddings(texts)

    print("Embeddings generated.")

    # --------------------------------
    # Prepare metadata
    # --------------------------------

    metadata = [
        chunk["metadata"]
        for chunk in chunks
    ]

    # --------------------------------
    # Generate unique IDs
    # --------------------------------

    ids = [
        f"chunk_{i}"
        for i in range(len(chunks))
    ]

    # --------------------------------
    # Store in ChromaDB
    # --------------------------------

    print("Storing data in ChromaDB...")

    collection.upsert(
        ids=ids,
        documents=texts,
        embeddings=embeddings,
        metadatas=metadata
    )

    print(
        f"Successfully stored {len(chunks)} chunks in ChromaDB."
    )


# -----------------------------
# Run pipeline
# -----------------------------

if __name__ == "__main__":
    ingest_document()