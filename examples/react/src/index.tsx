import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import flagsmith from 'flagsmith'
import {FlagsmithProvider} from 'flagsmith/react'
ReactDOM.render(
  <FlagsmithProvider options={{
      environmentID: "QjgYur4LQTwe5HpvbvhpzK",
      cacheFlags:true
  }} flagsmith={flagsmith}>
    <App />
  </FlagsmithProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
