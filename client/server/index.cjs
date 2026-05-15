const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// إعداد مجلد الصور ليعمل على Vercel
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

// الربط مع Aiven (البيانات من سكرين شوت HeidiSQL و Aiven Console)
const db = mysql.createConnection({
  host: 'mysql-36b9e26a-travel-zone.c.aivencloud.com',
  port: 14600,
  user: 'avnadmin',
  password: 'AVNS_PrEWATHYYWJGUkrICPi',
  database: 'defaultdb',
  ssl: { rejectUnauthorized: false }
});

db.connect(err => {
  if (err) console.error("❌ Aiven Connection Error:", err);
  else console.log("✅ Connected to Aiven Cloud!");
});

// --- المسارات (Routes) ---

// مسار تسجيل الدخول
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * FROM employees WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    if (data.length > 0) {
      res.json({ message: "Success", user: data[0] });
    } else {
      res.status(401).json({ message: "Failed" });
    }
  });
});

// مسار جلب العملاء
app.get('/customers', (req, res) => {
  db.query("SELECT * FROM customers ORDER BY id DESC", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// مسار إضافة عميل جديد مع صورة الإيصال
app.post('/add-customer', upload.single('receipt'), (req, res) => {
  const { name, phone, notes, price } = req.body;
  const receipt_img = req.file ? req.file.originalname : null;
  const sql = "INSERT INTO customers (customer_name, phone, notes, trip_price, receipt_img) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, phone, notes, price, receipt_img], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Success" });
  });
});

// رسالة التأكد أن السيرفر يعمل
app.get('/', (req, res) => res.send("Travel Zone API is LIVE 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));