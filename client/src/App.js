import { useState } from 'react';
const url = "https://hai-interaction.onrender.com/"
function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("No response yet");
  function sendMessage() {
    if (message === "") {
      return;
    } 
    fetch(`${url}query`, {
      method: 'POST',
      body: JSON.stringify({ prompt: message }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      return response.json();
    }).then(data => {
      setResponse(data.response);
    });
    setMessage("");
  }
  function handleMessage(e) {   
    setMessage(e.target.value); 
  }
  return (
    <div className="h-screen w-full flex flex-col p-4">
      <h1 className="text-4xl ml-2 mb-4">DogGPT</h1>
        <div className="bg-white shadow-lg rounded-lg p-4 h-full overflow-y-auto border border-gray-300">
          <div className="chat chat-start">
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="Apollo"
                  src="https://i.ibb.co/gzZKJjt/apollo.jpg" />
              </div>
            </div>
            <div className="chat-header">
              Apollo
            </div>
            <div className="chat-bubble chat-bubble-warning">Woof woof! Hi Joy! I love you! I miss you!</div>
          </div>
      </div>
      <div className="mt-5 flex gap-2">
        <input type="text" placeholder="Type your message here" value={message} className="input input-success w-full max-w-x" onInput={handleMessage} />
        <button className="btn" onClick={sendMessage}>Send</button>
      </div>
      
    </div>
  );
}

export default App;

