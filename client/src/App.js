import { useState, useRef, useEffect } from 'react';
import { bouncy } from 'ldrs'
import { csvParse, autoType } from 'd3-dsv';
bouncy.register()
const url = "https://hai-interaction.onrender.com/";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false); 
  const chatContainerRef = useRef(null);
  const [csvData, setCsvData] = useState([]);
  const [showTable, setShowTable] = useState(true);


  function sendMessage() {
    if (message === "") {
      return;
    }

    setChatHistory((prev) => [...prev, { sender: "user", message: message }]);
    setMessage("");
    setLoading(true);

    fetch(`${url}query`, {
      method: 'POST',
      body: JSON.stringify({ prompt: message }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      setChatHistory((prev) => [...prev, { sender: "bot", message: data.response }]);
    })
    .finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      readCSVFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      readCSVFile(file);
    }
  };

  const readCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsedData = csvParse(text, autoType);
      console.log(parsedData);
      setCsvData(parsedData); 
    };
    reader.onerror = (error) => {
      console.error('Error reading CSV file:', error);
    };
    reader.readAsText(file);
  };

  function handleMessage(e) {
    setMessage(e.target.value);
  }
   

return (
<div className="h-screen w-full flex flex-col">
  <h1 className="text-5xl font-bold p-4">VisGPT</h1>

  <div className="px-4">
    <div
      className="hero rounded-lg bg-base-200 h-auto border-dashed border-2 border-gray-400 flex justify-center items-center cursor-pointer mx-auto py-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <label
        htmlFor="file-upload"
        className="hero-content text-center max-w-md flex flex-col justify-center items-center"
      >
        <p className="py-6">
          Drag and drop or click to upload a CSV file to get started
        </p>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          className="file-input file-input-ghost w-full max-w-xs hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  </div>
  {csvData.length > 0 && showTable && (
  <div className="flex-1 bg-white shadow-lg rounded-lg overflow-y-auto border border-gray-300 mb-0 mt-3 mx-4 px-4">
    <table className="table-auto w-full">
      <thead>
        <tr>
          {csvData.columns.map((header, index) => (
            <th key={index} className="px-4 py-2 border">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
      {csvData.slice(0, 10).map((row, rowIndex) => (
        <tr key={rowIndex}>
          {csvData.columns.map((column, colIndex) => (
            <td key={colIndex} className="px-4 py-2 border">{row[column]}</td>
          ))}
        </tr>
      ))}
    </tbody>
    </table>
  </div>
)}
{csvData.length > 0 && (
  <div className="flex justify-center px-4 mt-2">
    <button
      className="btn btn-sm btn-secondary"
      onClick={() => setShowTable(!showTable)}
    >
      {showTable ? 'Hide Table Preview' : 'Show Table Preview'}
    </button>
  </div>
)}

  <div
    className="flex-1 bg-white shadow-lg rounded-lg overflow-y-auto border border-gray-300 mb-0 mt-3 mx-4 px-4"
    ref={chatContainerRef}
  >
  
  {chatHistory.map((chat, index) => (
  <div
    key={index}
    className={`chat ${
      chat.sender === "user" ? "chat-end" : "chat-start"
    } mb-4`}
  >
    {chat.sender === "bot" && (
      <div className="chat-image avatar mr-2">
        <div className="w-10 rounded-full">
          <img
            alt="Vision"
            src="https://pbs.twimg.com/profile_images/1816871301597786112/7W8tnSY8_400x400.jpg"
          />
        </div>
      </div>
    )}
    <div className="chat-header">
      {chat.sender === "user" ? "You" : "Vision"}
    </div>
    <div
      className={`chat-bubble break-words max-w-[75%] ${
        chat.sender === "user"
          ? "chat-bubble-primary"
          : "chat-bubble-warning"
      }`}
    >
      {chat.message}
    </div>
  </div>
))}


    {loading && (
      <div className="chat chat-start mb-4">
        <div className="chat-image avatar mr-2">
          <div className="w-10 rounded-full">
            <img
              alt="Vision"
              src="https://pbs.twimg.com/profile_images/1816871301597786112/7W8tnSY8_400x400.jpg"
            />
          </div>
        </div>
        <div className="chat-header">Vision</div>
        <div className="chat-bubble chat-bubble-warning">
          <l-bouncy size="25" speed="1.00" color="black"></l-bouncy>
        </div>
      </div>
    )}
  </div>

  <div className="flex gap-2 p-4">
    <textarea
      placeholder="Type your message here"
      value={message}
      className="textarea textarea-success w-full max-w-x resize-none"
      onChange={handleMessage}
      rows={1}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          sendMessage();
        }
      }}
    />
    <button className="btn" onClick={sendMessage}>
      Send
    </button>
  </div>
</div>

);
}
export default App;


