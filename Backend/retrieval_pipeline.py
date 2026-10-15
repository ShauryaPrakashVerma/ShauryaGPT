from Backend.embedding import generate_embeddings
from Backend.retrieval import search_similar



def retrieve(query, top_k=10, max_projects=5):
    """
    Convert the user query into an embedding and retrieve
    relevant chunks while avoiding multiple chunks from
    the same project dominating the results.
    """

    # --------------------------------
    # 1. Embed user query
    # --------------------------------

    query_embedding = generate_embeddings([query])[0]

    # --------------------------------
    # 2. Retrieve more candidates
    # --------------------------------

    results = search_similar(
        query_embedding,
        top_k=top_k
    )

    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    distances = results["distances"][0]

    # --------------------------------
    # 3. Remove duplicate project results
    # --------------------------------

    retrieved_chunks = []
    seen_projects = set()

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances
    ):

        # Use project metadata if available.
        # Fall back to section if project is not present.
        project = metadata.get(
            "project",
            metadata.get("section", "unknown")
        )

        # Don't allow multiple chunks from the
        # same project for broad project queries.
        if project in seen_projects:
            continue

        seen_projects.add(project)

        retrieved_chunks.append({
            "text": document,
            "metadata": metadata,
            "distance": distance
        })

        if len(retrieved_chunks) >= max_projects:
            break

    return retrieved_chunks


# --------------------------------------------------
# Test retrieval
# --------------------------------------------------

if __name__ == "__main__":

    query = "What projects have I developed?"

    results = retrieve(
        query,
        top_k=10,
        max_projects=5
    )

    for i, result in enumerate(results):

        print("\n" + "=" * 60)
        print(f"RESULT {i + 1}")

        print("\nTEXT:")
        print(result["text"])

        print("\nMETADATA:")
        print(result["metadata"])

        print("\nDISTANCE:")
        print(result["distance"])
