import { useEffect, useRef, useState } from "react";
import { useLoaderData, useParams } from "react-router-dom";
import { connect, relay } from "../../soccer_api/SignalingServer";
import { Container, ItemsLoading, Loading } from "./styles";
import NameUser from "../NameUser/NameUser";
import Game from "../Game/Game";



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
    const peers = useRef({});
    const channels = useRef({});
    const [loading, setLoading] = useState([]);
    const [peerData, setPeerData] = useState([]);

    if(roomExists === 'Not Found') {
        throw new Error('Room not found!');
    }

    useEffect(() => {
        setLoading([]);
        if(window.localStorage.getItem('username'))
            connect(wsConnection, roomId, addPeer, sessionDescription, iceCandidate, removePeer, [loading, setLoading]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function createUser(){
        return <NameUser joiningDirectToRoom={true} />
    }

    const loaded = loading.map((load) =>
        <ItemsLoading key={load}>{load}</ItemsLoading>
    );

    function addPeer(data) {
        const {peer: peerToAdd, offer} = data;

        // if incoming peer is already in context, cancel the operation
        if (peers.current[peerToAdd]) {
            return;
        }
    
        // setup peer connection
        let peer = new RTCPeerConnection(rtcConfig);
        peers.current[`${peerToAdd.id}`] = peer;
    
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
                setPeerData([peerToAdd.id, event.data]);
            };
            channels.current[`${peerToAdd.id}`] = channel;
            createOfferAndSetLocalDescription(peerToAdd.id, peer);
        } else {
            //logMessage(`${peerToAdd.username} entrou na sala!`, 'green');
            peer.ondatachannel = function (event) {
                channels.current[`${peerToAdd.id}`] = event.channel;
                event.channel.onmessage = function (evt) {
                    setPeerData([peerToAdd.id, evt.data]);
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

    // Will run when I receive the session-description event
    async function sessionDescription(data) {
        let message = data;
        let peer = peers.current[message.peer.id]; // get the peer related to this id stored on state

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
        let peer = peers.current[message.peer.id];
        peer.addIceCandidate(new RTCIceCandidate(message.data));
    }

    function removePeer(data) {
        let message = data;
        if (peers.current[message.peer.id]) {
            peers.current[message.peer.id].close();
        }
        delete channels.current[`${message.peer.id}`];
        delete peers.current[`${message.peer.id}`];
        //logMessage(`${message.peer.username} saiu da sala!`, 'red');
    }
    
    return (
        window.localStorage.getItem('username') ? 
            (loading.length === 6 ? 
                <Game channels={channels.current} peers={peers.current} peerData={peerData} />
            : <Container>
                <Loading>
                    {loaded}
                </Loading>
            </Container>)
        : createUser()
    );
}

export default LoadingConnection;