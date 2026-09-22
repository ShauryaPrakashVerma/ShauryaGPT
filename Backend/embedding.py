from sentence_transformers import SentenceTransformer

model = SentenceTransformer(
    "BAAI/bge-small-en-v1.5"
)

text = "Hello My name is shaurya. this is my text"

def generate_embeddings(text):
    
    embedding = model.encode(text)
    print(embedding)
    
    # return model.encode(
    #     chunks,
    #     normalize_embeddings=True
    # )
    
generate_embeddings(text)