from app.core.database import planos_collection

def find_lesson_plans_by_subject(materia_id: str):
    return list(planos_collection.find({"materiaID": materia_id}, {"_id": 0}))