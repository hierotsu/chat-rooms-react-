import { useState, useEffect } from 'react';
import ScrollToBottom from 'react-scroll-to-bottom'

import User from './User';

export default function Chat({ socket, username, room, onClose }) {
    const [currentMessage, setCurrentMessage] = useState('')
    const [messageList, setMessageList] = useState([])
    const [users, setUsers] = useState([])
    const [showUsers, setShowUsers] = useState(true)
    const [isReduced, setIsReduced] = useState(false)

    useEffect(() => {
        socket.on('receive-users', (data) => {
            console.log('Receive-users:', data)
            if (data)
                setUsers(prev => [...prev, ...data])
        })
        socket.on('receive-conversation', (data) => {
            if (data)
                setMessageList(prev => [...prev, ...data])
        })
        socket.on('receive-message', (data) => {
            setMessageList(prev => [...prev, data])
        })
        socket.on('new-chatter', (username, id) => {
            // console.log('new-chattre', username)
            setMessageList(prev => [...prev, {
                message: username + ' entrou.', author: '', room,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            }])
            setUsers(prev => [...prev, { id, username }])
        })
        socket.on('logout-chatter', (username, id) => {
            // console.log('new-chattre', username)
            setMessageList(prev => [...prev, {
                message: username + ' saiu.', author: '', room,
                time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
            }])
            setUsers(prev => {
                return prev.filter(user => user.id !== id)
            })
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
        await socket.emit('logout', room, username)
        onClose();
    }
    const reduceChat = () => {
        console.log('reduce')
        setIsReduced(prev => !prev)
    }
    const showUserPanel = (e) => {
        // e.preventDefault();
        e.stopPropagation();
        // console.log('Show Users')
        setShowUsers(prev => !prev)
    }

    return <div className={"chat-window" + (isReduced ? ' isReduced' : '')}>
        <div className="chat-header" onClick={reduceChat}>
            <p >Live Chat</p>
            <div className="action-bar">
                <button className="toggle-users" onClick={showUserPanel}><i className="fas fa-users"></i></button>
                <button className="close-chat" onClick={logout}><i className="fas fa-times"></i></button>
            </div>
        </div>
        <div className="chat-container">
            <h4>Utilizadores</h4>
            {showUsers && <div className="chat-users" >
                {users.map((user, ind) => {
                    return <User key={"chat-user-" + ind} username={user.username} id={user.id} />
                })
                }
            </div>
            }
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                    {messageList.map((message, ind) => {
                        return <div className={"message" + ('' === message.author ? ' new-chatter' : '')} key={"message_" + ind} id={username === message.author ? "you" : "other"}>
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
    </div>
        ;
}