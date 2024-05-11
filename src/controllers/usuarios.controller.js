const { pool } = require('../db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config.js');

exports.getUsuarios = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users');
        res.json(rows);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.getUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT avatar, created_at, user_id, username FROM users WHERE user_id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.registerUsuario = async (req, res) => {
    const { username, password, avatar } = req.body;
    if (!username || !password ) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const [rowsUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rowsUser.length === 0) {
                const hashPass = bcrypt.hashSync(password, 10);
                const [rows] = await pool.query('INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)', [username, hashPass, avatar]);
                if (rows.insertId) {
                    const token = jwt.sign({ username, user_id: rows.insertId }, SECRET_KEY, { expiresIn: '24h' });
                    res.status(200).send({
                        id: rows.insertId,
                        token
                    });
                } else {
                    return res.status(400).json({
                        message: 'No se pudo registrar usuario'
                    });
                }
            
        } else {
            return res.status(400).json({
                message: 'El nombre de usuario ya existe'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.loginUsuario = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    try {
        const [rowsUser] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rowsUser.length !== 0) {
            const coincide = bcrypt.compareSync(password, rowsUser[0].password);
            if (!coincide) {
                return res.status(401).json({ message: 'Contraseña incorrecta' });
            }
            const token = jwt.sign({ username, user_id: rowsUser[0].user_id }, SECRET_KEY, { expiresIn: '24h' });
            res.status(200).json({ message: 'Inicio de sesión exitoso', token });
        } else {
            return res.status(400).json({
                message: 'El usuario no existe'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.updateUsuario = async (req, res) => {
    const { id } = req.params;
    let { password, avatar } = req.body;
    try {
        if (password) {
            password = bcrypt.hashSync(password, 10);
        }
        const result = await pool.query('UPDATE users set password = IFNULL(?, password), avatar = IFNULL(?, avatar) WHERE user_id = ?', [password, avatar, id]);
        if (result.affectedRows === 0) return res.status(404).json({
            message: 'Servicio not found'
        });

        const [rows] = await pool.query('SELECT * FROM users WHERE user_id = ?', [id]);

        res.send(rows[0]);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [req.params.id]);
        if (result.affectedRows <= 0) return res.status(404).json({
            message: 'Servicio not found'
        });

        res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({
            message: 'Something goes wrong'
        });
    }
};
