const filterManager = new FilterManager();
const chartManager = new ChartManager();

// Theme handling
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    updateChartsTheme(newTheme);
}

function updateChartsTheme(theme) {
    const textColor = theme === 'dark' ? '#ffffff' : '#666666';
    Chart.defaults.color = textColor;
    chartManager.updateChartsTheme(textColor);
}

// Initial data load
async function loadInitialData() {
    try {
        // Add loading state
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('loading');
        });

        // First verify API is accessible
        const testResponse = await fetch('http://127.0.0.1:8000/api/test');
        const testData = await testResponse.json();
        console.log('API Test:', testData);

        // Then load the actual data
        const response = await fetch('http://127.0.0.1:8000/api/data/filtered');
        const data = await response.json();
        console.log('Loaded data:', data);

        if (data && data.length > 0) {
            // Animate charts sequentially
            await new Promise(resolve => setTimeout(resolve, 300));
            chartManager.updateAllCharts(data);
            filterManager.updateSummaryCards(data);
        } else {
            console.error('No data received from API');
            alert('No data available. Please check the backend connection.');
        }
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error connecting to the backend. Please check if the server is running.');
    } finally {
        // Remove loading state
        document.querySelectorAll('.card').forEach(card => {
            card.classList.remove('loading');
        });
    }
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    updateChartsTheme(savedTheme);

    // Theme toggle listener
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    loadInitialData();
});

// Add error handling for Chart.js
Chart.defaults.plugins.title.display = true;
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;

// Add smooth transitions when filtering
document.addEventListener('filterChange', () => {
    document.querySelectorAll('.chart-card').forEach(card => {
        card.style.opacity = '0.5';
        setTimeout(() => {
            card.style.opacity = '1';
        }, 300);
    });
}); 