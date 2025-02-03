const express = require('express');
const menuController = require('../controllers/menuController');

const router = express.Router();

router.get('/', menuController.getMenu);
router.get('/sandwiches', menuController.getSandwiches);
router.get('/extras', menuController.getExtras);

module.exports = router;