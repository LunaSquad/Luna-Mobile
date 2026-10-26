import unicodedata
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from bson.objectid import ObjectId
from bson.errors import InvalidId
from app.core.database import planos_collection
from app.repositories.studentRepository import serialize_mongo

router = APIRouter()

MAPA_SIGLAS = {
    "LP": ["portugues", "lingua portuguesa", "lp"],
    "MAT": ["matematica", "mat"],
    "GEO": ["geografia", "geo"],
    "HIS": ["historia", "his"],
}


def normalizar_texto(texto: str) -> str:
    if not texto:
        return ""
    nfd = unicodedata.normalize("NFD", str(texto).strip().lower())
    return "".join(c for c in nfd if unicodedata.category(c) != "Mn")


def tentar_object_id(valor: str):
    if not valor or len(str(valor)) != 24:
        return None
    try:
        return ObjectId(str(valor))
    except InvalidId:
        return None


def buscar_ids_materia_por_sigla(db, sigla: str):
    chave = sigla.upper().strip()
    termos = MAPA_SIGLAS.get(chave, [normalizar_texto(chave)])
    ids_encontrados = []

    for nome_col in db.list_collection_names():
        if nome_col in ("planos", "lesson_plans", "lessonPlans"):
            continue
        colecao = db[nome_col]
        for doc in colecao.find():
            for campo in ("nome", "titulo", "name", "sigla", "materia"):
                if campo in doc and doc[campo]:
                    valor_norm = normalizar_texto(doc[campo])
                    if any(valor_norm == t or t in valor_norm for t in termos):
                        doc_id = doc.get("_id")
                        if doc_id is not None:
                            ids_encontrados.append(doc_id)
                            ids_encontrados.append(str(doc_id))
                        break

    return ids_encontrados


def buscar_turma_do_aluno(db, user_id: str):
    if not user_id or user_id in ("undefined", "null", ""):
        return []

    oid_user = tentar_object_id(user_id)
    criterios_busca = [{"_id": user_id}, {"userID": user_id}, {"userId": user_id}]
    if oid_user:
        criterios_busca.extend(
            [{"_id": oid_user}, {"userID": oid_user}, {"userId": oid_user}]
        )

    for nome_col in ("alunos", "students", "users", "usuarios"):
        if nome_col in db.list_collection_names():
            aluno = db[nome_col].find_one({"$or": criterios_busca})
            if aluno:
                turma = (
                    aluno.get("turmaID")
                    or aluno.get("turmaId")
                    or aluno.get("idTurma")
                    or aluno.get("turma")
                )
                if isinstance(turma, dict):
                    turma = turma.get("_id") or turma.get("id")
                if turma:
                    oid_t = tentar_object_id(str(turma))
                    return [oid_t, str(turma)] if oid_t else [turma]

    return []


@router.get("/turma/{turma_id}/materia/{materia_id}")
def get_planos_por_turma_e_materia(
    turma_id: str,
    materia_id: str,
    sigla: Optional[str] = Query(None),
    userId: Optional[str] = Query(None),
):
    try:
        db = planos_collection.database

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
        elif userId:
            valores_turma = buscar_turma_do_aluno(db, userId)

        if valores_turma:
            filtro = {
                "turmaID": {"$in": valores_turma},
                "materiaID": {"$in": valores_materia},
            }
            planos = list(planos_collection.find(filtro))
            if not planos and turma_id in ("auto", "undefined", "null", ""):
                planos = list(
                    planos_collection.find({"materiaID": {"$in": valores_materia}})
                )
        else:
            planos = list(
                planos_collection.find({"materiaID": {"$in": valores_materia}})
            )

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
