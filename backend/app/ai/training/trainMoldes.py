
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

planos = [
    "Atividade de matemática com operações de soma e subtração simples",
    "Leitura e interpretação de histórias infantis com rimas",
    "Ciências: reconhecer animais e seus habitats",
    "Desenhar e pintar formas geométricas",
    "Resolver problemas de multiplicação usando jogos de tabuleiro"
]

moldes = [
    "jogo_interativo_basico",
    "historia_rimada_musical",
    "aventura_dos_animais",
    "arte_colorida",
    "jogo_matematico"
]

vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(planos)

modelo = LogisticRegression()
modelo.fit(X, moldes)

# Salvar
joblib.dump(modelo, "modelo_moldes.pkl")
joblib.dump(vectorizer, "vetorizador.pkl")

print("✅ Modelo treinado e salvo com sucesso!")
