const menu = require('../data/menuData');

exports.getMenu = (req, res) => {
    res.status(200).json(menu);
};

exports.getSandwiches = (req, res) => {
    const sandwiches = menu.filter(item => item.type === 'sandwich');
    res.status(200).json(sandwiches);
};

exports.getExtras = (req, res) => {
    const extras = menu.filter(item => item.type === 'extra');
    res.status(200).json(extras);
};