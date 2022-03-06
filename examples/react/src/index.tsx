import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import flagsmith from 'flagsmith'
import {FlagsmithProvider} from './react'

ReactDOM.render(
  <FlagsmithProvider options={{
      environmentID: "QjgYur4LQTwe5HpvbvhpzK",
      cacheFlags:true
  }} flagsmith={flagsmith}>
    <App />
  </FlagsmithProvider>,
  document.getElementById('root')
);
