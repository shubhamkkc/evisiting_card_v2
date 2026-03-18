const GOOGLE_PLACES_API_KEY = "QXcwQqhnn3__5Uj5vnoqSGoqSS0=";
const query = 'restaurant in Delhi';
const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`;

async function testAPI() {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log('API Status:', data.status);
        if (data.status === 'OK') {
            console.log('Total Results:', data.results ? data.results.length : 0);
            if (data.results && data.results.length > 0) {
                console.log('First Result Name:', data.results[0].name);
            }
        } else {
            console.log('Full Response:', JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testAPI();
