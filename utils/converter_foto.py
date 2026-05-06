import base64

# FUNÇÃO AUXILIAR PARA CONVERTER BINÁRIO (BYTEA) PARA BASE64
def converter_foto_para_base64(instancia_foto):
    if instancia_foto:
        try:
            # Converte o memoryview do Postgres para bytes e depois para string Base64
            foto_bytes = bytes(instancia_foto)
            foto_base64 = base64.b64encode(foto_bytes).decode('utf-8')
            return f"data:image/jpeg;base64,{foto_base64}"
        except Exception:
            return None
    return None
