import React from 'react';

export default function User({ username, id, key }) {
    return <div key={key}>{username}</div>;
}

