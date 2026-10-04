from Backend.embedding import generate_embeddings
from Backend.retrieval import search_similar


def retrieve(
    query,
    top_k=5
):
    """
    Convert the user query into an embedding
    and retrieve the most relevant chunks.
    """

    # --------------------------------
    # 1. Embed user query
    # --------------------------------

    query_embedding = generate_embeddings(
        [query]
    )[0]

    # --------------------------------
    # 2. Search ChromaDB
    # --------------------------------

    results = search_similar(
        query_embedding,
        top_k=top_k
    )

    # --------------------------------
    # 3. Extract results
    # --------------------------------

    documents = results["documents"][0]

    metadatas = results["metadatas"][0]

    distances = results["distances"][0]

    retrieved_chunks = []

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances
    ):

        retrieved_chunks.append({
            "text": document,
            "metadata": metadata,
            "distance": distance
        })

    return retrieved_chunks


# --------------------------------------------------
# Test retrieval
# --------------------------------------------------

if __name__ == "__main__":

    query = "What projects have I developed?"

    results = retrieve(
        query,
        top_k=5
    )

    for i, result in enumerate(results):

        print("\n" + "=" * 60)

        print(
            f"RESULT {i + 1}"
        )

        print("\nTEXT:")

        print(
            result["text"]
        )

        print("\nMETADATA:")

        print(
            result["metadata"]
        )

        print("\nDISTANCE:")

        print(
            result["distance"]
        )