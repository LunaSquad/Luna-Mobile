from fastapi import APIRouter

from app.controllers import feedback_controller
from app.schemas.feedback_schema import FeedbackRequest

router = APIRouter()


@router.post("/")
def salvar_feedback(payload: FeedbackRequest):
    return feedback_controller.salvar_feedback(payload)
