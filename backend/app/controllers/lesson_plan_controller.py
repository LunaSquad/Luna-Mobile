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

        valores_materia = []
        oid_materia = tentar_object_id(materia_id)
        if oid_materia:
            valores_materia.extend([oid_materia, str(materia_id)])

        if sigla:
            valores_materia.extend(buscar_ids_materia_por_sigla(db, sigla))
        elif not oid_materia:
            valores_materia.extend(buscar_ids_materia_por_sigla(db, materia_id))

        if not valores_materia:
            return {"ok": True, "planos": []}

        valores_turma = []
        if turma_id and turma_id not in ("auto", "undefined", "null", ""):
            oid_turma = tentar_object_id(turma_id)
            valores_turma = [oid_turma, str(turma_id)] if oid_turma else [str(turma_id)]
        elif user_id:
            valores_turma = buscar_turma_do_aluno(db, user_id)

        if not valores_turma:
            return {"ok": True, "planos": []}

        filtro = {
            "$and": [
                {
                    "$or": [
                        {"turmaID": {"$in": valores_turma}},
                        {"turmaId": {"$in": valores_turma}},
                    ]
                },
                {
                    "$or": [
                        {"materiaID": {"$in": valores_materia}},
                        {"materiaId": {"$in": valores_materia}},
                    ]
                },
            ]
        }

        planos = buscar_planos(filtro)

        for plano in planos:
            if "titulo" not in plano or not plano["titulo"]:
                plano["titulo"] = "Atividade Pendente (PDF)"
            if "descricao" not in plano or not plano["descricao"]:
                plano["descricao"] = (
                    "Clique para a IA adaptar este conteúdo para o seu hiperfoco."
                )
            turma_val = plano.get("turmaId") or plano.get("turmaID")
            materia_val = plano.get("materiaId") or plano.get("materiaID")
            if turma_val:
                plano["turmaID"] = str(turma_val)
                plano["turmaId"] = str(turma_val)
            if materia_val:
                plano["materiaID"] = str(materia_val)
                plano["materiaId"] = str(materia_val)

        return {"ok": True, "planos": serialize_mongo(planos)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
