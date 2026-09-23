from docx import Document
from chunking import chunk_text


def extract_document(file_path):
    """
    Extract paragraphs from a DOCX file while preserving headings.

    Args:
        file_path (str): Path to the Word document.

    Returns:
        list: List of extracted sections.
    """

    document = Document("Personal_Information\\MY PROJECTS.docx")

    sections = []
    current_heading = "General"

    for paragraph in document.paragraphs:

        text = paragraph.text.strip()

        # Ignore empty paragraphs
        if not text:
            continue

        # Check whether paragraph is a heading
        if paragraph.style.name.startswith("Heading"):

            current_heading = text

        else:

            sections.append({
                "text": text,
                "section": current_heading
            })

    return sections


def extract_and_chunk(file_path):
    """
    Extract the DOCX document and send its text to the chunking module.
    """

    sections = extract_document(file_path)

    chunked_data = []

    for section in sections:
        chunks = chunk_text(section["text"])

        for chunk in chunks:
            chunked_data.append({
                "text": chunk,
                "metadata": {
                    "section": section["section"]
                }
            })

    return chunked_data


# if __name__ == "__main__":

#     file_path = "../Personal_Information/MY PROJECTS.docx"

#     chunks = extract_and_chunk(file_path)

#     for i, chunk in enumerate(chunks):

#         print(f"\n--- Chunk {i + 1} ---")
#         print("Section:", chunk["metadata"]["section"])
#         print("Text:", chunk["text"])