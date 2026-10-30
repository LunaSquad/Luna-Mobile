from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import traceback

# Importa o banco de dados (tenta pegar a collection direta, se não, pega do db)
try:
    from app.core.database import feedbacks_collection
except ImportError:
    from app.core.database import db

    feedbacks_collection = db.feedbacks

router = APIRouter()


# Define o formato dos dados que o frontend vai enviar
class FeedbackRequest(BaseModel):
    userID: str
    comentario: str
    nota: int


@router.post("/")
def salvar_feedback(payload: FeedbackRequest):
    try:
        # Prepara o documento exatamente igual ao padrão que você tem no MongoDB
        novo_feedback = {
            "userID": payload.userID,
            "comentario": payload.comentario,
            "nota": payload.nota,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "__v": 0,
        }

        # Salva no banco de dados
        result = feedbacks_collection.insert_one(novo_feedback)

        return {
            "ok": True,
            "message": "Feedback enviado com sucesso!",
            "id": str(result.inserted_id),
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Erro interno ao salvar feedback")
