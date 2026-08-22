import sqlite3
import json
from datetime import datetime
from typing import Dict, Any, List

DB_PATH = "inference.db"

def init_event_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            event_type TEXT,
            severity TEXT,
            context TEXT,
            model_version TEXT,
            machine_id TEXT
        )
    ''')
    conn.commit()
    conn.close()

def log_event(event_type: str, severity: str, context: Dict[str, Any], model_version: str = None, machine_id: str = None):
    init_event_db()
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    
    timestamp = datetime.utcnow().isoformat()
    c.execute(
        "INSERT INTO events (timestamp, event_type, severity, context, model_version, machine_id) VALUES (?, ?, ?, ?, ?, ?)",
        (timestamp, event_type, severity, json.dumps(context), model_version, machine_id)
    )
    conn.commit()
    conn.close()
    
    # Also print to stdout for visibility
    print(f"[{timestamp}] {severity} - {event_type} | {context}")

def get_recent_events(limit: int = 50) -> List[Dict[str, Any]]:
    init_event_db()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    c.execute("SELECT * FROM events ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = c.fetchall()
    conn.close()
    
    events = []
    for r in rows:
        events.append({
            "id": r["id"],
            "timestamp": r["timestamp"],
            "event_type": r["event_type"],
            "severity": r["severity"],
            "context": json.loads(r["context"]),
            "model_version": r["model_version"],
            "machine_id": r["machine_id"]
        })
    return events
