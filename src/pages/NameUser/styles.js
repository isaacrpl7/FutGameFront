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
    
export const Input = styled.input`
    font-family: 'Roboto', sans-serif;
    border-radius: 1rem;
    height: 2rem;
    border: 2px solid black;
    margin-bottom: 1rem;
    padding: 0 0.5rem;
`;
    
export const Button = styled.button`
    font-family: 'Roboto', sans-serif;
    border: 2px solid black;
    border-radius: 1rem;
    height: 2rem;
    background-color: white;

    &:hover {
        cursor: pointer;
        background-color: black;
        color: white;
    }
`;

export const Form = styled.form`
    display: flex;
    flex-direction: column;
    margin: auto;
    padding: 2rem;
    border: 2px solid black;
    background-color: white;
`;

export const Title = styled.h1`
    font-family: 'Roboto', sans-serif;
    margin-top: 0;
    padding-top: 0;
`;