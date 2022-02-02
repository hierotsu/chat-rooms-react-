import { useState, useEffect } from 'react';
import io from 'socket.io-client'


export default function Rooms({ socket, joinRoom }) {
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        const f = socket.connected;
        console.log('Socket changed useEffect', socket, f)
        // if (!socket.connected)
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
        <h1>Rooms</h1>
        <div className="rooms-list">
            {listRooms()}
        </div>
    </div>;
}