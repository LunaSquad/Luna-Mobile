import os
import json
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# Caminho absoluto para a pasta do modelo
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ai", "models", "modelo_luna_pronto")

print("⏳ Carregando a IA LUNA para a memória...")
try:
    tokenizer = AutoTokenizer.from_pretrained(MODEL_PATH)
    model = AutoModelForSeq2SeqLM.from_pretrained(MODEL_PATH)
    print("✅ IA LUNA carregada com sucesso!")
except Exception as e:
    print(f"❌ Erro ao carregar o modelo: {e}")


def gerar_texto_adaptado_local(texto_original: str, hiperfoco: str) -> dict:
    """Usa o seu modelo PTT5 treinado para gerar o JSON adaptado."""

    # O prompt segue a mesma estrutura que você usou no treinamento
    prompt = f"adaptar para hiperfoco em {hiperfoco}: {texto_original}"

    inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)

    # max_new_tokens define o tamanho máximo da resposta gerada
    outputs = model.generate(**inputs, max_new_tokens=512, temperature=0.7)
    resultado_texto = tokenizer.decode(outputs[0], skip_special_tokens=True)

    try:
        return json.loads(resultado_texto)
    except json.JSONDecodeError:
        print("❌ A IA não gerou um JSON válido. Retorno bruto:", resultado_texto)
        # Retorno de segurança caso a IA falhe na formatação
        return {"explicacao": "Erro ao adaptar o texto.", "questoes": []}
