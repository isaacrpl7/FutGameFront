class SignalingServer {
    constructor() {

    }

    // joining room in the server (this is used when server send the connected event)
    static async join(roomId) {
        return fetch(`${process.env.REACT_APP_API}/${roomId}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.localStorage.getItem('user-token')}`
            }
        });
    }
}

export default SignalingServer;