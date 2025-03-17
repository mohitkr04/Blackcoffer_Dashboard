import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from . import models
from .models import Data
from .database import DATABASE_URL, Base

def load_data_from_json(json_file):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(engine)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    try:
        # Clear existing data
        db.query(Data).delete()
        
        # Open file with UTF-8 encoding
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            for item in data:
                db_item = Data(**item)
                db.add(db_item)
        db.commit()
        print("Data loaded successfully!")
        
        # Verify data count
        count = db.query(Data).count()
        print(f"Total records loaded: {count}")
    except Exception as e:
        print(f"Error loading data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    JSON_FILE = "jsondata.json"  # Make sure this path is correct
    load_data_from_json(JSON_FILE)