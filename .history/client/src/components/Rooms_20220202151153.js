import { useState, useEffect } from 'react';
import io from 'socket.io-client'


export default function Rooms({ socket, joinRoom }) {
    const [rooms, setRooms] = useState([])

    useEffect(() => {
        socket.emit('get-rooms', setRooms)
    }, [socket])


    const listRooms = () => {
        return rooms.map((room, ind) => {
            return <div key={'chat-room-' + ind} >Sala {room.name} com {room.membersTotal} utilizadores</div>
        })
    }

    return <div>
        <h1>Rooms</h1>
        <div>
            {listRooms()}
        </div>
    </div>;
}
