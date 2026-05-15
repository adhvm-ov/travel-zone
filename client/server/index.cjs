const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// إعداد رفع الملفات
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ملاحظة: لما نرفع الداتا بيز أونلاين هنغير البيانات دي بالبيانات الجديدة
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'travel_zone',
});

// المسارات (Routes) كما هي
app.post('/add-customer', upload.single('receipt'), (req, res) => {
  const { name, phone, destination, price } = req.body;
  const receipt_img = req.file ? req.file.filename : null;
  const sql = "INSERT INTO customers (customer_name, phone, notes, trip_price, receipt_img) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [name, phone, destination, price, receipt_img], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Success" });
  });
});

app.get('/customers', (req, res) => {
  db.query("SELECT * FROM customers ORDER BY id DESC", (err, result) => res.json(result));
});

// البورت المرن للاستضافة
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});