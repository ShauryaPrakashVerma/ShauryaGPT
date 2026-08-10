from groq import Groq
from dotenv import load_dotenv
from pydantic import BaseModel
import os

from pypdf import PdfReader
from docx import Document


load_dotenv()
my_api_key = os.getenv("GROQ_API_KEY")

if not my_api_key:
    raise ValueError("Invalid API key")

client = Groq(api_key=my_api_key)
model = "llama-3.3-70b-versatile"

file_path = "C:\\Users\\Shaur\\Desktop\\ShauryaGPT\\Personal_Information\\MY PROJECTS.docx"

def read_docx(file_path):
    document = Document(file_path)
    text = ""
    for paragraph in document.paragraphs:
        if paragraph.text.strip():
            text += paragraph.text + "\n"
    
    for table in document.tables:
        for row in table.rows:
            for cell in row.cells:
                if cell.text.strip():
                    text += cell.text + "\n"
    return text

description = read_docx(file_path)

system_prompt = f'''
# ROLE:
You are an expert virtual assistant for Shaurya.

# TASK:
Your task is to answer all the questions asked related to the projects and details about the person.

# Constraints:
You need to answer about details mentioned in the given description only.
{description }

# Output Format:
The output need to strictly as per the specified format 

# Fallback
If the question isnt related to the details mentioned in the description, the answer should be that i can't answer this question.

'''


question = input("Enter your question: ")


user_prompt = question


messages = [
    {
        "role" : "system",
        "content" : system_prompt
    },
    {
        "role" : "user",
        "content" : user_prompt
    }
]



response = client.chat.completions.create(model=model, messages=messages)
answer = response.choices[0].message.content
messages.append({
    "role" : "assistant",
    "content" : answer
})
print(answer)



def ask_llm(system_prompt, user_prompt):
    pass

def doc_parser():
    pass