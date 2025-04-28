import { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './App.css'

function App() {
  const [msg, setMsg] = useState("");

  const backendUrl = import.meta.env.VITE_API_URL; 
  const [beforeUrl, setBeforeUrl] = useState(null);
  const [afterUrl, setAfterUrl] = useState(null);
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

  const UploadWithProgress = () => {
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
  
    const uploadFile = (file) => {
      setUploading(true);
      const formData = new FormData();
      formData.append('image', file);
  
      fetch(`${backendUrl}/api/process`, {
        method: 'POST',
        body: formData,
      }).then(async (res) => {
        const data = await res.json();
        setMsg(data.message);
        setBeforeUrl(data.before_url);
        setAfterUrl(data.after_url);
      });
  
      // Fake progress (or use progress from backend)
      let prog = 0;
      const interval = setInterval(() => {
        prog += 10;
        setProgress(prog);
        if (prog >= 100) {
          clearInterval(interval);
          setUploading(false);
        }
      }, 200);
    };
  
    return (
      <>
        <UploadArea onFileUpload={uploadFile} />
        {uploading && <progress value={progress} max="100" />}
      </>
    );
  };

  const BeforeAfter = ({ beforeUrl, afterUrl }) => {
    return (
      <div className="mt-4">
        <CompareImage leftImage={beforeUrl} rightImage={afterUrl} />
      </div>
    );
  };
  
  return (
    <div className="App" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Color Cast Removal in Outdoor Images</h1>
      <button onClick={fetchMessage}>Click Me</button>
      <p>{msg}</p>
      <h2 style={{ marginTop: '2rem' }}>Upload an Image</h2>
      <UploadWithProgress />  {}
      {beforeUrl && afterUrl && <BeforeAfter beforeUrl={beforeUrl} afterUrl={afterUrl} />}
    </div>
  );
};

export default App
