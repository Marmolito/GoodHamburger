const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

const menu = {
    sandwiches: [
        { id: 1, name: "X Burger", price: 5.00 },
        { id: 2, name: "X Egg", price: 4.50 },
        { id: 3, name: "X Bacon", price: 7.00 }
    ],
    extras: [
        { id: 4, name: "Fries", price: 2.00 },
        { id: 5, name: "Soft drink", price: 2.50 }
    ]
};

let orders = [];

app.get('/menu', (req, res) => res.json(menu));

app.get('/sandwiches', (req, res) => res.json(menu.sandwiches));

app.get('/extras', (req, res) => res.json(menu.extras));

app.post('/orders', (req, res) => {
    const { sandwichId, extraIds } = req.body;
    if (!menu.sandwiches.some(s => s.id === sandwichId)) {
        return res.status(400).json({ error: "Invalid sandwich selection." });
    }
    if (extraIds && extraIds.length > 2) {
        return res.status(400).json({ error: "Too many extras selected." });
    }
    
    const selectedSandwich = menu.sandwiches.find(s => s.id === sandwichId);
    let total = selectedSandwich.price;
    let selectedExtras = [];
    
    if (extraIds) {
        selectedExtras = menu.extras.filter(e => extraIds.includes(e.id));
        if (selectedExtras.length !== extraIds.length) {
            return res.status(400).json({ error: "Invalid extra selection." });
        }
        total += selectedExtras.reduce((sum, e) => sum + e.price, 0);
    }

    if (selectedExtras.length === 2) {
        total *= 0.8;
    } else if (selectedExtras.some(e => e.id === 5) && selectedExtras.length === 1) {
        total *= 0.85;
    } else if (selectedExtras.some(e => e.id === 4) && selectedExtras.length === 1) {
        total *= 0.9;
    }

    const order = { id: orders.length + 1, sandwichId, extraIds, total: total.toFixed(2) };
    orders.push(order);
    res.status(201).json(order);
});

app.get('/orders', (req, res) => res.json(orders));

app.put('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    const orderIndex = orders.findIndex(o => o.id === orderId);
    if (orderIndex === -1) return res.status(404).json({ error: "Order not found." });
    
    const { sandwichId, extraIds } = req.body;
    if (sandwichId && orders[orderIndex].sandwichId !== sandwichId) {
        return res.status(400).json({ error: "Order cannot contain more than one sandwich." });
    }
    if (extraIds) {
        const uniqueExtras = new Set(extraIds);
        if (uniqueExtras.size !== extraIds.length) {
            return res.status(400).json({ error: "Order cannot contain duplicate extras." });
        }
    }
    
    orders[orderIndex] = { ...orders[orderIndex], ...req.body };
    res.json(orders[orderIndex]);
});

app.delete('/orders/:id', (req, res) => {
    const orderId = parseInt(req.params.id);
    orders = orders.filter(o => o.id !== orderId);
    res.status(204).send();
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
