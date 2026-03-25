from pathlib import Path
import json
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"
DATASET_DIR = Path(__file__).resolve().parent / "datasets"

MODELS_DIR.mkdir(parents=True, exist_ok=True)

# Exemplos de treino
dados_treino = [
    {
        "plano": "Atividade de matemática com operações de soma e subtração simples",
        "hiperfoco": "videogames",
        "molde": "jogo_interativo_basico"
    },
    {
        "plano": "Leitura e interpretação de histórias infantis com rimas",
        "hiperfoco": "música",
        "molde": "historia_rimada_musical"
    },
    {
        "plano": "Ciências sobre animais e seus habitats",
        "hiperfoco": "animais",
        "molde": "aventura_dos_animais"
    },
    {
        "plano": "Desenhar e pintar formas geométricas",
        "hiperfoco": "cores",
        "molde": "arte_colorida"
    },
    {
        "plano": "Resolver problemas de multiplicação com desafios",
        "hiperfoco": "jogos de tabuleiro",
        "molde": "jogo_matematico"
    },
    {
        "plano": "Atividade de adição com números pequenos",
        "hiperfoco": "games",
        "molde": "jogo_interativo_basico"
    },
    {
        "plano": "Poema infantil com leitura em voz alta",
        "hiperfoco": "canções",
        "molde": "historia_rimada_musical"
    },
    {
        "plano": "Estudo sobre floresta e animais silvestres",
        "hiperfoco": "bichos",
        "molde": "aventura_dos_animais"
    },
    {
        "plano": "Atividade de pintura e mistura de cores",
        "hiperfoco": "desenho",
        "molde": "arte_colorida"
    },
    {
        "plano": "Desafios de multiplicação em sequência",
        "hiperfoco": "tabuleiro",
        "molde": "jogo_matematico"
    }
]

entradas = [
    f"plano: {item['plano']} | hiperfoco: {item['hiperfoco']}"
    for item in dados_treino
]
saidas = [item["molde"] for item in dados_treino]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(entradas)

modelo = LogisticRegression(max_iter=1000)
modelo.fit(X, saidas)

joblib.dump(modelo, MODELS_DIR / "modelo_moldes.pkl")
joblib.dump(vectorizer, MODELS_DIR / "vetorizador.pkl")

print("✅ Modelo treinado e salvo com sucesso!")