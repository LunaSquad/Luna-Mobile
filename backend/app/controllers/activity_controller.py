from datetime import datetime
import traceback
from fastapi import HTTPException

from app.models.activity_model import (
    find_activities_by_turma_and_subject,
    upsert_activity_answers,
    find_activity_answers,
    find_completed_activities_by_student,
)
from app.schemas.activity_schema import SubmissaoAtividadeRequest


def get_activities_by_turma_and_subject(turma_id: str, materia_sigla: str):
    return find_activities_by_turma_and_subject(turma_id, materia_sigla)


def salvar_respostas_atividade(payload: SubmissaoAtividadeRequest):
    try:
        agora = datetime.utcnow()
        documento = {
            "alunoID": payload.alunoID,
            "planoID": payload.planoID,
            "turmaID": payload.turmaID,
            "materiaID": payload.materiaID,
            "materia": payload.materia,
            "titulo": payload.titulo,
            "respostas": [r.dict() for r in payload.respostas],
            "acertos": payload.acertos,
            "totalQuestoes": payload.totalQuestoes,
            "status": "concluida",
            "updatedAt": agora,
        }

        upsert_activity_answers(payload.alunoID, payload.planoID, documento, agora)

        return {"ok": True, "message": "Respostas salvas com sucesso!"}
    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail="Erro ao salvar respostas da atividade"
        )


def obter_resposta_atividade(aluno_id: str, plano_id: str):
    try:
        doc = find_activity_answers(aluno_id, plano_id)
        if not doc:
            return {"ok": False, "atividade": None}

        doc["_id"] = str(doc["_id"])
        return {"ok": True, "atividade": doc}
    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail="Erro ao buscar resposta da atividade"
        )


def listar_atividades_concluidas_aluno(aluno_id: str):
    try:
        cursor = find_completed_activities_by_student(aluno_id)
        planos_concluidos = [
            str(doc.get("planoID")) for doc in cursor if doc.get("planoID")
        ]
        return {"ok": True, "planosConcluidos": planos_concluidos}
    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail="Erro ao listar atividades concluidas"
        )
