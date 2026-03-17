from fastapi import APIRouter
from app.schemas.ai import AIRequest
from app.services.aiServices import gerar_conteudo_ia

router = APIRouter()

@router.post("/ai/gerar")
def gerar_ai(payload: AIRequest):
    return gerar_conteudo_ia(payload.plano, payload.hiperfoco)