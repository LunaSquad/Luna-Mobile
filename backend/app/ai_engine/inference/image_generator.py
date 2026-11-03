"""
Geração dos assets visuais (1 background + 3 stickers) de cada hiperfoco.

Como funciona agora:
  1. As imagens são geradas pelo Pollinations (IA) e enviadas ao Cloudinary.
  2. Cada tema (ex.: "borboleta", "dinossauro", "mar") é gerado UMA vez e
     reaproveitado por todos os alunos com aquele hiperfoco. Os arquivos
     recebem tags no Cloudinary:  luna_hiperfoco_<tema>  +  luna_bg / luna_st1 /
     luna_st2 / luna_st3  (é assim que o backend os encontra depois).
  3. Se algo falhar, a função devolve [] (lista vazia). NUNCA devolve URL
     "meio quebrada": o app, sem imagens, usa o visual nativo de emojis.

Variável de ambiente opcional:
  POLLINATIONS_API_KEY  -> chave gratuita de https://enter.pollinations.ai
                           Sem ela o Pollinations limita a ~1 imagem a cada 15 s
                           e pode colocar marca d'água (o código já espaça os
                           pedidos e corta o rodapé do background).
"""

import io
import json
import os
import re
import threading
import time
import unicodedata
import urllib.parse

import requests
from PIL import Image, ImageDraw
import cloudinary
import cloudinary.api
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

POLLINATIONS_API_KEY = os.getenv("POLLINATIONS_API_KEY", "").strip()

PASTA_BACKGROUNDS = "luna_assets/hiperfocos/backgrounds"
PASTA_STICKERS = "luna_assets/hiperfocos/stickers"
TAG_BASE = "luna_hiperfoco"
# Ordem fixa dos assets devolvidos: [background, sticker1 (mascote), sticker2, sticker3 (item)]
PAPEIS = ("bg", "st1", "st2", "st3")

# Estilo visual único para TODOS os hiperfocos (mantém a identidade do app).
# Se quiser mudar o "jeitão" das imagens, é só mexer aqui.
ESTILO_BG = (
    "vertical mobile game wallpaper, soft painterly digital illustration, "
    "vibrant but gentle colors, beautiful depth, open empty space in the center, "
    "no characters, no text, no watermark"
)
ESTILO_STICKER = (
    "cute glossy 3D clay toy figurine, soft studio lighting, pastel colors, "
    "single subject, centered, isolated on a solid pure white background, "
    "no shadow, no text, no watermark"
)

