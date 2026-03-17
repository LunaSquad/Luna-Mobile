from fastapi import APIRouter
from app.schemas.auth import LoginRequest
from app.services.authService import login_user

router = APIRouter()

@router.post("/login")
def login(payload: LoginRequest):
    return login_user(payload.email, payload.senha)