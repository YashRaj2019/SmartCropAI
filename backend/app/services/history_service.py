import os
import json
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional

from backend.app.config import settings

LOCAL_DB_FILE = os.path.join(settings.STORAGE_DIR, "db_history.json")

class HistoryService:
    """
    Manages analysis persistence with automatic dual-engine support:
    MongoDB engine when available, JSON local storage fallback otherwise.
    """
    def __init__(self):
        self._ensure_storage()

    def _ensure_storage(self):
        if not os.path.exists(LOCAL_DB_FILE):
            with open(LOCAL_DB_FILE, "w") as f:
                json.dump([], f)

    def _read_local(self) -> List[Dict[str, Any]]:
        try:
            with open(LOCAL_DB_FILE, "r") as f:
                return json.load(f)
        except Exception:
            return []

    def _write_local(self, data: List[Dict[str, Any]]):
        with open(LOCAL_DB_FILE, "w") as f:
            json.dump(data, f, indent=2)

    def save_analysis(self, analysis_record: Dict[str, Any]) -> Dict[str, Any]:
        record_id = str(uuid.uuid4())
        record = {
            "_id": record_id,
            "id": record_id,
            "timestamp": datetime.now().isoformat(),
            **analysis_record
        }

        # Try MongoDB save
        try:
            import pymongo
            client = pymongo.MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=1000)
            db = client[settings.DATABASE_NAME]
            db.crop_analyses.insert_one(record.copy())
            client.close()
        except Exception as e:
            # Fallback to local JSON DB
            pass

        records = self._read_local()
        records.insert(0, record)
        self._write_local(records)
        return record

    def get_all_history(self) -> List[Dict[str, Any]]:
        # Try MongoDB
        try:
            import pymongo
            client = pymongo.MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=1000)
            db = client[settings.DATABASE_NAME]
            records = list(db.crop_analyses.find({}, {"_id": 0}))
            client.close()
            if records:
                return records
        except Exception:
            pass

        return self._read_local()

    def get_analysis_by_id(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        records = self.get_all_history()
        for r in records:
            if r.get("id") == analysis_id or r.get("_id") == analysis_id:
                return r
        return None

    def delete_analysis(self, analysis_id: str) -> bool:
        # Try MongoDB delete
        try:
            import pymongo
            client = pymongo.MongoClient(settings.MONGODB_URL, serverSelectionTimeoutMS=1000)
            db = client[settings.DATABASE_NAME]
            db.crop_analyses.delete_one({"$or": [{"id": analysis_id}, {"_id": analysis_id}]})
            client.close()
        except Exception:
            pass

        records = self._read_local()
        new_records = [r for r in records if r.get("id") != analysis_id and r.get("_id") != analysis_id]
        if len(new_records) != len(records):
            self._write_local(new_records)
            return True
        return False

history_service = HistoryService()
