from fastapi import APIRouter
from app.services.subjectService import get_subjects_by_escola_id

router = APIRouter()

@router.get("/materias/{escola_id}")
def get_subjects(escola_id: str):
    return get_subjects_by_escola_id(escola_id)