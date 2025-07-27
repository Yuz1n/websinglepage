const express = require('express');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();
console.log('Serving static files from:', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public')))

const cors = require('cors');
app.use(cors({
  origin: ['https://hypecommunity.com.br', 'https://websinglepage.vercel.app']
}));

app.get('/api/accounts', async (req, res) => {
    try {
        const response = await axios.get(`https://apigeral.squareweb.app/account/search?${req._parsedUrl.query}`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.API_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching accounts:', error.message);
        res.status(500).json({ error: 'Failed to fetch accounts from external API' });
    }
});

app.get('/api/traducoes',async (req, res) => {
    try {
        const response = await axios.get('https://apigeral.squareweb.app/config/tier/translate', {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.API_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error parsing traducao tier:', error.message);
        res.status(500).json({ error: 'Failed to parse environment variables' });
    }
});

app.get('/api/colors', async (req, res) => {
    try {
        const response = await axios.get('https://apigeral.squareweb.app/config/tier/colors', {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.API_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error parsing colors:', error.message);
        res.status(500).json({ error: 'Failed to parse environment variables' });
    }
});

app.get('/api/icon', async (req, res) => {
    try {
        const response = await axios.get('https://apigeral.squareweb.app/config/tier/icon', {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.API_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error parsing icon:', error.message);
        res.status(500).json({ error: 'Failed to parse environment variables' });
    }
});

app.get('/api/skin', async (req, res) => {
    try {
        const response = await axios.get('https://apigeral.squareweb.app/config/skins/translate', {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.API_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error parsing skin:', error.message);
        res.status(500).json({ error: 'Failed to parse environment variables' });
    }
});

app.get('/api/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://apigeral.squareweb.app/account/search?id=${req.params.id}`, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.API_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching LZT API:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from LZT API' });
    }
});

// Nova rota padrão para a raiz
app.get('/', (req, res) => {
    const id = req.query.id;
    if (id) {
        res.sendFile(path.join(__dirname, 'public/static/', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, 'public/static/', 'home.html'));
    }
});

// Catch-all for debugging 404s
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));