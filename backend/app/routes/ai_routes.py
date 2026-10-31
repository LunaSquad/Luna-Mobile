from fastapi import APIRouter

from app.controllers import ai_controller
from app.schemas.ai_schema import AdaptarPlanoComOpcoesRequest, GerarAssetsRequest

router = APIRouter()


@router.post("/adaptar-plano")
def adaptar_plano_endpoint(body: AdaptarPlanoComOpcoesRequest):
    return ai_controller.adaptar_plano(body)


@router.post("/gerar-assets-visuais")
def gerar_assets_endpoint(request: GerarAssetsRequest):
    return ai_controller.gerar_assets(request)


@router.delete("/resetar-cache-aluno/{aluno_id}")
def resetar_cache_aluno(aluno_id: str):
    return ai_controller.resetar_cache_aluno(aluno_id)
