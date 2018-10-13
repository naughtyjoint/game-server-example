import { Room, Client } from "colyseus";
import { BoDState } from "./BoDState";


export class BoDRoom extends Room<BoDState> {
    maxClients = 2;
    wallPaperLoop = true;


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
            this.gameLaunch();
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
            // console.log(data.transform);
        }
        
        if (data.type == 'adHit') {
            this.state.adCoolDown(client, data.wallpaper_id);
        }

        if (data.type == 'trigger') {
            //console.log("triggered");
            this.broadcast({
                type: 'trigger',
                client_id: client.id,
                msg: data.msg,
            });
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

    gameLaunch () {
        this.state.gameStateChange(1);
        let startCountdown = setInterval(() => {
            this.state.state[ this.roomId ].ready_countdown -= 1;
            if (this.state.state[ this.roomId ].ready_countdown <= 0) {
                clearInterval(startCountdown);
                this.broadcast({
                    type: "start"
                });
                this.state.gameStateChange(2);
                for (let i = 0; i < this.state.wallPapers[ this.roomId ].wallPaper.length; i++){
                    this.wallPaperHandler(i);
                }
                let matchTimer = setInterval(() => {
                    this.state.state[ this.roomId ].countdown -= .001;
                    if (this.state.state[ this.roomId ].countdown <= 0) {
                        this.wallPaperLoop = false;
                        clearInterval(matchTimer);
                        console.log('Time\'s up');
                        
                        this.broadcast({ 
                            type: "over"
                        });
                        this.state.gameStateChange(3);
                    }
                }, 1);
            }
        }, 1000);
    }

    wallPaperHandler (Target) {
        if(this.wallPaperLoop) {
            let changeTarget = Target;
            let changeTime: number = Math.floor(Math.random() * 6) + 5;
            if (this.state.wallPapers[ this.roomId ].wallPaper[changeTarget].state == 1 ) {
                this.state.wallPapers[ this.roomId ].wallPaper[changeTarget].item = this.state.getRandomItem();            
            }
            setTimeout(() => {
                this.wallPaperHandler(Target);
            }, changeTime * 1000);
        }
    }
}