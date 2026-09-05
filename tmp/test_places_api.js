const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

const envPath = 'c:/Users/shubh/OneDrive/Desktop/antigravity/evisiting_card/.env';

if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.error('.env file not found at:', envPath);
    process.exit(1);
}

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

if (!GOOGLE_PLACES_API_KEY) {
    console.error('GOOGLE_PLACES_API_KEY is not set in .env');
    process.exit(1);
}

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
