import { useEffect, useRef, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import NameUser from "../NameUser/NameUser";

// register and get the token adding it to context
async function getToken() {
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
async function join(roomId) {
    return fetch(`${process.env.REACT_APP_API}/${roomId}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.localStorage.getItem('user-token')}`
        }
    });
}

// Choosing the STUN servers
const rtcConfig = {
    iceServers: [{
        urls: [
            'stun:stun.l.google.com:19302',
            'stun:global.stun.twilio.com:3478'
        ]
    }]
};

function LoadingConnection() {
    const params = useParams();
    const {roomId} = params;
    let roomExists = useLoaderData();
    const wsConnection = useRef(null);
    const [peers, setPeers] = useState({});
    const [channels, setChannels] = useState({});

    if(roomExists === 'Not Found') {
        throw new Error('Room not found!');
    }

    useEffect(() => {
        async function setConnection() {
            console.log('Authorizing...');
            await getToken();
            console.log('Authorized!');

            const url = process.env.REACT_APP_API.split('//');
            const wsURL = encodeURI(`${url[0] === 'https:' ? 'wss' : 'ws'}://${url[1].substring(-1)}?token=${window.localStorage.getItem('user-token')}`);
            console.log('Opening connection...');
            wsConnection.current = new WebSocket(wsURL, 'json');
    
            wsConnection.current.onopen = (data) => {
                console.log('Connection open!');
            }
    
            wsConnection.current.onmessage = (messageevent) => {
                const data = JSON.parse(messageevent.data);
                // eslint-disable-next-line default-case
                switch(data.type){
                    case 'connected':
                        console.log('Joining room...');
                        join(roomId);
                        console.log('Joined!');
                        //logMessage(`Bem-vindo, ${context.username}`, 'green');
                        break;
                    case 'add-peer':
                        addPeer(data);
                        break;
                    case 'session-description':
                        sessionDescription(data);
                        break;
                    case 'ice-candidate':
                        iceCandidate(data);
                        break;
                    case 'remove-peer':
                        removePeer(data);
                        break;
                }
            };
        }
        if(window.localStorage.getItem('username'))
            setConnection();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function createUser(){
        return <NameUser joiningDirectToRoom={true} />
    }


    function addPeer(data) {
        const {peer: peerToAdd, offer} = data;
    
        // if incoming peer is already in context, cancel the operation
        if (peers[peerToAdd]) {
            return;
        }
    
        // setup peer connection
        let peer = new RTCPeerConnection(rtcConfig);
        setPeers({
            ...peers,
            [`${peerToAdd.id}`]: peer
        });
    
        // handle ice candidate
        peer.onicecandidate = function (event) {
            if (event.candidate) {
                relay(peerToAdd.id, 'ice-candidate', event.candidate);
            }
        };
    
        // generate offer if required (on join, a peer will create an offer
        // to every other peer in the network, thus forming a mesh)
        if (offer) {
            // create the data channel, map peer updates
            let channel = peer.createDataChannel('updates');
            channel.onmessage = function (event) {
                //onPeerData(peerToAdd.id, event.data);
                console.log(peerToAdd.id, event.data);
            };
            setChannels({
                ...channels,
                [`${peerToAdd.id}`]: channel,
            });
            createOfferAndSetLocalDescription(peerToAdd.id, peer);
        } else {
            //logMessage(`${peerToAdd.username} entrou na sala!`, 'green');
            peer.ondatachannel = function (event) {
                setChannels({
                    ...channels,
                    [`${peerToAdd.id}`]: event.channel,
                });
                event.channel.onmessage = function (evt) {
                    //onPeerData(peerToAdd.id, evt.data);
                    console.log(peerToAdd.id, event.data);
                };
            };
        }
    }

    async function createOfferAndSetLocalDescription(peerId, peer) {
        let offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        // relay the offer to the peer
        await relay(peerId, 'session-description', offer);
    }

    // peerId: peer target, send info to server, and server send to peer
    async function relay(peerId, event, data) {
        await fetch(`${process.env.REACT_APP_API}/relay/${peerId}/${event}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('user-token')}`
            },
            body: JSON.stringify(data)
        });
    }

    // Will run when I receive the session-description event
    async function sessionDescription(data) {
        let message = data;
        let peer = peers[message.peer.id]; // get the peer related to this id stored on state

        let remoteDescription = new RTCSessionDescription(message.data);// Use the offer to create the session description
        await peer.setRemoteDescription(remoteDescription);// set the remote description

        // if the peer is receiving an offer, it will generate the answer and relay to the other peer throught the server
        if (remoteDescription.type === 'offer') {
            let answer = await peer.createAnswer();
            await peer.setLocalDescription(answer);
            await relay(message.peer.id, 'session-description', answer);
        }
    }

    function iceCandidate(data) {
        let message = data;
        let peer = peers[message.peer.id];
        peer.addIceCandidate(new RTCIceCandidate(message.data));
    }

    function removePeer(data) {
        let message = data;
        if (peers[message.peer.id]) {
            peers[message.peer.id].close();
        }
        setChannels((current) => {
            const copy = {...current};
            delete copy[`${message.peer.id}`];
            return copy;
        });
        setPeers((current) => {
            const copy = {...current};
            delete copy[`${message.peer.id}`];
            return copy;
        });
        //logMessage(`${message.peer.username} saiu da sala!`, 'red');
    }

    
    return (
        window.localStorage.getItem('username') ? <h1>Olá {window.localStorage.getItem('username')}</h1> : createUser()
    );
}

export default LoadingConnection;