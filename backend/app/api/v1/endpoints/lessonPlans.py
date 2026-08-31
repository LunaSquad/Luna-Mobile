from fastapi import APIRouter, HTTPException
from bson.objectid import ObjectId
from bson.errors import InvalidId
from app.core.database import planos_collection
from app.repositories.studentRepository import serialize_mongo

router = APIRouter()


@router.get("/turma/{turma_id}/materia/{materia_id}")
def get_planos_por_turma_e_materia(turma_id: str, materia_id: str):
    try:

        try:
            t_id = ObjectId(turma_id)
            m_id = ObjectId(materia_id)
        except InvalidId:
            t_id = turma_id
            m_id = materia_id

        filtro = {"turmaID": t_id, "materiaID": m_id}

        planos = list(planos_collection.find(filtro))

        for plano in planos:
            if "titulo" not in plano:
                plano["titulo"] = "Atividade Pendente (PDF)"
            if "descricao" not in plano:
                plano["descricao"] = (
                    "Clique para a IA adaptar este conteúdo para o seu hiperfoco."
                )

        return {"ok": True, "planos": serialize_mongo(planos)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
