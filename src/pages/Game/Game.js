import { useEffect, useState } from "react";

function Game({peers, channels, peerData}) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);


    useEffect(() => {
        onPeerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [peerData]);

    function broadcast(data) {
        for (let channelId in channels) {
            console.log('Envando para', channelId, data);
            channels[channelId].send(data);
        }
    }

    const onPeerData = () => {
        const [, data] = peerData;
        if(data) {
            const incomingData = JSON.parse(data.toString());

            if(incomingData.type === 'message') {
                setMessageList((current) => [...current, `${incomingData.username}: ${incomingData.data}`]);
            }

            if(incomingData.type === 'drawing') {
                //drawLine(incomingData.data);
            }
        }
    }

    const sendMessage = () => {
        if(message !== ''){
            setMessageList((current) => [...current, `Eu: ${message}`]);
            broadcast(JSON.stringify({type: 'message', data: message, username: window.localStorage.getItem('username')}));
            setMessage('');
        }
    }

    const typing = (event) => {
        setMessage(event.target.value);
    }

    return (
        <>
            <ul>
                <li>{messageList}</li>
            </ul>
            <input value={message} onChange={typing} />
            <button type='button' onClick={sendMessage}></button>
        </>
    )
}

export default Game;