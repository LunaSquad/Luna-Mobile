from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


BASE_DIR = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = BASE_DIR / "data" / "outputs"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def quebrar_linha(texto: str, tamanho: int = 95):
    palavras = texto.split()
    linhas = []
    linha_atual = ""

    for palavra in palavras:
        teste = f"{linha_atual} {palavra}".strip()
        if len(teste) <= tamanho:
            linha_atual = teste
        else:
            linhas.append(linha_atual)
            linha_atual = palavra

    if linha_atual:
        linhas.append(linha_atual)

    return linhas


def escrever_bloco(pdf, texto: str, x: int, y: int, tamanho_linha: int = 95, espacamento: int = 16):
    linhas = quebrar_linha(texto, tamanho_linha)

    for linha in linhas:
        pdf.drawString(x, y, linha)
        y -= espacamento
        if y < 50:
            pdf.showPage()
            pdf.setFont("Helvetica", 11)
            y = 800

    return y


def gerar_pdf_adaptado(dados: dict, nome_arquivo: str = "plano_adaptado.pdf") -> str:
    caminho = OUTPUT_DIR / nome_arquivo

    pdf = canvas.Canvas(str(caminho), pagesize=A4)
    largura, altura = A4
    y = altura - 50

    pdf.setTitle("Plano de Aula Adaptado")
    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, "Plano de Aula Adaptado")
    y -= 30

    pdf.setFont("Helvetica", 11)

    campos_iniciais = [
        f"Título adaptado: {dados.get('tituloAdaptado', '')}",
        f"Tema original: {dados.get('temaOriginal', '')}",
        f"Hiperfoco: {dados.get('hiperfoco', '')}",
    ]

    for campo in campos_iniciais:
        y = escrever_bloco(pdf, campo, 50, y)
        y -= 6

    y -= 10
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(50, y, "Explicação Adaptada")
    y -= 22

    pdf.setFont("Helvetica", 11)
    y = escrever_bloco(pdf, dados.get("explicacaoAdaptada", ""), 50, y)
    y -= 20

    atividades = dados.get("atividades", [])

    for i, atividade in enumerate(atividades, start=1):
        if y < 140:
            pdf.showPage()
            pdf.setFont("Helvetica", 11)
            y = 800

        pdf.setFont("Helvetica-Bold", 13)
        pdf.drawString(50, y, f"Atividade {i}: {atividade.get('titulo', '')}")
        y -= 22

        pdf.setFont("Helvetica", 11)
        conteudo = atividade.get("conteudoAdaptado", "")
        if conteudo:
            y = escrever_bloco(pdf, conteudo, 50, y)
            y -= 10

        questoes = atividade.get("questoes", [])
        for j, questao in enumerate(questoes, start=1):
            pergunta = questao.get("pergunta", "")
            resposta = questao.get("respostaCorreta", "")

            y = escrever_bloco(pdf, f"{j}. {pergunta}", 60, y)
            y = escrever_bloco(pdf, f"Resposta correta: {resposta}", 80, y)
            y -= 8

        y -= 12

    pdf.save()
    return str(caminho)