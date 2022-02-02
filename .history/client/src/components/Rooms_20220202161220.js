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


    const listRooms = () => {
        return rooms.map((room, ind) => {
            return <div key={'chat-room-' + ind} >Sala {room.name} com {room.usersTotal} utilizadores</div>
        })
    }

    return <div className="rooms-container">
        <h2>Salas</h2>
        <div className="rooms-list">
            {listRooms()}
        </div>
    </div>;
}
