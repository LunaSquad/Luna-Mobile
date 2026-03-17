from fastapi import APIRouter
from app.api.v1.endpoints import auth, students, subjects, lessonPlans

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(students.router, tags=["students"])
api_router.include_router(subjects.router, tags=["subjects"])
api_router.include_router(lessonPlans.router, tags=["lesson_plans"])