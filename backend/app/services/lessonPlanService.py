from app.repositories.lessonPlanRepository import find_lesson_plans_by_subject

def get_lesson_plans_by_subject(materia_id: str):
    lista = find_lesson_plans_by_subject(materia_id)
    return {"ok": True, "planos": lista}