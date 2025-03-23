# Data Visualization Dashboard

A dynamic and interactive dashboard for visualizing data trends, built with FastAPI backend and vanilla JavaScript frontend.

## Features

- Interactive data visualization using Chart.js
- Real-time filtering capabilities
- Dark/Light theme toggle
- Responsive design
- Animated transitions and interactions
- Cross-browser compatibility

## Key Visualizations

- Intensity trends over time
- Likelihood distribution
- Topics distribution
- Region-wise analysis
- Country-wise distribution
- Relevance vs Intensity correlation

## Tech Stack

### Backend
- FastAPI
- SQLAlchemy
- SQLite Database
- Python 3.8+
- CORS middleware

### Frontend
- Vanilla JavaScript
- Chart.js for visualizations
- Bootstrap 5 for styling
- AOS (Animate On Scroll) library
- Font Awesome icons

## Project Structure
dashboard_project/
├── backend/
│ ├── app/
│ │ ├── init.py
│ │ ├── main.py
│ │ ├── crud.py
│ │ ├── models.py
│ │ ├── schemas.py
│ │ ├── database.py
│ │ └── load_data.py
│ ├── requirements.txt
│ └── jsondata.json
└── frontend/
├── index.html
├── css/
│ └── style.css
└── js/
├── main.js
├── charts.js
└── filters.js

## Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/mohitkr04/Blackcoffer_Dashboard
cd Blackcoffer_Dashboard
```

2. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

3. Load the data:
```bash
python -m app.load_data
```

4. Start the backend server:
```bash
uvicorn app.main:app --reload
```

5. Start the frontend server:
```bash
cd ../frontend
python -m http.server 3000 --bind 127.0.0.1
```

6. Access the dashboard:
- Open your browser and navigate to `http://127.0.0.1:3000`

## Available Filters

- End Year
- Topic
- Sector
- Region
- PESTLE
- Source
- Country
- City

## API Endpoints

- `GET /api/test` - Test endpoint to verify data connection
- `GET /api/data/filtered` - Get filtered data based on parameters
- `GET /api/filters` - Get available filter options

## Data Visualization Features

1. **Intensity Analysis**
   - Line chart showing intensity trends over time
   - Interactive tooltips with detailed information

2. **Likelihood Distribution**
   - Bar chart displaying likelihood distribution
   - Color-coded for better visualization

3. **Topics Distribution**
   - Pie chart showing distribution of topics
   - Interactive legend with hover effects

4. **Regional Analysis**
   - Horizontal bar chart for region-wise distribution
   - Sorted by frequency for better insight

## Interactive Features

- Real-time data filtering
- Smooth animations during data updates
- Theme toggle (Dark/Light mode)
- Responsive design for all screen sizes
- Loading states for better UX
- Animated transitions between data updates

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance Optimizations

- Efficient data filtering
- Optimized chart rendering
- Lazy loading of resources
- Minimized API calls
- Smooth animations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Acknowledgments

- Data source: jsondata.json
- Chart.js library
- FastAPI framework
- Bootstrap framework
