import React from 'react';
import Chart from './Chart'; 

function Chat({ chatHistory, loading, chatContainerRef, csvData }) {
  return (
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
                  src="https://posterspy.com/wp-content/uploads/2015/05/AVENGERS_VISION_thedarkinker.jpg"
                />
              </div>
            </div>
          )}
          <div className="chat-header">
            {chat.sender === "user" ? "You" : "Vision"}
          </div>
          <div
            className={`chat-bubble break-words max-w-[45%] ${
              chat.sender === "user"
                ? "chat-bubble-primary"
                : "chat-bubble-warning"
            }`}
          >
            {chat.message.description ? (
              <>
                {chat.message.spec && (
                  <Chart spec={chat.message.spec} data={csvData}/> 
                )}
                <p>{chat.message.description}</p>
              </>
            ) : (
              chat.message
            )}
          </div>
        </div>
      ))}

      {loading && (
        <div className="chat chat-start mb-4">
          <div className="chat-image avatar mr-2">
            <div className="w-10 rounded-full">
              <img
                alt="Vision"
                src="https://posterspy.com/wp-content/uploads/2015/05/AVENGERS_VISION_thedarkinker.jpg"
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
  );
}

export default Chat;

