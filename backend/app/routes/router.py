from fastapi import APIRouter
from app.routes import (
    auth_routes,
    student_routes,
    subject_routes,
    lesson_plan_routes,
    ai_routes,
    register_routes,
    activity_routes,
    feedback_routes,
)

api_router = APIRouter()

api_router.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
api_router.include_router(register_routes.router, prefix="/register", tags=["Register"])
api_router.include_router(student_routes.router, prefix="/students", tags=["Students"])
api_router.include_router(subject_routes.router, prefix="/subjects", tags=["Subjects"])
api_router.include_router(
    lesson_plan_routes.router, prefix="/lesson-plans", tags=["LessonPlans"]
)
api_router.include_router(ai_routes.router, prefix="/ai", tags=["AI"])
api_router.include_router(
    activity_routes.router, prefix="/activities", tags=["Activities"]
)
api_router.include_router(
    feedback_routes.router, prefix="/feedbacks", tags=["Feedbacks"]
)
