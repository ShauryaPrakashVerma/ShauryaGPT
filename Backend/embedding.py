from sentence_transformers import SentenceTransformer


# Load the embedding model once.
# Loading it inside the function repeatedly would be inefficient.
model = SentenceTransformer("BAAI/bge-small-en-v1.5")


def generate_embeddings(texts):
    """
    Generate embeddings for a list of text chunks.

    Args:
        texts (list[str]): List of text chunks.

    Returns:
        list: List of embedding vectors.
    """

    embeddings = model.encode(
        texts,
        normalize_embeddings=True
    )

    # Convert NumPy array to regular Python lists
    # so they can easily be passed to ChromaDB.
    return embeddings.tolist()


if __name__ == "__main__":

    text = [
        "My name is Shaurya and I am a Computer Science student.",
        "I have worked on Python, Flask and machine learning projects."
    ]

    embeddings = generate_embeddings(text)

    print("Number of embeddings:", len(embeddings))
    print("Embedding dimensions:", len(embeddings[0]))
    print("First embedding:")
    print(embeddings[0])