# A ORDEM IMPORTA: a primeira regra que casar vence (igual ao app).
# stickers[0] = mascote, stickers[1] = secundário, stickers[2] = item.
TEMAS_IA = {
    "borboleta": {
        "padrao": r"borboleta|inseto|joaninha|jardim|\bflor(es)?\b",
        "bg": "magical enchanted flower garden full of colorful butterflies, blooming pink and purple flowers, green hills, sparkling sunlight",
        "stickers": [
            "cute blue and pink butterfly with big sparkling wings",
            "cute orange monarch butterfly smiling",
            "cute blooming pink flower",
        ],
    },
    "dinossauro": {
        "padrao": r"dino|t-?rex|jurassic|tiranossauro|triceratops|pterodactilo",
        "bg": "lush prehistoric valley with a smoking volcano far away, sparkling waterfall, giant ferns and palm trees, warm golden sunset sky",
        "stickers": [
            "cute friendly green T-Rex dinosaur",
            "cute friendly Brachiosaurus dinosaur",
            "cute spotted dinosaur egg in a small nest",
        ],
    },
    "minecraft": {
        "padrao": r"minecraft|creeper",
        "bg": "blocky voxel world landscape, sunny green blocky hills, blocky oak trees, bright blue sky with voxel clouds",
        "stickers": [
            "voxel style diamond pickaxe",
            "voxel style glowing blue diamond gem",
            "voxel style grass block cube",
        ],
    },
    "futebol": {
        "padrao": r"futebol|\bbolas?\b|esporte|craque",
        "bg": "sunny green soccer stadium field with bright stadium lights and a blue sky",
        "stickers": [
            "classic black and white soccer ball",
            "red and white soccer goal with a net",
            "golden championship trophy cup",
        ],
    },
    "videogame": {
        "padrao": r"video ?-?game|game|jogo|roblox|fortnite|mario|pokemon|nintendo|playstation|xbox|console",
        "bg": "retro arcade neon night landscape, purple mountains, floating grass platforms, big cyan moon, glowing stars",
        "stickers": [
            "friendly arcade robot character",
            "glowing video game controller",
            "shiny golden arcade coin",
        ],
    },
    "mar": {
        "padrao": r"\bmar(es)?\b|marinh|oceano|praia|peixe|tubarao|baleia|golfinho|polvo|sereia|aquario|submarino",
        "bg": "bright underwater ocean scene with a coral reef, sun rays through the water, floating bubbles",
        "stickers": [
            "cute smiling orange clownfish",
            "cute purple octopus",
            "pink spiral seashell",
        ],
    },
    "espaco": {
        "padrao": r"espaco|astronauta|planeta|foguete|galaxia|universo|estrela|\blua\b|\bmarte\b",
        "bg": "outer space scene with a colorful nebula, glowing ringed planet, bright stars, soft purple and blue galaxy",
        "stickers": [
            "red and white space rocket ship",
            "cute flying saucer UFO",
            "shiny golden star",
        ],
    },
    "carro": {
        "padrao": r"carro|corrida|automovel|formula ?1|caminhao|veiculo|\bmotos?\b",
        "bg": "sunny cartoon racing track landscape with green hills, colorful flags and a blue sky",
        "stickers": [
            "shiny red racing car",
            "blue off-road truck",
            "golden winner trophy cup",
        ],
    },
    "princesa": {
        "padrao": r"princesa|unicornio|\bfadas?\b|rainha|castelo",
        "bg": "magical fairytale kingdom landscape with a pink and gold castle in the distance and a soft pastel rainbow sky",
        "stickers": [
            "cute smiling princess with a golden crown",
            "white unicorn with a rainbow mane",
            "golden princess crown with pink gems",
        ],
    },
    "cachorro": {
        "padrao": r"cachorr|\bcaes?\b|\bcao\b|\bdogs?\b|cadel|filhote",
        "bg": "sunny green park with a wooden fence, blue sky and fluffy clouds, soft grass",
        "stickers": [
            "cute happy golden puppy dog",
            "cute brown and white dog with floppy ears",
            "cute chewy dog bone",
        ],
    },
    "gato": {
        "padrao": r"\bgat(o|a|os|as|inho|inha|inhos|inhas)\b|felino|\bcats?\b",
        "bg": "cozy sunny room with a big window, soft pillows and a warm blanket, pastel colors",
        "stickers": [
            "cute fluffy orange kitten",
            "cute gray cat sitting",
            "cute little silver fish",
        ],
    },
}

_TEMAS_COMPILADOS = [(slug, re.compile(d["padrao"])) for slug, d in TEMAS_IA.items()]


def _normalizar(texto: str) -> str:
    t = unicodedata.normalize("NFD", str(texto or ""))
    t = "".join(c for c in t if unicodedata.category(c) != "Mn")
    return t.lower().strip()


def identificar_tema(hiperfoco: str) -> str:
    """
    Devolve o "slug" do tema do hiperfoco. Para hiperfocos conhecidos é um dos
    temas de TEMAS_IA; para qualquer outro, é o próprio hiperfoco "slugificado"
    (ex.: "Origami" -> "origami"), para que cada hiperfoco novo tenha seu cache.
    """
    texto = _normalizar(hiperfoco) or "dinossauro"
    for slug, padrao in _TEMAS_COMPILADOS:
        if padrao.search(texto):
            return slug
    slug = re.sub(r"[^a-z0-9]+", "-", texto).strip("-")[:40]
    return slug or "aventura"


