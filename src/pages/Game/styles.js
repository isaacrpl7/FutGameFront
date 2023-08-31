import styled from 'styled-components';


export const Panel = styled.div`
    height: 100vh;
`;

export const UserInteraction = styled.div`
    height: 10rem;
    margin: 0;
    background-color: #000000d9;
`;

export const Chat = styled.div`
    margin: 0 auto;
    width: 50%;
    height: 100%;
    background-color: #00000026;
`;

export const MessageArea = styled.div`
    overflow-y: auto;
    height: 85%;
    color: white;
`;

export const SendMessageArea = styled.div`
    display: flex;
    height: 15%;
`;

export const TextBox = styled.input`
    width: 70%;
    font-family: 'Quicksand', 'Roboto', sans-serif;
    font-weight: 600;
    border: 2px solid black;
`;

export const SendMessageButton = styled.button`
    width: 30%;
    height: 100%;
    background-color: white;
    border: 2px solid black;
    font-family: 'Quicksand', 'Roboto', sans-serif;
    font-weight: 600;

    &:hover {
        cursor: pointer;
        background-color: black;
        color: white;
        border: 2px solid white;
    }
`;

export const MessageList = styled.ul`
    list-style: none;
    margin: 0;
    padding: 10px;
`;

export const Message = styled.li`
`;