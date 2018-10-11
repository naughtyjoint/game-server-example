import { Room, Client } from "colyseus";
import { BoDState } from "./BoDState";


export class BoDRoom extends Room<BoDState> {
    maxClients = 2;


    // When room is initialized
    onInit (options: any) {
        this.setState(new BoDState(this.roomId));
        console.log("JOINING ROOM");
    }

    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin (options: any, isNew: boolean) {
        return true;
    }

    // When client successfully join the room
    onJoin (client: Client, options: any) {
        console.log(`client (session id : ${client.sessionId} & id : ${client.id}) SUCCESS JOINING !`);
        let role = this.state.addPlayer(client);
        
        this.broadcast({
            type: 'join',
            client_id: client.id,
            msg: `${role} joined.`,
        });

        if (this.clients.length == 2) {
            this.broadcast({
                type: 'ready'
            });
            this.state.gameStateChange(1);
            let startCountdown = setInterval(() => {
                this.state.state[ this.roomId ].ready_countdown -= 1;
                if (this.state.state[ this.roomId ].ready_countdown <= 0) {
                    clearInterval(startCountdown);
                    this.broadcast({
                        type: "start"
                    });
                    this.state.gameStateChange(2);
                    let myTimer = setInterval(() => {
                        this.state.state[ this.roomId ].countdown -= .001;
                        if (this.state.state[ this.roomId ].countdown <= 0) {
                            clearInterval(myTimer);
                            this.broadcast({ 
                                type: "over"
                            });
                            this.state.gameStateChange(3);
                        }
                    }, 1);
                }
            }, 1000);
        }
    }

    // When a client sends a message
    onMessage (client: Client, data: any) {
        let time = this.state.state[ this.roomId ].countdown;
        let state = this.state.state[ this.roomId ];
        let player = this.state.players[ client.id ];
        let postion = this.state.positions[ client.id ];
        if (data.type == 'move') {
            this.state.movePlayer(client, data.transform);
            console.log(data.transform);
        }
    }

    // When a client leaves the room
    onLeave (client: Client, consented: boolean) {
        this.state.removePlayer(client);
        this.disconnect();
    }

    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () {
        console.log("Dispose BasicRoom");
    }
}