import io
import traceback
import urllib.request
from typing import Optional
from bson import ObjectId
from fastapi import HTTPException
from pypdf import PdfReader

from app.ai_engine.inference.activity_builder import selecionar_molde_ideal
from app.ai_engine.inference.gemini_adapter import (
    adaptar_plano_com_ia,
    normalizar_plano_adaptado,
)
from app.ai_engine.inference.image_generator import gerar_assets_visuais_ia
from app.models.activity_model import (
    find_adapted_activity,
    delete_activity_by_id,
    insert_activity,
    delete_activities_by_student,
)
from app.models.student_model import (
    buscar_aluno_flexivel,
    update_student_visual_assets,
    reset_student_visual_assets,
)
from app.schemas.ai_schema import AdaptarPlanoComOpcoesRequest, GerarAssetsRequest
from app.utils.pdf_reader import ler_e_estruturar_plano

VERSAO_ATUAL_CACHE = "v4_gamificado"


def serialize_mongo(document):
    if not document:
        return None
    if isinstance(document, list):
        return [serialize_mongo(item) for item in document]
    if isinstance(document, dict):
        doc = {}
        for key, value in document.items():
            if isinstance(value, ObjectId):
                doc[key] = str(value)
            elif isinstance(value, dict):
                doc[key] = serialize_mongo(value)
            elif isinstance(value, list):
                doc[key] = [serialize_mongo(i) for i in value]
            else:
                doc[key] = value
        return doc
    return document


def assets_sao_transparentes_atuais(atuais: list[str]) -> bool:
    if len(atuais) < 4:
        return False
    return "Animated-Fluent-Emojis" in atuais[1]


def garantir_assets_do_aluno(
    aluno_id: str, hiperfoco: str, forcar: bool = False
) -> list[str]:
    aluno = buscar_aluno_flexivel(aluno_id)
    if aluno and not forcar:
        atuais = [
            u
            for u in (aluno.get("assetsVisuais") or [])
            if isinstance(u, str) and u.startswith("http")
        ]
        if assets_sao_transparentes_atuais(atuais):
            return atuais

    novas_urls = gerar_assets_visuais_ia(hiperfoco)

    if aluno and novas_urls and len(novas_urls) >= 4:
        update_student_visual_assets(aluno["_id"], novas_urls)
    return novas_urls


def extrair_texto_pdf_da_url_ou_local(url_pdf: Optional[str]) -> dict:
    if url_pdf and url_pdf.startswith("http"):
        try:
            req = urllib.request.Request(url_pdf, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=25) as response:
                pdf_bytes = response.read()
            reader = PdfReader(io.BytesIO(pdf_bytes))
            paginas = []
            for pagina in reader.pages:
                paginas.append(pagina.extract_text() or "")
            texto_completo = "\n".join(paginas).strip()
            if texto_completo:
                return {
                    "texto_completo": texto_completo,
                    "url_origem": url_pdf,
                }
        except Exception as e:
            print(f"Aviso ao baixar PDF da URL ({url_pdf}): {e}")

    plano_local = ler_e_estruturar_plano()
    if isinstance(plano_local, str):
        return {"texto_completo": plano_local}
    return plano_local


def cache_esta_atualizado(doc: dict) -> bool:
    if not doc:
        return False
    if doc.get("versaoCache") != VERSAO_ATUAL_CACHE:
        return False
    if "topicosExplicacao" not in doc or not isinstance(
        doc.get("topicosExplicacao"), list
    ):
        return False
    atividades = doc.get("atividades", [])
    if not isinstance(atividades, list) or len(atividades) == 0:
        return False
    return True


def adaptar_plano(body: AdaptarPlanoComOpcoesRequest):
    try:
        hiperfoco = body.hiperfoco or "dinossauros"
        assets_garantidos = garantir_assets_do_aluno(
            body.alunoId, hiperfoco, bool(body.forcarRegeneracao)
        )

        atividade_salva = find_adapted_activity(body.planoId, body.alunoId)

        if (
            atividade_salva
            and not body.forcarRegeneracao
            and cache_esta_atualizado(atividade_salva)
        ):
            normalizada = normalizar_plano_adaptado(atividade_salva, hiperfoco)
            normalizada["assetsVisuais"] = assets_garantidos
            return {
                "ok": True,
                "origem": "cache_mongodb",
                "hiperfoco": hiperfoco,
                "assets": assets_garantidos,
                "plano_adaptado": serialize_mongo(normalizada),
            }

        if atividade_salva:
            delete_activity_by_id(atividade_salva["_id"])

        plano_bruto = extrair_texto_pdf_da_url_ou_local(body.urlPlanoDeAula)
        texto_plano = (
            plano_bruto.get("texto_completo", str(plano_bruto))
            if isinstance(plano_bruto, dict)
            else str(plano_bruto)
        )

        info_molde = selecionar_molde_ideal(texto_plano)
        if isinstance(plano_bruto, dict):
            plano_bruto["molde_info"] = info_molde

        plano_adaptado = adaptar_plano_com_ia(plano_bruto, hiperfoco)

        nova_atividade = {
            "planoOrigemID": body.planoId,
            "alunoID": body.alunoId,
            "turmaID": body.turmaId,
            "materiaID": body.materiaId,
            "hiperfoco": hiperfoco,
            "moldeUsado": info_molde["molde_usado"],
            "temaDetectado": info_molde["tema_detectado"],
            "urlPlanoOriginal": body.urlPlanoDeAula,
            "assetsVisuais": assets_garantidos,
            "versaoCache": VERSAO_ATUAL_CACHE,
            **plano_adaptado,
        }

        result = insert_activity(nova_atividade)
        nova_atividade["_id"] = result.inserted_id

        return {
            "ok": True,
            "origem": "ia",
            "hiperfoco": hiperfoco,
            "assets": assets_garantidos,
            "plano_adaptado": serialize_mongo(nova_atividade),
        }

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


def gerar_assets(request: GerarAssetsRequest):
    try:
        urls = garantir_assets_do_aluno(
            request.alunoId,
            request.hiperfoco or "dinossauros",
            bool(request.forcarRegeneracao),
        )
        return {
            "ok": True,
            "assets": urls,
            "message": "Assets prontos!",
        }
    except Exception as e:
        traceback.print_exc()
        return {"ok": False, "message": str(e), "assets": []}


def resetar_cache_aluno(aluno_id: str):
    reset_student_visual_assets(aluno_id)
    delete_activities_by_student(aluno_id)
    return {
        "ok": True,
        "message": "Assets visuais e atividades em cache resetados com sucesso!",
    }
