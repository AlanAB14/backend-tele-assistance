const { pool } = require('../db.js');
const { SECRET_KEY } = require('../config.js');
const jwt = require('jsonwebtoken');

exports.getContacts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM contacts');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.createContact = async (req, res) => {
    let { name, email, message } = req.body;

    try {
        const token = req.header('Authorization');
        if (!name || !email || !message) {
            return res.status(400).json({
                message: 'Faltan campos'
            });
        }

        // var authorization = req.headers.authorization.split(' ')[1];
        // var decoded = jwt.verify(authorization, SECRET_KEY);
        // if (decoded.role_id === 3) {
        //     return res.status(400).json({
        //         message: 'El usuario no tiene privilegios para realizar la acción'
        //     });
        // }
        const result = await pool.query('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?, ?, ?)', [name, email, message]);
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Contact not found'
        });

        const [rows] = await pool.query('SELECT * FROM contacts WHERE id = ?', [result[0].insertId]);
        res.send(rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};


exports.deleteContact = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Contact not found'
        });

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};