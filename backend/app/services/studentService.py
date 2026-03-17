from app.repositories.studentRepository import find_student_by_user_id

def get_student_by_user_id(user_id: str):
    aluno = find_student_by_user_id(user_id)

    if not aluno:
        return {"ok": False, "message": "Aluno não encontrado para esse userID"}

    return {"ok": True, "aluno": aluno}