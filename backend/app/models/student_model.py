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
            print(f"ERRO student_model: '{clean_id}' não é um ObjectId válido.")
            return None

        aluno = alunos_collection.find_one({"usuarioId": oid})

        if not aluno:
            aluno = alunos_collection.find_one({"_id": oid})

        if not aluno:
            return None

        return serialize_mongo(aluno)

    except Exception as e:
        print("ERRO EXCEÇÃO student_model:", e)
        return None


def find_student_by_cpf(cpf: str):
    return alunos_collection.find_one({"cpf": cpf})


def insert_student(aluno_doc: dict):
    return alunos_collection.insert_one(aluno_doc)


def to_object_id(id_val: str):
    try:
        return ObjectId(id_val)
    except Exception:
        return id_val


def buscar_aluno_flexivel(aluno_id: str):
    if not aluno_id:
        return None
    aluno_oid = to_object_id(aluno_id)
    return alunos_collection.find_one(
        {
            "$or": [
                {"_id": aluno_oid},
                {"usuarioId": aluno_oid},
                {"_id": aluno_id},
                {"usuarioId": aluno_id},
            ]
        }
    )


def update_student_visual_assets(aluno_mongo_id, novas_urls: list):
    alunos_collection.update_one(
        {"_id": aluno_mongo_id},
        {"$set": {"assetsVisuais": novas_urls}},
    )


def reset_student_visual_assets(aluno_id: str):
    aluno_oid = to_object_id(aluno_id)
    alunos_collection.update_one(
        {
            "$or": [
                {"_id": aluno_oid},
                {"usuarioId": aluno_oid},
                {"_id": aluno_id},
                {"usuarioId": aluno_id},
            ]
        },
        {"$set": {"assetsVisuais": []}},
    )
