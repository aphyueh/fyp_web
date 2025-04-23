import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './App.css'

function App() {
  const [msg, setMsg] = useState("");

  const backendUrl = import.meta.env.VITE_API_URL; // ✅ This replaces process.env...
  console.log("Backend URL:", backendUrl);

  const fetchMessage = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/hello`);
      const data = await res.json();
      setMsg(data.message);
    } catch (error) {
      setMsg("Failed to fetch message.");
      console.error(error);
    }
  };
  
  return (
    <div className="App" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>React + Flask (Cloud Run)</h1>
      <button onClick={fetchMessage}>Click Me</button>
      <p>{msg}</p>
    </div>
  );
};

export default App
