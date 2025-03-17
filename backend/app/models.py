from sqlalchemy import Column, Integer, String, Float, Index
from sqlalchemy.ext.declarative import declarative_base
from .database import Base

class Data(Base):
    __tablename__ = "data"

    # Add indexes for frequently filtered columns
    __table_args__ = (
        Index('idx_end_year', 'end_year'),
        Index('idx_topic', 'topic'),
        Index('idx_sector', 'sector'),
        Index('idx_region', 'region'),
        Index('idx_pestle', 'pestle'),
        Index('idx_source', 'source'),
        Index('idx_country', 'country'),
        Index('idx_city', 'city'),
    )

    id = Column(Integer, primary_key=True, index=True)
    end_year = Column(String, nullable=True)
    intensity = Column(Integer, nullable=True)
    sector = Column(String, nullable=True)
    topic = Column(String, nullable=True)
    insight = Column(String, nullable=True)
    url = Column(String, nullable=True)
    region = Column(String, nullable=True)
    start_year = Column(String, nullable=True)
    impact = Column(String, nullable=True)
    added = Column(String, nullable=True)
    published = Column(String, nullable=True)
    country = Column(String, nullable=True)
    relevance = Column(Integer, nullable=True)
    pestle = Column(String, nullable=True)
    source = Column(String, nullable=True)
    title = Column(String, nullable=True)
    likelihood = Column(Integer, nullable=True)
    city = Column(String, nullable=True)