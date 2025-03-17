class FilterManager {
    constructor() {
        this.filters = {};
        this.initializeFilters();
    }

    async initializeFilters() {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/data/filtered');
            const data = await response.json();
            console.log('Filter data:', data);

            // Extract unique values from data
            const filters = {
                end_years: [...new Set(data.map(item => item.end_year).filter(Boolean))],
                topics: [...new Set(data.map(item => item.topic).filter(Boolean))],
                sectors: [...new Set(data.map(item => item.sector).filter(Boolean))],
                regions: [...new Set(data.map(item => item.region).filter(Boolean))],
                pestles: [...new Set(data.map(item => item.pestle).filter(Boolean))],
                sources: [...new Set(data.map(item => item.source).filter(Boolean))],
                countries: [...new Set(data.map(item => item.country).filter(Boolean))],
                cities: [...new Set(data.map(item => item.city).filter(Boolean))]
            };

            // Populate filter dropdowns
            Object.keys(filters).forEach(key => {
                const filterId = key.replace('pestles', 'pestle')
                                  .replace('countries', 'country')
                                  .replace('cities', 'city')
                                  .replace('sectors', 'sector')
                                  .replace('regions', 'region')
                                  .replace('sources', 'source')
                                  .replace('topics', 'topic')
                                  .replace('end_years', 'year') + 'Filter';
                this.populateFilter(filterId, filters[key].sort());
            });

            this.attachFilterListeners();
        } catch (error) {
            console.error('Error initializing filters:', error);
        }
    }

    populateFilter(filterId, options) {
        const select = document.getElementById(filterId);
        if (select && options) {
            // Clear existing options except the first one
            while (select.options.length > 1) {
                select.remove(1);
            }

            // Add new options
            options.forEach(option => {
                if (option) {
                    const opt = document.createElement('option');
                    opt.value = option;
                    opt.textContent = option;
                    select.appendChild(opt);
                }
            });
        }
    }

    attachFilterListeners() {
        const filterIds = ['yearFilter', 'topicFilter', 'sectorFilter', 'regionFilter', 
                          'pestleFilter', 'sourceFilter', 'countryFilter', 'cityFilter'];
        
        filterIds.forEach(filterId => {
            const element = document.getElementById(filterId);
            if (element) {
                element.addEventListener('change', async (e) => {
                    this.filters[filterId.replace('Filter', '')] = e.target.value;
                    await this.updateData();
                });
            }
        });
    }

    async updateData() {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(this.filters).forEach(([key, value]) => {
                if (value) {
                    const apiKey = key === 'year' ? 'end_year' : key;
                    queryParams.append(apiKey, value);
                }
            });

            const url = `http://127.0.0.1:8000/api/data/filtered?${queryParams}`;
            console.log('Fetching filtered data:', url);
            
            const response = await fetch(url);
            const data = await response.json();
            console.log('Filtered data:', data);

            chartManager.updateAllCharts(data);
            this.updateSummaryCards(data);
        } catch (error) {
            console.error('Error updating data:', error);
        }
    }

    updateSummaryCards(data) {
        const avgIntensity = data.reduce((sum, item) => sum + (item.intensity || 0), 0) / (data.length || 1);
        const avgLikelihood = data.reduce((sum, item) => sum + (item.likelihood || 0), 0) / (data.length || 1);
        const avgRelevance = data.reduce((sum, item) => sum + (item.relevance || 0), 0) / (data.length || 1);

        document.getElementById('avgIntensity').textContent = avgIntensity.toFixed(2);
        document.getElementById('avgLikelihood').textContent = avgLikelihood.toFixed(2);
        document.getElementById('avgRelevance').textContent = avgRelevance.toFixed(2);
        document.getElementById('totalRecords').textContent = data.length;
    }
} 