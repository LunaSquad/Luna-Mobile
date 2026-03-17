from app.core.database import usuarios_collection

def find_user_by_email_and_password(email: str, senha: str):
    return usuarios_collection.find_one({"email": email, "senha": senha})