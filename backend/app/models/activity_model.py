from bson.objectid import ObjectId
from app.core.database import atividades_collection
from app.models.student_model import serialize_mongo


def find_activities_by_turma_and_subject(turma_id: str, materia_sigla: str):
    try:
        filtro = {
            "$or": [
                {"turmaId": turma_id},
                {"turmaID": turma_id},
                {"idTurma": turma_id},
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
    atividades_collection.update_one(
        {"alunoID": aluno_id, "planoID": plano_id},
        {"$set": documento, "$setOnInsert": {"createdAt": agora}},
        upsert=True,
    )


def find_activity_answers(aluno_id: str, plano_id: str):
    return atividades_collection.find_one({"alunoID": aluno_id, "planoID": plano_id})


def find_completed_activities_by_student(aluno_id: str):
    return atividades_collection.find({"alunoID": aluno_id, "status": "concluida"})


def find_adapted_activity(plano_id: str, aluno_id: str):
    return atividades_collection.find_one(
        {"planoOrigemID": plano_id, "alunoID": aluno_id}
    )


def delete_activity_by_id(activity_id):
    atividades_collection.delete_one({"_id": activity_id})


def insert_activity(atividade: dict):
    return atividades_collection.insert_one(atividade)


def delete_activities_by_student(aluno_id: str):
    atividades_collection.delete_many({"alunoID": aluno_id})
