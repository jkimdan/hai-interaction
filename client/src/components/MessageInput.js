function MessageInput({ message, setMessage, sendMessage, loading }) {
    function handleMessage(e) {
      setMessage(e.target.value);
    }
  
    return (
      <div className="flex gap-2 p-4">
        <textarea
          placeholder="Type your message here"
          value={message}
          className="textarea textarea-success w-full max-w-x resize-none"
          onChange={handleMessage}
          rows={1}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
        />
        <button className="btn" onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    );
  }
  
  export default MessageInput;
  