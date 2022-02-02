import { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom'

export default function Chat({ socket, username, room }) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    // const messageRef = useRef()

    useEffect(() => {
        socket.on('receive-conversation', (data) => {
            console.log('conversation precedente', data)
            setMessageList(prev => [...prev, ...data])
        })
        socket.on('receive-message', (data) => {
            console.log('datas mesasges', data)
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

    return <div className="chat-window">
        <div className="chat-header">
            <p>Live Chat</p>
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
