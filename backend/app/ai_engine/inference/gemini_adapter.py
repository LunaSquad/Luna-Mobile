import json
import re
import google.generativeai as genai
from app.core.config import GEMINI_API_KEY, GEMINI_MODEL
from app.ai_engine.inference.activity_builder import selecionar_molde_ideal

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY não definida no .env")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)


def prever_molde_com_modelo_local(texto_plano: str) -> str:
    try:
        from app.ai_engine.inference.predictor import prever_molde

        return str(prever_molde(texto_plano))
    except Exception:
        return ""


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
    texto_plano = (
        plano.get("texto_completo", json.dumps(plano, ensure_ascii=False))
        if isinstance(plano, dict)
        else str(plano)
    )

    molde_pkl = prever_molde_com_modelo_local(texto_plano)
    molde_info = (
        plano.get("molde_info")
        if isinstance(plano, dict) and plano.get("molde_info")
        else selecionar_molde_ideal(texto_plano, molde_pkl)
    )

    prompt = f"""
Você é um especialista em neuroeducação e gamificação para estudantes com TDAH.
O aluno possui o hiperfoco estrito em: "{hiperfoco}".

REGRAS OBRIGATÓRIAS DE ADAPTAÇÃO:
1. TODAS as explicações, exemplos e historietas DEVEM ser ambientadas exclusivamente no universo de "{hiperfoco}". 
   - NUNCA mencione animais ou elementos fora do hiperfoco.
2. Textos claros, sem quebras bruscas ou frases cortadas ("..."). Cada frase deve ser completa e envolvente.
3. SE A QUESTÃO ORIGINAL TIVER ALTERNATIVAS, mantenha-as e adapte o texto (tipo "objetiva"). 
4. SE A QUESTÃO ORIGINAL FOR ABERTA OU NÃO TIVER ALTERNATIVAS, NÃO INVENTE ALTERNATIVAS. Defina o tipo como "dissertativa" e deixe a lista de alternativas VAZIA ([]).

Retorne APENAS um JSON válido (sem markdown, sem blocos de código) seguindo estritamente esta estrutura:
{{
  "tituloAdaptado": "Título gamificado e divertido usando {hiperfoco}",
  "temaOriginal": "Tema original do plano",
  "disciplina": "{molde_info.get("tema_detectado")}",
  "moldeUsado": "{molde_info.get("molde_usado")}",
  "hiperfoco": "{hiperfoco}",
  "explicacaoTeorica": "Resumo geral amigável da explicação teórica",
  "topicosExplicacao": [
    {{
      "subtitulo": "Título curto do tópico",
      "textoAdaptado": "Explicação curta, completa e sem cortes ambientada em {hiperfoco}",
      "dicaVisual": "Dica de incentivo conectada com {hiperfoco}"
    }}
  ],
  "temExemplo": true,
  "exemploPratico": "Passo a passo do exemplo prático adaptado com {hiperfoco}",
  "topicosExemplo": [
    {{
      "titulo": "Exemplo Prático",
      "passoAPasso": "Descrição clara e visual do exemplo passo a passo",
      "conclusao": "Resultado final do exemplo"
    }}
  ],
  "atividades": [
    {{
      "titulo": "Missão na Fase",
      "conteudoAdaptado": "Instrução clara",
      "questoes": [
        {{
          "tipo": "objetiva ou dissertativa",
          "pergunta": "Enunciado completo, sem cortes, usando estritamente elementos de {hiperfoco}",
          "dicaTDAH": "Dica rápida para ajudar o aluno",
          "respostaCorreta": "Resposta correta exata",
          "alternativas": ["opção 1", "opção 2"]
        }}
      ]
    }}
  ]
}}

PLANO DE AULA ORIGINAL:
\"\"\"
{texto_plano}
\"\"\"
"""

    response = model.generate_content(prompt)
    texto = limpar_json_resposta(response.text)

    try:
        plano_adaptado = json.loads(texto)
    except Exception as e:
        raise ValueError(f"Resposta inválida da IA:\n{texto}") from e

    return normalizar_plano_adaptado(plano_adaptado, hiperfoco)


def normalizar_plano_adaptado(
    plano_adaptado: dict, hiperfoco: str = "dinossauros"
) -> dict:
    explicacao_teorica = str(
        plano_adaptado.get("explicacaoTeorica")
        or plano_adaptado.get("explicacaoAdaptada")
        or ""
    ).strip()

    plano_adaptado["explicacaoTeorica"] = explicacao_teorica
    plano_adaptado["explicacaoAdaptada"] = explicacao_teorica

    topicos = plano_adaptado.get("topicosExplicacao")
    if not isinstance(topicos, list) or len(topicos) == 0:
        topicos = [
            {
                "subtitulo": "Explicação",
                "textoAdaptado": explicacao_teorica or "Vamos aprender jogando!",
                "dicaVisual": f"Divirta-se com {hiperfoco}!",
            }
        ]
    plano_adaptado["topicosExplicacao"] = topicos

    exemplo_pratico = str(plano_adaptado.get("exemploPratico") or "").strip()
    topicos_exemplo = plano_adaptado.get("topicosExemplo")
    if not isinstance(topicos_exemplo, list):
        topicos_exemplo = []

    if not topicos_exemplo and exemplo_pratico:
        topicos_exemplo = [
            {
                "titulo": "Exemplo",
                "passoAPasso": exemplo_pratico,
                "conclusao": "Viu como é fácil?",
            }
        ]

    plano_adaptado["topicosExemplo"] = topicos_exemplo
    plano_adaptado["exemploPratico"] = exemplo_pratico
    plano_adaptado["temExemplo"] = bool(exemplo_pratico or len(topicos_exemplo) > 0)

    atividades = plano_adaptado.get("atividades")
    if not isinstance(atividades, list):
        atividades = []

    questoes_gerais = []

    for idx_atv, atividade in enumerate(atividades):
        if not isinstance(atividade, dict):
            continue
        titulo_atv = str(atividade.get("titulo") or f"Fase {idx_atv + 1}").strip()
        comando_atv = str(atividade.get("conteudoAdaptado") or "").strip()
        questoes_brutas = atividade.get("questoes")
        if not isinstance(questoes_brutas, list):
            questoes_brutas = []

        questoes_normalizadas = []

        for q in questoes_brutas:
            if not isinstance(q, dict):
                continue
            pergunta = str(q.get("pergunta") or "").strip()
            if not pergunta:
                continue

            resposta = str(q.get("respostaCorreta") or "").strip()
            dica = str(q.get("dicaTDAH") or "Leia com calma, você consegue!").strip()
            alternativas = q.get("alternativas")
            if not isinstance(alternativas, list):
                alternativas = []
            alternativas = [str(a).strip() for a in alternativas if str(a).strip()]

            tipo = str(q.get("tipo") or "").strip().lower()

            if tipo not in ["objetiva", "dissertativa"]:
                tipo = "objetiva" if len(alternativas) > 0 else "dissertativa"

            if tipo == "dissertativa":
                alternativas = []

            item_questao = {
                "tituloAtividade": titulo_atv,
                "comandoAtividade": comando_atv,
                "tipo": tipo,
                "pergunta": pergunta,
                "dicaTDAH": dica,
                "respostaCorreta": resposta or "OK",
                "alternativas": alternativas,
            }
            questoes_normalizadas.append(item_questao)
            questoes_gerais.append(item_questao)

        atividade["questoes"] = questoes_normalizadas

    plano_adaptado["atividades"] = atividades
    plano_adaptado["questoesGerais"] = questoes_gerais

    return plano_adaptado
