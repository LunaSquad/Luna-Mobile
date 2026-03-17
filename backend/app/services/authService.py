from app.repositories.userRepository import find_user_by_email_and_password

def login_user(email: str, senha: str):
    user = find_user_by_email_and_password(email, senha)

    if not user:
        return {"ok": False, "message": "Email ou senha inválidos"}

    return {
        "ok": True,
        "tipoUser": user.get("tipoUser", "aluno"),
        "userId": str(user["_id"]),
    }