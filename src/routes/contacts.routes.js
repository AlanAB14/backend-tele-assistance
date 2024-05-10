const express = require('express');
const { verificarToken } = require('../middleware/verificarToken.js');
const { getContacts, createContact, deleteContact } = require('../controllers/contacts.controller.js');

const router = express.Router();

router.get('/contacts', verificarToken, getContacts);
router.post('/contacts', createContact);
router.delete('/contacts/:id', verificarToken, deleteContact);

module.exports = router;
