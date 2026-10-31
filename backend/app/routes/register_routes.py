from typing import List, Optional
from fastapi import APIRouter, File, Form, UploadFile, status

from app.controllers import register_controller

router = APIRouter()


@router.post("/student", status_code=status.HTTP_201_CREATED)
async def register_student(
    nome: str = Form(...),
    nomeResponsavel: str = Form(...),
    cpf: str = Form(...),
    cpfResponsavel: str = Form(...),
    dataNascimento: str = Form(...),
    email: str = Form(...),
    telefone: str = Form(...),
    hiperfoco: Optional[str] = Form(None),
    senha: str = Form(...),
    fotoRosto: UploadFile = File(...),
    laudos: List[UploadFile] = File(...),
):
    return register_controller.register_student(
        nome,
        nomeResponsavel,
        cpf,
        cpfResponsavel,
        dataNascimento,
        email,
        telefone,
        hiperfoco,
        senha,
        fotoRosto,
        laudos,
    )
