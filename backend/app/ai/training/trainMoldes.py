import json
import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
import os

# Caminhos dos arquivos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, "datasets", "moldes.json")
MODEL_DIR = os.path.join(os.path.dirname(BASE_DIR), "models")


def treinar_modelo():
    print("⏳ Carregando dataset...")
    with open(DATASET_PATH, "r", encoding="utf-8") as f:
        dados = json.load(f)

    df = pd.DataFrame(dados)

    # Juntamos as características para treinar a IA
    df["features"] = df["hiperfoco"] + " " + df["perfil"]
    X = df["features"]
    y = df["molde"]

    print("🧠 Treinando a Inteligência Artificial...")
    # Pipeline: Transforma texto em números (Vetorização) e treina o algoritmo Naive Bayes
    modelo = make_pipeline(TfidfVectorizer(), MultinomialNB())
    modelo.fit(X, y)

    # Salva o modelo treinado na pasta models
    os.makedirs(MODEL_DIR, exist_ok=True)
    modelo_path = os.path.join(MODEL_DIR, "modelo_moldes.pkl")

    with open(modelo_path, "wb") as f:
        pickle.dump(modelo, f)

    print(f"✅ Modelo treinado e salvo com sucesso em: {modelo_path}")


if __name__ == "__main__":
    treinar_modelo()
