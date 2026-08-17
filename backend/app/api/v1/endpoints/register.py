from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
import cloudinary.uploader

from app.core.database import usuarios_collection, alunos_collection
from app.core.security import hash_password

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
    # 1. Valida se o email já existe
    clean_email = email.lower().strip()
    if usuarios_collection.find_one({"email": clean_email}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este e-mail já está cadastrado.",
        )

    # 2. Valida se o CPF já existe
    clean_cpf = "".join(filter(str.isdigit, cpf))
    if alunos_collection.find_one({"cpf": clean_cpf}):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este CPF já está cadastrado.",
        )

    # 3. Upload da Foto do Rosto no Cloudinary (pasta luna_uploads/alunos)
    try:
        rosto_upload = cloudinary.uploader.upload(
            fotoRosto.file,
            folder="luna_uploads/alunos",
            resource_type="image",
        )
        url_foto_aluno = rosto_upload.get("secure_url")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Falha ao enviar foto do aluno ao Cloudinary: {str(e)}",
        )

    # 4. Upload dos Laudos no Cloudinary
    urls_laudos = []
    for laudo in laudos:
        try:
            laudo_upload = cloudinary.uploader.upload(
                laudo.file,
                folder="luna_uploads/alunos",
                resource_type="auto",
            )
            urls_laudos.append(laudo_upload.get("secure_url"))
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Falha ao enviar arquivo de laudo: {str(e)}",
            )

    # 5. Inserir na tabela 'usuarios'
    now = datetime.utcnow()
    hashed_pwd = hash_password(senha)

    usuario_doc = {
        "email": clean_email,
        "senha": hashed_pwd,
        "tipoUser": "aluno",
        "createdAt": now,
        "updatedAt": now,
        "__v": 0,
    }
    user_result = usuarios_collection.insert_one(usuario_doc)
    user_id = user_result.inserted_id

    # 6. Formatação da Data de Nascimento
    try:
        data_nasc_dt = datetime.fromisoformat(dataNascimento.replace("Z", "+00:00"))
    except Exception:
        try:
            data_nasc_dt = datetime.strptime(dataNascimento, "%Y-%m-%d")
        except Exception:
            data_nasc_dt = now

    # 7. Inserir na tabela 'alunos'
    aluno_doc = {
        "usuarioId": user_id,
        "turmaId": None,
        "nome": nome.strip(),
        "cpf": clean_cpf,
        "dataNasc": data_nasc_dt,
        "telefone": "".join(filter(str.isdigit, telefone)),
        "email": clean_email,
        "nomeResponsavel": nomeResponsavel.strip(),
        "cpfResponsavel": "".join(filter(str.isdigit, cpfResponsavel)),
        "urlFotoAluno": url_foto_aluno,
        "urlFotoLaudo": urls_laudos[0] if urls_laudos else None,
        "urlsLaudos": urls_laudos,
        "hiperfoco": hiperfoco.strip() if hiperfoco else None,
        "createdAt": now,
        "updatedAt": now,
        "__v": 0,
    }
    alunos_collection.insert_one(aluno_doc)

    return {
        "ok": True,
        "message": "Aluno cadastrado com sucesso!",
        "userId": str(user_id),
    }
