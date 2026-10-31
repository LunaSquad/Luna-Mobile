from typing import Optional
from fastapi import APIRouter, Query

from app.controllers import lesson_plan_controller

router = APIRouter()


@router.get("/turma/{turma_id}/materia/{materia_id}")
def get_planos_por_turma_e_materia(
    turma_id: str,
    materia_id: str,
    sigla: Optional[str] = Query(None),
    userId: Optional[str] = Query(None),
):
    return lesson_plan_controller.get_planos_por_turma_e_materia(
        turma_id, materia_id, sigla, userId
    )
