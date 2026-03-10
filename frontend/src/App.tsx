import { useState } from 'react'

function App() {
  const [inputSecret, setInputSecret] = useState('');
  const [currentSecret, setCurrentSecret] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3000/users');
      const data = await res.json();
      // โจทย์: เรียงตัวอักษรรายชื่อ (A-Z)
      const sorted = data.sort((a, b) => a.display_name.localeCompare(b.display_name));
      setUsers(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleCheckin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:3000/users/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret: inputSecret })
      });

      if (!res.ok) throw new Error('ไม่พบซีเคร้ตนี้ในระบบ');

      setCurrentSecret(inputSecret);
      await fetchUsers(); // เช็คอินเสร็จแล้วดึง List ทันที
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>User Check-in (React)</h1>

      {!currentSecret ? (
        <form onSubmit={handleCheckin}>
          <input 
            type="text" 
            value={inputSecret}
            onChange={(e) => setInputSecret(e.target.value)}
            placeholder="กรอกซีเคร้ต (ลอง: 1234 หรือ 1111)"
            style={{ padding: '10px', width: '70%', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '10px 20px' }}>ตกลง</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <div>
          <h3>รายชื่อผู้ใช้ทั้งหมด</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {users.map(user => (
              <li key={user.id} style={{
                padding: '15px',
                margin: '10px 0',
                border: '1px solid #ddd',
                borderRadius: '8px',
                // โจทย์: Highlight ชื่อที่ Checkin อยู่
                backgroundColor: user.secret === currentSecret ? '#fff3cd' : '#fff',
                borderColor: user.secret === currentSecret ? '#ffc107' : '#ddd',
                boxShadow: user.secret === currentSecret ? '0 4px 6px rgba(0,0,0,0.1)' : 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{user.display_name}</strong>
                  {user.secret === currentSecret && <span style={{ color: '#856404', fontWeight: 'bold' }}>★ คุณ</span>}
                </div>
                <div style={{ fontSize: '0.85em', color: '#666', marginTop: '5px' }}>
                  Check-in ล่าสุด: {user.last_checkin ? new Date(user.last_checkin).toLocaleString() : 'ยังไม่มีข้อมูล'}
                </div>
              </li>
            ))}
          </ul>
          <button onClick={() => {setCurrentSecret(''); setInputSecret('');}} style={{ marginTop: '20px' }}>
            ออกจากระบบ
          </button>
        </div>
      )}
    </div>
  )
}

export default App
