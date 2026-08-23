import os
import cloudinary
from dotenv import load_dotenv

load_dotenv()

# Banco de Dados MongoDB
MONGO_URL = os.getenv(
    "MONGO_URL",
    "mongodb+srv://Vitor:admin@projetointegrador.uxu3ymo.mongodb.net/?appName=ProjetoIntegrador",
)
DATABASE_NAME = os.getenv("DATABASE_NAME", "Banco_PI")

# Cloudinary
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME", "dhkotadvd")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY", "379771926896593")
CLOUDINARY_API_SECRET = os.getenv(
    "CLOUDINARY_API_SECRET", "sfNNWsXJn3nqJO9AhlBD7uGL_JY"
)

cloudinary.config(
    cloud_name=CLOUDINARY_CLOUD_NAME,
    api_key=CLOUDINARY_API_KEY,
    api_secret=CLOUDINARY_API_SECRET,
    secure=True,
)

# OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

# Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
