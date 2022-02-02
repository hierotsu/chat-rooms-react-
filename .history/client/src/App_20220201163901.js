import './App.css';
import io from 'socket.io-client'

const SERVER_URL = "http://localhost:3001"

const socket = io.connect(SERVER_URL)

function App() {
  return (
    <div className="App">
      <h1>React Chat</h1>
    </div>
  );
}

export default App;
