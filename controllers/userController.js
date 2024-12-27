const db = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getAllUsers = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM users');
        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Criptografar a senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const [result] = await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);
        res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        await db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id]);
        res.status(200).json({ id, name, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
        res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
