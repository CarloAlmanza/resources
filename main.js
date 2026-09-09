async function getDashboardData(query) {
    try {
        // Eseguiamo le tre richieste in parallelo con Promise.all()
        const [destinationsRes, weathersRes, airportsRes] = await Promise.all([
            fetch(`http://localhost:3333/destinations?search=${query}`),
            fetch(`http://localhost:3333/weathers?search=${query}`),
            fetch(`http://localhost:3333/airports?search=${query}`)
        ]);

        // Convertiamo le risposte in JSON
        const destinations = await destinationsRes.json();
        const weathers = await weathersRes.json();
        const airports = await airportsRes.json();

        // Prendiamo il primo risultato di ogni array (se esiste)
        const destination = destinations[0] || null;
        const weather = weathers[0] || null;
        const airport = airports[0] || null;

        // Creiamo l'oggetto con i dati aggregati
        const dashboardData = {
            city: destination?.name || null,
            country: destination?.country || null,
            temperature: weather?.temperature || null,
            weather: weather?.weather_description || null,
            airport: airport?.name || null
        };

        return dashboardData;

    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
        throw error;
    }
}

// Funzione per stampare i dati in modo formattato
function printDashboard(data, query) {
    console.log(`📊 Dashboard per "${query}":`);

    if (data.city && data.country) {
        console.log(`📍 ${data.city}, ${data.country}`);
    }

    if (data.temperature && data.weather) {
        console.log(`🌡️ ${data.temperature}°C, ${data.weather}`);
    }

    if (data.airport) {
        console.log(`✈️ Aeroporto: ${data.airport}`);
    }

    // Se tutti i dati sono null
    if (!data.city && !data.country && !data.temperature && !data.weather && !data.airport) {
        console.log('❌ Nessun dato trovato per questa città');
    }

    console.log('---');
}

// Test con "london" (tutti i dati presenti)
getDashboardData("london")
    .then(data => printDashboard(data, "london"))
    .catch(error => console.error('Test fallito:', error));

// Test con "vienna" (dove manca il meteo)
getDashboardData("vienna")
    .then(data => printDashboard(data, "vienna"))
    .catch(error => console.error('Test fallito:', error));