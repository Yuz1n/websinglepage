const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;
require('dotenv').config();

app.use(express.static('static'));

TIER_COLORS = {
    "12683d76-48d7-84a3-4e09-6985794f0445": [52, 67, 84],
    "0cebb8be-46d7-c12a-d306-e9907bfc5a25": [34, 65, 66],
    "60bca009-4182-7998-dee7-b8a2558dc369": [75, 52, 67],
    "411e4a55-4e59-7757-41f0-86a53f101bb5": [84, 78, 58],
    "e046854e-406c-37f4-6607-19a9ba8426fc": [83, 65, 57],
}

ICON_TIERS = {
    "12683d76-48d7-84a3-4e09-6985794f0445": "https://media.valorant-api.com/contenttiers/12683d76-48d7-84a3-4e09-6985794f0445/displayicon.png",
    "0cebb8be-46d7-c12a-d306-e9907bfc5a25": "https://media.valorant-api.com/contenttiers/0cebb8be-46d7-c12a-d306-e9907bfc5a25/displayicon.png",
    "60bca009-4182-7998-dee7-b8a2558dc369": "https://media.valorant-api.com/contenttiers/60bca009-4182-7998-dee7-b8a2558dc369/displayicon.png",
    "411e4a55-4e59-7757-41f0-86a53f101bb5": "https://media.valorant-api.com/contenttiers/411e4a55-4e59-7757-41f0-86a53f101bb5/displayicon.png",
    "e046854e-406c-37f4-6607-19a9ba8426fc": "https://media.valorant-api.com/contenttiers/e046854e-406c-37f4-6607-19a9ba8426fc/displayicon.png",
}

TRADUCAO = {
    "Ranked Ready":"Pronto para Ranked",
    "No rank":"Sem Rank",
    "Iron 1":"Ferro 1",
    "Iron 2":"Ferro 2",
    "Iron 3":"Ferro 3",
    "Bronze 1":"Bronze 1",
    "Bronze 2":"Bronze 2",
    "Bronze 3":"Ferro 3",
    "Silver 1":"Prata 1",
    "Silver 2":"Prata 2",
    "Silver 3":"Prata 3",
    "Gold 1":"Ouro 1",
    "Gold 2":"Ouro 2",
    "Gold 3":"Ouro 3",
    "Platinum 1":"Platina 1",
    "Platinum 2":"Platina 2",
    "Platinum 3":"Platina 3",
    "Diamond 1":"Diamante 1",
    "Diamond 2":"Diamante 2",
    "Diamond 3":"Diamante 3",
    "Ascendant 1":"Ascendente 1",
    "Ascendant 2":"Ascendente 2",
    "Ascendant 3":"Ascendente 3",
    "Immortal 1":"Imortal 1",
    "Immortal 2":"Imortal 2",
    "Immortal 3":"Imortal 3",
    "Radiant":"Radiante",
}

app.get('/api/traducoes', (req, res) => {
    console.log('Received request for /api/traducoes'); // Debug log
    try {
        res.json({ traducoes: TRADUCAO });
    } catch (error) {
        console.error('Error parsing TRADUCAO:', error.message);
        res.status(500).json({ error: 'Failed to parse environment variables' });
    }
});

app.get('/api/tier-colors', (req, res) => {
    console.log('Received request for /api/tier-colors'); // Debug log
    try {
        res.json({ tierColors: TIER_COLORS, iconTiers: ICON_TIERS });
    } catch (error) {
        console.error('Error parsing TIER_COLORS or ICON_TIERS:', error.message);
        res.status(500).json({ error: 'Failed to parse environment variables' });
    }
});

app.get('/api/:id', async (req, res) => {
    try {
        const response = await axios.get(`https://prod-api.lzt.market/${req.params.id}`, {
            headers: {
                accept: 'application/json',
                authorization: `Bearer ${process.env.LTZ_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching LZT API:', error.message);
        res.status(500).json({ error: 'Failed to fetch data from LZT API' });
    }
});

// Catch-all for debugging 404s
app.use((req, res) => {
    console.log(`404: Requested path: ${req.path}`);
    res.status(404).json({ error: 'Endpoint not found' });
});

app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));