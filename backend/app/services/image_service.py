import requests
from PIL import Image
import io
import urllib.parse
import cloudinary.uploader


def gerar_assets_visuais_ia(hiperfoco: str):
    """
    Gera 1 Background e 3 Stickers transparentes.
    Se o rembg falhar, continua rodando com imagens normais sem derrubar o servidor.
    """
    urls_geradas = []
    tema_formatado = urllib.parse.quote(hiperfoco)

    print(f"🎨 Gerando assets visuais imersivos para: {hiperfoco}...")

    # 1. GERAR O CENÁRIO DE FUNDO (Background)
    try:
        prompt_bg = f"A beautiful cute 2d cartoon mobile wallpaper background landscape of {tema_formatado}, empty, child friendly, soft colors"
        url_pollinations = f"https://image.pollinations.ai/prompt/{prompt_bg}?width=720&height=1280&nologo=true&seed=999"

        response = requests.get(url_pollinations)
        buffer_bg = io.BytesIO(response.content)

        resultado_bg = cloudinary.uploader.upload(
            buffer_bg, folder="luna_assets/hiperfocos/backgrounds"
        )
        urls_geradas.append(resultado_bg["secure_url"])
        print("✅ Background imersivo gerado!")
    except Exception as e:
        print(f"❌ Erro ao gerar background: {e}")
        urls_geradas.append("")

    # 2. GERAR 3 STICKERS (Mascote e Itens)
    for i in range(3):
        try:
            prompt_sticker = f"A single 3D cute cartoon sticker of {tema_formatado}, isolated on a solid white background, high quality, child friendly"
            url_pollinations = f"https://image.pollinations.ai/prompt/{prompt_sticker}?width=512&height=512&nologo=true&seed={i * 1234}"

            response = requests.get(url_pollinations)
            img_bruta = Image.open(io.BytesIO(response.content))

            # BLOCO DE PROTEÇÃO CONTRA CRASH DO REMBG
            try:
                from rembg import remove

                img_final = remove(img_bruta)
            except (
                BaseException
            ) as e:  # Captura inclusive o SystemExit que estava derrubando seu backend
                print(
                    f"⚠️ Aviso: Falha ao remover fundo. Usando imagem original. Erro: {e}"
                )
                img_final = img_bruta

            buffer = io.BytesIO()
            img_final.save(buffer, format="PNG")
            buffer.seek(0)

            resultado_upload = cloudinary.uploader.upload(
                buffer, folder="luna_assets/hiperfocos/stickers"
            )
            urls_geradas.append(resultado_upload["secure_url"])
            print(f"✅ Sticker {i+1} gerado!")
        except Exception as e:
            print(f"❌ Erro ao gerar sticker {i+1}: {e}")

    return urls_geradas
