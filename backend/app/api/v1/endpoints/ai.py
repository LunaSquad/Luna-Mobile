import json
import re
from pathlib import Path
from fastapi import APIRouter, HTTPException

from app.schemas.ai import AdaptarPlanoRequest
from app.services.pdf_service import ler_e_estruturar_plano
from app.services.geminiService import adaptar_plano_com_ia
from app.services.jsonService import salvar_json
from app.services.pdfGeneratorService import gerar_pdf_adaptado


router = APIRouter()

BASE_DIR = Path(__file__).resolve().parents[4]
OUTPUT_DIR = BASE_DIR / "data" / "outputs"


def normalizar_nome_arquivo(texto: str) -> str:
    texto = texto.lower().strip()

    substituicoes = {
        "á": "a",
        "à": "a",
        "â": "a",
        "ã": "a",
        "é": "e",
        "ê": "e",
        "í": "i",
        "ó": "o",
        "ô": "o",
        "õ": "o",
        "ú": "u",
        "ç": "c",
    }

    for original, novo in substituicoes.items():
        texto = texto.replace(original, novo)

    texto = re.sub(r"[^a-z0-9]+", "_", texto)
    texto = texto.strip("_")

    return texto or "hiperfoco"


@router.post("/adaptar-plano")
def adaptar_plano_endpoint(body: AdaptarPlanoRequest):
    try:
        hiperfoco = body.hiperfoco or "dinossauros"
        nome_hiperfoco = normalizar_nome_arquivo(hiperfoco)

        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

        arquivo_json = OUTPUT_DIR / f"plano_adaptado_{nome_hiperfoco}.json"
        arquivo_pdf = OUTPUT_DIR / f"plano_adaptado_{nome_hiperfoco}.pdf"

        if arquivo_json.exists():
            with open(arquivo_json, "r", encoding="utf-8") as f:
                plano_adaptado = json.load(f)

            return {
                "ok": True,
                "origem": "cache",
                "hiperfoco": hiperfoco,
                "json_path": str(arquivo_json),
                "pdf_path": str(arquivo_pdf),
                "plano_adaptado": plano_adaptado,
            }

        plano = ler_e_estruturar_plano()

        salvar_json("plano_extraido.json", plano)

        plano_adaptado = adaptar_plano_com_ia(plano, hiperfoco)

        json_path = salvar_json(
            f"plano_adaptado_{nome_hiperfoco}.json",
            plano_adaptado,
        )

        pdf_path = gerar_pdf_adaptado(
            plano_adaptado,
            f"plano_adaptado_{nome_hiperfoco}.pdf",
        )

        return {
            "ok": True,
            "origem": "ia",
            "hiperfoco": hiperfoco,
            "json_path": json_path,
            "pdf_path": pdf_path,
            "plano_adaptado": plano_adaptado,
        }

    except Exception as e:
        print("ERRO COMPLETO:", repr(e))
        raise HTTPException(status_code=500, detail=str(e))