from bson.objectid import ObjectId
from app.core.database import atividades_collection, alunos_collection
from app.models.student_model import serialize_mongo


def _to_oid(val: str):
    if not val or len(str(val)) != 24:
        return None
    try:
        return ObjectId(str(val))
    except Exception:
        return None


def obter_valores_id_aluno(aluno_id: str) -> list:
    if not aluno_id:
        return []
    valores = [str(aluno_id)]
    oid = _to_oid(str(aluno_id))
    if oid:
        valores.append(oid)

    try:
        criterios = [{"_id": str(aluno_id)}, {"usuarioId": str(aluno_id)}]
        if oid:
            criterios.extend([{"_id": oid}, {"usuarioId": oid}])
        aluno_doc = alunos_collection.find_one({"$or": criterios})
        if aluno_doc:
            if aluno_doc.get("_id"):
                valores.append(aluno_doc["_id"])
                valores.append(str(aluno_doc["_id"]))
            if aluno_doc.get("usuarioId"):
                valores.append(aluno_doc["usuarioId"])
                valores.append(str(aluno_doc["usuarioId"]))
    except Exception:
        pass

    unicos = []
    for v in valores:
        if v not in unicos:
            unicos.append(v)
    return unicos


def obter_valores_id_plano(plano_id: str) -> list:
    if not plano_id:
        return []
    valores = [str(plano_id)]
    oid = _to_oid(str(plano_id))
    if oid:
        valores.append(oid)
    return valores


def find_activities_by_turma_and_subject(turma_id: str, materia_sigla: str):
    try:
        oid_turma = _to_oid(turma_id)
        valores_turma = [oid_turma, str(turma_id)] if oid_turma else [str(turma_id)]
        filtro = {
            "$or": [
                {"turmaId": {"$in": valores_turma}},
                {"turmaID": {"$in": valores_turma}},
                {"idTurma": {"$in": valores_turma}},
            ],
            "materia": materia_sigla.upper(),
        }

        cursor = atividades_collection.find(filtro)
        atividades = list(cursor)

        if not atividades:
            return []

        return serialize_mongo(atividades)

    except Exception as e:
        print(f"ERRO activity_model: {e}")
        return []


def upsert_activity_answers(aluno_id: str, plano_id: str, documento: dict, agora):
    existente = find_activity_answers(aluno_id, plano_id)
    if existente and existente.get("_id"):
        atividades_collection.update_one(
            {"_id": existente["_id"]},
            {"$set": documento},
        )
    else:
        atividades_collection.update_one(
            {"alunoID": str(aluno_id), "planoID": str(plano_id)},
            {"$set": documento, "$setOnInsert": {"createdAt": agora}},
            upsert=True,
        )


def find_activity_answers(aluno_id: str, plano_id: str):
    vals_aluno = obter_valores_id_aluno(aluno_id)
    vals_plano = obter_valores_id_plano(plano_id)

    filtro = {
        "$and": [
            {
                "$or": [
                    {"alunoID": {"$in": vals_aluno}},
                    {"userID": {"$in": vals_aluno}},
                    {"alunoId": {"$in": vals_aluno}},
                    {"userId": {"$in": vals_aluno}},
                ]
            },
            {
                "$or": [
                    {"planoID": {"$in": vals_plano}},
                    {"planoId": {"$in": vals_plano}},
                    {"planoOrigemID": {"$in": vals_plano}},
                ]
            },
            {"respostas.0": {"$exists": True}},
        ]
    }
    doc = atividades_collection.find_one(filtro)
    return serialize_mongo(doc) if doc else None


def find_completed_activities_by_student(aluno_id: str):
    vals_aluno = obter_valores_id_aluno(aluno_id)
    filtro = {
        "$and": [
            {
                "$or": [
                    {"alunoID": {"$in": vals_aluno}},
                    {"userID": {"$in": vals_aluno}},
                    {"alunoId": {"$in": vals_aluno}},
                    {"userId": {"$in": vals_aluno}},
                ]
            },
            {
                "$or": [
                    {"status": {"$in": ["concluida", "corrigida", "respondida"]}},
                    {"respostas.0": {"$exists": True}},
                ]
            },
        ]
    }
    return list(atividades_collection.find(filtro))


def find_adapted_activity(plano_id: str, aluno_id: str):
    vals_aluno = obter_valores_id_aluno(aluno_id)
    vals_plano = obter_valores_id_plano(plano_id)

    filtro = {
        "$and": [
            {"planoOrigemID": {"$in": vals_plano}},
            {
                "$or": [
                    {"alunoID": {"$in": vals_aluno}},
                    {"userID": {"$in": vals_aluno}},
                    {"alunoId": {"$in": vals_aluno}},
                    {"userId": {"$in": vals_aluno}},
                ]
            },
            {"atividades.0": {"$exists": True}},
        ]
    }
    return atividades_collection.find_one(filtro)


def update_activity_assets(activity_id, assets: list):
    atividades_collection.update_one(
        {"_id": activity_id},
        {"$set": {"assetsVisuais": assets}},
    )


def delete_activity_by_id(activity_id):
    atividades_collection.delete_one({"_id": activity_id})


def insert_activity(atividade: dict):
    return atividades_collection.insert_one(atividade)


def delete_activities_by_student(aluno_id: str):
    vals_aluno = obter_valores_id_aluno(aluno_id)
    atividades_collection.delete_many(
        {
            "$or": [
                {"alunoID": {"$in": vals_aluno}},
                {"userID": {"$in": vals_aluno}},
            ],
            "respostas.0": {"$exists": False},
        }
    )
