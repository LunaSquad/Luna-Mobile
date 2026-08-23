import bcrypt
from app.core.database import usuarios_collection


def find_user_by_email_and_password(email: str, senha: str):
    user = usuarios_collection.find_one({"email": email})

    if not user:
        return None

    senha_hash = user.get("senha")
    if not senha_hash:
        return None

    try:
        senha_valida = bcrypt.checkpw(senha.encode("utf-8"), senha_hash.encode("utf-8"))
        if senha_valida:
            return user
    except Exception:
        return None

    return None
