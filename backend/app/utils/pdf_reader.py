import re
from pathlib import Path
from pypdf import PdfReader


BASE_DIR = Path(__file__).resolve().parent.parent
PDF_PATH = BASE_DIR / "data" / "pdfs" / "plano_de_aula.pdf"


def ler_texto_pdf(caminho_pdf: str | None = None) -> str:
    caminho = Path(caminho_pdf) if caminho_pdf else PDF_PATH

    if not caminho.exists():
        raise FileNotFoundError(f"PDF não encontrado em: {caminho}")

    reader = PdfReader(str(caminho))
    texto_paginas = []

    for pagina in reader.pages:
        texto = pagina.extract_text() or ""
        texto_paginas.append(texto)

    texto_completo = "\n".join(texto_paginas)
    return texto_completo.strip()


def extrair_campo(texto: str, campo: str) -> str:
    padrao = rf"{campo}:\s*(.+)"
    match = re.search(padrao, texto, re.IGNORECASE)
    return match.group(1).strip() if match else ""


def extrair_bloco(texto: str, inicio: str, proximos_titulos: list[str]) -> str:
    padrao_inicio = re.escape(inicio)
    padrao_fim = "|".join(re.escape(t) for t in proximos_titulos)

    padrao = rf"{padrao_inicio}\s*(.*?)(?={padrao_fim}|$)"
    match = re.search(padrao, texto, re.IGNORECASE | re.DOTALL)

    if not match:
        return ""

    return match.group(1).strip()


def limpar_lista_linhas(bloco: str) -> list[str]:
    if not bloco:
        return []

    linhas = []
    for linha in bloco.splitlines():
        linha = linha.strip()
        if not linha:
            continue

        linha = linha.replace("•", "").strip()
        if linha:
            linhas.append(linha)

    return linhas


def separar_atividades(texto: str) -> list[dict]:
    atividades = []

    padrao = r"(Atividade\s+\d+\s+—\s+.*?)(?=Atividade\s+\d+\s+—|$)"
    matches = re.findall(padrao, texto, re.IGNORECASE | re.DOTALL)

    for bloco in matches:
        linhas = [linha.strip() for linha in bloco.splitlines() if linha.strip()]
        if not linhas:
            continue

        titulo = linhas[0]
        conteudo = "\n".join(linhas[1:]).strip()

        atividades.append({
            "titulo": titulo,
            "conteudo": conteudo
        })

    return atividades


def extrair_informacoes_plano(texto: str) -> dict:
    objetivos_bloco = extrair_bloco(
        texto,
        "Objetivos de Aprendizagem",
        [
            "Habilidades Trabalhadas",
            "Explicação do Conteúdo",
            "Atividade 1",
        ],
    )

    habilidades_bloco = extrair_bloco(
        texto,
        "Habilidades Trabalhadas",
        [
            "Explicação do Conteúdo",
            "Atividade 1",
        ],
    )

    explicacao_bloco = extrair_bloco(
        texto,
        "Explicação do Conteúdo",
        [
            "Atividade 1",
            "Atividade 2",
            "Atividade 3",
            "Atividade 4",
            "Atividade 5",
        ],
    )

    plano = {
        "disciplina": extrair_campo(texto, "Disciplina"),
        "tema": extrair_campo(texto, "Tema"),
        "ano": extrair_campo(texto, "Ano"),
        "duracao": extrair_campo(texto, "Duração"),
        "professor": extrair_campo(texto, "Professor"),
        "data": extrair_campo(texto, "Data"),
        "objetivos_aprendizagem": limpar_lista_linhas(objetivos_bloco),
        "habilidades_trabalhadas": limpar_lista_linhas(habilidades_bloco),
        "explicacao_conteudo": explicacao_bloco,
        "atividades": separar_atividades(texto),
        "texto_completo": texto,
    }

    return plano


def ler_e_estruturar_plano(caminho_pdf: str | None = None) -> dict:
    texto = ler_texto_pdf(caminho_pdf)
    plano = extrair_informacoes_plano(texto)

    print("\n================= PDF LIDO COM SUCESSO =================")
    print("DISCIPLINA:", plano["disciplina"])
    print("TEMA:", plano["tema"])
    print("ANO:", plano["ano"])
    print("DURAÇÃO:", plano["duracao"])
    print("PROFESSOR:", plano["professor"])
    print("DATA:", plano["data"])
    print("\nOBJETIVOS:")
    for item in plano["objetivos_aprendizagem"]:
        print("-", item)

    print("\nHABILIDADES:")
    for item in plano["habilidades_trabalhadas"]:
        print("-", item)

    print("\nEXPLICAÇÃO DO CONTEÚDO:")
    print(plano["explicacao_conteudo"])

    print("\nATIVIDADES:")
    for atividade in plano["atividades"]:
        print(f"\n{atividade['titulo']}")
        print(atividade["conteudo"])

    print("\n=======================================================\n")

    return plano