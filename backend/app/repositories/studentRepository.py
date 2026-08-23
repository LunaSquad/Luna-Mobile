from bson.objectid import ObjectId
from app.core.database import alunos_collection


def find_student_by_user_id(user_id: str):
    try:
        # AQUI FOI CORRIGIDO: de "userID" para "usuarioId" e adicionado o ObjectId()
        aluno = alunos_collection.find_one({"usuarioId": ObjectId(user_id)})

        if not aluno:
            return None

        # Convertendo os ObjectIds para string para o FastAPI conseguir enviar para o React Native
        aluno["_id"] = str(aluno["_id"])

        if "usuarioId" in aluno:
            aluno["usuarioId"] = str(aluno["usuarioId"])

        # Se houver outros ObjectIds dentro do aluno (como hiperfoco), você pode convertê-los aqui futuramente

        return aluno

    except Exception as e:
        print("ERRO studentRepository:", e)
        return None
