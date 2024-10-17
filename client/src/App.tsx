
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    const sockett = new WebSocket('ws://localhost:8080');
    sockett.onopen = () => {
      console.log("Connected ")
      setSocket(sockett);
    }
    sockett.onmessage = (message) => {
      setMessages(prevMessages => [...prevMessages, message.data])
    }

    sockett.onerror = (err) => {
      console.log("Web socket connection Error: ", err)
    }

    return () => {
      console.log('Closing WebSocket connection');
      sockett.close();
    };

  }, [])


  const sendMessages = () => {

    if (socket && inputMessage.trim()) {
      console.log(`Sending message: ${inputMessage}`)
      socket?.send(inputMessage)
      setInputMessage('')
    }
  }

  if (!socket) {
    return <div>
      Connecting to socket server ....
    </div>
  }

  return (
    <>
      <div className="chat-app">
        <h2>WebSocket Chat</h2>
        <div className="chat-window">
          {messages.length > 0 ? (
            <ul>
              {messages.map((msg, index) => (
                <li key={index}>{msg}</li>
              ))}
            </ul>
          ) : (
            <p>No messages yet...</p>
          )}
        </div>

        <div className="message-input">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessages}>Send</button>
        </div>
      </div>
    </>
  )
}

export default App
