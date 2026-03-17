import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

modelo = joblib.load(MODELS_DIR / "modelo_moldes.pkl")
vectorizer = joblib.load(MODELS_DIR / "vetorizador.pkl")


def escolher_molde(plano: str, hiperfoco: str) -> str:
    entrada = f"{plano} {hiperfoco}"
    X = vectorizer.transform([entrada])
    molde_previsto = modelo.predict(X)[0]
    return molde_previsto