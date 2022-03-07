import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import flagsmith from 'flagsmith'
import {FlagsmithProvider} from 'kyle-test2/x'
import App from './App';

const environmentID = "QjgYur4LQTwe5HpvbvhpzK"
ReactDOM.render(
  <FlagsmithProvider options={{
      environmentID: "QjgYur4LQTwe5HpvbvhpzK",
      cacheFlags:true
  }} flagsmith={flagsmith}>
    <App />
  </FlagsmithProvider>,
  document.getElementById('root')
);


// flagsmith.init({environmentID})
// ReactDOM.render(
//   <div/>,
//   document.getElementById('root')
// );
