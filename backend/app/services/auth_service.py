import os
import json
import uuid
import hashlib
import hmac
from datetime import datetime
from typing import Optional, Dict, Any

from backend.app.config import settings

USERS_FILE = os.path.join(settings.STORAGE_DIR, "users.json")
SECRET_KEY = settings.SECRET_KEY

def hash_password(password: str, salt: str = None) -> tuple:
    if not salt:
        salt = uuid.uuid4().hex
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt.encode("utf-8"), 100000).hex()
    return pwd_hash, salt

def verify_password(password: str, salt: str, expected_hash: str) -> bool:
    pwd_hash, _ = hash_password(password, salt)
    return hmac.compare_digest(pwd_hash, expected_hash)

def generate_token(user_id: str) -> str:
    raw = f"{user_id}:{uuid.uuid4().hex}:{datetime.now().timestamp()}"
    signature = hmac.new(SECRET_KEY.encode("utf-8"), raw.encode("utf-8"), hashlib.sha256).hexdigest()
    return f"{raw}.{signature}"

def verify_token(token: str) -> Optional[str]:
    try:
        raw, sig = token.rsplit(".", 1)
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), raw.encode("utf-8"), hashlib.sha256).hexdigest()
        if not hmac.compare_digest(sig, expected_sig):
            return None
        user_id = raw.split(":", 1)[0]
        return user_id
    except Exception:
        return None

class AuthService:
    def __init__(self):
        self._ensure_storage()

    def _ensure_storage(self):
        os.makedirs(settings.STORAGE_DIR, exist_ok=True)
        if not os.path.exists(USERS_FILE):
            with open(USERS_FILE, "w", encoding="utf-8") as f:
                json.dump([], f)

    def _read_users(self) -> list:
        try:
            with open(USERS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []

    def _write_users(self, users: list):
        with open(USERS_FILE, "w", encoding="utf-8") as f:
            json.dump(users, f, indent=2)

    def register(self, name: str, email: str, password: str, farm_name: str = "My Farm") -> Dict[str, Any]:
        email_clean = email.strip().lower()
        users = self._read_users()
        for u in users:
            if u["email"].lower() == email_clean:
                raise ValueError("An account with this email address already exists.")

        pwd_hash, salt = hash_password(password)
        user_id = str(uuid.uuid4())
        created_at = datetime.now().isoformat()

        user_doc = {
            "id": user_id,
            "name": name.strip(),
            "email": email_clean,
            "farm_name": farm_name.strip() if farm_name else "My Farm",
            "password_hash": pwd_hash,
            "salt": salt,
            "created_at": created_at
        }
        users.append(user_doc)
        self._write_users(users)

        token = generate_token(user_id)
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "name": user_doc["name"],
                "email": user_doc["email"],
                "farm_name": user_doc["farm_name"],
                "created_at": created_at
            }
        }

    def login(self, email: str, password: str) -> Dict[str, Any]:
        email_clean = email.strip().lower()
        users = self._read_users()
        user_doc = None
        for u in users:
            if u["email"].lower() == email_clean:
                user_doc = u
                break

        if not user_doc or not verify_password(password, user_doc["salt"], user_doc["password_hash"]):
            raise ValueError("Invalid email or password.")

        token = generate_token(user_doc["id"])
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_doc["id"],
                "name": user_doc["name"],
                "email": user_doc["email"],
                "farm_name": user_doc.get("farm_name", "My Farm"),
                "created_at": user_doc["created_at"]
            }
        }

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        users = self._read_users()
        for u in users:
            if u["id"] == user_id:
                return {
                    "id": u["id"],
                    "name": u["name"],
                    "email": u["email"],
                    "farm_name": u.get("farm_name", "My Farm"),
                    "created_at": u["created_at"]
                }
        return None

auth_service = AuthService()
