from fastapi import APIRouter
from app.schemas.ai import AdaptarPlanoRequest
from app.services.aiService import adaptar_plano

router = APIRouter(prefix="/ai", tags=["IA"])


@router.post("/adaptar")
def adaptar(request: AdaptarPlanoRequest):
    return adaptar_plano(request.plano, request.hiperfoco)