from retrieval_pipeline import retrieve
from llm import generate_answer_stream


def build_context(retrieved_chunks):

    context_parts = []

    for i, chunk in enumerate(retrieved_chunks):

        text = chunk["text"]

        metadata = chunk["metadata"]

        section = metadata.get(
            "section",
            "Unknown"
        )

        context_parts.append(
            f"""
[Source {i + 1}]
Section: {section}

{text}
"""
        )

    return "\n".join(context_parts)


def generate_rag_response(query, top_k=5):

    retrieved_chunks = retrieve(
        query,
        top_k=top_k
    )

    if not retrieved_chunks:

        yield "I could not find relevant information."

        return

    context = build_context(
        retrieved_chunks
    )

    for chunk in generate_answer_stream(
        query,
        context
    ):

        yield chunk