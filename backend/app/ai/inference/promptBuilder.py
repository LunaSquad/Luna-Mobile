def gerar_prompt(molde: str, hiperfoco: str) -> str:
    temas = {
        "jogo_interativo_basico": "um fundo colorido estilo videogame infantil",
        "historia_rimada_musical": "um cenário com notas musicais e livros abertos",
        "aventura_dos_animais": "um fundo de floresta com animais simpáticos",
        "arte_colorida": "um fundo artístico com pincéis e tintas coloridas",
        "jogo_matematico": "um fundo com números flutuando e tabuleiros"
    }

    base = temas.get(molde, "um fundo educativo e alegre para crianças")
    return f"Crie {base}, relacionado ao hiperfoco em {hiperfoco}."