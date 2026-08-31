from bson.objectid import ObjectId
from bson.errors import InvalidId
from app.core.database import alunos_collection


def serialize_mongo(doc):
    if isinstance(doc, list):
        return [serialize_mongo(item) for item in doc]
    if isinstance(doc, dict):
        return {
            key: str(value) if isinstance(value, ObjectId) else serialize_mongo(value)
            for key, value in doc.items()
        }
    return doc


def find_student_by_user_id(user_id: str):
    try:
        clean_id = user_id.strip(" \"'()")

        try:
            oid = ObjectId(clean_id)
        except InvalidId:
            print(f"ERRO studentRepository: '{clean_id}' não é um ObjectId válido.")
            return None

        aluno = alunos_collection.find_one({"usuarioId": oid})

        if not aluno:
            aluno = alunos_collection.find_one({"_id": oid})

        if not aluno:
            return None

        return serialize_mongo(aluno)

    except Exception as e:
        print("ERRO EXCEÇÃO studentRepository:", e)
        return None
