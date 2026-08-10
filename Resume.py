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



system_prompt = '''

'''


user_prompt = '''
Can you list the exact repositories of this github profile: https://github.com/ShauryaPrakashVerma
'''


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