import { useState, useRef, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import TablePreview from './components/TablePreview';
import Chat from './components/Chat';
import MessageInput from './components/MessageInput';
import { bouncy } from 'ldrs';

bouncy.register();
const url = "https://hai-interaction.onrender.com";
function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [csvData, setCsvData] = useState([]);
  const [showTable, setShowTable] = useState(true);
  const chatContainerRef = useRef(null);
  const [datasetInfo, setDatasetInfo] = useState([]);
  const [fileUrl, setFileUrl] = useState("")
  
  function clearChatHistory() {
    setChatHistory([]);
  }
  
  function sendMessage() {
    if (message === "") return;
    setChatHistory((prev) => [...prev, { sender: "user", message }]);
    setMessage("");
    setLoading(true);
    fetch(`${url}/query`, {
      method: "POST",
      body: JSON.stringify({ prompt: message, dataset_info: datasetInfo, file_url: fileUrl }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => response.json())
      .then((data) => {
        const response = data.response;
        if (data.response && response.spec && response.description) {
          setChatHistory((prev) => [
            ...prev,
            {
              sender: "bot",
              message: {
                description: response.description,
                spec: response.spec,
              },
            },
          ]);
        } else if (data.response && response.description) {
          setChatHistory((prev) => [
            ...prev,
            {
              sender: "bot",
              message: response.description,
            },
          ]);
        } 
        else {
          setChatHistory((prev) => [
            ...prev,
            {
              sender: "bot",
              message: "Sorry, I couldn't process your request.",
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setChatHistory((prev) => [
          ...prev,
          {
            sender: "bot",
            message: "An error occurred while processing your request.",
          },
        ]);
      })
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    const scrollTimeout = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);
    return () => clearTimeout(scrollTimeout);
  }, [chatHistory]);

  const handleFileParsed = ({ fullData, datasetInfo, fileUrl }) => {
    setCsvData(fullData);       
    setDatasetInfo(datasetInfo);
    setFileUrl(fileUrl);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      <h1 className="text-5xl font-bold p-4">VisGPT</h1>
      <FileUpload onFileParsed={handleFileParsed} />
      <TablePreview csvData={csvData} showTable={showTable} toggleTable={() => setShowTable(!showTable)} />
      <Chat chatHistory={chatHistory} loading={loading} chatContainerRef={chatContainerRef} csvData={csvData} />
      <MessageInput message={message} setMessage={setMessage} sendMessage={sendMessage} loading={loading} clearMessages={clearChatHistory} />
    </div>
  );
}

export default App;
// placeholder 