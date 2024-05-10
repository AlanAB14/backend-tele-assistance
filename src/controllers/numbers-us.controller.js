const { SECRET_KEY } = require('../config.js');
const { pool } = require('../db.js');
const jwt = require('jsonwebtoken');

exports.getNumbers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM numbers_us');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.updateNumbers = async (req, res) => {
    let { number, type } = req.body;

    try {
        const token = req.header('Authorization');
        if (!number || !token) {
            return res.status(400).json({
                message: 'Faltan campos'
            });
        }
        
        var authorization = req.headers.authorization.split(' ')[1];
        var decoded = jwt.verify(authorization, SECRET_KEY);
        const result = await pool.query('UPDATE numbers_us set number = IFNULL(?, number), updated_by = IFNULL(?, updated_by) WHERE type = ?', [number, decoded.user_id, type]);
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Servicio not found'
        });

        const [rows] = await pool.query('SELECT * FROM numbers_us WHERE type = ?', [type]);

        res.send(rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};
