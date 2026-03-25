from pydantic import BaseModel


class AdaptarPlanoRequest(BaseModel):
    plano: str
    hiperfoco: str


class AdaptarPlanoResponse(BaseModel):
    molde_id: str
    molde: dict | None = None
    confianca: float | None = None
    prompt_imagem: str