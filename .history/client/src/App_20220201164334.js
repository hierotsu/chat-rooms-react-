import './App.css';
import io from 'socket.io-client'

const SERVER_URL = "http://localhost:3001"

const socket = io.connect(SERVER_URL, { query: { Math.floor(Math.random() * 1000) })

function App() {
  return (
    <div className="App">
      <h1>React Chat</h1>
    </div>
  );
}

export default App;
