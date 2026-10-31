from fastapi import APIRouter
from app.controllers import subject_controller

router = APIRouter()

@router.get("/materias")
def get_subjects():
    return subject_controller.listar_materias()
