import json
from openai import OpenAI
from app.core.config import OPENAI_API_KEY, OPENAI_MODEL


if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY não foi definida no .env")


client = OpenAI(api_key=OPENAI_API_KEY)


def adaptar_plano_com_ia(plano: dict, hiperfoco: str) -> dict:
    prompt = f"""
Você é um especialista em educação infantil e adaptação pedagógica para crianças com TDAH.

Objetivo:
Adaptar o plano de aula abaixo para o hiperfoco da criança.

Regras IMPORTANTES:
- NÃO alterar o conteúdo pedagógico
- NÃO alterar respostas corretas
- Adaptar apenas o contexto
- Linguagem simples, infantil e clara
- Pode usar nomes específicos do hiperfoco quando fizer sentido, sem dificultar a compreensão
- Preserve a estrutura do plano
- Retorne APENAS JSON válido
- Não use markdown
- Não use blocos de código
- Não escreva explicações fora do JSON

Formato de saída obrigatório:
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
          "respostaCorreta": "string"
        }}
      ]
    }}
  ]
}}

Plano original:
{json.dumps(plano, ensure_ascii=False, indent=2)}

Hiperfoco:
{hiperfoco}
"""

    response = client.responses.create(
        model=OPENAI_MODEL,
        input=prompt
    )

    conteudo = response.output_text.strip()

    try:
        return json.loads(conteudo)
    except json.JSONDecodeError as e:
        raise ValueError(f"A IA não retornou JSON válido. Resposta recebida: {conteudo}") from e