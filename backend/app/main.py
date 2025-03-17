from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:3000", "http://localhost:3000"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.post("/data/", response_model=schemas.Data)
def create_data_endpoint(data: schemas.DataCreate, db: Session = Depends(get_db)):
    return crud.create_data(db=db, data=data)

@app.get("/data/", response_model=List[schemas.Data])
def read_data(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_data(db, skip=skip, limit=limit)
    return items

@app.get("/data/{data_id}", response_model=schemas.Data)
def read_data_by_id(data_id: int, db: Session = Depends(get_db)):
    db_data = crud.get_data_by_id(db, data_id=data_id)
    if db_data is None:
        raise HTTPException(status_code=404, detail="Data not found")
    return db_data

@app.get("/api/stats/intensity")
def get_intensity_stats(db: Session = Depends(get_db)):
    return crud.get_intensity_stats(db)

@app.get("/api/stats/by-year")
def get_stats_by_year(db: Session = Depends(get_db)):
    return crud.get_stats_by_year(db)

@app.get("/api/filters")
def get_filter_options(db: Session = Depends(get_db)):
    return crud.get_filter_options(db)

@app.get("/api/data/filtered")
def get_filtered_data(
    end_year: Optional[str] = None,
    topic: Optional[str] = None,
    sector: Optional[str] = None,
    region: Optional[str] = None,
    pestle: Optional[str] = None,
    source: Optional[str] = None,
    country: Optional[str] = None,
    city: Optional[str] = None,
    db: Session = Depends(get_db)
):
    print(f"Filtering data with parameters: end_year={end_year}, topic={topic}, sector={sector}, region={region}")
    data = crud.get_filtered_data(db, end_year, topic, sector, region, pestle, source, country, city)
    print(f"Found {len(data)} records")
    return data

@app.get("/api/test")
def test_endpoint(db: Session = Depends(get_db)):
    """Test endpoint to verify data"""
    count = db.query(models.Data).count()
    sample = db.query(models.Data).first()
    return {
        "total_records": count,
        "sample_record": sample
    }