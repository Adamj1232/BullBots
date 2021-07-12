import React from 'react';
import ReactDOM from 'react-dom';
import 'reflect-metadata';
import App from './app/App';
import { MoralisProvider } from 'react-moralis';

ReactDOM.render(
  <MoralisProvider
    appId="yXYoxCHXnLT54ylFTQUM48MmxJWCYnFIKdirLvJU"
    serverUrl="https://l0ofdtitry2q.usemoralis.com:2053/server"
  >
    <App />
  </MoralisProvider>,
  document.getElementById('root')
);
