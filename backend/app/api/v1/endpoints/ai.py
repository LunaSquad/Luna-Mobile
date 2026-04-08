from fastapi import APIRouter, HTTPException
from app.schemas.ai import AdaptarPlanoRequest
from app.services.aiService import adaptar_plano
from app.services.pdf_service import ler_e_estruturar_plano

router = APIRouter(prefix="/ai", tags=["IA"])


@router.post("/adaptar")
def adaptar(request: AdaptarPlanoRequest):
    return adaptar_plano(request.plano, request.hiperfoco)


@router.get("/testar-leitura-pdf")
def testar_leitura_pdf():
    try:
        plano = ler_e_estruturar_plano()

        return {
            "ok": True,
            "message": "PDF lido com sucesso",
            "plano_extraido": plano,
        }

    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Erro ao ler PDF: {str(e)}"
        )