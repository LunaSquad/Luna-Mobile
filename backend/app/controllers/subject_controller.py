from app.models.subject_model import find_subjects_by_escola_id, find_all_subjects

def get_subjects_by_escola_id(escola_id: str):

    materias = find_subjects_by_escola_id(escola_id)

    return {
        "ok": True,
        "materias": materias
    }


def listar_materias():
    try:
        materias = find_all_subjects()

        for materia in materias:
            materia["_id"] = str(materia["_id"])

        return {
            "ok": True,
            "materias": materias
        }

    except Exception as e:
        return {
            "ok": False,
            "message": str(e)
        }
