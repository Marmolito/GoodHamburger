const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);

module.exports = app;