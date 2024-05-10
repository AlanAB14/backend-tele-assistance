const express = require('express');
const { verificarToken } = require('../middleware/verificarToken.js');
const { getNumbers, updateNumbers } = require('../controllers/numbers-us.controller.js');

const router = express.Router();

router.get('/numbersUs', getNumbers);
router.patch('/numbersUs', verificarToken, updateNumbers);

module.exports = router;
