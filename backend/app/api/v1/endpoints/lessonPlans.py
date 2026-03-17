from fastapi import APIRouter
from app.services.lessonPlanService import get_lesson_plans_by_subject

router = APIRouter()

@router.get("/planos/{materia_id}")
def get_planos_por_materia(materia_id: str):
    return get_lesson_plans_by_subject(materia_id)