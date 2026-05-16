def gerar_prompt(molde: str, hiperfoco: str, conteudo: str) -> str:
    temas = {
        "jogo_interativo_basico": "um cenário lúdico de videogame infantil",
        "historia_rimada_musical": "um cenário educativo com livros, notas musicais e crianças lendo",
        "aventura_dos_animais": "um ambiente de natureza com animais simpáticos e elementos educativos",
        "arte_colorida": "um cenário artístico com pincéis, tintas, formas e cores vibrantes",
        "jogo_matematico": "um ambiente divertido com números, peças de tabuleiro e desafios matemáticos"
    }

    base = temas.get(molde, "um fundo educativo e alegre para crianças")
    return (
        f"Crie uma imagem infantil educativa, colorida e amigável, mostrando {base}, "
        f"relacionada ao hiperfoco em {hiperfoco} e ao conteúdo '{conteudo}'. "
        f"A imagem deve ser apropriada para crianças com TDAH, com poucos elementos de distração "
        f"e foco visual claro."
    )