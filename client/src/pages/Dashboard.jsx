import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [user] = useState(JSON.parse(localStorage.getItem('user')));
  const [form, setForm] = useState({ name: '', phone: '', destination: '', price: '' });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    const res = await axios.get('https://travel-zone-seven.vercel.app/customers');
    setCustomers(res.data);
  };

  const handleAddCustomer = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    formData.append('destination', form.destination);
    formData.append('price', form.price);
    if (file) formData.append('receipt', file);

    try {
      await axios.post('https://travel-zone-seven.vercel.app/customers', formData);
      alert('تمت إضافة العميل بنجاح ✅');
      fetchCustomers();
      setForm({ name: '', phone: '', destination: '', price: '' });
      setFile(null);
    } catch (err) {
      alert('حدث خطأ أثناء الإضافة');
    }
  };

  return (
    <div className="p-8 bg-slate-900 min-h-screen text-white font-sans" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400 text-center">لوحة تحكم منطقة السفر 👋</h1>
      
      {/* فورم الإضافة */}
      <div className="bg-slate-800 p-6 rounded-2xl mb-10 shadow-lg border border-slate-700">
        <h2 className="text-xl mb-4 font-bold text-slate-300 text-center">إضافة رحلة جديدة</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input value={form.name} placeholder="اسم العميل" className="p-3 rounded-lg bg-slate-700 text-white outline-none border border-slate-600 focus:border-cyan-500" onChange={(e) => setForm({...form, name: e.target.value})} />
          <input value={form.phone} placeholder="رقم الهاتف" className="p-3 rounded-lg bg-slate-700 text-white outline-none border border-slate-600 focus:border-cyan-500" onChange={(e) => setForm({...form, phone: e.target.value})} />
          <input value={form.destination} placeholder="الوجهة" className="p-3 rounded-lg bg-slate-700 text-white outline-none border border-slate-600 focus:border-cyan-500" onChange={(e) => setForm({...form, destination: e.target.value})} />
          <input value={form.price} placeholder="السعر" className="p-3 rounded-lg bg-slate-700 text-white outline-none border border-slate-600 focus:border-cyan-500" onChange={(e) => setForm({...form, price: e.target.value})} />
        </div>
        <div className="flex flex-col items-center">
          <label className="mb-2 text-sm text-slate-400">إرفاق صورة الإيصال (اختياري):</label>
          <input type="file" className="mb-4 text-sm" onChange={(e) => setFile(e.target.files[0])} />
          <button onClick={handleAddCustomer} className="bg-cyan-500 hover:bg-cyan-600 px-10 py-3 rounded-lg font-bold transition-all w-full md:w-1/2">حفظ +</button>
        </div>
      </div>

      {/* الجدول */}
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-slate-700">
        <table className="w-full text-right">
          <thead className="bg-slate-700 text-cyan-400">
            <tr>
              <th className="p-4 border-b border-slate-600">اسم العميل</th>
              <th className="p-4 border-b border-slate-600">الهاتف</th>
              <th className="p-4 border-b border-slate-600">الوجهة</th>
              <th className="p-4 border-b border-slate-600">السعر</th>
              <th className="p-4 border-b border-slate-600">الإيصال</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={i} className="border-t border-slate-700 hover:bg-slate-750 transition-colors">
                <td className="p-4 text-slate-200">{c.customer_name}</td>
                <td className="p-4 text-slate-300">{c.phone}</td>
                <td className="p-4 text-slate-300">{c.notes}</td>
                <td className="p-4 text-green-400 font-bold">{c.trip_price} ج.م</td>
                <td className="p-4 text-cyan-400">
                  {c.receipt_img && <a href={'https://travel-zone-seven.vercel.app/customers'} target="_blank" rel="noreferrer">عرض 🖼️</a>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}