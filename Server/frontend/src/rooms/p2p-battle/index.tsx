import React from 'react';
import * as Colyseus from 'colyseus.js';
import { Grid, Paper, Box, Button } from '@material-ui/core';
import faker from 'faker';
import { SendForm } from '../../components/send-form.component';
import { getWsHost } from '../../get-ws-host.utils';

const SERVER_HOST = 'ws://localhost:2567';
const ROOM_NAME = 'P2PBattleRoom';

export enum ActionTypeEnum {
  Action = 'Action',
  ActionResult = 'ActionResult',
  StartGame = 'StartGame',
  EndGame = 'EndGame',
}

type Message = {
  sessionId: string;
  payload: string;
  client: any;
  actionType: ActionTypeEnum;
}

type State = {
  log: Message[];
  value: undefined | string;
  isHost: undefined | boolean;
  user: {
    id: string;
    email: string;
    userName: string;
    role: string;
  };
  players: any;
  serverHost: undefined | string;
}


const getInitialState = (): State => {
  return {
    log: [],
    value: undefined,
    isHost: undefined,
    user: {
      id: faker.random.uuid(),
      email: faker.internet.email(),
      userName: faker.internet.userName(),
      role: 'User',
    },
    players: {},
    serverHost: getWsHost(),
  };
};


export class P2PBattleRoom extends React.Component<any, any> {

  client: Colyseus.Client | undefined = undefined;
  room: Colyseus.Room | undefined = undefined;
  state: State = getInitialState();

  joinOrCreate = async () => {
    if (!this.client) {
      return;
    }
    this.room = await this.client.joinOrCreate(ROOM_NAME, {
      user: this.state.user,
    });
    console.log(this.room);
    this.room.onStateChange((state: any) => {
      this.setState({
        ...state,
      });
    });

    this.room.onMessage(ActionTypeEnum.Action, (message: Message) => {
      this.setState((state: State) => {
        return {
          log: [message, ...state.log],
        };
      });
    });
    this.room.onMessage(ActionTypeEnum.ActionResult, (message: Message) => {
      this.setState((state: State) => {
        return {
          log: [message, ...state.log],
        };
      });
    });
    this.room.onMessage(ActionTypeEnum.EndGame, (message: Message) => {
      this.setState((state: State) => {
        return {
          log: [message, ...state.log],
        };
      });
    });
    this.room.onMessage(ActionTypeEnum.StartGame, (message: Message) => {
      this.setState((state: State) => {
        return {
          log: [message, ...state.log],
        };
      });
    });
  };

  sendAction = () => {
    if (!this.room) {
      return;
    }
    this.room.send(ActionTypeEnum.Action, JSON.stringify({
      time: Date.now(),
    }));
  };

  sendActionResult = () => {
    if (!this.room) {
      return;
    }
    this.room.send(ActionTypeEnum.ActionResult, JSON.stringify({
      time: Date.now(),
    }));
  };

  sendEndBattle = () => {
    if (!this.room) {
      return;
    }
    this.room.send(ActionTypeEnum.EndGame, JSON.stringify({
      time: Date.now(),
    }));
  };

  sendStartBattle = () => {
    if (!this.room) {
      return;
    }
    this.room.send(ActionTypeEnum.StartGame, JSON.stringify({
      time: Date.now(),
    }));
  };

  renderMessages = () => {
    const { log } = this.state;

    return (
      <div>
        {
          log.map((message, index) => (
            <Paper key={`${message.payload}${index}`} style={{
              padding: '10px',
            }}>
              <Box component="div" style={{
                borderTop: '1px solid',
                borderBottom: '1px solid',
              }} m={1} p={1}>
                sessionId: {message.sessionId} <br/>
                actionType: {message.actionType} <br/>
                payload: {message.payload}
              </Box>
            </Paper>))
        }
      </div>
    );
  };

  hoIam = () => {

    if (!this.room) {
      return null;
    }

    if (this.state.players[this.room.sessionId]) {
      if (this.state.players[this.room.sessionId].isHost) {
        return (<div>I am host</div>);
      } else {
        return (<div>I am not host</div>);
      }
    }
    return null;
  };


  render() {
    console.log(this.state);
    return <Grid container spacing={3}>
      <Grid item xs={6}>
        <SendForm
          buttonLabel={'Connect'}
          placeholder={'host'}
          value={this.state.serverHost}
          onChange={(event: any) => {
            this.setState({
              serverHost: event.target.value,
            });
          }}
          onSubmit={() => {
            this.client = new Colyseus.Client(this.state.serverHost);

            this.joinOrCreate();
          }}
        />
      </Grid>

      <Grid item xs={12}>
        {this.hoIam()}
      </Grid>

      <Grid item xs={12}>
        <Button onClick={this.sendAction}>
          Action
        </Button>
        <Button onClick={this.sendActionResult}>
          ActionResult
        </Button>
        <Button onClick={this.sendEndBattle}>
          EndGame
        </Button>
      </Grid>
      <Grid item xs={12}>
        {this.renderMessages()}
      </Grid>
    </Grid>;
  }

}
