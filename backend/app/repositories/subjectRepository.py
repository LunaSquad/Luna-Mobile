from app.core.database import materias_collection

def find_subjects_by_escola_id(escola_id: str):

    materias = list(
        materias_collection.find({
            "escolaID": escola_id
        })
    )

    resultado = []

    for m in materias:
        resultado.append({
            "id": str(m["_id"]),
            "nome": m.get("nome", ""),
            "rota": m.get("rota", "Atividades")
        })

    return resultado