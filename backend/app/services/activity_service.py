from app.repositories.activity_repository import find_activities_by_turma_and_subject


def get_activities_by_turma_and_subject(turma_id: str, materia_sigla: str):
    return find_activities_by_turma_and_subject(turma_id, materia_sigla)
