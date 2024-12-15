const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Array untuk menyimpan data menu
let menuItems = [];

// Route untuk testing
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Route untuk mendapatkan semua menu
app.get('/api/menu', (req, res) => {
    res.json(menuItems);
});

// Route untuk menambah menu
app.post('/api/menu/add', (req, res) => {
    try {
        const { name, price, category } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({ 
                message: 'Semua field harus diisi'
            });
        }

        const newItem = {
            id: menuItems.length + 1,
            name,
            price: Number(price),
            category
        };

        menuItems.push(newItem);
        res.status(201).json(newItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route untuk update menu
app.put('/api/menu/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = menuItems.findIndex(item => item.id === id);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Menu tidak ditemukan' });
        }

        menuItems[itemIndex] = {
            ...menuItems[itemIndex],
            ...req.body
        };

        res.json(menuItems[itemIndex]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route untuk delete menu
app.delete('/api/menu/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const itemIndex = menuItems.findIndex(item => item.id === id);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Menu tidak ditemukan' });
        }

        const deletedItem = menuItems.splice(itemIndex, 1);
        res.json(deletedItem[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buat HTTP server
const server = http.createServer(app);

// Buat WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('Client connected');

    // Kirim data menu saat client connect
    ws.send(JSON.stringify(menuItems));

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Definisikan port
const PORT = process.env.PORT || 3000;

// Jalankan server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`HTTP server: http://localhost:${PORT}`);
    console.log(`WebSocket server: ws://localhost:${PORT}`);
});
