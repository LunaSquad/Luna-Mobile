from app.models.student_model import find_student_by_user_id, update_student_turma


def get_student_by_user_id(user_id: str):
    aluno = find_student_by_user_id(user_id)

    if not aluno:
        return {"ok": False, "message": "Aluno não encontrado para esse userID"}

    return {"ok": True, "aluno": aluno}


# --- NOVA FUNÇÃO ADICIONADA ---
def vincular_aluno_turma(user_id: str, turma_id: str, codigo_acesso: str):
    # Futuramente, você pode importar o turma_model aqui para validar o codigo_acesso no banco
    sucesso = update_student_turma(user_id, turma_id)

    if sucesso:
        return {"ok": True, "message": "Aluno vinculado à turma com sucesso!"}

    return {
        "ok": False,
        "message": "Não foi possível vincular. Aluno não encontrado ou já está nessa turma.",
    }
