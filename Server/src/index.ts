import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as serveIndex from 'serve-index';

import { Server } from 'colyseus';
import {monitor} from '@colyseus/monitor';
import * as path from 'path';
import {configModule} from './lib/config.module';
import { P2PBattleRoom } from './p2p-battle/p2p-battle.room';
import { ChatRoom } from './chat/chat.room';


const port = Number(configModule.get<string>('PORT'));
const app = express();

app.use(cors());
app.use(express.json());
app.use('/battle/monitoring',monitor());


app.use('/', express.static(path.join(__dirname, '../frontend/build'),{
    redirect: false,
}));


const server = http.createServer(app)


const gameServer = new Server({
  server,
});

gameServer.define('ChatRoom', ChatRoom);
gameServer.define('P2PBattleRoom', P2PBattleRoom);


gameServer.listen(port)
  .then((res) => {
    console.log(`Listening on ws://localhost:${port}`);
    return res;
  })
  .catch((err) => {
    console.log(`Not listening on ws://localhost:${port}`, err);
    return err;
  });

