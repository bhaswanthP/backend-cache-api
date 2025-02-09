const express = require('express');
const dotenv = require('dotenv');
const app = express();
const cors = require('cors');
dotenv.config();

app.use(express.json());
app.use('cors');

const cache = new Map();
const MAX_SIZE = process.env.MAX_SIZE || 10;

app.get('/', (req, res) => {
    res.send('Welcome to the Backend Cache API');
});

app.post('/cache', (req, res) => {
    const { key, value } = req.body;
    if(cache.size >= MAX_SIZE) {
        return res
                .status(400)
                .json({ error: 'Cache limit exceeded' });
    }
    cache.set(key, value);
    res.status(201)
        .json({ message: 'key-value pair added', key, value});
});

app.get('/cache/:key', (req, res) => {
    const key = req.params.key;
    if (cache.has(key)) {
        return res.status(200)
                    .json({ key, value: cache.get(key) });
    }
    res.status(404)
        .json({ error: 'Key not found' });
});

app.delete('/cache/:key', (req, res) => {
    const key = req.params.key;
    if (cache.delete(key)) {
        return res.status(200)
                    .json({ message: 'Key-Value pair deleted', key });    }
    res.status(404).json({ error: 'Key not found' });
});

app.get('/cache_status', (req, res) => {
    const cacheEntries = Array.from(cache.entries()).map(([key, value]) => ({ key, value }));
    res.status(200).json(cacheEntries);
});

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})