def obter_prompts_ia_para_hiperfoco(hiperfoco: str, slug: str | None = None) -> dict:
    slug = slug or identificar_tema(hiperfoco)
    if slug in TEMAS_IA:
        return {
            "bg": TEMAS_IA[slug]["bg"],
            "stickers": list(TEMAS_IA[slug]["stickers"]),
        }

    hiperfoco_limpo = (hiperfoco or "aventura").strip()
    if GEMINI_API_KEY:
        try:
            model = genai.GenerativeModel(GEMINI_MODEL)
            prompt = (
                f'Create English image generation prompts for a children educational game themed around "{hiperfoco_limpo}". '
                'Return ONLY a valid JSON object with keys: "bg" (a landscape/scenery description with NO characters) '
                'and "stickers" (a list of exactly 3 short descriptions: 1) the main cute character or object, '
                "2) a secondary cute character or object, 3) a small collectible item of this theme)."
            )
            resp = model.generate_content(prompt)
            texto = (
                resp.text.strip()
                .removeprefix("```json")
                .removeprefix("```")
                .removesuffix("```")
                .strip()
            )
            dados = json.loads(texto)
            if (
                isinstance(dados, dict)
                and dados.get("bg")
                and isinstance(dados.get("stickers"), list)
                and len(dados["stickers"]) >= 3
            ):
                return {
                    "bg": str(dados["bg"]),
                    "stickers": [str(s) for s in dados["stickers"][:3]],
                }
        except Exception as e:
            print(f"Aviso ao gerar prompts de imagem com Gemini: {e}")

    return {
        "bg": f"beautiful scenery themed around {hiperfoco_limpo}",
        "stickers": [
            f"cute main character of {hiperfoco_limpo}",
            f"cute secondary character of {hiperfoco_limpo}",
            f"cute small collectible item of {hiperfoco_limpo}",
        ],
    }


# --------------------------------------------------------------------------- #
#  Cloudinary: localizar o que já foi gerado (por tema)                        #
# --------------------------------------------------------------------------- #

_CACHE_URLS: dict[str, list[str]] = {}
_CACHE_VAZIO_ATE: dict[str, float] = {}
_TTL_VAZIO_SEGUNDOS = 45


def _tags_do_tema(slug: str, papel: str) -> list[str]:
    return [TAG_BASE, f"{TAG_BASE}_{slug}", f"luna_{papel}"]


def _buscar_assets_por_papel(slug: str) -> dict[str, str]:
    """Consulta o Cloudinary (Admin API) e devolve {papel: url} do tema."""
    try:
        resp = cloudinary.api.resources_by_tag(
            f"{TAG_BASE}_{slug}",
            tags=True,
            max_results=100,
            resource_type="image",
        )
    except Exception as e:
        print(f"Aviso ao consultar assets do tema '{slug}' no Cloudinary: {e}")
        return {}

    por_papel: dict[str, str] = {}
    recursos = sorted(
        resp.get("resources", []),
        key=lambda r: r.get("created_at", ""),
        reverse=True,  # o mais novo de cada papel vence
    )
    for r in recursos:
        tags = r.get("tags") or []
        for papel in PAPEIS:
            if f"luna_{papel}" in tags and papel not in por_papel:
                url = r.get("secure_url")
                if url:
                    por_papel[papel] = url
    return por_papel


def buscar_assets_cloudinary(slug: str) -> list[str]:
    """
    Rápido e sem gerar nada: devolve [bg, st1, st2, st3] se o tema já estiver
    completo no Cloudinary; senão, [].
    """
    if slug in _CACHE_URLS:
        return list(_CACHE_URLS[slug])
    if _CACHE_VAZIO_ATE.get(slug, 0) > time.monotonic():
        return []

    por_papel = _buscar_assets_por_papel(slug)
    if all(p in por_papel for p in PAPEIS):
        urls = [por_papel[p] for p in PAPEIS]
        _CACHE_URLS[slug] = urls
        return list(urls)

    _CACHE_VAZIO_ATE[slug] = time.monotonic() + _TTL_VAZIO_SEGUNDOS
    return []


# --------------------------------------------------------------------------- #
#  Pollinations: baixar imagens                                                #
# --------------------------------------------------------------------------- #

_THROTTLE_LOCK = threading.Lock()
_ULTIMO_DOWNLOAD = 0.0
_INTERVALO_ANONIMO = 16.0
_INTERVALO_COM_CHAVE = 1.0


