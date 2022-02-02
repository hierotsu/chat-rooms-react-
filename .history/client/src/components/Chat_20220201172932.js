import { useState, useEffect } from 'react';

export default function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])

    useEffect(() => {
        socket.on('receive-message', (data) => {
            console.log('message-received', data)
            setMessageList(prev => [...prev, data])
        })
    }, [socket])

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                room,
                author: username,
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + ('0' + new Date(Date.now()).getMinutes()).slice(-2)
            }

            await socket.emit('send-message', messageData)
            setMessageList(prev => [...prev, messageData])
        }
    }

    return <div className="chat-window">
        <div className="chat-header">
            <p>Live Chat</p>
        </div>
        <div className="chat-body">
            {messageList.map((message, ind) => {
                return <div className="message" key={"message_" + ind}>
                    <div className="message-content">
                        <p>{message.message}</p>
                    </div>
                    <div className="message-meta">
                        <p>{message.time}</p>
                        <p>{message.author}</p>
                    </div>
                </div>
            })

            }
        </div>
        <div className="chat-footer">
            <input type="text" placeholder='Messagem' onChange={e => setCurrentMessage(e.target.value)} />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>;
}
