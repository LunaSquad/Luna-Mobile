from app.ai.inference.predictor import escolher_molde
from app.ai.inference.promptBuilder import gerar_prompt


def gerar_conteudo_ia(plano: str, hiperfoco: str):
    molde = escolher_molde(plano, hiperfoco)
    prompt = gerar_prompt(molde, hiperfoco)

    return {
        "ok": True,
        "molde": molde,
        "prompt": prompt
    }