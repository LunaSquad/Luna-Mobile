from pydantic import BaseModel
from typing import List, Optional


class ItemResposta(BaseModel):
    numeroQuestao: int
    pergunta: str
    respostaAluno: str
    respostaCorreta: str
    acertou: bool
    tipo: Optional[str] = "objetiva"


class SubmissaoAtividadeRequest(BaseModel):
    alunoID: str
    planoID: str
    turmaID: Optional[str] = ""
    materiaID: Optional[str] = ""
    materia: Optional[str] = ""
    titulo: Optional[str] = ""
    respostas: List[ItemResposta]
    acertos: int
    totalQuestoes: int
    status: Optional[str] = "concluida"
