from typing import Optional
from fastapi import HTTPException

from app.models.lesson_plan_model import (
    find_lesson_plans_by_subject,
    obter_database,
    buscar_planos,
    tentar_object_id,
    buscar_ids_materia_por_sigla,
    buscar_turma_do_aluno,
)
from app.models.student_model import serialize_mongo


def get_lesson_plans_by_subject(materia_id: str):
    try:
        lista = find_lesson_plans_by_subject(materia_id)
        return {"ok": True, "planos": lista}
    except Exception as e:
        return {"ok": False, "message": str(e), "planos": []}


def get_planos_por_turma_e_materia(
    turma_id: str,
    materia_id: str,
    sigla: Optional[str],
    user_id: Optional[str],
):
    try:
        db = obter_database()

        oid_materia = tentar_object_id(materia_id)
        if oid_materia:
            valores_materia = [oid_materia, materia_id]
        else:
            sigla_alvo = sigla or materia_id
            valores_materia = buscar_ids_materia_por_sigla(db, sigla_alvo)

        if not valores_materia:
            return {"ok": True, "planos": []}

        valores_turma = []
        if turma_id not in ("auto", "undefined", "null", ""):
            oid_turma = tentar_object_id(turma_id)
            valores_turma = [oid_turma, turma_id] if oid_turma else [turma_id]
        elif user_id:
            valores_turma = buscar_turma_do_aluno(db, user_id)

        if valores_turma:
            filtro = {
                "turmaID": {"$in": valores_turma},
                "materiaID": {"$in": valores_materia},
            }
            planos = buscar_planos(filtro)
            if not planos and turma_id in ("auto", "undefined", "null", ""):
                planos = buscar_planos({"materiaID": {"$in": valores_materia}})
        else:
            planos = buscar_planos({"materiaID": {"$in": valores_materia}})

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
