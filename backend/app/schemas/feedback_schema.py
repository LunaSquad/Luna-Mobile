from pydantic import BaseModel


# Define o formato dos dados que o frontend vai enviar
class FeedbackRequest(BaseModel):
    userID: str
    comentario: str
    nota: int
