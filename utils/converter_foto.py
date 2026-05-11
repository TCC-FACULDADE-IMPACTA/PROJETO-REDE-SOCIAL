import base64
from django.conf import settings
import os

def converter_foto_para_base64(foto_campo):
    if not foto_campo:
        return None
    try:
        # Pega o caminho real no seu computador/servidor
        path = os.path.join(settings.MEDIA_ROOT, str(foto_campo))
        with open(path, "rb") as image_file:
            # Lendo os bytes REAIS do arquivo
            encoded_string = base64.b64encode(image_file.read()).decode('utf-8')
            return f"data:image/jpeg;base64,{encoded_string}"
    except Exception as e:
        return None