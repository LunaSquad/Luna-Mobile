import json
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent.parent
OUTPUT_DIR = BASE_DIR / "data" / "outputs"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def salvar_json(nome_arquivo: str, dados: dict) -> str:
    caminho = OUTPUT_DIR / nome_arquivo

    with open(caminho, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)

    return str(caminho)