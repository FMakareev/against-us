import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {
  Switch,
  Route,
  Link,
  HashRouter,
} from 'react-router-dom';

import { Layout } from './components/layout.component';
import { AppBar, Toolbar, Button } from '@material-ui/core';
import { P2PBattleRoom } from './rooms/p2p-battle';
import { ChatRoom } from './rooms/chat';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <Layout>
        <AppBar position="static">
          <Toolbar>
              <Link to={'/p2p-battle'}>
                <Button variant="contained" color="secondary">
                  P2PBattleRoom
                </Button>
              </Link>

              <Link to={'/chat'}>
                <Button variant="contained" color="secondary">
                  ChatRoom
                </Button>
              </Link>
          </Toolbar>
        </AppBar>
        <Switch>
          <Route path="/p2p-battle">
            <P2PBattleRoom />
          </Route>
          <Route path="/">
            <ChatRoom />
          </Route>
        </Switch>
      </Layout>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
