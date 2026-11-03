import io
import json
import urllib.parse
import requests
from PIL import Image
import cloudinary
import cloudinary.uploader
import google.generativeai as genai

from app.core.config import (
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    GEMINI_API_KEY,
    GEMINI_MODEL,
)

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True,
    )

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

MAPA_TEMAS_IA = {
    "dinossauros": {
        "bg": "masterpiece 2D flat vector mobile game background illustration, vibrant prehistoric valley with a smoking volcano in the distance, sparkling waterfall, lush green palm trees, warm golden sunset sky, crisp vector lines, Khan Academy Kids art style",
        "stickers": [
            "cute friendly 2D cartoon T-Rex dinosaur character, full body, vibrant green, game sticker",
            "cute friendly 2D cartoon Brachiosaurus dinosaur character, full body, game sticker",
            "cute 2D cartoon spotted dinosaur egg in a nest, game icon sticker",
        ],
    },
    "dinossauro": {
        "bg": "masterpiece 2D flat vector mobile game background illustration, vibrant prehistoric valley with a smoking volcano in the distance, sparkling waterfall, lush green palm trees, warm golden sunset sky, crisp vector lines, Khan Academy Kids art style",
        "stickers": [
            "cute friendly 2D cartoon T-Rex dinosaur character, full body, vibrant green, game sticker",
            "cute friendly 2D cartoon Brachiosaurus dinosaur character, full body, game sticker",
            "cute 2D cartoon spotted dinosaur egg in a nest, game icon sticker",
        ],
    },
    "borboletas": {
        "bg": "masterpiece 2D flat vector mobile game background illustration, magical enchanted flower garden with colorful butterflies in the sky, blooming pink flowers and green hills, sparkling sunlight, Khan Academy Kids art style",
        "stickers": [
            "cute vibrant 2D cartoon blue and pink butterfly with sparkling wings, game sticker",
            "cute vibrant 2D cartoon monarch orange butterfly smiling, game sticker",
            "cute 2D cartoon blooming pink hibiscus flower, game icon sticker",
        ],
    },
    "borboleta": {
        "bg": "masterpiece 2D flat vector mobile game background illustration, magical enchanted flower garden with colorful butterflies in the sky, blooming pink flowers and green hills, sparkling sunlight, Khan Academy Kids art style",
        "stickers": [
            "cute vibrant 2D cartoon blue and pink butterfly with sparkling wings, game sticker",
            "cute vibrant 2D cartoon monarch orange butterfly smiling, game sticker",
            "cute 2D cartoon blooming pink hibiscus flower, game icon sticker",
        ],
    },
    "video game": {
        "bg": "masterpiece 16-bit pixel art retro arcade platformer night landscape, vibrant neon purple mountains, floating pixel grass platforms, big cyan synthwave moon, glowing stars, high contrast",
        "stickers": [
            "cute 2D cartoon friendly arcade robot character, game sticker",
            "cute 2D cartoon glowing video game controller, game sticker",
            "cute 2D cartoon shiny golden arcade coin, game icon sticker",
        ],
    },
    "minecraft": {
        "bg": "masterpiece vibrant voxel 3d block world landscape, sunny green blocky hills, blocky oak trees, bright blue sky with voxel clouds, high contrast",
        "stickers": [
            "cute 2D voxel style diamond pickaxe, game sticker",
            "cute 2D voxel style glowing blue diamond gem, game sticker",
            "cute 2D voxel style grass block cube, game icon sticker",
        ],
    },
    "espaço": {
        "bg": "masterpiece vibrant 2D vector outer space game background, glowing neon Saturn planet, colorful nebula, bright stars, synthwave space horizon",
        "stickers": [
            "cute 2D cartoon red and white space rocket ship, game sticker",
            "cute 2D cartoon colorful ringed Saturn planet, game sticker",
            "cute 2D cartoon glowing golden star, game icon sticker",
        ],
    },
    "carros": {
        "bg": "masterpiece vibrant 2D vector cartoon racing track stadium landscape, green hills, colorful flags, sunny blue sky",
        "stickers": [
            "cute 2D cartoon red formula racing car, game sticker",
            "cute 2D cartoon golden winner trophy cup, game sticker",
            "cute 2D cartoon blue off-road racing truck, game icon sticker",
        ],
    },
    "princesas": {
        "bg": "masterpiece vibrant 2D vector magical fairytale kingdom landscape, pink and gold castle in the distance, waterfall, pastel rainbow sky",
        "stickers": [
            "cute 2D cartoon magical white unicorn with rainbow mane, game sticker",
            "cute 2D cartoon golden princess crown with pink gems, game sticker",
            "cute 2D cartoon fairy magic wand with star, game icon sticker",
        ],
    },
    "futebol": {
        "bg": "masterpiece vibrant 2D vector sunny green soccer stadium field game background, bright stadium lights, blue sky",
        "stickers": [
            "cute 2D cartoon classic soccer ball, game sticker",
            "cute 2D cartoon golden championship trophy, game sticker",
            "cute 2D cartoon gold winner medal with ribbon, game icon sticker",
        ],
    },
}


