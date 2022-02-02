import { useState, useEffect } from 'react'
import io from 'socket.io-client'

import Chat from './components/Chat';

import './App.css';

const SERVER_URL = "http://localhost:3001"

const connect = () => {
  return io.connect(SERVER_URL,
    { query: { id: Math.floor(Math.random() * 1000) } })
}

const socket = connect()

function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('Public')
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(true)
  const [showChat, setShowChat] = useState(false)

  useEffect(() => {
    setJoinButtonDisabled(username === '' || room === '')
  }, [username, room])

  const joinRoom = () => {
    console.log('SOCKET', socket)
    if (username !== '' && room !== '') {
      socket.emit('join_room', room, username)
      setShowChat(true)
    }
  }

  function logoutHandle() {
    setShowChat(false)
  }

  return (
    <div className="App">
      {!showChat ?
        <div className="joinChatContainer">
          <h1>React Chat</h1>
          <h3>Juntar o Chat</h3>
          <input type="text" placeholder='Nome' onKeyPress={e => { e.key === 'Enter' && e.target.value !== '' && joinRoom() }} onChange={e => setUsername(e.target.value)} />
          <input type="text" placeholder='Sala' onKeyPress={e => { e.key === 'Enter' && e.target.value !== '' && joinRoom() }} onChange={e => setRoom(e.target.value)} defaultValue="Public" />
          <button onClick={joinRoom} disabled={joinButtonDisabled}>Juntar Sala</button>
        </div>
        :
        <Chat socket={socket} username={username} room={room} onClose={logoutHandle} />
      }
    </div>
  );
}

export default App;
