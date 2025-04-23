import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './App.css'

function App() {
  const [msg, setMsg] = useState("");

  const backendUrl = import.meta.env.VITE_API_URL; // ✅ This replaces process.env...
  console.log("Backend URL:", backendUrl);

  const UploadArea = ({ onFileUpload }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {'image/*': []},
      onDrop: acceptedFiles => {
        onFileUpload(acceptedFiles[0]);
      }
    });
    return (
      <div {...getRootProps()} className="p-6 border-2 border-dashed rounded-xl text-center">
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the image here...</p> :
            <p>Drag 'n' drop an image, or click to select one</p>
        }
      </div>
    );
  };

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
      <h1>Color Cast Removal in Outdoor Images</h1>
      <button onClick={fetchMessage}>Click Me</button>
      <p>{msg}</p>
      <h2 style={{ marginTop: '2rem' }}>Upload an Image</h2>
      <UploadArea onFileUpload={(file) => console.log("Uploaded file:", file)} />
    </div>
  );
};

export default App
