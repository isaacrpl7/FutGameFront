export async function connect(wsConnection, roomId, addPeerFunction, sessionDescriptionFunction, iceCandidateFunction, removePeerFunction, loader) {
    const [, setLoading] = loader;
    setLoading((current) => [...current, 'Loading token...']);
    await getToken();
    setLoading((current) => [...current, 'Token loaded!']);

    const url = process.env.REACT_APP_API.split('//');
    const wsURL = encodeURI(`${url[0] === 'https:' ? 'wss' : 'ws'}://${url[1].substring(-1)}?token=${window.localStorage.getItem('user-token')}`);

    setLoading((current) => [...current, 'Opening connection...']);
    wsConnection.current = new WebSocket(wsURL, 'json');

    wsConnection.current.onopen = (data) => {
        setLoading((current) => [...current, 'Connection opened!']);
    }

    wsConnection.current.onmessage = (messageevent) => {
        const data = JSON.parse(messageevent.data);
        // eslint-disable-next-line default-case
        switch(data.type){
            case 'connected':
                setLoading((current) => [...current, 'Joining room...']);
                join(roomId);
                setLoading((current) => [...current, 'Room joined!']);
                //logMessage(`Bem-vindo, ${context.username}`, 'green');
                break;
            case 'add-peer':
                addPeerFunction(data);
                break;
            case 'session-description':
                sessionDescriptionFunction(data);
                break;
            case 'ice-candidate':
                iceCandidateFunction(data);
                break;
            case 'remove-peer':
                removePeerFunction(data);
                break;
        }
    };
}

export async function getToken() {
    let res = await fetch(process.env.REACT_APP_API+'/access', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: window.localStorage.getItem('username')
        })
    });
    let token = await res.json();
    window.localStorage.setItem('user-token', token);
}

// joining room in the server (this is used when server send the connected event)
export async function join(roomId) {
    return fetch(`${process.env.REACT_APP_API}/${roomId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('user-token')}`
        }
    });
}

// peerId: peer target, send info to server, and server send to peer
export async function relay(peerId, event, data) {
    await fetch(`${process.env.REACT_APP_API}/relay/${peerId}/${event}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('user-token')}`
        },
        body: JSON.stringify(data)
    });
}