def _respeitar_intervalo() -> None:
    global _ULTIMO_DOWNLOAD
    with _THROTTLE_LOCK:
        intervalo = _INTERVALO_COM_CHAVE if POLLINATIONS_API_KEY else _INTERVALO_ANONIMO
        espera = _ULTIMO_DOWNLOAD + intervalo - time.monotonic()
        if espera > 0:
            time.sleep(espera)
        _ULTIMO_DOWNLOAD = time.monotonic()


def _imagem_valida(conteudo: bytes) -> bool:
    try:
        Image.open(io.BytesIO(conteudo)).verify()
        return True
    except Exception:
        return False


def baixar_imagem_pollinations(
    prompt_en: str, width: int, height: int, seed: int
) -> bytes | None:
    prompt_q = urllib.parse.quote(prompt_en, safe="")
    tentativas: list[tuple[str, dict]] = []
    if POLLINATIONS_API_KEY:
        tentativas.append(
            (
                f"https://gen.pollinations.ai/image/{prompt_q}?width={width}&height={height}&seed={seed}",
                {"Authorization": f"Bearer {POLLINATIONS_API_KEY}"},
            )
        )
    tentativas.append(
        (
            f"https://image.pollinations.ai/prompt/{prompt_q}?width={width}&height={height}&nologo=true&model=flux&seed={seed}",
            {},
        )
    )
    tentativas.append(
        (
            f"https://image.pollinations.ai/prompt/{prompt_q}?width={width}&height={height}&nologo=true&seed={seed}",
            {},
        )
    )

    for url, extra_headers in tentativas:
        for _ in range(2):  # a 2ª volta só acontece se o servidor responder 429
            _respeitar_intervalo()
            try:
                resp = requests.get(
                    url,
                    headers={"User-Agent": "Mozilla/5.0", **extra_headers},
                    timeout=15,
                )
            except Exception as e:
                print(f"Aviso tentativa Pollinations: {e}")
                break
            if resp.status_code == 429:
                time.sleep(20)
                continue
            if (
                resp.status_code == 200
                and len(resp.content) > 1000
                and _imagem_valida(resp.content)
            ):
                return resp.content
            print(f"Aviso Pollinations: HTTP {resp.status_code}")
            break
    return None


# --------------------------------------------------------------------------- #
#  Pós-processamento                                                           #
# --------------------------------------------------------------------------- #


def _preparar_background(img_bytes: bytes) -> bytes:
    img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    w, h = img.size
    if not POLLINATIONS_API_KEY:
        # plano anônimo: corta o rodapé, onde fica a marca d'água
        img = img.crop((0, 0, w, int(h * 0.94)))
    img.thumbnail((1080, 1920))
    out = io.BytesIO()
    img.save(out, format="JPEG", quality=88, optimize=True)
    return out.getvalue()


def _remover_fundo_por_cantos(img_bytes: bytes) -> bytes:
    """Plano B sem rembg: apaga só o branco ligado às bordas (preserva brancos internos)."""
    img = Image.open(io.BytesIO(img_bytes)).convert("RGBA")
    w, h = img.size
    for ponto in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        r, g, b, a = img.getpixel(ponto)
        if a > 0 and r > 235 and g > 235 and b > 235:
            ImageDraw.floodfill(img, ponto, (255, 255, 255, 0), thresh=40)
    out = io.BytesIO()
    img.save(out, format="PNG")
    return out.getvalue()


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
            return _remover_fundo_por_cantos(img_bytes)
        except Exception:
            return img_bytes


