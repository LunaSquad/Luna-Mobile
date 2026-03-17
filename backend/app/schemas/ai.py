from pydantic import BaseModel

class AIRequest(BaseModel):
    plano: str
    hiperfoco: str