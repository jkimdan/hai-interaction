import { useState, useRef, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import TablePreview from './components/TablePreview';
import Chat from './components/Chat';
import MessageInput from './components/MessageInput';
import { bouncy } from 'ldrs';

bouncy.register();
const url = "http://127.0.0.1:8000/";
function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const chatContainerRef = useRef(null);

  function sendMessage() {
    if (message === "") return;
    setChatHistory((prev) => [...prev, { sender: "user", message: message }]);
    setMessage("");
    setLoading(true);
    fetch(`${url}query`, {
      method: 'POST',
      body: JSON.stringify({ prompt: message }),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(data => {
      setChatHistory((prev) => [...prev, { sender: "bot", message: data.response }]);
    })
    .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="h-screen w-full flex flex-col">
      <h1 className="text-5xl font-bold p-4">VisGPT</h1>

      <FileUpload onFileParsed={setCsvData} />
      <TablePreview csvData={csvData} showTable={showTable} toggleTable={() => setShowTable(!showTable)} />
      <Chat chatHistory={chatHistory} loading={loading} chatContainerRef={chatContainerRef} />
      <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} loading={loading} />
    </div>
  );
}

export default App;
