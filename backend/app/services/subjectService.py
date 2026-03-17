from app.repositories.subjectRepository import find_subjects_by_school

def get_subjects_by_school(escola_id: str):
    docs = find_subjects_by_school(escola_id)

    lista = []
    for m in docs:
        lista.append({
            "id": str(m["_id"]),
            "nome": m.get("nome", ""),
            "rota": m.get("rota", "Atividades"),
        })

    return {"ok": True, "materias": lista}