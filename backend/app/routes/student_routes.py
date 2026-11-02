from fastapi import APIRouter
from pydantic import BaseModel
from app.controllers.student_controller import (
    get_student_by_user_id,
    vincular_aluno_turma,
)

router = APIRouter()


class VincularTurmaRequest(BaseModel):
    turmaId: str
    codigoAcesso: str


@router.get("/aluno/{user_id}")
def get_student(user_id: str):
    return get_student_by_user_id(user_id)


# --- NOVA ROTA ADICIONADA ---
@router.put("/aluno/{user_id}/vincular-turma")
def vincular_turma(user_id: str, req: VincularTurmaRequest):
    return vincular_aluno_turma(user_id, req.turmaId, req.codigoAcesso)
