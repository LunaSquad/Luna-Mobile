import traceback
from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

# Importação da coleção do banco de dados
from app.core.database import atividades_collection

# Garante acesso à coleção de alunos de forma segura
try:
    from app.core.database import alunos_collection
except ImportError:
    try:
        from app.core.database import db

        alunos_collection = db.alunos
    except Exception:
        alunos_collection = atividades_collection.database["alunos"]

from app.schemas.ai import AdaptarPlanoRequest
from app.services.geminiService import adaptar_plano_com_ia
from app.services.pdf_service import ler_e_estruturar_plano

router = APIRouter()


class GerarAssetsRequest(BaseModel):
    alunoId: str
    hiperfoco: str


def to_object_id(id_val: str):
    """Converte string para ObjectId de forma segura."""
    try:
        return ObjectId(id_val)
    except Exception:
        return id_val


def serialize_mongo(document):
    """Converte ObjectId e campos do MongoDB para tipos serializáveis em JSON."""
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


@router.post("/adaptar-plano")
def adaptar_plano_endpoint(body: AdaptarPlanoRequest):
    try:
        hiperfoco = body.hiperfoco or "dinossauros"

        # 1. VERIFICAÇÃO DE CACHE NO MONGODB
        atividade_salva = atividades_collection.find_one(
            {"planoOrigemID": body.planoId, "alunoID": body.alunoId}
        )

        if atividade_salva:
            print("⚡ [CACHE] Atividade recuperada direto do banco de dados!")
            return {
                "ok": True,
                "origem": "cache_mongodb",
                "hiperfoco": hiperfoco,
                "plano_adaptado": serialize_mongo(atividade_salva),
            }

        print("🧠 [IA] Atividade nova. Iniciando extração e adaptação...")

        # 2. Extrai o texto do PDF
        plano = ler_e_estruturar_plano()

        # 3. Gera o JSON adaptado com a IA
        plano_adaptado = adaptar_plano_com_ia(plano, hiperfoco)

        # 4. Monta o documento final
        nova_atividade = {
            "planoOrigemID": body.planoId,
            "alunoID": body.alunoId,
            "turmaID": body.turmaId,
            "materiaID": body.materiaId,
            "hiperfoco": hiperfoco,
            "urlPlanoOriginal": body.urlPlanoDeAula,
            **plano_adaptado,
        }

        # 5. Salva no MongoDB
        result = atividades_collection.insert_one(nova_atividade)
        nova_atividade["_id"] = result.inserted_id

        print("✅ [MONGO] Nova atividade adaptada e salva com sucesso!")

        return {
            "ok": True,
            "origem": "ia",
            "hiperfoco": hiperfoco,
            "plano_adaptado": serialize_mongo(nova_atividade),
        }

    except Exception as e:
        print("ERRO COMPLETO EM ADAPTAR PLANO:")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/gerar-assets-visuais")
def gerar_assets_endpoint(request: GerarAssetsRequest):
    try:
        aluno_oid = to_object_id(request.alunoId)

        # 1. Busca o aluno tanto por _id quanto por usuarioId
        aluno = alunos_collection.find_one(
            {
                "$or": [
                    {"_id": aluno_oid},
                    {"usuarioId": aluno_oid},
                    {"_id": request.alunoId},
                    {"usuarioId": request.alunoId},
                ]
            }
        )

        if not aluno:
            print(f"⚠️ Aluno não encontrado para ID: {request.alunoId}")
            return {"ok": False, "message": "Aluno não encontrado."}

        # 2. Se já possuir assets gerados, retorna direto
        if aluno.get("assetsVisuais") and len(aluno["assetsVisuais"]) > 0:
            return {
                "ok": True,
                "assets": aluno["assetsVisuais"],
                "message": "Assets já existiam.",
            }

        # 3. Importa e gera os stickers com a IA
        from app.services.image_service import gerar_assets_visuais_ia

        novas_urls = gerar_assets_visuais_ia(request.hiperfoco, quantidade=4)

        if novas_urls:
            alunos_collection.update_one(
                {"_id": aluno["_id"]}, {"$set": {"assetsVisuais": novas_urls}}
            )

        return {
            "ok": True,
            "assets": novas_urls,
            "message": "Assets gerados com sucesso!",
        }

    except Exception as e:
        print("ERRO COMPLETO EM GERAR ASSETS:")
        traceback.print_exc()
        # Retorna JSON seguro para evitar quebras no frontend
        return {"ok": False, "message": str(e), "assets": []}
