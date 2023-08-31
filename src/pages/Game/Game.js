import { useEffect, useRef, useState } from "react";
import Camera from "./Canvas/Camera";
import Map from "./Canvas/Map";
import Player from "./Canvas/Player";
import { SendMessageArea, Canvas, Chat, MessageArea, Panel, SendMessageButton, UserInteraction, TextBox, MessageList, Message } from "./styles";
import mapImage from './Canvas/map.png';

function Game({peers, channels, peerData}) {
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const messageTextBox = useRef(null);
    const gameCanvas = useRef(null);
    const userInteraction = useRef(null);
    const controls = useRef({
        left: false,
        up: false,
        right: false,
        down: false,
    });


    useEffect(() => {
        onPeerData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [peerData]);

    useEffect(() => {
        // preparing our game canvas
        let canvas = gameCanvas.current;
        let context = canvas.getContext("2d");
        
        
        // game settings:
        let FPS = 60;
        let INTERVAL = 1000 / FPS; // milliseconds
        let STEP = INTERVAL / 1000 // seconds

        // Criando e retornando as dimensões da imagem do mapa
        const mapImg = new Image();
        mapImg.src = mapImage;

        const room = {
            width: mapImg.width,
            height: mapImg.height
        }
        const map = new Map(room.width, room.height);
        map.generate();
        
        const player = new Player(50, 50);

        function configCamera(){
            // Set the right viewport size for the camera
            let vWidth = Math.min(room.width, canvas.width);
            let vHeight = Math.min(room.height, canvas.height);

            // Setup the camera
            // Se a sala for maior que o canvas, a posição será 0. Se não, calcular a posição em que
            // A camera fique centralizada no canvas
            const xInitialPositionCamera = room.width > canvas.width ? 0 : Math.abs(canvas.width-room.width)/2;
            const yInitialPositionCamera = room.height > canvas.height ? 0 : Math.abs(canvas.height-room.height)/2;
            camera = new Camera(xInitialPositionCamera, yInitialPositionCamera, vWidth, vHeight, room.width, room.height);

            camera.follow(player, (vWidth / 3), (vHeight / 3));
        }

        function handleResize() {
            // Resizing canvas without stretching
            let canvas = gameCanvas.current;
            let rect = canvas.parentNode.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height - (164);
            
            let userinter = userInteraction.current.parentNode.getBoundingClientRect();
            userInteraction.current.width = userinter.width;
            userInteraction.current.height = 160;

            configCamera();
        }
        
        let camera;
        window.addEventListener("resize", handleResize);
        handleResize();

        // Game update function
        let update = function () {
            player.update(STEP, room.width, room.height, controls.current, context);
            camera.update();
        }
        
        // Game draw function
        let draw = function () {
            // clear the entire canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // redraw all objects
            map.draw(context, camera.xView, camera.yView);
            player.draw(context, camera.xView, camera.yView);
        }

        let gameLoop = function () {
            update();
            draw();
        }

        const runningId = setInterval(function () {
            gameLoop();
        }, INTERVAL);

        window.addEventListener("keydown", function (e) {
            switch (e.key) {
                case 'a': // left
                    controls.current.left = true;
                    break;
                case 'w': // up
                    controls.current.up = true;
                    break;
                case 'd': // right
                    controls.current.right = true;
                    break;
                case 's': // down
                    controls.current.down = true;
                    break;
            }
        }, false);
        
        window.addEventListener("keyup", function (e) {
            switch (e.key) {
                case 'a': // left
                    controls.current.left = false;
                    break;
                case 'w': // up
                    controls.current.up = false;
                    break;
                case 'd': // right
                    controls.current.right = false;
                    break;
                case 's': // down
                    controls.current.down = false;
                    break;
                case 'p': // key P pauses the game
                    Game.togglePause();
                    break;
            }
        }, false);

        return () => {
            window.removeEventListener("resize", handleResize);
            clearInterval(runningId);
        }
    }, []);

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

    const sendMessage = (e) => { // (X and Y) or (X and Z) < = > X and (Y or Z)
        if((message !== '') && (e.type === 'click' || e.key === 'Enter')){
            setMessageList((current) => [...current, `${window.localStorage.getItem('username')}: ${message}`]);
            broadcast(JSON.stringify({type: 'message', data: message, username: window.localStorage.getItem('username')}));
            setMessage('');
        }
        messageTextBox.current.focus();
    }

    const typing = (event) => {
        setMessage(event.target.value);
    }

    const messages = messageList.map((msg, index) => <Message key={`${msg}${index}`}>{msg}</Message>);

    return (
        <>
            <Panel>
                <canvas ref={gameCanvas}>Canvas não carregou</canvas>
                <UserInteraction ref={userInteraction}>
                    <Chat>
                        <MessageArea>
                            <MessageList>
                                {messages}
                            </MessageList>
                        </MessageArea>
                        <SendMessageArea>
                            <TextBox ref={messageTextBox} value={message} onKeyDown={sendMessage} onChange={typing}></TextBox>
                            <SendMessageButton type='button' onClick={sendMessage}>Enviar mensagem</SendMessageButton>
                        </SendMessageArea>
                    </Chat>
                </UserInteraction>
            </Panel>
        </>
    )
}

export default Game;