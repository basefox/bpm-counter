/* eslint-disable no-unused-vars */
import './App.css';
import Home from './Home.js';
import About from './About.js';
import Account from './Account.js';
import Admin from './Admin.js';
import Login from './Login.js';
import Upload from './Upload.js';
import log from 'loglevel';
import { isMobile } from 'react-device-detect';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import React, { useEffect } from 'react';
import { Workbox } from 'workbox-window';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const query = new URLSearchParams(window.location.search);
  const isDebug = query.get('debug') === 'true';
  const isForcedViz = query.get('viz') === 'true';
  const testBPM = query.get('bpm');

  log.setDefaultLevel(isDebug ? 'info' : 'error');

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      const refreshPage = () => {
        wb.addEventListener('controlling', (event) => {
          window.location.reload();
        });

        wb.messageSkipWaiting();
      };

      const Msg = () => (
        <div>
          Updated app is available&nbsp;&nbsp;
          <button onClick={refreshPage}>Reload</button>
        </div>
      );

      const showSkipWaitingPrompt = (event) => {
        toast.info(<Msg />);
      };

      wb.addEventListener('waiting', showSkipWaitingPrompt);

      wb.addEventListener('message', (event) => {
        if (!event.data) {
          return;
        }
        if (event.data.type === 'REPLAY_COMPLETED') {
          toast.success(
            'Your feedback was sent after the connection is restored'
          );
        }
        if (event.data.type === 'REQUEST_FAILED') {
          toast.warning(
            'Your feedback will be sent after the connection is restored'
          );
        }
      });

      wb.register();
    }
  }, []);

  return (
    <Router>
      <header>
        <h1>
          <Link to="/">BPM Techno &mdash; Real-Time BPM Counter</Link>
        </h1>
        <Link to="/about" className="about">
          &#63;
        </Link>
      </header>
      <div className="body">
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/account">
            <Account />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/upload">
            <Upload isDebug={isDebug} log={log} />
          </Route>
          <Route path="/">
            <Home
              isDebug={isDebug}
              log={log}
              isMobile={isMobile}
              isForcedViz={isForcedViz}
              testBPM={testBPM}
            ></Home>
          </Route>
        </Switch>

        <nav className="nav"></nav>
        <aside className="ads"></aside>
      </div>
      <footer>
        <div id="AudioMotionAnalyzer"></div>

        {!isDebug ? (
          <p>
            Made in 🇳🇴&nbsp; by&nbsp;
            <a href="https://twitter.com/webmaxru/">Maxim Salnikov</a> |&nbsp;
            <a href="https://github.com/webmaxru/bpm-counter">GitHub</a>
          </p>
        ) : (
          <p>Debugging mode</p>
        )}
      </footer>

      <ToastContainer />
    </Router>
  );
}

export default App;
