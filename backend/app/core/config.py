import os

MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb+srv://Vitor:admin@projetointegrador.uxu3ymo.mongodb.net/?appName=ProjetoIntegrador"
)

DATABASE_NAME = os.getenv("DATABASE_NAME", "ProjetoIntegrador")