from app.ai.inference.predictor import escolher_molde
from app.ai.inference.promptBuilder import gerar_prompt
from app.ai.inference.activity_builder import montar_atividade
from app.ai.utils.loaders import carregar_moldes


def adaptar_plano(plano: str, hiperfoco: str):
    resultado_predicao = escolher_molde(plano, hiperfoco)

    if isinstance(resultado_predicao, dict):
        molde_id = resultado_predicao["molde"]
        confianca = resultado_predicao["confianca"]
    else:
        molde_id = resultado_predicao
        confianca = None

    moldes = carregar_moldes()
    molde_completo = next((m for m in moldes if m["id"] == molde_id), None)

    prompt_imagem = gerar_prompt(molde_id, hiperfoco, plano)
    atividade = montar_atividade(molde_id, plano, hiperfoco)

    return {
        "molde_id": molde_id,
        "molde": molde_completo,
        "confianca": confianca,
        "prompt_imagem": prompt_imagem,
        "atividade": atividade
    }