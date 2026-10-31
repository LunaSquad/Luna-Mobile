import socket
import os


def obter_ip_local():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


ip_atual = obter_ip_local()
caminho_arquivo_ip = os.path.join("src", "services", "ip.ts")

conteudo = (
    f'const API_BASE_URL = "http://{ip_atual}:8000";\n\nexport default API_BASE_URL;\n'
)

os.makedirs(os.path.dirname(caminho_arquivo_ip), exist_ok=True)
with open(caminho_arquivo_ip, "w", encoding="utf-8") as f:
    f.write(conteudo)

print(f"IP configurado automaticamente para: http://{ip_atual}:8000")
