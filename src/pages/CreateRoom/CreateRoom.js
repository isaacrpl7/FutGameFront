import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Title, Input, Button } from '../NameUser/styles';

function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const username = window.localStorage.getItem('username');
        if(!username) {
            navigate('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createRoom = async () => {
        console.log(roomName + " send criada");
        await fetch(process.env.REACT_APP_API + '/createRoom?roomName=' + roomName, {
            mode: 'no-cors'
        });
        navigate('/list');
    }

    const typing = (event) => {
        setRoomName(event.target.value);
    }

    return (
        <Container>
            <Form className="card" >
                <Title>Sua sala</Title>
                <Input value={roomName} onChange={typing} />
                <Button type="button" onClick={createRoom}>Criar sala</Button>
            </Form>
        </Container>
    )
}

export default CreateRoom;