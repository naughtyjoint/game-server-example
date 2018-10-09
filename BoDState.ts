import { EntityMap } from "colyseus";
import { Player } from "./src/models/Player";
import { State } from "./src/models/State";
import { Position } from "./src/models/Position";

export class BoDState {

    constructor(public roomId: string){
        this.state[ this.roomId ] = new State();
    };

    state: EntityMap<State> = {};
    players: EntityMap<Player> = {};
    positions: EntityMap<Position> = {};
    
    
    gameStateChange (state: number) {
        this.state[ this.roomId ].state = state;
    }

    addPlayer (client) {
        if (this.state[ this.roomId ].clientNum == 0) {
            this.players[ client.id ] = new Player('O');
            this.positions[ client.id ] = new Position(
                { 
                    position: { x: 4, y: 0, z: 4 }, 
                    rotation: { x: 0, y: 250, z: 0 }
                } 
            );
        } else {
            let playersNow: Player;
            for (let x in this.players) {
                playersNow = this.players[x];
            }
            if (playersNow.role === 'X') {
                this.players[ client.id ] = new Player('O');
                this.positions[ client.id ] = new Position(
                    { 
                        position: { x: -4, y: 0, z: -4 }, 
                        rotation: { x: 0, y: 42, z: 0 }
                    }
                );
            } else {
                this.players[ client.id ] = new Player('X');
                this.positions[ client.id ] = new Position({ 
                    position: { x: -4, y: 0, z: -4 }, 
                    rotation: { x: 0, y: 42, z: 0 }
                });
            }
        }
        this.state[ this.roomId ].clientNum ++;
        this.resetPlayer();
        let clientInfo = this.players[ client.id ];
        return {
            role: clientInfo.role
        }
    }

    removePlayer (client) {
        delete this.players[ client.id ];
    }

    movePlayer (client, transform) {
        console.log(this.positions[ client.id ].cart);
        this.positions[ client.id ].cart.position = transform.cart.position;
        this.positions[ client.id ].cart.rotation = transform.cart.rotation;
    }

    resetPlayer () {
        let players: Player;
            for (let x in this.players) {
                players = this.players[x];
            }
        players.state = 0;
        players.score = 0;
        players.itemList = [];
    }

    
}