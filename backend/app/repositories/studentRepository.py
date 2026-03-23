from app.core.database import alunos_collection

def find_student_by_user_id(user_id: str):
    try:
        aluno = alunos_collection.find_one({
            "userID": user_id
        })

        if not aluno:
            return None

        aluno["_id"] = str(aluno["_id"])

        return aluno

    except Exception as e:
        print("ERRO studentRepository:", e)
        return None