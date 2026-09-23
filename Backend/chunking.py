from typing import List, Dict


def chunk_text(text: str, chunk_size: int = 500, chunk_overlap: int = 50) -> List[str]:
    """
    Split text into overlapping chunks based on words.

    Args:
        text: Input text.
        chunk_size: Maximum number of words in each chunk.
        chunk_overlap: Number of words shared between consecutive chunks.

    Returns:
        List of text chunks.
    """

    if chunk_overlap >= chunk_size:
        raise ValueError("chunk_overlap must be smaller than chunk_size")

    words = text.split()

    chunks = []
    start = 0

    while start < len(words):

        end = start + chunk_size

        chunk = " ".join(words[start:end])

        if chunk.strip():
            chunks.append(chunk)

        start += chunk_size - chunk_overlap

    return chunks


if __name__ == "__main__":

    text = """
    I am a Computer Science student specializing in AI and Machine Learning.
    I have worked on several projects involving Python, Flask, machine learning,
    RAG systems and intelligent traffic management.
    """

    chunks = chunk_text(text)

    for i, chunk in enumerate(chunks):
        print(f"\n--- Chunk {i} ---")
        print(chunk)