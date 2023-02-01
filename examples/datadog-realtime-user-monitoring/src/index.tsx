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
      enableLogs: true,
      datadogRum: {
          client: datadogRum,
          trackTraits: true,
      }// configure flagsmith with the datadogRum instance to track traits, remote config and flag enabled states
  }} flagsmith={flagsmith}>
    <App />
  </FlagsmithProvider>,
  document.getElementById('root')
);



datadogRum.init({
    applicationId: '8da85c94-0794-41bf-b61f-55a55e35aa26',
    clientToken: 'pubf451c95b6177b6fbda096322beb85d4f',
    site: 'datadoghq.eu',
    service:'rum-test',
    // Specify a version number to identify the deployed version of your application in Datadog
    // version: '1.0.0',
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel:'mask-user-input',
    enableExperimentalFeatures: ["feature_flags"],
});

datadogRum.startSessionReplayRecording();
