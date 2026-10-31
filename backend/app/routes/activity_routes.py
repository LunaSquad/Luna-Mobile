from fastapi import APIRouter, Query

from app.controllers import activity_controller
from app.schemas.activity_schema import SubmissaoAtividadeRequest

router = APIRouter()


@router.post("/responder")
def salvar_respostas_atividade(payload: SubmissaoAtividadeRequest):
    return activity_controller.salvar_respostas_atividade(payload)


@router.get("/resposta")
def obter_resposta_atividade(alunoId: str = Query(...), planoId: str = Query(...)):
    return activity_controller.obter_resposta_atividade(alunoId, planoId)


@router.get("/aluno/{aluno_id}")
def listar_atividades_concluidas_aluno(aluno_id: str):
    return activity_controller.listar_atividades_concluidas_aluno(aluno_id)
