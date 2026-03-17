from app.core.database import materias_collection

def find_subjects_by_school(escola_id: str):
    return list(materias_collection.find({"escolaID": escola_id}, {"nome": 1, "rota": 1}))