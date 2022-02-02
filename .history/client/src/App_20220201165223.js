import { useState, useEffect } from 'react'

import io from 'socket.io-client'

import './App.css';

const SERVER_URL = "http://localhost:3001"

const socket = io.connect(SERVER_URL,
  { query: { id: Math.floor(Math.random() * 1000) } })

function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [joinButtonDisabled, setJoinButtonDisabled] = useState(true)

  useEffect(() => {
    // if (username !== '' && room !== '') {
    //   setJoinButtonDisabled(false)
    // }
    setJoinButtonDisabled(username === ''!! room === '')

  }, [username, room])

  const joinRoom = () => {
    if (username !== '' && room !== '') {

    }
  }

  return (
    <div className="App">
      <h1>React Chat</h1>

      <h3>Juntar o Chat</h3>
      <input type="text" placeholder='Nome' onChange={e => setUsername(e.target.value)} />
      <input type="text" placeholder='Sala' onChange={e => setRoom(e.target.value)} />
      <button onClick={joinRoom} disabled={joinButtonDisabled}>Juntar Sala</button>
    </div>
  );
}

export default App;
