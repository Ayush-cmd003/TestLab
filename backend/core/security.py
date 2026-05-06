from cryptography.fernet import Fernet
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_ENCRYPTION_KEY = os.getenv('encrypt_decrypt_key')

cipher = Fernet(SECRET_ENCRYPTION_KEY)

def encrypt_api_key(api_key: str):
    return cipher.encrypt(api_key.encode()).decode()

def decrypt_api_key(encrypted_key: str):
    return cipher.decrypt(encrypted_key.encode()).decode()