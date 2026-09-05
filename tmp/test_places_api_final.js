const fs = require('fs');
const GOOGLE_PLACES_API_KEY = "[ENCRYPTION_KEY]";
const query = 'restaurant in Delhi';
const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${GOOGLE_PLACES_API_KEY}`;

async function testAPI() {
    let output = {};
    try {
        const response = await fetch(url);
        const data = await response.json();
        output = {
            status: data.status,
            resultsCount: data.results ? data.results.length : 0,
            firstResult: data.results && data.results.length > 0 ? data.results[0].name : null,
            error: data.error_message || null
        };
    } catch (error) {
        output = { error: error.message };
    }
    fs.writeFileSync('c:/Users/shubh/OneDrive/Desktop/antigravity/evisiting_card/tmp/api_result.json', JSON.stringify(output, null, 2));
}

testAPI();
