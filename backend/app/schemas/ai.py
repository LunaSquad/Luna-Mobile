from pydantic import BaseModel
from typing import Optional


class AdaptarPlanoRequest(BaseModel):
    hiperfoco: Optional[str] = None
    planoId: str
    alunoId: str
    turmaId: str
    materiaId: str
    urlPlanoDeAula: str


class AdaptarPlanoResponse(BaseModel):
    ok: bool
    origem: str
    hiperfoco: str
    plano_adaptado: dict
