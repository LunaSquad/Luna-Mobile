from app.repositories.subjectRepository import find_subjects_by_escola_id

def get_subjects_by_escola_id(escola_id: str):

    materias = find_subjects_by_escola_id(escola_id)

    return {
        "ok": True,
        "materias": materias
    }