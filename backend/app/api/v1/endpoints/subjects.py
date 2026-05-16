from fastapi import APIRouter
from app.core.database import db

router = APIRouter()

@router.get("/materias")
def get_subjects():
    try:
        materias = list(db.materias.find())

        for materia in materias:
            materia["_id"] = str(materia["_id"])

        return {
            "ok": True,
            "materias": materias
        }

    except Exception as e:
        return {
            "ok": False,
            "message": str(e)
        }