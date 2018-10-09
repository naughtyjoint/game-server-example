import { Server } from "colyseus";
import { createServer } from "http";
import * as express from 'express';
import * as dotenv from "./src/utils/config";

import {BoDRoom} from './BoDRoom';

const port = Number(dotenv.PORT || 2567);
const app = express();
const gameServer = new Server({
  server: createServer(app)
});

app.use(express.static('client'));

app.get('/test', function(req, res) {
  res.sendFile('client/test.html', {root: __dirname })
});


gameServer.register('two_player_battle', BoDRoom).
    on('create', (room) => console.log(`room created: ${ room.roomId }`));

gameServer.onShutdown(function(){
  console.log(`game server is going down.`);
});

gameServer.listen(port);
console.log(`Listening on http://localhost:${ port }`);