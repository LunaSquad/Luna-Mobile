from app.core.database import planos_collection

def find_lesson_plans_by_subject(materia_id: str):
    planos = list(planos_collection.find({"materiaID": materia_id}))

    for plano in planos:
        plano["idPlano"] = str(plano["_id"])
        del plano["_id"]

    return planos