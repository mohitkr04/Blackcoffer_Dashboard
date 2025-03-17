from pydantic import BaseModel
from typing import Optional

class DataBase(BaseModel):
    end_year: Optional[str] = None
    intensity: Optional[int] = None
    sector: Optional[str] = None
    topic: Optional[str] = None
    insight: Optional[str] = None
    url: Optional[str] = None
    region: Optional[str] = None
    start_year: Optional[str] = None
    impact: Optional[str] = None
    added: Optional[str] = None
    published: Optional[str] = None
    country: Optional[str] = None
    relevance: Optional[int] = None
    pestle: Optional[str] = None
    source: Optional[str] = None
    title: Optional[str] = None
    likelihood: Optional[int] = None
    city: Optional[str] = None

class DataCreate(DataBase):
    pass

class Data(DataBase):
    id: int

    class Config:
        from_attributes = True #alias of orm_mode