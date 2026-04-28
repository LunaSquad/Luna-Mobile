from fastapi import APIRouter
from app.api.v1.endpoints import auth, students, subjects, lessonPlans, ai

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(students.router)
api_router.include_router(subjects.router)
api_router.include_router(lessonPlans.router)
api_router.include_router(ai.router, prefix="/ai", tags=["AI"])