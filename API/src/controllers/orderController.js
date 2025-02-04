const menu = require('../data/menuData');
let orders = require('../data/orderData');

exports.placeOrder = (req, res) => {
    const { sandwichId, extrasIds } = req.body;

    if (new Set(extrasIds).size !== extrasIds.length) {
        return res.status(400).json({ error: 'No se permiten elementos duplicados en el pedido.' });
    }

    const sandwich = menu.find(item => item.id === sandwichId && item.type === 'sandwich');
    if (!sandwich) {
        return res.status(400).json({ error: 'Sandwich no válido.' });
    }

    const extras = extrasIds.map(id => menu.find(item => item.id === id && item.type === 'extra')).filter(Boolean);
    if (extras.length !== extrasIds.length) {
        return res.status(400).json({ error: 'Extras no válidos.' });
    }

    let total = sandwich.price;
    extras.forEach(item => total += item.price);

    let discount = 0;
    if (extras.length === 2) {
        discount = 0.2;
    } else if (extras.some(item => item.name === 'Soft drink')) {
        discount = 0.15;
    } else if (extras.some(item => item.name === 'Fries')) {
        discount = 0.1;
    }

    const finalTotal = total * (1 - discount);

    const order = {
        id: orders.length + 1,
        sandwich,
        extras,
        total: finalTotal,
        discount: discount * 100
    };

    orders.push(order);
    res.status(201).json(order);
};

exports.getOrders = (req, res) => {
    res.status(200).json(orders);
};

exports.updateOrder = (req, res) => {
    const { id } = req.params;
    const { sandwichId, extrasIds } = req.body;

    const orderIndex = orders.findIndex(order => order.id === parseInt(id));
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Pedido no encontrado.' });
    }

    if (new Set(extrasIds).size !== extrasIds.length) {
        return res.status(400).json({ error: 'No se permiten elementos duplicados en el pedido.' });
    }

    const sandwich = menu.find(item => item.id === sandwichId && item.type === 'sandwich');
    if (!sandwich) {
        return res.status(400).json({ error: 'Sandwich no válido.' });
    }

    const extras = extrasIds.map(id => menu.find(item => item.id === id && item.type === 'extra')).filter(Boolean);
    if (extras.length !== extrasIds.length) {
        return res.status(400).json({ error: 'Extras no válidos.' });
    }

    let total = sandwich.price;
    extras.forEach(item => total += item.price);

    let discount = 0;
    if (extras.length === 2) {
        discount = 0.2;
    } else if (extras.some(item => item.name === 'Soft drink')) {
        discount = 0.15;
    } else if (extras.some(item => item.name === 'Fries')) {
        discount = 0.1;
    }

    const finalTotal = total * (1 - discount);

    orders[orderIndex] = {
        ...orders[orderIndex],
        sandwich,
        extras,
        total: finalTotal,
        discount: discount * 100
    };

    res.status(200).json(orders[orderIndex]);
};

exports.deleteOrder = (req, res) => {
    const { id } = req.params;

    const orderIndex = orders.findIndex(order => order.id === parseInt(id));
    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found.' });
    }

    orders.splice(orderIndex, 1);
    res.status(200).json({ message: 'Order eliminated successfully.' });
};