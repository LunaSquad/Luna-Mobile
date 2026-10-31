# Importa o banco de dados (tenta pegar a collection direta, se não, pega do db)
try:
    from app.core.database import feedbacks_collection
except ImportError:
    from app.core.database import db

    feedbacks_collection = db.feedbacks


def insert_feedback(novo_feedback: dict):
    return feedbacks_collection.insert_one(novo_feedback)
