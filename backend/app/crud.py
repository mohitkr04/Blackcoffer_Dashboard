from sqlalchemy.orm import Session
from sqlalchemy import func
from . import models, schemas

def create_database(db: Session):
    return models.Base.metadata.create_all(bind=db.engine)

def create_data(db: Session, data: schemas.DataCreate):
    db_data = models.Data(**data.model_dump())
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

def get_data(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Data).offset(skip).limit(limit).all()

def get_data_by_id(db: Session, data_id: int):
    return db.query(models.Data).filter(models.Data.id == data_id).first()

def get_intensity_stats(db: Session):
    return db.query(
        func.avg(models.Data.intensity).label('avg_intensity'),
        func.min(models.Data.intensity).label('min_intensity'),
        func.max(models.Data.intensity).label('max_intensity')
    ).first()

def get_stats_by_year(db: Session):
    return db.query(
        models.Data.end_year,
        func.count().label('count'),
        func.avg(models.Data.intensity).label('avg_intensity'),
        func.avg(models.Data.likelihood).label('avg_likelihood')
    ).group_by(models.Data.end_year).all()

def get_filter_options(db: Session):
    return {
        'end_years': db.query(models.Data.end_year).distinct().all(),
        'topics': db.query(models.Data.topic).distinct().all(),
        'sectors': db.query(models.Data.sector).distinct().all(),
        'regions': db.query(models.Data.region).distinct().all(),
        'pestles': db.query(models.Data.pestle).distinct().all(),
        'sources': db.query(models.Data.source).distinct().all(),
        'countries': db.query(models.Data.country).distinct().all(),
        'cities': db.query(models.Data.city).distinct().all(),
    }

def get_filtered_data(db: Session, end_year=None, topic=None, sector=None, 
                     region=None, pestle=None, source=None, country=None, city=None):
    query = db.query(models.Data)
    
    if end_year:
        query = query.filter(models.Data.end_year == end_year)
    if topic:
        query = query.filter(models.Data.topic == topic)
    if sector:
        query = query.filter(models.Data.sector == sector)
    if region:
        query = query.filter(models.Data.region == region)
    if pestle:
        query = query.filter(models.Data.pestle == pestle)
    if source:
        query = query.filter(models.Data.source == source)
    if country:
        query = query.filter(models.Data.country == country)
    if city:
        query = query.filter(models.Data.city == city)
        
    return query.all()

# Add other CRUD operations as needed (update, delete, etc.)