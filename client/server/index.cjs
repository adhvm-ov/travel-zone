const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// حل مشكلة الـ uploads في Vercel: استخدام المجلد المؤقت /tmp
const uploadDir = '/tmp/uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

// إعداد Multer للتخزين المؤقت
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// --- الربط بقاعدة بيانات Aiven أونلاين بناءً على بياناتك ---
const db = mysql.createConnection({
  host: 'mysql-36b9e26a-travel-zone.c.aivencloud.com',
  port: 14600,
  user: 'avnadmin',
  password: 'AVNS_PrEWATHYYWJGUkrICPi',
  database: 'defaultdb',
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect(err => {
  if (err) {
    console.error("❌ خطأ في الاتصال بـ Aiven:", err);
  } else {
    console.log("✅ متصل بنجاح بسحابة Aiven!");
  }
});

// --- المسارات (Routes) ---

// 1. تسجيل الدخول
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM employees WHERE email = ? AND password = ?", [email, password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data && data.length > 0) res.json({ message: "Success", user: data[0] });
    else res.status(401).json({ message: "Failed" });
  });
});

// 2. إضافة عميل
app.post('/add-customer', upload.single('receipt'), (req, res) => {
  const { name, phone, destination, price } = req.body;
  const receipt_img = req.file ? req.file.filename : null;
  const sql = "INSERT INTO customers (customer_name, phone, notes, trip_price, receipt_img) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, phone, destination, price, receipt_img], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Success" });
  });
});

// 3. جلب قائمة العملاء
app.get('/customers', (req, res) => {
  db.query("SELECT * FROM customers ORDER BY id DESC", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

// 4. تسجيل الحضور
app.post('/attendance/check-in', (req, res) => {
  const { employee_id } = req.body;
  db.query("INSERT INTO attendance (employee_id, check_in, date) VALUES (?, NOW(), CURDATE())", [employee_id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Success" });
  });
});

// رسالة ترحيب عند فتح رابط السيرفر
app.get('/', (req, res) => {
    res.send("Travel Zone API is running on Vercel... 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));