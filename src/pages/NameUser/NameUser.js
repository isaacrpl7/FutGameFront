import { useState, useEffect } from 'react';
import { Input, Button, Form, Container, Title } from './styles';
import { useNavigate } from 'react-router-dom';

function NameUser({joiningDirectToRoom}) {
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const username = window.localStorage.getItem('username');
        setUserName(username ? username : '');
    }, []);

    const createUser = async () => {
        if(userName) window.localStorage.setItem('username', userName);
        if(joiningDirectToRoom) {
            window.location.reload();
        } else {
            navigate('/list');
        }
    }

    const typing = (event) => {
        setUserName(event.target.value);
    }

    return (
        <Container>
            <Form className="card" onSubmit={createUser}>
                <Title>Seu usuário</Title>
                <Input value={userName} onChange={typing} />
                <Button type="submit">Criar usuário</Button>
            </Form>
        </Container>
    )
}

export default NameUser;