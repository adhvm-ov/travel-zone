const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'mysql-36b9e26a-travel-zone.c.aivencloud.com',
  port: 14600,
  user: 'avnadmin',
  password: 'AVNS_PrEWATHYYWJGUkrICPi',
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM employees WHERE email = ? AND password = ?", [email, password], (err, data) => {
    if (err) return res.status(500).json({ message: "خطأ في قاعدة البيانات", error: err.message });
    if (data.length > 0) return res.json({ message: "Success", user: data[0] });
    return res.status(401).json({ message: "الايميل أو الباسورد غلط" });
  });
});

app.get('/', (req, res) => res.send("Server is Running! 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));