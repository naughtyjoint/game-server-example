import { EntityMap } from "colyseus";
import { KillList } from "./KillList";
import { DeadList } from "./DeadList";

export class State {
    constructor(
        public state: number = 0,  // 0 waiting, 1 ready, 2 start, 3 over
        public clientNum: number = 0, //max 2
        public countdown: number = Number(process.env.MATCH_TIME), 
        public ready_countdown: number = 4,
        public killList: EntityMap<KillList> = {},
        public deadList: EntityMap<DeadList> = {} 
    )
    {
      
    };
  }