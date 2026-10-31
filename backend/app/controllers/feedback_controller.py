from fastapi import HTTPException
from datetime import datetime
import traceback

from app.models.feedback_model import insert_feedback
from app.schemas.feedback_schema import FeedbackRequest


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
        result = insert_feedback(novo_feedback)

        return {
            "ok": True,
            "message": "Feedback enviado com sucesso!",
            "id": str(result.inserted_id),
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Erro interno ao salvar feedback")
