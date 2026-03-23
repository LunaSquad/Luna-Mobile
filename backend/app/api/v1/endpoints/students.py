from fastapi import APIRouter
from app.services.studentService import get_student_by_user_id

router = APIRouter()

@router.get("/aluno/{user_id}")
def get_student(user_id: str):
    return get_student_by_user_id(user_id)