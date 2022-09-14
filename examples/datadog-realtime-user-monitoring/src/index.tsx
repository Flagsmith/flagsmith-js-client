import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import flagsmith from 'flagsmith'
import {FlagsmithProvider} from 'flagsmith/react'
import App from './App';
import { datadogRum } from '@datadog/browser-rum';

ReactDOM.render(
  <FlagsmithProvider options={{
      environmentID: "QjgYur4LQTwe5HpvbvhpzK",
      cacheFlags:true,
      datadogRum // configure flagsmith with the datadogRum instance to track traits, remote config and flag enabled states
  }} flagsmith={flagsmith}>
    <App />
  </FlagsmithProvider>,
  document.getElementById('root')
);



datadogRum.init({
    applicationId: '2001f533-0533-4184-a3f9-234abbe428f9',
    clientToken: 'pub433eff9c5c546ac6ed3c5ea7cc20dff8',
    site: 'datadoghq.eu',
    service:'flagsmith-test',
    sampleRate: 100,
    premiumSampleRate: 100,
    trackInteractions: true,
    defaultPrivacyLevel:'mask-user-input'
});

datadogRum.startSessionReplayRecording();
