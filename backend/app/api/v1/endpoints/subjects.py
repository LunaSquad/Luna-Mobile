from fastapi import APIRouter
from app.services.subjectService import get_subjects_by_school

router = APIRouter()

@router.get("/materias/{escola_id}")
def get_materias_por_escola(escola_id: str):
    return get_subjects_by_school(escola_id)