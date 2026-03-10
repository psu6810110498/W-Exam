import { useState } from 'react'

export default function App() {
  const [inputSecret, setInputSecret] = useState('');
  const [currentUserSecret, setCurrentUserSecret] = useState('');
  const [users, setUser] = useState([]);

  const sortedUsers = computed(() => {
    return [...users.values].sort((a,b) => a.display_name.LocaleCompare(b.display_name))
  });

  const fetchUsers = async () => {
    const res = await fetch('http://localhost:3000/users');
    users.values = await res.json();
  };

  const handleCheckin = async () => {
    error.values = '';
    try {
      const res = await fetch('http://localhost:3000/users/checkin', {
        method: 'POST',
        headers : {'Content-Type': 'application/json'},
        body: JSON.stringify({ secret: inputSecret.value})
      })

      if (!res.ok) throw new Error('Secret ไม่ถูกต้องครับบ')

      currentUserSecret.value = inputSecret.value;
      await fetchUsers();
    } catch​ (err) {
      error.value = err.message;
    }
  };
  const getListStyle = (secret) => {
    return secret === currentUserSecret.value
    ? { backgroundColor: '#e3f2fd', borderColor: '#2196f3', borderWidth: '2px'}
    : {};
  };

  return (
    <>
      <div>
        <h2> Check-in System </h2>
      </div>
      <div>
        <input placeholder='กรอก Secret ของคุณ'> </input>
        <button> Click </button>
      </div>

      <div>
        <h3> รายชื่อทั้งหมด </h3>
        <strong>{{user.display_name }}</strong>
        <div>
          เช็คอินล่าสุด {{user.last_checkin ? new Date(user.last_checkin).toLocaleDateString}}
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
