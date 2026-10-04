import os

from dotenv import load_dotenv
from groq import Groq

load_dotenv()

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


MODEL_NAME = "openai/gpt-oss-120b"


def generate_answer(
    query,
    context
):
    """
    Generate an answer using retrieved context.
    """

    system_prompt = """
You are a portfolio assistant for Shaurya.

Your job is to answer questions about Shaurya's
projects, education, technical skills, experience,
achievements and other information contained in
the provided knowledge base.

Use ONLY the information provided in the context.

Do not invent facts.

If the answer cannot be found in the context,
clearly say that the information is not available
in the knowledge base.

Give concise but useful answers.
"""

    user_prompt = f"""
Context from the knowledge base:

---------------- CONTEXT ----------------

{context}

-------------- END CONTEXT --------------

User question:

{query}

Answer the user's question using the context above.
"""

    response = client.chat.completions.create(
        model=MODEL_NAME,

        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": user_prompt
            }
        ],

        temperature=0.2
    )

    return response.choices[0].message.content