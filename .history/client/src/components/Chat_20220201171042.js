import { useState } from 'react';

export default function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('')

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + ('0' + new Date(Date.now()).getMinutes()).slice(-2)
            }

            await socket.emit('send-message', messageData)
        }
    }

    return <div>
        <div className="chat-header">
            <p>Live Chat</p>
        </div>
        <div className="chat-body">

        </div>
        <div className="chat-footer">
            <input type="text" placeholder='Messagem' onChange={e => setCurrentMessage(e.target.value)} />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>;
}
