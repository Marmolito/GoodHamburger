const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

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

const orders = [];

app.get('/menu', (req, res) => {
    res.json(menu);
});

app.get('/sandwiches', (req, res) => {
    res.json(menu.sandwiches);
});

app.get('/extras', (req, res) => {
    res.json(menu.extras);
});

app.post('/orders', (req, res) => {
    const { sandwich, fries, softDrink } = req.body;

    if (!sandwich || (fries && fries > 1) || (softDrink && softDrink > 1)) {
        return res.status(400).json({ error: "Pedido inválido. No se pueden repetir elementos." });
    }

    let total = menu.sandwiches.find(s => s.id === sandwich)?.price || 0;
    if (fries) total += 2.00;
    if (softDrink) total += 2.50;

    if (fries && softDrink) total *= 0.8;
    else if (softDrink) total *= 0.85;
    else if (fries) total *= 0.9;

    const order = { id: orders.length + 1, sandwich, fries, softDrink, total: total.toFixed(2) };
    orders.push(order);
    res.status(201).json(order);
});

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.put('/orders/:id', (req, res) => {
    const { id } = req.params;
    const { sandwich, fries, softDrink } = req.body;
    const order = orders.find(o => o.id == id);
    if (!order) return res.status(404).json({ error: "Pedido no encontrado." });

    order.sandwich = sandwich || order.sandwich;
    order.fries = fries !== undefined ? fries : order.fries;
    order.softDrink = softDrink !== undefined ? softDrink : order.softDrink;

    res.json(order);
});

app.delete('/orders/:id', (req, res) => {
    const { id } = req.params;
    const index = orders.findIndex(o => o.id == id);
    if (index === -1) return res.status(404).json({ error: "Pedido no encontrado." });

    orders.splice(index, 1);
    res.status(204).send();
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
