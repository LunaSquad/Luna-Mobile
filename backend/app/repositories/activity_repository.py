from bson.objectid import ObjectId
from app.core.database import atividades_collection
from app.repositories.studentRepository import serialize_mongo


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
        print(f"ERRO activity_repository: {e}")
        return []
