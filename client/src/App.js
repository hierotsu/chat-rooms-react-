import { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

import Chat from './components/Chat';
import Rooms from './components/Rooms'

import './App.css';

// console.log('process.env.REACT_APP_LOCAL', process.env.REACT_APP_LOCAL, typeof process.env.REACT_APP_LOCAL)
export const SERVER_URL = process.env.REACT_APP_LOCAL === '1' ? "http://localhost:3001" : "https://chat-react-buzzy-bob.herokuapp.com/"
// export const SERVER_URL = "https://chat-react-buzzy-bob.herokuapp.com/"

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
  const usernameRef = useRef()
  const roomRef = useRef()


  useEffect(() => {
    if (username === "") {
      usernameRef.current.focus()
    }
  }, [])

  useEffect(() => {
    setJoinButtonDisabled(username === '' || room === '')
  }, [username, room])



  const joinRoom = (room_ext) => {
    // console.log('SOCKET Join', socket, socket.id, room_ext)
    if (typeof room_ext !== "undefined")
      setRoom(room_ext);
    else
      room_ext = room;
    if (username !== '' && room !== '') {
      if (!socket.connected)
        socket.open()

      socket.emit('join_room', room_ext, username)
      setShowChat(true)
    }
    else if (username === '') {
      usernameRef.current.focus()
    }
    else if (room === '') {
      roomRef.current.focus()
    }
  }

  function logoutHandle() {
    setShowChat(false)
  }

  return (
    <div className="App">
      <h1>React Chat</h1>
      <div className="chat-ini-container">

        {!showChat ?
          <>
            <div className="joinChatContainer">
              <h3>Juntar o Chat</h3>
              <input type="text" placeholder='Nome' onKeyPress={e => { e.key === 'Enter' && e.target.value !== '' && joinRoom() }}
                onChange={e => setUsername(e.target.value)}
                value={username}
                ref={usernameRef} />
              <input type="text" placeholder='Sala' onKeyPress={e => { e.key === 'Enter' && e.target.value !== '' && joinRoom() }}
                onChange={e => setRoom(e.target.value)}
                value={room}
                ref={roomRef} />
              <button onClick={e => joinRoom()} disabled={joinButtonDisabled}>Juntar Sala</button>
            </div>
            <Rooms socket={socket} joinRoom={joinRoom} />
          </>
          :
          <Chat socket={socket} username={username} room={room} onClose={logoutHandle} />
        }
      </div>
    </div>
  );
}

export default App;
