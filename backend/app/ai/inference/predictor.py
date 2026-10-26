import pickle
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "modelo_moldes.pkl")

# Carrega a IA treinada para a memória
with open(MODEL_PATH, "rb") as f:
    ia_moldes = pickle.load(f)


def prever_molde_ia(hiperfoco: str, perfil: str = "curioso") -> str:
    """Usa a nossa IA treinada para prever o melhor molde."""
    caracteristicas = f"{hiperfoco} {perfil}"
    previsao = ia_moldes.predict([caracteristicas])
    return previsao[0]
