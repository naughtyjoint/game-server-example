import { Server } from "colyseus";
import { createServer } from "http";
import * as express from "express";

import { BoDRoom } from './BoDRoom';

const Dotenv: any = require('dotenv');
Dotenv.config();
const port = Number(process.env.PORT || 2567);
const app = express();
const gameServer = new Server({
  server: createServer(app)
});

app.use(express.static('client'));

app.get('/test', (req, res) => res.sendFile('client/test.html', {root: __dirname }));


gameServer.register('two_player_battle', BoDRoom).
    on('create', room => console.log(`room created: ${ room.roomId }`));

gameServer.onShutdown(() => console.log(`game server is going down.`));

gameServer.listen(port);
console.log(`Listening on http://localhost:${ port }`);