def obter_prompts_ia_para_hiperfoco(hiperfoco: str) -> dict:
    chave = (hiperfoco or "dinossauros").strip().lower()
    for nome_tema, dados in MAPA_TEMAS_IA.items():
        if nome_tema in chave or chave in nome_tema:
            return dados

    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(GEMINI_MODEL)
            prompt = (
                f'Create English image generation prompts for a children educational game themed around "{hiperfoco}". '
                'Return ONLY a valid JSON object with keys: "bg" (a 2D flat vector mobile game background landscape description) '
                'and "stickers" (a list of exactly 3 short descriptions of cute 2D cartoon characters/objects from this theme).'
            )
            resp = model.generate_content(prompt)
            texto = (
                resp.text.strip()
                .removeprefix("```json")
                .removeprefix("```")
                .removesuffix("```")
                .strip()
            )
            dados_json = json.loads(texto)
            if (
                isinstance(dados_json, dict)
                and dados_json.get("bg")
                and isinstance(dados_json.get("stickers"), list)
                and len(dados_json["stickers"]) >= 3
            ):
                return {
                    "bg": str(dados_json["bg"]),
                    "stickers": [str(s) for s in dados_json["stickers"][:3]],
                }
        except Exception as e:
            print(f"Aviso ao gerar prompts de imagem com Gemini: {e}")

    return {
        "bg": f"masterpiece vibrant 2D flat vector mobile game background landscape themed around {chave}, cute cartoon style, crisp vector art, high contrast, no text",
        "stickers": [
            f"cute 2D cartoon main character of {chave}, vibrant colors, game sticker",
            f"cute 2D cartoon secondary character of {chave}, vibrant colors, game sticker",
            f"cute 2D cartoon collectible item of {chave}, vibrant colors, game icon sticker",
        ],
    }


def remover_fundo_sticker(img_bytes: bytes) -> bytes:
    try:
        from rembg import remove

        sem_fundo = remove(img_bytes)
        img = Image.open(io.BytesIO(sem_fundo)).convert("RGBA")
        out = io.BytesIO()
        img.save(out, format="PNG")
        return out.getvalue()
    except Exception:
        try:
            img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
            datas = img.getdata()
            nova_data = []
            for item in datas:
                if item[0] > 240 and item[1] > 240 and item[2] > 240:
                    nova_data.append((255, 255, 255, 0))
                else:
                    nova_data.append(item)
            img.putdata(nova_data)
            out = io.BytesIO()
            img.save(out, format="PNG")
            return out.getvalue()
        except Exception:
            return img_bytes


def baixar_imagem_pollinations(
    prompt_en: str, width: int, height: int, seed: int
) -> bytes | None:
    headers = {"User-Agent": "Mozilla/5.0"}
    prompt_quoted = urllib.parse.quote(prompt_en)
    urls_tentativa = [
        f"[https://image.pollinations.ai/prompt/](https://image.pollinations.ai/prompt/){prompt_quoted}?width={width}&height={height}&nologo=true&model=flux&seed={seed}",
        f"[https://image.pollinations.ai/prompt/](https://image.pollinations.ai/prompt/){prompt_quoted}?width={width}&height={height}&nologo=true&seed={seed}",
    ]
    for url in urls_tentativa:
        try:
            resp = requests.get(url, headers=headers, timeout=40)
            if resp.status_code == 200 and len(resp.content) > 1000:
                return resp.content
        except Exception as e:
            print(f"Aviso tentativa Pollinations: {e}")
    return None


def gerar_assets_visuais_ia(hiperfoco: str) -> list[str]:
    prompts = obter_prompts_ia_para_hiperfoco(hiperfoco)
    cenario_en = prompts["bg"]
    stickers_prompts = prompts["stickers"]

    prompt_bg_completo = f"{cenario_en}, vertical mobile game wallpaper, 8k resolution, no text, no watermark"
    url_bg_fallback = (
        f"[https://image.pollinations.ai/prompt/](https://image.pollinations.ai/prompt/){urllib.parse.quote(prompt_bg_completo)}"
        "?width=1080&height=1920&nologo=true&seed=8088"
    )

    url_bg_final = url_bg_fallback
    bytes_bg = baixar_imagem_pollinations(prompt_bg_completo, 1080, 1920, 8088)
    if bytes_bg:
        try:
            img_bg = Image.open(io.BytesIO(bytes_bg)).convert("RGB")
            buf_bg = io.BytesIO()
            img_bg.save(buf_bg, format="JPEG", quality=90)
            buf_bg.seek(0)
            res_bg = cloudinary.uploader.upload(
                buf_bg,
                folder="luna_assets/hiperfocos/backgrounds",
                resource_type="image",
            )
            url_bg_final = res_bg["secure_url"]
        except Exception as e:
            print(f"Aviso no upload do background para Cloudinary: {e}")

    urls_stickers_finais = []
    for idx, st_prompt in enumerate(stickers_prompts[:3]):
        prompt_st_completo = (
            f"{st_prompt}, isolated on solid pure white background, centered, "
            "clean vector cartoon illustration, no shadow, no text, no watermark"
        )
        bytes_st = baixar_imagem_pollinations(prompt_st_completo, 512, 512, 8090 + idx)
        if bytes_st:
            try:
                bytes_transparente = remover_fundo_sticker(bytes_st)
                buf_st = io.BytesIO(bytes_transparente)
                buf_st.seek(0)
                res_st = cloudinary.uploader.upload(
                    buf_st,
                    folder="luna_assets/hiperfocos/stickers",
                    format="png",
                    resource_type="image",
                )
                urls_stickers_finais.append(res_st["secure_url"])
                continue
            except Exception as e:
                print(f"Aviso no upload do sticker {idx + 1} para Cloudinary: {e}")

        url_st_fallback = (
            f"[https://image.pollinations.ai/prompt/](https://image.pollinations.ai/prompt/){urllib.parse.quote(prompt_st_completo)}"
            f"?width=512&height=512&nologo=true&seed={8090 + idx}"
        )
        urls_stickers_finais.append(url_st_fallback)

    return [
        url_bg_final,
        urls_stickers_finais[0],
        urls_stickers_finais[1],
        urls_stickers_finais[2],
    ]
