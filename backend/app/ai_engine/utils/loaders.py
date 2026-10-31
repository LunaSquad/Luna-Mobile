import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_DIR = BASE_DIR / "training" / "datasets"


def carregar_moldes():
    caminho = DATASET_DIR / "moldes.json"
    with open(caminho, "r", encoding="utf-8") as arquivo:
        return json.load(arquivo)