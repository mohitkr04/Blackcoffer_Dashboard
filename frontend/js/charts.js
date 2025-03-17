class ChartManager {
    constructor() {
        this.charts = {};
        this.initializeCharts();
    }

    initializeCharts() {
        // Common options for all charts
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        padding: 10,
                        boxWidth: 10
                    }
                }
            }
        };

        this.charts.intensity = this.createLineChart('intensityChart', 'Intensity Over Time', {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        maxTicksLimit: 6
                    }
                }
            }
        });

        this.charts.likelihood = this.createBarChart('likelihoodChart', 'Likelihood Distribution', {
            ...commonOptions,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        });

        this.charts.topics = this.createPieChart('topicsChart', 'Topics Distribution', {
            ...commonOptions,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        boxWidth: 12
                    }
                }
            }
        });

        this.charts.regions = this.createBarChart('regionChart', 'Region-wise Analysis', {
            ...commonOptions,
            indexAxis: 'y',
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        });

        this.charts.country = this.createHorizontalBarChart('countryChart', 'Top 10 Countries');
        this.charts.scatter = this.createScatterChart('scatterChart', 'Relevance vs Intensity');
    }

    createLineChart(canvasId, label, options) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: options
        });
    }

    createBarChart(canvasId, label, options) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1
                }]
            },
            options: options
        });
    }

    createHorizontalBarChart(canvasId, label) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    borderColor: 'rgb(153, 102, 255)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    createPieChart(canvasId, label, options) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: options
        });
    }

    createScatterChart(canvasId, label) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        return new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: label,
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Relevance'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Intensity'
                        }
                    }
                }
            }
        });
    }

    updateAllCharts(data) {
        this.updateIntensityChart(data);
        this.updateLikelihoodChart(data);
        this.updateTopicsChart(data);
        this.updateRegionsChart(data);
        this.updateCountryChart(data);
        this.updateScatterChart(data);
    }

    updateIntensityChart(data) {
        const yearData = {};
        data.forEach(item => {
            if (item.end_year && item.intensity) {
                if (!yearData[item.end_year]) {
                    yearData[item.end_year] = [];
                }
                yearData[item.end_year].push(item.intensity);
            }
        });

        const years = Object.keys(yearData).sort();
        const avgIntensities = years.map(year => {
            const sum = yearData[year].reduce((a, b) => a + b, 0);
            return (sum / yearData[year].length).toFixed(2);
        });

        this.charts.intensity.data.labels = years;
        this.charts.intensity.data.datasets[0].data = avgIntensities;
        this.charts.intensity.update();
    }

    updateLikelihoodChart(data) {
        const likelihoodCounts = {};
        data.forEach(item => {
            if (item.likelihood) {
                likelihoodCounts[item.likelihood] = (likelihoodCounts[item.likelihood] || 0) + 1;
            }
        });

        const labels = Object.keys(likelihoodCounts).sort();
        const counts = labels.map(label => likelihoodCounts[label]);

        this.charts.likelihood.data.labels = labels;
        this.charts.likelihood.data.datasets[0].data = counts;
        this.charts.likelihood.update();
    }

    updateTopicsChart(data) {
        const topicCounts = {};
        data.forEach(item => {
            if (item.topic) {
                topicCounts[item.topic] = (topicCounts[item.topic] || 0) + 1;
            }
        });

        // Get top 8 topics only
        const sortedTopics = Object.entries(topicCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);

        this.charts.topics.data.labels = sortedTopics.map(([topic]) => topic);
        this.charts.topics.data.datasets[0].data = sortedTopics.map(([,count]) => count);
        this.charts.topics.update();
    }

    updateRegionsChart(data) {
        const regionCounts = {};
        data.forEach(item => {
            if (item.region) {
                regionCounts[item.region] = (regionCounts[item.region] || 0) + 1;
            }
        });

        // Get top 8 regions only
        const sortedRegions = Object.entries(regionCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 8);

        this.charts.regions.data.labels = sortedRegions.map(([region]) => region);
        this.charts.regions.data.datasets[0].data = sortedRegions.map(([,count]) => count);
        this.charts.regions.update();
    }

    updateCountryChart(data) {
        const countryCounts = {};
        data.forEach(item => {
            if (item.country) {
                countryCounts[item.country] = (countryCounts[item.country] || 0) + 1;
            }
        });

        const sortedCountries = Object.entries(countryCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10);

        this.charts.country.data.labels = sortedCountries.map(([country]) => country);
        this.charts.country.data.datasets[0].data = sortedCountries.map(([,count]) => count);
        this.charts.country.update();
    }

    updateScatterChart(data) {
        const scatterData = data
            .filter(item => item.relevance && item.intensity)
            .map(item => ({
                x: item.relevance,
                y: item.intensity
            }));

        this.charts.scatter.data.datasets[0].data = scatterData;
        this.charts.scatter.update();
    }

    updateChartsTheme(textColor) {
        Object.values(this.charts).forEach(chart => {
            if (chart.options) {
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        if (scale.ticks) {
                            scale.ticks.color = textColor;
                        }
                    });
                }
                chart.update('none');
            }
        });
    }
} 