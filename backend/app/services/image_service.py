import requests
from rembg import remove
from PIL import Image
import io
import urllib.parse
import cloudinary.uploader


def gerar_assets_visuais_ia(hiperfoco: str, quantidade: int = 3):
    """
    Gera imagens no Pollinations, remove o fundo e faz upload no Cloudinary.
    Retorna uma lista de URLs das imagens.
    """
    urls_geradas = []

    # Formata o hiperfoco para colocar na URL (ex: "homem aranha" vira "homem%20aranha")
    tema_formatado = urllib.parse.quote(hiperfoco)

    print(f"🎨 Gerando {quantidade} assets visuais para o hiperfoco: {hiperfoco}...")

    for i in range(quantidade):
        try:
            # 1. Prompt em inglês para melhor resultado da IA Generativa
            # O parâmetro 'seed' garante que cada imagem gerada no loop seja diferente da outra
            prompt = f"A single 3D cute cartoon sticker of {tema_formatado}, isolated on a solid white background, high quality, child friendly"
            url_pollinations = f"https://image.pollinations.ai/prompt/{prompt}?width=512&height=512&nologo=true&seed={i * 1234}"

            # 2. Faz o download da imagem gerada pela IA
            response = requests.get(url_pollinations)
            img_bruta = Image.open(io.BytesIO(response.content))

            # 3. Remove o fundo usando Inteligência Artificial do rembg
            img_transparente = remove(img_bruta)

            # 4. Prepara a imagem transparente para o Cloudinary (salva em memória)
            buffer = io.BytesIO()
            img_transparente.save(buffer, format="PNG")
            buffer.seek(0)

            # 5. Faz o upload para o Cloudinary (cria uma pasta 'luna_assets')
            resultado_upload = cloudinary.uploader.upload(
                buffer, folder="luna_assets/hiperfocos"
            )

            # Salva a URL segura que o Cloudinary retornou
            urls_geradas.append(resultado_upload["secure_url"])
            print(f"✅ Asset {i+1} gerado e upado: {resultado_upload['secure_url']}")

        except Exception as e:
            print(f"❌ Erro ao gerar asset {i+1}: {e}")

    return urls_geradas
