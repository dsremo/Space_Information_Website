// index.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Sample array of countries
const countries = [
    { name: 'India', capital: 'New Delhi' },
    { name: 'USA', capital: 'Washington D.C.' },
    { name: 'UK', capital: 'London' }
];

// Route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Country Events Website! Use /countries to get the list of countries.');
});

// Route to display list of countries
app.get('/countries', (req, res) => {
    res.json(countries);
});

// Route to display a specific country by name
app.get('/countries/:name', (req, res) => {
    const { name } = req.params;
    const country = countries.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (!country) {
        res.status(404).send('Country not found');
    } else {
        res.json(country);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
