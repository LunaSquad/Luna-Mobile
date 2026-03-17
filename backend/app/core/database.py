from pymongo import MongoClient
from app.core.config import MONGO_URL, DATABASE_NAME

client = MongoClient(MONGO_URL)
db = client[DATABASE_NAME]

usuarios_collection = db["usuarios"]
alunos_collection = db["alunos"]
materias_collection = db["materias"]
planos_collection = db["planosDeAula"]