import { useState } from 'react';

export default function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('')

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
            }

            await socket.emit('send-message', messageData)
        }
    }

    return <div>
        <div clasName="chat-header">
            <p>Live Chat</p>
        </div>
        <div clasName="chat-body">

        </div>
        <div clasName="chat-footer">
            <input type="text" placeholder='Messagem' onChange={e => setCurrentMessage(e.target.value)} />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>;
}
