from fastapi import APIRouter
from app.schemas.auth_schema import LoginRequest
from app.controllers.auth_controller import login_user

router = APIRouter()

@router.post("/login")
def login(payload: LoginRequest):
    return login_user(payload.email, payload.senha)
