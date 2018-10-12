import { EntityMap } from "colyseus";
import { Player } from "./src/models/Player";
import { State } from "./src/models/State";
import { Position } from "./src/models/Position";
import { WallPaper } from "./src/models/WallPaper";

export class BoDState {

    constructor(public roomId: string){
        this.state[ this.roomId ] = new State();
        this.wallPaper[ this.roomId ] = new WallPaper();
    };

    state: EntityMap<State> = {};
    players: EntityMap<Player> = {};
    positions: EntityMap<Position> = {};
    wallPaper: EntityMap<WallPaper> = {};
    
    
    gameStateChange (state: number) {
        this.state[ this.roomId ].state = state;
    }

    addPlayer (client) {
        if (this.state[ this.roomId ].clientNum == 0) {
            this.players[ client.id ] = new Player('A');
            this.positions[ client.id ] = new Position();            
            this.mapInit();
        } else {
            let playersNow: Player;
            for (let x in this.players) {
                playersNow = this.players[x];
            }
            this.players[ client.id ] = (playersNow.role === 'B') ? new Player('A') : new Player('B');
            this.positions[ client.id ] = new Position();
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
        this.positions[ client.id ].head.position = transform.head.position;
        this.positions[ client.id ].head.rotation = transform.head.rotation;
        this.positions[ client.id ].rightHand.position = transform.rightHand.position;
        this.positions[ client.id ].rightHand.rotation = transform.rightHand.rotation;
        this.positions[ client.id ].leftHand.position = transform.leftHand.position;
        this.positions[ client.id ].leftHand.rotation = transform.leftHand.rotation;
        if (this.state[ this.roomId ].state == 2) {
            this.positions[ client.id ].cart.position = transform.cart.position;
            this.positions[ client.id ].cart.rotation = transform.cart.rotation;
        }
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

    mapInit () {
        for (let i = 0; i < 5; i++) {
            this.wallPaper[ this.roomId ].wallPaper.push({
                id: i+1,
                item: 5,
                state: 1,
                coolDown: 10,
            });
        }
    }

    
}