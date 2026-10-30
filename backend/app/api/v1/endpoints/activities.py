from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import traceback

try:
    from app.core.database import atividades_collection
except ImportError:
    from app.core.database import db

    atividades_collection = db.atividades

router = APIRouter()


class ItemResposta(BaseModel):
    numeroQuestao: int
    pergunta: str
    respostaAluno: str
    respostaCorreta: str
    acertou: bool
    tipo: Optional[str] = "objetiva"


class SubmissaoAtividadeRequest(BaseModel):
    alunoID: str
    planoID: str
    turmaID: Optional[str] = ""
    materiaID: Optional[str] = ""
    materia: Optional[str] = ""
    titulo: Optional[str] = ""
    respostas: List[ItemResposta]
    acertos: int
    totalQuestoes: int
    status: Optional[str] = "concluida"


@router.post("/responder")
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

        atividades_collection.update_one(
            {"alunoID": payload.alunoID, "planoID": payload.planoID},
            {"$set": documento, "$setOnInsert": {"createdAt": agora}},
            upsert=True,
        )

        return {"ok": True, "message": "Respostas salvas com sucesso!"}
    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail="Erro ao salvar respostas da atividade"
        )


@router.get("/resposta")
def obter_resposta_atividade(alunoId: str = Query(...), planoId: str = Query(...)):
    try:
        doc = atividades_collection.find_one({"alunoID": alunoId, "planoID": planoId})
        if not doc:
            return {"ok": False, "atividade": None}

        doc["_id"] = str(doc["_id"])
        return {"ok": True, "atividade": doc}
    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail="Erro ao buscar resposta da atividade"
        )


@router.get("/aluno/{aluno_id}")
def listar_atividades_concluidas_aluno(aluno_id: str):
    try:
        cursor = atividades_collection.find(
            {"alunoID": aluno_id, "status": "concluida"}
        )
        planos_concluidos = [
            str(doc.get("planoID")) for doc in cursor if doc.get("planoID")
        ]
        return {"ok": True, "planosConcluidos": planos_concluidos}
    except Exception:
        traceback.print_exc()
        raise HTTPException(
            status_code=500, detail="Erro ao listar atividades concluidas"
        )
