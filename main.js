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

        // Prendiamo il primo risultato di ogni array
        const destination = destinations[0];
        const weather = weathers[0];
        const airport = airports[0];

        // Creiamo l'oggetto con i dati aggregati
        const dashboardData = {
            city: destination?.name || 'N/A',
            country: destination?.country || 'N/A',
            temperature: weather?.temperature || 'N/A',
            weather: weather?.weather_description || 'N/A',
            airport: airport?.name || 'N/A'
        };

        return dashboardData;

    } catch (error) {
        console.error('Errore nel recupero dei dati:', error);
        throw error;
    }
}

// Test della funzione con "london"
getDashboardData("london")
    .then(data => {
        console.log(`Dashboard per ${data.city}, ${data.country}:`);
        console.log(`- Temperatura: ${data.temperature}°C`);
        console.log(`- Meteo: ${data.weather}`);
        console.log(`- Aeroporto principale: ${data.airport}`);
    })
    .catch(error => console.error('Test fallito:', error));