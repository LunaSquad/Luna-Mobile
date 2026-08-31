from fastapi import APIRouter, HTTPException
from app.services.activity_service import get_activities_by_turma_and_subject

router = APIRouter()


@router.get("/turma/{turma_id}/materia/{materia_sigla}")
def get_atividades_turma_materia(turma_id: str, materia_sigla: str):
    try:
        atividades = get_activities_by_turma_and_subject(turma_id, materia_sigla)

        return {
            "ok": True,
            "atividades": atividades,
            "message": "Atividades recuperadas com sucesso.",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
