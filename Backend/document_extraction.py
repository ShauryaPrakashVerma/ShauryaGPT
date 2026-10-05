from docx import Document
from docx.table import Table
from docx.text.paragraph import Paragraph
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P

from Backend.chunking import chunk_text


def iter_block_items(document):
    """
    Iterate through paragraphs and tables in the same order
    in which they appear in the DOCX document.
    """

    for child in document.element.body.iterchildren():

        if isinstance(child, CT_P):
            yield Paragraph(child, document)

        elif isinstance(child, CT_Tbl):
            yield Table(child, document)


def extract_table(table):
    """
    Convert a DOCX table into searchable plain text.

    Each row is represented as:
        Column 1 | Column 2 | Column 3

    Returns:
        str: Text representation of the table.
    """

    rows = []

    for row in table.rows:

        cells = [
            cell.text.strip().replace("\n", " ")
            for cell in row.cells
        ]

        # Ignore completely empty rows
        if not any(cells):
            continue

        rows.append(" | ".join(cells))

    return "\n".join(rows)


def extract_document(file_path):
    """
    Extract paragraphs and tables from a DOCX file while
    preserving the document order and current heading.

    Args:
        file_path (str): Path to the Word document.

    Returns:
        list: List of extracted sections.
    """

    document = Document(file_path)

    sections = []
    current_heading = "General"

    # Process paragraphs and tables in their actual DOCX order.
    for block in iter_block_items(document):

        # -----------------------------
        # Paragraph
        # -----------------------------
        if isinstance(block, Paragraph):

            text = block.text.strip()

            # Ignore empty paragraphs
            if not text:
                continue

            # Check whether paragraph is a heading
            if block.style.name.startswith("Heading"):
                current_heading = text

            else:
                sections.append({
                    "text": text,
                    "section": current_heading,
                    "content_type": "paragraph"
                })

        # -----------------------------
        # Table
        # -----------------------------
        elif isinstance(block, Table):

            table_text = extract_table(block)

            # Ignore empty tables
            if not table_text:
                continue

            sections.append({
                "text": table_text,
                "section": current_heading,
                "content_type": "table"
            })

    return sections


def extract_and_chunk(file_path):
    """
    Extract paragraphs and tables from the DOCX document,
    then send their text to the chunking module.

    Args:
        file_path (str): Path to the Word document.

    Returns:
        list: Chunked text with metadata.
    """

    sections = extract_document(file_path)

    chunked_data = []

    for section in sections:

        chunks = chunk_text(section["text"])

        for chunk in chunks:

            chunked_data.append({
                "text": chunk,
                "metadata": {
                    "section": section["section"],
                    "content_type": section["content_type"]
                }
            })

    return chunked_data
