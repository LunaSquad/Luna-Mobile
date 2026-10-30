from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    students,
    subjects,
    lessonPlans,
    ai,
    register,
    activities,
    feedback,  # 1. Adicionamos a importação do arquivo feedback.py aqui
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(register.router, prefix="/register", tags=["Register"])
api_router.include_router(students.router, prefix="/students", tags=["Students"])
api_router.include_router(subjects.router, prefix="/subjects", tags=["Subjects"])
api_router.include_router(
    lessonPlans.router, prefix="/lesson-plans", tags=["LessonPlans"]
)
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])
api_router.include_router(activities.router, prefix="/activities", tags=["Activities"])

# 2. Registramos a rota para que o aplicativo possa acessá-la
api_router.include_router(feedback.router, prefix="/feedbacks", tags=["Feedbacks"])
