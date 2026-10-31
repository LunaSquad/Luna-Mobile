from typing import Any, Dict, List


def extrair_palavras_chave(plano: str) -> List[str]:
    palavras_ignoradas = {
        "de",
        "da",
        "do",
        "das",
        "dos",
        "a",
        "o",
        "as",
        "os",
        "e",
        "em",
        "para",
        "com",
        "um",
        "uma",
        "ao",
        "na",
        "no",
        "que",
        "por",
        "sobre",
        "como",
        "mais",
        "sua",
        "seu",
        "são",
        "foi",
        "entre",
        "pelo",
        "pela",
        "nos",
        "nas",
        "aos",
        "plano",
        "aula",
    }

    palavras = (
        plano.lower()
        .replace(",", "")
        .replace(".", "")
        .replace(";", "")
        .replace(":", "")
        .replace("(", "")
        .replace(")", "")
        .split()
    )
    filtradas = [p for p in palavras if p not in palavras_ignoradas and len(p) > 3]

    resultado = []
    for palavra in filtradas:
        if palavra not in resultado:
            resultado.append(palavra)

    return resultado[:12]


def detectar_tema(plano: str) -> str:
    texto = plano.lower()

    if any(
        p in texto
        for p in [
            "idade média",
            "feudalismo",
            "feudo",
            "império romano",
            "constantinopla",
            "século",
            "história",
            "historiadores",
            "nobreza",
            "clero",
            "camponeses",
            "medieval",
            "revolução",
            "brasil",
        ]
    ):
        return "História"

    if any(
        p in texto
        for p in [
            "soma",
            "subtração",
            "adição",
            "multiplicação",
            "divisão",
            "número",
            "matemática",
            "equação",
            "contagem",
            "calcular",
        ]
    ):
        return "Matemática"

    if any(
        p in texto
        for p in [
            "gramática",
            "rima",
            "poesia",
            "verbo",
            "substantivo",
            "português",
            "ortografia",
            "leitura",
            "interpretação",
            "sílaba",
        ]
    ):
        return "Língua Portuguesa"

    if any(
        p in texto
        for p in [
            "ecossistema",
            "natureza",
            "habitat",
            "ciências",
            "biologia",
            "corpo humano",
            "fotossíntese",
            "planeta",
            "animais",
        ]
    ):
        return "Ciências"

    if any(
        p in texto
        for p in [
            "relevo",
            "clima",
            "geografia",
            "território",
            "mapa",
            "continente",
            "vegetação",
        ]
    ):
        return "Geografia"

    if any(
        p in texto for p in ["arte", "desenho", "pintura", "cores", "formas", "música"]
    ):
        return "Artes"

    return "Multidisciplinar"


def selecionar_molde_ideal(plano: str, molde_predito: str = "") -> Dict[str, Any]:
    tema = detectar_tema(plano)
    texto_lower = plano.lower()

    tem_exemplo_explicito = any(
        termo in texto_lower
        for termo in [
            "exemplo:",
            "exemplo ",
            "outro exemplo",
            "por exemplo",
            "veja como",
        ]
    )
    tem_dissertativa = any(
        termo in texto_lower
        for termo in [
            "dissertativa",
            "explique",
            "com suas palavras",
            "cite pelo menos",
            "justifique",
            "descreva",
            "resposta:",
        ]
    )
    tem_multipla_escolha = any(
        termo in texto_lower
        for termo in ["múltipla escolha", "alternativa", "a)", "b)", "c)", "d)"]
    )

    if tema == "Matemática":
        nome_molde = "molde_exatas_visual_tdah"
        diretriz_molde = (
            "Adaptação Matemática TDAH: Explicação curta e visual; exemplo passo a passo concreto usando o hiperfoco; "
            "transformar todas as contas em questões interativas mantendo exatamente os mesmos números e operações."
        )
    elif tema == "História" or (tem_dissertativa and tem_multipla_escolha):
        nome_molde = "molde_humanas_narrativo_tdah"
        diretriz_molde = (
            "Adaptação Humanas/História TDAH: Dividir explicações em blocos curtos e envolventes usando metáforas do hiperfoco; "
            "criar exemplo prático conectando o conceito ao hiperfoco."
        )
    else:
        nome_molde = molde_predito or f"molde_universal_tdah_{tema.lower()}"
        diretriz_molde = (
            f"Adaptação Pedagógica Universal TDAH ({tema}): Fragmentar a teoria em blocos curtos de leitura rápida, "
            "apresentar exemplo claro ambientado no hiperfoco e converter os exercícios em desafios interativos."
        )

    return {
        "molde_usado": nome_molde,
        "tema_detectado": tema,
        "tem_exemplo_no_plano": tem_exemplo_explicito,
        "tem_dissertativa": tem_dissertativa,
        "tem_multipla_escolha": tem_multipla_escolha,
        "palavras_chave": extrair_palavras_chave(plano),
        "diretriz_molde": diretriz_molde,
    }


def montar_atividade(molde: str, plano: str, hiperfoco: str) -> Dict[str, Any]:
    info_molde = selecionar_molde_ideal(plano, molde)
    info_molde["hiperfoco"] = hiperfoco
    return info_molde
