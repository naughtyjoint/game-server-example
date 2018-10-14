import { EntityMap } from "colyseus";
import { Player } from "./src/models/Player";
import { State } from "./src/models/State";
import { Position } from "./src/models/Position";
import { WallPaper } from "./src/models/WallPaper";
import { KillList } from "./src/models/KillList";
import { DeadList } from "./src/models/DeadList";

export class BoDState {

    constructor(public roomId: string){
        this.state[ this.roomId ] = new State();
        this.wallPapers[ this.roomId ] = new WallPaper();
    };

    state: EntityMap<State> = {};
    players: EntityMap<Player> = {};
    positions: EntityMap<Position> = {};
    wallPapers: EntityMap<WallPaper> = {};
    
    
    gameStateChange (state: number) {
        this.state[ this.roomId ].state = state;
    }

    addPlayer (client) {
        if (this.state[ this.roomId ].clientNum == 0) {
            this.players[ client.id ] = new Player('A');
            this.positions[ client.id ] = new Position(); 
            this.state[ this.roomId ].killList[ client.id ] = new KillList([]);    
            this.state[ this.roomId ].deadList[ client.id ] = new DeadList([]);           
            this.mapInit();
        } else {
            let playersNow: Player;
            for (let x in this.players) {
                playersNow = this.players[x];
            }
            this.players[ client.id ] = (playersNow.role === 'B') ? new Player('A') : new Player('B');
            this.positions[ client.id ] = new Position();
            this.state[ this.roomId ].killList[ client.id ] = new KillList([]);
            this.state[ this.roomId ].deadList[ client.id ] = new DeadList([]);
        }
        this.state[ this.roomId ].clientNum ++;
        // this.resetPlayer();
        let clientInfo = this.players[ client.id ];
        return {
            role: clientInfo.role
        }
    }

    removePlayer (client) {
        delete this.players[ client.id ];
    }

    movePlayer (client, transform) {
        //console.log(this.positions[ client.id ].cart);
        this.positions[ client.id ].head.position = transform.head.position;
        this.positions[ client.id ].head.rotation = transform.head.rotation;
        this.positions[ client.id ].rightHand.position = transform.rightHand.position;
        this.positions[ client.id ].rightHand.rotation = transform.rightHand.rotation;
        this.positions[ client.id ].leftHand.position = transform.leftHand.position;
        this.positions[ client.id ].leftHand.rotation = transform.leftHand.rotation;
        if (this.state[ this.roomId ].state == 2) {
            this.positions[ client.id ].cart.position = transform.cart.position;
            this.positions[ client.id ].cart.rotation = transform.cart.rotation;
            this.positions[ client.id ].cart.velocity = transform.cart.velocity;
        }
    }

    resetPlayer () {
        let players: Player;
            for (let x in this.players) {
                players = this.players[x];
            }
        players.status = 0;
        players.score = 0;
        players.itemList = [];
        players.kill = 0;
    }

    mapInit () {
        for (let i = 0; i < 100; i++) {
            this.wallPapers[ this.roomId ].wallPaper.push({
                id: i+1,
                item: Math.floor(Math.random() * 7) + 1,
                state: 1,
                coolDown: 0
            });
        }
    }

    adScore(clientId: string, wallPaper) {
        let pointMap = [0, 50, 60, 80, 100, 150, 150, 900];
        let point = pointMap[wallPaper.item];
        this.players[ clientId ].score += point;
    }

    adCoolDown (client, wallPaperId) {
        let wallPaper = this.wallPapers[ this.roomId ].wallPaper[wallPaperId];
        if (wallPaper.state != 0 && this.state[ this.roomId ].state == 2) {
            this.adScore(client.id, wallPaper);
            let coolDownTime = Math.round(Math.random() * 6) + 10;
            wallPaper.state = 0;
            wallPaper.coolDown = coolDownTime;
            console.log(`${client.id} hit wall number ${wallPaperId}, coolDown ${coolDownTime} secs !`);
            var cdTimer = setInterval(() => {
                wallPaper.coolDown -= 1;
                if (wallPaper.coolDown <= 0) {
                    wallPaper.coolDown == 0;
                    wallPaper.item = this.getRandomItem();
                    clearInterval(cdTimer);
                    wallPaper.state = 1;
                }
            }, 1000)
        }
    }

    playerCoolDown(clientId: string) {
        let player = this.players[ clientId ];
        player.status = 0;
        setTimeout(() => {
            player.status = 1;
        }, 10000);
    }

    getRandomItem () {
        let item = Math.random() * 110;
        switch (true) {
            case item < 29.8 :
                return 1;
            case item >= 29.8 && item < 54.63 :
                return 2;
            case item >= 54.63 && item < 73.255 :
                return 3;
            case item >= 73.255 && item < 88.155 :
                return 4;
            case item >= 88.155 && item < 98.055 :
                return 5;
            case item >= 98.055 && item < 107.985 :
                return 6;
            case item >= 107.985 :
                return 7;
        }
    }

    playerHit (client, target) {
        if (!this.players[ target ]) {
            return false;
        }
        if (this.players[ client.id ].status == 1 && this.players[ target ].status == 1){
            let result = false;
            this.state[ this.roomId ].deadList[ target ].list.forEach((value, index) => {
                if (value.killerId == client.id) {
                    console.log(value);
                    if (Date.now() <= value.timestamp + 10000) {
                        this.players[ client.id ].score += 1000;
                        this.players[ client.id ].kill += 1;
                        this.state[ this.roomId ].deadList[ target ].list.splice(index, 1);
                        this.playerCoolDown(target);
                        result = true;
                    }
                }
            });

            this.state[ this.roomId ].killList[ client.id ].list.push({
                victimId: target,
                timestamp: Date.now()
            });

            return result;
        }
    }

    scanned (client, killer) {
        if (!this.players[ killer ]) {
            return false;
        }
        if (this.players[ client.id ].status == 1 && this.players[ killer ].status == 1){
            let result = false;
            this.state[ this.roomId ].killList[ killer ].list.forEach((value, index) => {
                if (value.victimId == client.id) {
                    console.log(value);
                    if (Date.now() <= value.timestamp + 10000) {
                        this.players[ killer ].score += 1000;
                        this.players[ killer ].kill += 1;
                        this.state[ this.roomId ].killList[ killer ].list.splice(index, 1);
                        this.playerCoolDown(client.id);
                        result = true;
                    }
                }
            });

            this.state[ this.roomId ].deadList[ client.id ].list.push({
                killerId: killer,
                timestamp: Date.now()
            });

            return result;
        }
    }
}
