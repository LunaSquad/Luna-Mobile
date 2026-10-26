from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    students,
    subjects,
    lessonPlans,
    ai,
    register,
    activities,
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
