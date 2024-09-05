import { useState } from 'react';
import { bouncy } from 'ldrs'

bouncy.register()
const url = "https://hai-interaction.onrender.com/";

function App() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false); 

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

  function handleMessage(e) {
    setMessage(e.target.value);
  }

  return (
    <div className="h-screen w-full flex flex-col p-4">
      <h1 className="text-4xl ml-2 mb-4">DogGPT</h1>

      <div className="bg-white shadow-lg rounded-lg p-4 h-full overflow-y-auto border border-gray-300">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat ${chat.sender === "user" ? "chat-end" : "chat-start"}`}>
            {chat.sender === "bot" && (
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Apollo"
                    src="https://i.ibb.co/gzZKJjt/apollo.jpg"
                  />
                </div>
              </div>
            )}
            <div className="chat-header">
              {chat.sender === "user" ? "You" : "Apollo"}
            </div>
            <div className={`chat-bubble break-words max-w-[75%] ${chat.sender === "user" ? "chat-bubble-primary" : "chat-bubble-warning"}`}>
              {chat.message}
            </div>
          </div>
        ))}

        {loading && (
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Apollo"
                  src="https://i.ibb.co/gzZKJjt/apollo.jpg"
                />
              </div>
            </div>
            <div className="chat-header">Apollo</div>
            <div className="chat-bubble chat-bubble-warning">
            <l-bouncy
              size="25"
              speed="1.00" 
              color="black" 
            ></l-bouncy>
            </div>
          </div>
        )}
      </div>
      <div className="mt-5 flex gap-2">
      <textarea
        placeholder="Type your message here"
        value={message}
        className="textarea textarea-success w-full max-w-x resize-none"
        onInput={handleMessage}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  
            sendMessage();
          }
        }}
      />
        <button className="btn" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;


