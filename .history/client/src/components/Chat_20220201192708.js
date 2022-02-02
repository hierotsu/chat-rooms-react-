import { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom'

export default function Chat({ socket, username, room, onClose }) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    const [isReduced, setIsReduced] = useState(false)

    useEffect(() => {
        socket.on('receive-conversation', (data) => {
            if (data)
                setMessageList(prev => [...prev, ...data])
        })
        socket.on('receive-message', (data) => {
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
            // messageRef.current.value = ''
            setMessageList(prev => [...prev, messageData])
            setCurrentMessage('')
        }
    }

    const logout = async () => {
        console.log('Closing...')
        await socket.emit('logout')
        onClose();
    }
    const reduceChat = () => {
        console.log('reduce')
    }

    return <div className={"chat-window" + (isReduced ? ' isReduced' : '')}>
        <div className="chat-header" onClick={reduceChat}>
            <p >Live Chat</p>
            <button className="close-chat" onClick={logout}>x</button>
        </div>
        <div className="chat-body">
            <ScrollToBottom className="message-container">
                {messageList.map((message, ind) => {
                    return <div className="message" key={"message_" + ind} id={username === message.author ? "you" : "other"}>
                        <div>
                            <div className="message-content">
                                <p>{message.message}</p>
                            </div>
                            <div className="message-meta">
                                <p id="time">{message.time}</p>
                                <p id="author">{message.author}</p>
                            </div>
                        </div>
                    </div>
                })
                }
            </ScrollToBottom>
        </div>
        <div className="chat-footer">
            <input type="text" placeholder='Mensagem'
                // ref={messageRef}
                value={currentMessage}
                onChange={e => setCurrentMessage(e.target.value)}
                onKeyPress={e => {
                    e.key === "Enter" && e.target.value !== '' && sendMessage()
                }}
            />
            <button onClick={sendMessage}>&#9658;</button>
        </div>
    </div>;
}
