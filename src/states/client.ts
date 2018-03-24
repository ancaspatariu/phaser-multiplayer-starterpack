declare var io: any;

export class Client {
    socket: any;

    constructor () {
        this.socket = io.connect();
    }

    sendTest() {
        this.socket.emit('test');
    }

    sendMovement(direction: string) {
        this.socket.emit('movementKey', direction);
    }

    joinGame() {
        this.socket.emit('newplayer');
    }

}
