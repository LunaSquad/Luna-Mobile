import unicodedata
from bson.objectid import ObjectId
from bson.errors import InvalidId
from app.core.database import planos_collection

MAPA_SIGLAS = {
    "LP": ["portugues", "lingua portuguesa", "lp"],
    "MAT": ["matematica", "mat"],
    "GEO": ["geografia", "geo"],
    "HIS": ["historia", "his"],
}


def find_lesson_plans_by_subject(materia_id: str):
    planos = list(planos_collection.find({"materiaID": materia_id}))

    for plano in planos:
        plano["idPlano"] = str(plano["_id"])
        del plano["_id"]

    return planos


def obter_database():
    return planos_collection.database


def buscar_planos(filtro: dict):
    return list(planos_collection.find(filtro))


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
