import io
import os
import urllib.parse
import requests
from PIL import Image
from dotenv import load_dotenv
import cloudinary
import cloudinary.uploader

load_dotenv()

CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
API_KEY = os.getenv("CLOUDINARY_API_KEY")
API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if CLOUD_NAME and API_KEY and API_SECRET:
    cloudinary.config(
        cloud_name=CLOUD_NAME,
        api_key=API_KEY,
        api_secret=API_SECRET,
        secure=True,
    )

PACK_SPRITES_TRANSPARENTES = {
    "dinossauros": [
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/T-Rex.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Sauropod.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Egg.png",
    ],
    "dinossauro": [
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/T-Rex.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Sauropod.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Food/Egg.png",
    ],
    "video game": [
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Smilies/Robot.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Coin.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Video%20Game.png",
    ],
    "minecraft": [
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Pick.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Gem%20Stone.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Crystal%20Ball.png",
    ],
    "espaço": [
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Rocket.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Star.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Ringed%20Planet.png",
    ],
    "carros": [
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Racing%20Car.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Sport%20Utility%20Vehicle.png",
    ],
    "princesas": [
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Crown.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Magic%20Wand.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Animals/Unicorn.png",
    ],
    "futebol": [
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Soccer%20Ball.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/Trophy.png",
        "https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Activities/1st%20Place%20Medal.png",
    ],
}

MAPA_CENARIOS_HD = {
    "dinossauros": "masterpiece 2D flat vector mobile game background illustration, vibrant prehistoric valley with a smoking volcano in the center distance, sparkling waterfall, lush green palm trees, warm golden sunset sky, high contrast, crisp vector lines, Khan Academy Kids art style",
    "dinossauro": "masterpiece 2D flat vector mobile game background illustration, vibrant prehistoric valley with a smoking volcano in the center distance, sparkling waterfall, lush green palm trees, warm golden sunset sky, high contrast, crisp vector lines, Khan Academy Kids art style",
    "video game": "masterpiece 16-bit pixel art retro arcade platformer night landscape, vibrant neon purple mountains, floating pixel grass platforms, golden coins, big cyan synthwave moon, glowing stars, high contrast",
    "minecraft": "masterpiece vibrant voxel 3d block world landscape, sunny green blocky hills, blocky oak trees, bright blue sky with voxel clouds, high contrast",
    "espaço": "masterpiece vibrant 2D vector outer space game background, glowing neon Saturn planet, colorful nebula, bright stars, synthwave space horizon",
    "carros": "masterpiece vibrant 2D vector cartoon racing track stadium landscape, green hills, colorful flags, sunny blue sky",
    "princesas": "masterpiece vibrant 2D vector magical fairytale kingdom landscape, pink and gold castle in the distance, waterfall, pastel rainbow sky",
    "futebol": "masterpiece vibrant 2D vector sunny green soccer stadium field game background, bright stadium lights, blue sky",
}


def gerar_assets_visuais_ia(hiperfoco: str):
    chave = (hiperfoco or "dinossauros").strip().lower()
    cenario_en = MAPA_CENARIOS_HD.get(
        chave,
        f"masterpiece vibrant 2D flat vector mobile game background landscape themed around {chave}, crisp vector art, high contrast, no text",
    )
    headers = {"User-Agent": "Mozilla/5.0"}

    prompt_bg = urllib.parse.quote(
        f"{cenario_en}, vertical mobile game wallpaper, 8k resolution, no text, no watermark"
    )
    url_bg_ia = (
        f"https://image.pollinations.ai/prompt/{prompt_bg}"
        "?width=1080&height=1920&nologo=true&model=flux&seed=8088"
    )

    url_bg_final = url_bg_ia
    try:
        response = requests.get(url_bg_ia, headers=headers, timeout=35)
        if response.status_code == 200 and len(response.content) > 1000:
            if CLOUD_NAME and API_KEY and API_SECRET:
                buffer_bg = io.BytesIO(response.content)
                resultado_bg = cloudinary.uploader.upload(
                    buffer_bg, folder="luna_assets/hiperfocos/backgrounds_hd"
                )
                url_bg_final = resultado_bg["secure_url"]
    except Exception as e:
        print(f"Aviso no upload do background: {e}")

    stickers = None
    for nome_tema, urls_tema in PACK_SPRITES_TRANSPARENTES.items():
        if nome_tema in chave or chave in nome_tema:
            stickers = urls_tema
            break

    if not stickers:
        stickers = PACK_SPRITES_TRANSPARENTES["dinossauros"]

    return [url_bg_final, stickers[0], stickers[1], stickers[2]]
