
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
      console.log('Received message:', message.data);
      setMessages(prevMessages => [...prevMessages, message.data])
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
      <div>
        <input
          type='text'
          onChange={(e) =>
            setInputMessage(e.target.value)
          }
          placeholder='Type your message'
        />
        <button onClick={sendMessages}>SEND</button>
      </div>

      <div>
        <h2>Messages:</h2>
        <ul>
          {
            messages.map((msg, idx) => (
              <li key={idx}>
                <div>
                  {msg}
                </div>
              </li>
            ))

          }
        </ul>
      </div>
    </>
  )
}

export default App
