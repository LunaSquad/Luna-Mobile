from pydantic import BaseModel


class AdaptarPlanoRequest(BaseModel):
    hiperfoco: str | None = None


class AdaptarPlanoResponse(BaseModel):
    ok: bool
    hiperfoco: str
    json_path: str
    pdf_path: str
    plano_adaptado: dict