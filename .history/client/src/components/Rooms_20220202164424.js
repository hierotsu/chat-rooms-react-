import { useState, useEffect } from 'react';
import io from 'socket.io-client'


export default function Rooms({ socket, joinRoom }) {
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        console.log('Socket changed useEffect', socket, socket.id)
        // if (!socket.connected)
        socket.close()
        socket.open()
        socket.emit('get-rooms', setRooms)

        // socket.on('receive-rooms', roomsReceived)
    }, [socket])


    const refreshHandle = () => {
        socket.emit('get-rooms', setRooms)
    }


    const listRooms = () => {
        return rooms.map((room, ind) => {
            return <div key={'chat-room-' + ind} onClick={joinRoom.bind(null, room.name)}>Sala {room.name} com {room.usersTotal} utilizadores</div>
        })
    }

    return <div className="rooms-container">
        <div className="rooms-container-header">
            <h3>Salas</h3>
            <div className="action-bar">

            </div>
            <button onClick={refreshHandle}><i className="fas fa-sync-alt"></i></button>
        </div>
        <div className="rooms-list">
            {listRooms()}
        </div>
    </div>;
}
