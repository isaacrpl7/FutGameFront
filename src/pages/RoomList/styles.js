import styled from 'styled-components';

export const ListContainer = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 30%;
    right: 30%;

    box-shadow: 12px 12px 0px 0px #3a3a3a;
    background-color: white;
    border: 2px solid black;

    @media (max-width: 1200px) {
        left: 20%;
        right: 20%;
    }

    @media (max-width: 500px) {
        left: 10%;
        right: 10%;
    }
`;

export const ListTitle = styled.h1`
    padding: 1rem;
    margin-left: 1rem;
`;

export const ContainerContents = styled.div`
    overflow: auto;
    margin: 0 auto;
    width: 90%;
    margin-bottom: 1rem;
    max-height: 30rem;

    border: 2px solid black;

    ::-webkit-scrollbar {
        width: 10px;
    }

    ::-webkit-scrollbar-track {
        background: white;
    }

    ::-webkit-scrollbar-thumb {
        background: black;
    }

    ::-webkit-scrollbar-thumb:hover {
        background: #3a3a3a;
    }
`;

export const ContainerHeader = styled.div`
    width: 90%;
    margin: 0 auto;
`;

export const Item = styled.tr`
    &:hover {
        cursor: pointer;
        background-color: black;
        color: white;
    }
`;

export const ButtonsContainer = styled.div`
    display: flex;
    justify-content: center;
`;

export const CreateRoom = styled.button`
    border: 2px solid black;
    background-color: white;
    width: 45%;
    height: 2rem;
    margin-bottom: 1rem;

    &:hover {
        cursor: pointer;
        background-color: black;
        color: white;
    }
`;

export const RefreshRooms = styled.button`
    border: 2px solid black;
    background-color: white;
    width: 45%;
    height: 2rem;
    margin-bottom: 1rem;

    &:hover {
        cursor: pointer;
        background-color: black;
        color: white;
    }
`;