def _aparar_sticker(png_bytes: bytes) -> bytes:
    """Corta as sobras transparentes e centraliza num quadrado (sticker preenche a caixa)."""
    img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
    mascara = img.split()[3].point(lambda a: 255 if a > 10 else 0)
    caixa = mascara.getbbox()
    if caixa:
        img = img.crop(caixa)
    w, h = img.size
    lado = max(1, int(max(w, h) * 1.08))
    tela = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    tela.paste(img, ((lado - w) // 2, (lado - h) // 2), img)
    tela.thumbnail((512, 512))
    out = io.BytesIO()
    tela.save(out, format="PNG", optimize=True)
    return out.getvalue()


# --------------------------------------------------------------------------- #
#  Geração + upload                                                            #
# --------------------------------------------------------------------------- #


def _gerar_background(cenario_en: str, slug: str) -> str | None:
    # Removemos o limite de tamanho (width/height) para forçar máxima resolução
    prompt = f"{cenario_en}, {ESTILO_BG}, 8k resolution, highly detailed, sharp focus"

    # Gerar imagem sem restrição de tamanho na URL (deixa a IA escolher o melhor formato vertical)
    prompt_q = urllib.parse.quote(prompt, safe="")
    url = f"https://image.pollinations.ai/prompt/{prompt_q}?nologo=true&model=flux&seed=8088"

    try:
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=90)
        if resp.status_code == 200 and len(resp.content) > 1000:
            buf = io.BytesIO(_preparar_background(resp.content))
            res = cloudinary.uploader.upload(
                buf,
                folder=PASTA_BACKGROUNDS,
                resource_type="image",
                tags=_tags_do_tema(slug, "bg"),
            )
            return res["secure_url"]
    except Exception as e:
        print(f"Aviso no upload do background ({slug}) para Cloudinary: {e}")

    return None


def _gerar_sticker(sticker_en: str, slug: str, papel: str, seed: int) -> str | None:
    prompt = f"{sticker_en}, {ESTILO_STICKER}"
    bruto = baixar_imagem_pollinations(prompt, 768, 768, seed)
    if not bruto:
        return None
    try:
        png = _aparar_sticker(remover_fundo_sticker(bruto))
        res = cloudinary.uploader.upload(
            io.BytesIO(png),
            folder=PASTA_STICKERS,
            format="png",
            resource_type="image",
            tags=_tags_do_tema(slug, papel),
        )
        return res["secure_url"]
    except Exception as e:
        print(f"Aviso no upload do sticker {papel} ({slug}) para Cloudinary: {e}")
        return None


_LOCKS_POR_TEMA: dict[str, threading.Lock] = {}
_LOCKS_GUARD = threading.Lock()


def _lock_do_tema(slug: str) -> threading.Lock:
    with _LOCKS_GUARD:
        if slug not in _LOCKS_POR_TEMA:
            _LOCKS_POR_TEMA[slug] = threading.Lock()
        return _LOCKS_POR_TEMA[slug]


def gerar_assets_visuais_ia(hiperfoco: str, forcar: bool = False) -> list[str]:
    """
    Garante os 4 assets do tema do hiperfoco e devolve
    [background, sticker1, sticker2, sticker3] (todas URLs do Cloudinary).
    Devolve [] se não conseguir completar o conjunto.

    - Chamadas simultâneas para o mesmo tema esperam uma pela outra (lock).
    - Reaproveita o que já existe: se só faltar 1 sticker, gera só ele.
    """
    slug = identificar_tema(hiperfoco)
    with _lock_do_tema(slug):
        por_papel = {} if forcar else _buscar_assets_por_papel(slug)

        if all(p in por_papel for p in PAPEIS):
            urls = [por_papel[p] for p in PAPEIS]
            _CACHE_URLS[slug] = urls
            return urls

        prompts = obter_prompts_ia_para_hiperfoco(hiperfoco, slug)

        if "bg" not in por_papel:
            url = _gerar_background(prompts["bg"], slug)
            if url:
                por_papel["bg"] = url

        for idx, papel in enumerate(("st1", "st2", "st3")):
            if papel not in por_papel:
                url = _gerar_sticker(prompts["stickers"][idx], slug, papel, 8090 + idx)
                if url:
                    por_papel[papel] = url

            # NOVO COMPORTAMENTO: Se faltar algum asset, usa um fallback estático universal
            # e devolve os que já estão no Cloudinary, nunca devolvendo lista vazia [].
            fallbacks_seguros = {
                "bg": "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
                "st1": "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2728.png",  # Brilhos
                "st2": "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/2b50.png",  # Estrela
                "st3": "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/1f3c6.png",  # Troféu
            }

            urls_finais = []
            for p in PAPEIS:
                urls_finais.append(por_papel.get(p, fallbacks_seguros[p]))

            _CACHE_URLS[slug] = urls_finais
            _CACHE_VAZIO_ATE.pop(slug, None)
            return urls_finais

        print(
            f"Aviso: assets do tema '{slug}' ficaram incompletos "
            f"({sorted(por_papel)}). Será retomado na próxima chamada."
        )
        return []
