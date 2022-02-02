import React from 'react';

export default function Chat({ socket, username, room }) {
    return <div>
        <div clasName="chat-header">
            <p>Live Chat</p>
        </div>
        <div clasName="chat-body">

        </div>
        <div clasName="chat-footer">
            <input type="text" placeholder='Messagem' />
            <button>&#9658 </button>
        </div>
    </div>;
}
