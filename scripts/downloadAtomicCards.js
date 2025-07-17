const https = require('https');
const fs = require('fs');
const path = require('path')

const url = 'https://mtgjson.com/api/v5/AtomicCards.json';
const filePath = path.resolve(__dirname, '../data/AtomicCards.json');

console.log('Downloading AtomicCards.json...');

https.get(url)