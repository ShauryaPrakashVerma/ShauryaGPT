import chromadb

client = chromadb.PersistentClient(path="../chroma_db")

collection = client.get_collection("portfolio")

print("Total documents:", collection.count())

data = collection.get(
    include=["documents", "metadatas", "embeddings"]
)

for i in range(len(data["ids"])):
    print("\n" + "=" * 60)
    print("ID:", data["ids"][i])
    print("TEXT:", data["documents"][i])
    print("METADATA:", data["metadatas"][i])
    print("EMBEDDING DIMENSION:", len(data["embeddings"][i]))