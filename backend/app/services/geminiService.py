import json
import google.generativeai as genai
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL


if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY não definida no .env")


genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel(GEMINI_MODEL)


def limpar_json_resposta(texto: str) -> str:
    texto = texto.strip()

    if texto.startswith("```json"):
        texto = texto[7:]
    elif texto.startswith("```"):
        texto = texto[3:]

    if texto.endswith("```"):
        texto = texto[:-3]

    return texto.strip()


def adaptar_plano_com_ia(plano: dict, hiperfoco: str) -> dict:
    prompt = f"""
Você é um especialista em educação infantil e adaptação pedagógica para crianças com TDAH.

Objetivo:
Adaptar o plano de aula abaixo para o hiperfoco da criança.

Regras IMPORTANTES:
- NÃO alterar o conteúdo pedagógico.
- NÃO alterar respostas corretas.
- NÃO alterar os números das contas.
- Adaptar apenas o contexto, personagens, objetos e linguagem.
- Linguagem simples, infantil e clara.
- Pode usar elementos específicos do hiperfoco, mas sem dificultar a compreensão.
- Não use markdown.
- Não use blocos de código.
- Retorne APENAS JSON válido.

Regras obrigatórias sobre atividades:
- TODA atividade deve ter pelo menos uma questão dentro do campo "questoes".
- Nunca retorne "questoes": [].
- O campo "conteudoAdaptado" deve conter apenas uma introdução curta da atividade.
- NÃO coloque questões dentro de "conteudoAdaptado".
- Se a atividade original tiver contas no texto, transforme cada conta em uma questão.
- Se a atividade original tiver linhas com "_____", transforme cada linha em uma questão.
- Se a atividade original tiver alternativas, coloque as alternativas no campo "alternativas".
- Cada questão deve ter "pergunta", "respostaCorreta" e "alternativas".
- Quando não for uma questão de múltipla escolha, use "alternativas": [].
- Para questões de soma, mantenha a resposta matemática correta.
- Preserve a quantidade de atividades do plano original.

Formato obrigatório:
{{
  "tituloAdaptado": "string",
  "temaOriginal": "string",
  "hiperfoco": "string",
  "explicacaoAdaptada": "string",
  "atividades": [
    {{
      "titulo": "string",
      "conteudoAdaptado": "string",
      "questoes": [
        {{
          "pergunta": "string",
          "respostaCorreta": "string",
          "alternativas": []
        }}
      ]
    }}
  ]
}}

Exemplo correto de atividade:
{{
  "titulo": "Atividade 1 — Soma com Dinossauros",
  "conteudoAdaptado": "Observe os dinossauros e resolva as somas.",
  "questoes": [
    {{
      "pergunta": "2 T-Rex + 1 T-Rex = ?",
      "respostaCorreta": "3",
      "alternativas": []
    }},
    {{
      "pergunta": "1 Tricerátops + 2 Tricerátops = ?",
      "respostaCorreta": "3",
      "alternativas": []
    }}
  ]
}}

Plano original:
{json.dumps(plano, ensure_ascii=False, indent=2)}

Hiperfoco:
{hiperfoco}
"""

    response = model.generate_content(prompt)
    texto = limpar_json_resposta(response.text)

    try:
        plano_adaptado = json.loads(texto)
    except Exception as e:
        raise ValueError(f"Resposta inválida da IA:\n{texto}") from e

    return normalizar_plano_adaptado(plano_adaptado)


def normalizar_plano_adaptado(plano_adaptado: dict) -> dict:
    atividades = plano_adaptado.get("atividades", [])

    for atividade in atividades:
        if "questoes" not in atividade or not isinstance(atividade["questoes"], list):
            atividade["questoes"] = []

        questoes_normalizadas = []

        for questao in atividade["questoes"]:
            pergunta = str(questao.get("pergunta", "")).strip()
            resposta = str(questao.get("respostaCorreta", "")).strip()
            alternativas = questao.get("alternativas", [])

            if alternativas is None:
                alternativas = []

            if not isinstance(alternativas, list):
                alternativas = []

            if pergunta and resposta:
                questoes_normalizadas.append({
                    "pergunta": pergunta,
                    "respostaCorreta": resposta,
                    "alternativas": alternativas
                })

        atividade["questoes"] = questoes_normalizadas

    plano_adaptado["atividades"] = atividades

    return plano_adaptado