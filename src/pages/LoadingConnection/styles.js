import styled from "styled-components";

export const Container = styled.div`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 40%;
    right: 40%;
    box-shadow: 12px 12px 0px 0px #3a3a3a;

    @media (max-width: 1200px) {
        left: 30%;
        right: 30%;
    }

    @media (max-width: 500px) {
        left: 10%;
        right: 10%;
    }
`;

export const Loading = styled.div`
    display: flex;
    background-color: white;
    border: 2px solid black;
    flex-direction: column;
    padding: 1rem;
    padding-top: 0;
`;

export const ItemsLoading = styled.p`
    padding: 1rem 1rem 0 1rem;
    width: 100%;
`;