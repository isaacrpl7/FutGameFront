import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListContainer, ListTitle, ContainerContents, ContainerHeader, Item, CreateRoom, RefreshRooms, ButtonsContainer } from './styles';

function UserList() {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const username = window.localStorage.getItem('username');
        if(!username) {
            navigate('/');
        }
        async function fetchRooms(){
            const response = await fetch(process.env.REACT_APP_API + '/rooms');
            const activeRooms = await response.json();
            console.log(activeRooms);
            setRooms(activeRooms);
        }
        fetchRooms();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createRoom = async () => {
        navigate('/create-room');
    }
    const reload = async () => {
        window.location.reload();
    }

    const roomItems = rooms.map((room) =>
        <Item key={room.id}>
            <td>
                <span>{room.name}</span>
            </td>
            <td>{room.players}</td>
            <td>No</td>
            <td>
                <span>{room.id}</span>
            </td>
        </Item>
    );

    return (
        <ListContainer>
            <ListTitle>{window.localStorage.getItem('username')}, veja a lista de salas!</ListTitle>
            <ContainerHeader>
                <table style={{tableLayout: 'fixed'}}>
                    <colgroup width={"70rem"}>
                        <col width={"53.7%"} />
                        <col width={"97px"}/>
                        <col width={"110px"}/>
                        <col width={"128px"}/>
                    </colgroup>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>Players</td>
                            <td>Pass</td>
                            <td>Id</td>
                        </tr>
                    </thead>
                </table>
            </ContainerHeader>

            <ContainerContents>
                <table>
                    <colgroup>
                        <col width={"55%"} />
                        <col width={"100px"}/>
                        <col width={"100px"}/>
                        <col width={"100px"}/>
                    </colgroup>
                    <tbody>
                        {roomItems}
                    </tbody>
                </table>
            </ContainerContents>
            <ButtonsContainer>
                <CreateRoom onClick={createRoom}>Criar sala</CreateRoom>
                <RefreshRooms onClick={reload}>Atualizar</RefreshRooms>
            </ButtonsContainer>
        </ListContainer>
    )
}

export default UserList;