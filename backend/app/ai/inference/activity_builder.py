from typing import Any, Dict, List


def extrair_palavras_chave(plano: str) -> List[str]:
    """
    Extrai algumas palavras-chave simples do plano.
    Essa versão é básica e pode ser melhorada depois.
    """
    palavras_ignoradas = {
        "de", "da", "do", "das", "dos", "a", "o", "as", "os",
        "e", "em", "para", "com", "um", "uma", "ao", "na", "no",
        "que", "por", "sobre"
    }

    palavras = plano.lower().replace(",", "").replace(".", "").split()
    filtradas = [p for p in palavras if p not in palavras_ignoradas and len(p) > 2]

    # remove duplicadas mantendo ordem
    resultado = []
    for palavra in filtradas:
        if palavra not in resultado:
            resultado.append(palavra)

    return resultado[:8]


def detectar_tema(plano: str) -> str:
    """
    Detecta o tema principal de forma simples com base em palavras do plano.
    """
    texto = plano.lower()

    if any(p in texto for p in ["soma", "subtração", "adição", "multiplicação", "divisão", "número", "matemática"]):
        return "matemática"

    if any(p in texto for p in ["leitura", "rima", "poesia", "texto", "história", "português", "interpretação"]):
        return "português"

    if any(p in texto for p in ["animal", "animais", "natureza", "habitat", "ciências", "biologia"]):
        return "ciências"

    if any(p in texto for p in ["arte", "desenho", "pintura", "cores", "formas"]):
        return "arte"

    return "geral"


def montar_quiz_matematica(hiperfoco: str) -> Dict[str, Any]:
    return {
        "titulo": f"Missão dos Números com {hiperfoco.title()}",
        "tipo": "quiz",
        "descricao": (
            f"Uma atividade em formato de quiz, adaptada para uma criança com hiperfoco em {hiperfoco}, "
            "trabalhando operações matemáticas de forma lúdica."
        ),
        "conteudo": {
            "perguntas": [
                {
                    "pergunta": "Quanto é 2 + 3?",
                    "alternativas": ["4", "5", "6"],
                    "correta": "5"
                },
                {
                    "pergunta": "Quanto é 7 - 2?",
                    "alternativas": ["3", "4", "5"],
                    "correta": "5"
                },
                {
                    "pergunta": "Quanto é 4 + 4?",
                    "alternativas": ["6", "8", "9"],
                    "correta": "8"
                }
            ]
        }
    }


def montar_leitura_portugues(hiperfoco: str) -> Dict[str, Any]:
    return {
        "titulo": f"Leitura Encantada sobre {hiperfoco.title()}",
        "tipo": "leitura",
        "descricao": (
            f"Uma atividade de leitura e interpretação, conectando o conteúdo com o hiperfoco em {hiperfoco}."
        ),
        "conteudo": {
            "texto": (
                f"Em um lugar muito especial, cheio de elementos ligados a {hiperfoco}, "
                "havia uma criança curiosa que adorava aprender coisas novas. "
                "A cada descoberta, ela entendia melhor o mundo ao seu redor e se divertia aprendendo."
            ),
            "perguntas": [
                {
                    "pergunta": "Sobre o que o texto fala?",
                    "resposta_esperada": f"Sobre um contexto relacionado a {hiperfoco} e aprendizagem."
                },
                {
                    "pergunta": "Como a criança se sentia ao aprender?",
                    "resposta_esperada": "Ela se sentia curiosa e feliz."
                }
            ]
        }
    }


def montar_animais_ciencias(hiperfoco: str) -> Dict[str, Any]:
    return {
        "titulo": f"Aventura dos Animais e {hiperfoco.title()}",
        "tipo": "quiz",
        "descricao": (
            f"Atividade de ciências com foco em animais e natureza, adaptada ao hiperfoco em {hiperfoco}."
        ),
        "conteudo": {
            "perguntas": [
                {
                    "pergunta": "Qual destes é um animal terrestre?",
                    "alternativas": ["Leão", "Tubarão", "Polvo"],
                    "correta": "Leão"
                },
                {
                    "pergunta": "Onde os peixes vivem?",
                    "alternativas": ["No céu", "Na água", "Na floresta"],
                    "correta": "Na água"
                },
                {
                    "pergunta": "Qual animal pode voar?",
                    "alternativas": ["Pássaro", "Cachorro", "Cavalo"],
                    "correta": "Pássaro"
                }
            ]
        }
    }


def montar_arte_colorida(hiperfoco: str) -> Dict[str, Any]:
    return {
        "titulo": f"Criando com Cores e {hiperfoco.title()}",
        "tipo": "arte",
        "descricao": (
            f"Atividade artística com estímulos visuais adaptados ao hiperfoco em {hiperfoco}."
        ),
        "conteudo": {
            "instrucoes": [
                f"Observe os elementos relacionados a {hiperfoco}.",
                "Escolha três cores para representar a atividade.",
                "Desenhe ou pinte formas inspiradas no conteúdo estudado."
            ],
            "proposta": (
                f"Crie um desenho usando elementos do conteúdo e também referências a {hiperfoco}."
            )
        }
    }


def montar_jogo_matematico(hiperfoco: str) -> Dict[str, Any]:
    return {
        "titulo": f"Desafio Matemático de {hiperfoco.title()}",
        "tipo": "jogo",
        "descricao": (
            f"Atividade em formato de desafio matemático, conectando números ao hiperfoco em {hiperfoco}."
        ),
        "conteudo": {
            "fases": [
                {
                    "fase": 1,
                    "desafio": "Resolva: 3 x 2",
                    "resposta": "6"
                },
                {
                    "fase": 2,
                    "desafio": "Resolva: 10 ÷ 2",
                    "resposta": "5"
                },
                {
                    "fase": 3,
                    "desafio": "Resolva: 5 x 5",
                    "resposta": "25"
                }
            ]
        }
    }


def montar_atividade_generica(plano: str, hiperfoco: str) -> Dict[str, Any]:
    palavras_chave = extrair_palavras_chave(plano)

    return {
        "titulo": f"Atividade Adaptada sobre {hiperfoco.title()}",
        "tipo": "atividade_generica",
        "descricao": (
            f"Atividade adaptada com base no plano de aula e no hiperfoco em {hiperfoco}."
        ),
        "conteudo": {
            "resumo_plano": plano,
            "palavras_chave": palavras_chave,
            "proposta": (
                f"Desenvolver uma atividade educativa relacionada ao plano informado, "
                f"conectando o conteúdo ao hiperfoco em {hiperfoco}."
            )
        }
    }


def montar_atividade(molde: str, plano: str, hiperfoco: str) -> Dict[str, Any]:
    """
    Monta a atividade com base no molde escolhido.
    """
    tema = detectar_tema(plano)

    if molde == "jogo_interativo_basico":
        return montar_quiz_matematica(hiperfoco)

    if molde == "historia_rimada_musical":
        return montar_leitura_portugues(hiperfoco)

    if molde == "aventura_dos_animais":
        return montar_animais_ciencias(hiperfoco)

    if molde == "arte_colorida":
        return montar_arte_colorida(hiperfoco)

    if molde == "jogo_matematico":
        return montar_jogo_matematico(hiperfoco)

    # fallback
    atividade = montar_atividade_generica(plano, hiperfoco)
    atividade["tema_detectado"] = tema
    atividade["molde_usado"] = molde
    return atividade