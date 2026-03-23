from fastapi import APIRouter
from app.api.v1.endpoints import auth, students, subjects

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(students.router)
api_router.include_router(subjects.router)