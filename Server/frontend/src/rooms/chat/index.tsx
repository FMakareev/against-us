import React from 'react';
import * as Colyseus from 'colyseus.js';
import { Grid, Paper, Box } from '@material-ui/core';
import { SendForm } from '../../components/send-form.component';
import { getWsHost } from '../../get-ws-host.utils';



export enum ChatActionEnum {
  Message = 'Message',
  Messages = 'Messages',
}

console.log(getWsHost());
const SERVER_HOST = 'ws://localhost:2567';
const ROOM_NAME = 'ChatRoom';


type Message = {
  sessionId: string;
  message: string;
  client: any;
  actionType: string;
}

type State = {
  message: Message[];
  value: undefined | string;
  serverHost: undefined | string;
}

const getInitialState = () => {
  return {
    message: [],
    value: undefined,
    serverHost: getWsHost(),
  };
};

export class ChatRoom extends React.Component<any, State> {

  client: Colyseus.Client | undefined = undefined;
  room: Colyseus.Room | undefined = undefined;
  state: State = getInitialState();

  componentDidMount() {
    void this.joinOrCreate();
  }

  joinOrCreate = async () => {
    if (!this.client) {
      return;

    }
    this.room = await this.client.joinOrCreate(ROOM_NAME);

    this.room .onStateChange.once(function(state) {
      console.log("initial room state:", state);
    });

    // new room state
    this.room .onStateChange(function(state) {
      // this signal is triggered on each patch
      console.log("onStateChange:", state);
    });



    // listen to patches coming from the server
    this.room.onMessage(ChatActionEnum.Messages, (message: Message) => {
      this.setState((state: State) => {
        return {
          message: [message, ...state.message],
        };
      });
    });
  };

  onChange = (event: any) => {
    this.setState({
      value: event.target.value,
    })
  }

  onSubmit = () => {
    if (!this.room) {
      return;
    }

    this.room.send(ChatActionEnum.Message, this.state.value)
    this.setState({
      value: '',
    })
  }

  renderMessages = () => {
    const { message } = this.state;

    return (
      <div>
        {
          message.map((message) => (<Paper key={message.message} style={{
            padding: '10px'
          }}>
            <Box component="span" m={1}>
              [{message.sessionId}]:[{message.actionType}]: {message.message}
            </Box>
          </Paper>))
        }
      </div>
    );
  };


  render() {

    return <Grid container spacing={3}>
      <Grid item xs={12}>
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
        <SendForm onChange={this.onChange} onSubmit={this.onSubmit} value={this.state.value} />
      </Grid>
      <Grid item xs={12}>
        {this.renderMessages()}
      </Grid>
    </Grid>;
  }
};
;
