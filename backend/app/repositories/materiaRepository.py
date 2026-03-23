from app.core.database import materias_collection

def find_materias_by_escola_id(escola_id: str):
    materias = list(materias_collection.find({"escolaID": escola_id}))

    resultado = []
    for materia in materias:
        resultado.append({
            "id": str(materia["_id"]),
            "nome": materia.get("nome", ""),
            "rota": materia.get("rota", "Atividades")
        })

    return resultado